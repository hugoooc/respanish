"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Check, X, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { VOCABULARY } from "@/data/vocabulary";
import { GRAMMAR } from "@/data/grammar";
import { seedKnownCard, seedUnknownCard } from "@/lib/fsrs-engine";
import { updateSettings, markLessonMastered } from "@/lib/db";
import { getAllLessonsFlat } from "@/lib/curriculum-engine";
import type { GrammarEntry } from "@/lib/types";

const BATCH_SIZE = 20;
const BANDS = [1, 2, 3] as const;
const GRAMMAR_QUESTION_COUNT = 15;
const VOCAB_TOTAL = BANDS.length * BATCH_SIZE;

type Phase = "vocab" | "grammar" | "results";

interface GrammarQuestion {
  grammarId: string;
  sentence: string;
  correctAnswer: string;
  options: string[];
  difficulty: 1 | 2 | 3;
}

function getBandLabel(band: number): string {
  switch (band) {
    case 1:
      return "Basique (Top 200)";
    case 2:
      return "Intermédiaire (201-400)";
    case 3:
      return "Avancé (401+)";
    default:
      return "";
  }
}

function getDifficultyLabel(d: number): string {
  switch (d) {
    case 1:
      return "Basique";
    case 2:
      return "Intermédiaire";
    case 3:
      return "Avancé";
    default:
      return "";
  }
}

function generateGrammarPools(): Record<number, GrammarQuestion[]> {
  const pools: Record<number, GrammarQuestion[]> = { 1: [], 2: [], 3: [] };

  const eligible = GRAMMAR.filter(
    (g) =>
      g.conjugation_table &&
      parseInt(g.id.replace("g_", ""), 10) <= 60
  );

  for (const entry of eligible) {
    if (!entry.conjugation_table) continue;
    const tense = Object.keys(entry.conjugation_table)[0];
    const table = entry.conjugation_table[tense];
    const forms = Object.entries(table);

    let generated = false;
    for (const example of entry.examples) {
      if (generated) break;
      const words = example.es.split(/\s+/);

      for (const [, form] of forms) {
        const wordIdx = words.findIndex(
          (w) =>
            w.replace(/[.,!?¡¿;:'"()]/g, "").toLowerCase() ===
            form.toLowerCase()
        );

        if (wordIdx >= 0) {
          const blanked = [...words];
          blanked[wordIdx] = "___";

          const distractors = forms
            .filter(([, f]) => f.toLowerCase() !== form.toLowerCase())
            .map(([, f]) => f);

          for (let i = distractors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
          }

          const picked = distractors.slice(0, 3);
          if (picked.length < 3) continue;

          const options = [form, ...picked];
          for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
          }

          pools[entry.difficulty].push({
            grammarId: entry.id,
            sentence: blanked.join(" "),
            correctAnswer: form,
            options,
            difficulty: entry.difficulty,
          });
          generated = true;
          break;
        }
      }
    }

    if (!generated) {
      const randomIdx = Math.floor(Math.random() * forms.length);
      const [subject, form] = forms[randomIdx];

      const distractors = forms
        .filter(([, f]) => f !== form)
        .map(([, f]) => f);
      for (let i = distractors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
      }
      const picked = distractors.slice(0, 3);
      if (picked.length >= 3) {
        const options = [form, ...picked];
        for (let i = options.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [options[i], options[j]] = [options[j], options[i]];
        }
        pools[entry.difficulty].push({
          grammarId: entry.id,
          sentence: `${subject.charAt(0).toUpperCase() + subject.slice(1)} ___ (${tense})`,
          correctAnswer: form,
          options,
          difficulty: entry.difficulty,
        });
      }
    }
  }

  for (const d of [1, 2, 3]) {
    const pool = pools[d];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
  }

  return pools;
}

function getNextQuestion(
  pools: Record<number, GrammarQuestion[]>,
  targetDifficulty: number,
  usedCounts: Record<number, number>
): { question: GrammarQuestion; actualDifficulty: number } | null {
  const order = [
    targetDifficulty,
    ...([1, 2, 3].filter((d) => d !== targetDifficulty)),
  ];
  for (const d of order) {
    const pool = pools[d];
    const used = usedCounts[d] ?? 0;
    if (pool && used < pool.length) {
      return { question: pool[used], actualDifficulty: d };
    }
  }
  return null;
}

function determineUserBand(
  results: { band: number; known: number; total: number }[]
): number {
  let maxBand = 1;
  for (const r of results) {
    if (r.known / r.total >= 0.4) {
      maxBand = Math.max(maxBand, r.band);
    }
  }
  return maxBand;
}

function determineGrammarLevel(
  correct: Record<number, number>,
  total: Record<number, number>
): number {
  if (total[3] > 0 && correct[3] / total[3] >= 0.5) return 3;
  if (total[2] > 0 && correct[2] / total[2] >= 0.5) return 2;
  return 1;
}

function determinePlacement(
  vocabBand: number,
  grammarLevel: number
): { unitId: string; lessonId: string } {
  const score = (vocabBand + grammarLevel) / 2;
  let targetUnitNum: number;
  if (score >= 2.5) targetUnitNum = 9;
  else if (score >= 1.5) targetUnitNum = 5;
  else targetUnitNum = 1;

  const targetUnitId = `u_${targetUnitNum.toString().padStart(2, "0")}`;
  const allLessons = getAllLessonsFlat();
  const firstLessonInUnit = allLessons.find(
    (l) => l.unitId === targetUnitId
  );

  if (!firstLessonInUnit) {
    return { unitId: "u_01", lessonId: allLessons[0].id };
  }

  return { unitId: targetUnitId, lessonId: firstLessonInUnit.id };
}

export default function PlacementPage() {
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("vocab");
  const [finishing, setFinishing] = useState(false);

  // ── Vocab state ──
  const [currentBand, setCurrentBand] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [knownCount, setKnownCount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [bandResults, setBandResults] = useState<
    { band: number; known: number; total: number }[]
  >([]);

  const bandWords = useMemo(() => {
    return BANDS.map((band) => {
      const words = VOCABULARY.filter((v) => v.band === band);
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, BATCH_SIZE);
    });
  }, []);

  // ── Grammar state ──
  const grammarPools = useMemo(() => generateGrammarPools(), []);
  const [grammarIndex, setGrammarIndex] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState<1 | 2 | 3>(1);
  const [grammarCorrect, setGrammarCorrect] = useState<
    Record<number, number>
  >({ 1: 0, 2: 0, 3: 0 });
  const [grammarTotal, setGrammarTotal] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
  });
  const [usedCounts, setUsedCounts] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
  });
  const [selectedGrammarOption, setSelectedGrammarOption] = useState<
    string | null
  >(null);

  // ── Derived ──
  const currentBatch = bandWords[currentBand] ?? [];
  const currentWord = currentBatch[currentWordIndex];
  const vocabGlobalIndex = currentBand * BATCH_SIZE + currentWordIndex;
  const totalItems = VOCAB_TOTAL + GRAMMAR_QUESTION_COUNT;
  const globalProgress = (() => {
    if (phase === "vocab") return vocabGlobalIndex;
    if (phase === "grammar") return VOCAB_TOTAL + grammarIndex;
    return totalItems;
  })();
  const progress = (globalProgress / totalItems) * 100;

  const currentQuestion = useMemo(() => {
    return getNextQuestion(grammarPools, currentDifficulty, usedCounts);
  }, [grammarPools, currentDifficulty, usedCounts]);

  // ── Vocab handlers ──
  const handleVocabAnswer = useCallback(
    async (known: boolean) => {
      if (processing || !currentWord) return;
      setProcessing(true);

      if (known) {
        await seedKnownCard(currentWord.id, "vocab");
        setKnownCount((c) => c + 1);
      } else {
        await seedUnknownCard(currentWord.id, "vocab");
      }

      const nextIndex = currentWordIndex + 1;
      if (nextIndex >= currentBatch.length) {
        const newBandResults = [
          ...bandResults,
          {
            band: BANDS[currentBand],
            known: knownCount + (known ? 1 : 0),
            total: currentBatch.length,
          },
        ];
        setBandResults(newBandResults);

        const nextBand = currentBand + 1;
        if (nextBand >= BANDS.length) {
          setPhase("grammar");
        } else {
          setCurrentBand(nextBand);
          setCurrentWordIndex(0);
          setKnownCount(0);
        }
      } else {
        setCurrentWordIndex(nextIndex);
      }
      setProcessing(false);
    },
    [
      processing,
      currentWord,
      currentWordIndex,
      currentBatch,
      currentBand,
      bandResults,
      knownCount,
    ]
  );

  // ── Grammar handlers ──
  const handleGrammarSelect = useCallback(
    (option: string) => {
      if (selectedGrammarOption !== null) return;
      setSelectedGrammarOption(option);
    },
    [selectedGrammarOption]
  );

  const handleGrammarContinue = useCallback(() => {
    if (!currentQuestion || selectedGrammarOption === null) return;

    const isCorrect =
      selectedGrammarOption === currentQuestion.question.correctAnswer;
    const d = currentQuestion.actualDifficulty;

    setGrammarCorrect((prev) => ({
      ...prev,
      [d]: prev[d] + (isCorrect ? 1 : 0),
    }));
    setGrammarTotal((prev) => ({
      ...prev,
      [d]: prev[d] + 1,
    }));
    setUsedCounts((prev) => ({
      ...prev,
      [d]: prev[d] + 1,
    }));

    if (isCorrect) {
      setCurrentDifficulty((prev) => Math.min(3, prev + 1) as 1 | 2 | 3);
    } else {
      setCurrentDifficulty((prev) => Math.max(1, prev - 1) as 1 | 2 | 3);
    }

    const nextIndex = grammarIndex + 1;
    if (nextIndex >= GRAMMAR_QUESTION_COUNT) {
      setPhase("results");
    } else {
      setGrammarIndex(nextIndex);
      setSelectedGrammarOption(null);
    }
  }, [currentQuestion, selectedGrammarOption, grammarIndex]);

  // ── Finish placement ──
  const handleFinishPlacement = useCallback(async () => {
    setFinishing(true);

    const vocabBand = determineUserBand(bandResults);
    const grammarLevel = determineGrammarLevel(grammarCorrect, grammarTotal);
    const { unitId, lessonId } = determinePlacement(vocabBand, grammarLevel);

    const allLessons = getAllLessonsFlat();
    const startIdx = allLessons.findIndex((l) => l.id === lessonId);
    for (let i = 0; i < startIdx; i++) {
      await markLessonMastered(allLessons[i].id);
    }

    const today = new Date().toISOString().split("T")[0];
    await updateSettings({
      placementCompleted: true,
      currentBand: vocabBand,
      currentUnitId: unitId,
      currentLessonId: lessonId,
      curriculumStartDate: today,
    });

    router.replace("/curriculum");
  }, [bandResults, grammarCorrect, grammarTotal, router]);

  // ── Results phase ──
  if (phase === "results") {
    const vocabBand = determineUserBand(bandResults);
    const grammarLevel = determineGrammarLevel(grammarCorrect, grammarTotal);
    const score = (vocabBand + grammarLevel) / 2;

    let placementUnit: number;
    let placementLabel: string;
    let placementMessage: string;
    if (score >= 2.5) {
      placementUnit = 9;
      placementLabel = "Avancé";
      placementMessage =
        "Excellent ! On consolide vos acquis avancés.";
    } else if (score >= 1.5) {
      placementUnit = 5;
      placementLabel = "Intermédiaire";
      placementMessage =
        "Bon niveau intermédiaire. On renforce et on élargit.";
    } else {
      placementUnit = 1;
      placementLabel = "Débutant";
      placementMessage =
        "On reprend les fondamentaux. Vous progresserez vite !";
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Placement terminé !</h1>
          <p className="text-muted-foreground">
            Voici vos résultats détaillés
          </p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Vocabulaire
          </h3>
          <div className="space-y-2">
            {bandResults.map((r) => (
              <Card key={r.band}>
                <CardContent className="flex items-center justify-between p-4">
                  <span className="font-medium text-sm">
                    {getBandLabel(r.band)}
                  </span>
                  <Badge
                    variant={
                      r.known / r.total >= 0.5 ? "default" : "secondary"
                    }
                  >
                    {r.known}/{r.total} connus
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pt-2">
            Grammaire
          </h3>
          <div className="space-y-2">
            {([1, 2, 3] as const).map(
              (d) =>
                grammarTotal[d] > 0 && (
                  <Card key={d}>
                    <CardContent className="flex items-center justify-between p-4">
                      <span className="font-medium text-sm">
                        {getDifficultyLabel(d)}
                      </span>
                      <Badge
                        variant={
                          grammarCorrect[d] / grammarTotal[d] >= 0.5
                            ? "default"
                            : "secondary"
                        }
                      >
                        {grammarCorrect[d]}/{grammarTotal[d]} correct
                      </Badge>
                    </CardContent>
                  </Card>
                )
            )}
          </div>
        </div>

        <Card className="w-full max-w-sm">
          <CardContent className="p-4 text-center space-y-1">
            <p className="font-semibold text-lg">
              Placement : Unité {placementUnit}
            </p>
            <Badge variant="outline">{placementLabel}</Badge>
            <p className="text-sm text-muted-foreground pt-1">
              {placementMessage}
            </p>
          </CardContent>
        </Card>

        <Button
          className="w-full max-w-sm gap-2"
          onClick={handleFinishPlacement}
          disabled={finishing}
        >
          {finishing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Commencer le parcours
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    );
  }

  // ── Grammar phase ──
  if (phase === "grammar") {
    if (!currentQuestion) {
      setPhase("results");
      return null;
    }

    const q = currentQuestion.question;
    const hasAnswered = selectedGrammarOption !== null;
    const isCorrect = selectedGrammarOption === q.correctAnswer;

    return (
      <div className="min-h-screen flex flex-col px-4 py-6">
        <div className="space-y-2 mb-8">
          <div className="flex items-center justify-between">
            <Badge variant="outline">
              Grammaire — {getDifficultyLabel(currentQuestion.actualDifficulty)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {globalProgress + 1}/{totalItems}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <p className="text-sm text-muted-foreground">
            Complétez la conjugaison
          </p>

          <Card className="w-full max-w-sm">
            <CardContent className="p-8 text-center">
              <p className="text-2xl font-bold leading-relaxed">
                {q.sentence}
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            {q.options.map((option, i) => {
              const isThis = selectedGrammarOption === option;
              const isThisCorrect = option === q.correctAnswer;

              return (
                <Button
                  key={i}
                  variant="outline"
                  className={cn(
                    "w-full h-auto min-h-[52px] text-left justify-start px-4 py-3 text-base",
                    hasAnswered &&
                      isThisCorrect &&
                      "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400",
                    hasAnswered &&
                      isThis &&
                      !isThisCorrect &&
                      "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400",
                    !hasAnswered && "hover:bg-accent"
                  )}
                  onClick={() => handleGrammarSelect(option)}
                  disabled={hasAnswered}
                >
                  <span className="flex-1">{option}</span>
                  {hasAnswered && isThisCorrect && (
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                  )}
                  {hasAnswered && isThis && !isThisCorrect && (
                    <X className="h-5 w-5 text-red-500 shrink-0" />
                  )}
                </Button>
              );
            })}
          </div>

          {hasAnswered && (
            <Button
              className="w-full max-w-sm"
              onClick={handleGrammarContinue}
            >
              Continuer
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ── Vocab phase ──
  if (!currentWord) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col px-4 py-6">
      <div className="space-y-2 mb-8">
        <div className="flex items-center justify-between">
          <Badge variant="outline">
            {getBandLabel(BANDS[currentBand])}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {globalProgress + 1}/{totalItems}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Connaissez-vous ce mot ?
          </p>
        </div>

        <Card className="w-full max-w-sm">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-3xl font-bold">{currentWord.spanish}</p>
            <Badge variant="secondary" className="text-xs">
              {currentWord.pos}
            </Badge>
          </CardContent>
        </Card>

        <div className="flex gap-4 w-full max-w-sm">
          <Button
            variant="destructive"
            className="flex-1 h-14 gap-2 text-base"
            onClick={() => handleVocabAnswer(false)}
            disabled={processing}
          >
            <X className="h-5 w-5" />
            Non
          </Button>
          <Button
            className="flex-1 h-14 gap-2 text-base"
            onClick={() => handleVocabAnswer(true)}
            disabled={processing}
          >
            <Check className="h-5 w-5" />
            Oui
          </Button>
        </div>
      </div>
    </div>
  );
}
