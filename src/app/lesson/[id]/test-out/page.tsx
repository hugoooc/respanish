"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Check,
  X,
  Loader2,
  Trophy,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getLesson, getUnitForLesson, getNextLesson, completeLesson } from "@/lib/curriculum-engine";
import { markLessonMastered, upsertLessonProgress } from "@/lib/db";
import { getContentById, getDistractors } from "@/lib/fsrs-engine";
import { SENTENCES } from "@/data/sentences";
import type { Lesson, VocabEntry, GrammarEntry, PhraseEntry, SentenceEntry } from "@/lib/types";

type ExerciseKind = "mc_vocab" | "mc_grammar" | "fill_blank";

interface Exercise {
  kind: ExerciseKind;
  question: string;
  correctAnswer: string;
  options?: string[];
  hint?: string;
  sourceId: string;
}

function buildExercises(lesson: Lesson): Exercise[] {
  const exercises: Exercise[] = [];

  for (const vocabId of lesson.vocabIds.slice(0, 4)) {
    const entry = getContentById(vocabId, "vocab") as VocabEntry | undefined;
    if (!entry) continue;
    const distractors = getDistractors(entry.french, "vocab", 3);
    const options = shuffleArray([entry.french, ...distractors]);
    exercises.push({
      kind: "mc_vocab",
      question: entry.spanish,
      correctAnswer: entry.french,
      options,
      sourceId: vocabId,
    });
  }

  for (const grammarId of lesson.grammarIds.slice(0, 2)) {
    const entry = getContentById(grammarId, "grammar") as GrammarEntry | undefined;
    if (!entry || !entry.examples[0]) continue;
    const distractors = getDistractors(entry.examples[0].fr, "grammar", 3);
    const options = shuffleArray([entry.examples[0].fr, ...distractors]);
    exercises.push({
      kind: "mc_grammar",
      question: entry.examples[0].es,
      correctAnswer: entry.examples[0].fr,
      options,
      sourceId: grammarId,
    });
  }

  const lessonSentences = SENTENCES.filter((s) => lesson.sentenceIds.includes(s.id));
  for (const sentence of lessonSentences.slice(0, 2)) {
    exercises.push({
      kind: "fill_blank",
      question: sentence.spanish.replace(sentence.blank_word, "________"),
      correctAnswer: sentence.blank_word,
      hint: sentence.french,
      sourceId: sentence.id,
    });
  }

  return shuffleArray(exercises).slice(0, 8);
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function normalize(s: string): string {
  return s.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default function TestOutPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const lessonId = params.id;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [fillAnswer, setFillAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const l = getLesson(lessonId);
    if (!l) {
      router.push("/curriculum");
      return;
    }
    setLesson(l);
    setExercises(buildExercises(l));
  }, [lessonId, router]);

  const exercise = exercises[currentIndex];
  const accuracy = results.length > 0
    ? Math.round((results.filter(Boolean).length / results.length) * 100)
    : 0;
  const passed = accuracy >= 85;

  const handleSelectOption = useCallback((option: string) => {
    if (submitted) return;
    setSelected(option);
    setSubmitted(true);
    setResults((prev) => [...prev, option === exercise?.correctAnswer]);
  }, [submitted, exercise]);

  const handleSubmitFill = useCallback(() => {
    if (!fillAnswer.trim() || submitted) return;
    setSubmitted(true);
    const correct = normalize(fillAnswer) === normalize(exercise?.correctAnswer ?? "");
    setResults((prev) => [...prev, correct]);
  }, [fillAnswer, submitted, exercise]);

  const handleNext = useCallback(async () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setFillAnswer("");
      setSubmitted(false);
      return;
    }

    setFinished(true);
    setProcessing(true);

    const finalResults = results;
    const finalAccuracy = Math.round(
      (finalResults.filter(Boolean).length / finalResults.length) * 100
    );

    if (finalAccuracy >= 85 && lesson) {
      await markLessonMastered(lessonId);
      const next = getNextLesson(lessonId);
      if (next) {
        const nextUnit = getUnitForLesson(next.id);
        await upsertLessonProgress({
          lessonId: next.id,
          status: "available",
          attempts: 0,
        });
      }
    }

    setProcessing(false);
  }, [currentIndex, exercises.length, results, lesson, lessonId]);

  if (!lesson || exercises.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (finished) {
    const wrongAreas = new Set<string>();
    results.forEach((correct, i) => {
      if (!correct && exercises[i]) {
        wrongAreas.add(exercises[i].kind === "mc_vocab" ? "vocabulaire" : exercises[i].kind === "mc_grammar" ? "grammaire" : "phrases");
      }
    });

    return (
      <div className="min-h-screen px-4 py-6 max-w-md mx-auto flex flex-col items-center justify-center gap-6">
        {processing ? (
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        ) : passed ? (
          <>
            <div className="h-20 w-20 rounded-full bg-green-500/15 flex items-center justify-center">
              <Trophy className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-center">Leçon maîtrisée !</h2>
            <p className="text-muted-foreground text-center text-sm">
              {accuracy}% de bonnes réponses — vous pouvez passer à la suite.
            </p>
            <div className="w-full space-y-3">
              <Button className="w-full" onClick={() => router.push("/curriculum")}>
                Retour au programme
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="h-20 w-20 rounded-full bg-orange-500/15 flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-orange-500" />
            </div>
            <h2 className="text-xl font-bold text-center">Pas encore prêt</h2>
            <p className="text-muted-foreground text-center text-sm">
              {accuracy}% de bonnes réponses (85% requis)
            </p>
            {wrongAreas.size > 0 && (
              <div className="w-full">
                <p className="text-sm font-medium mb-2">À travailler :</p>
                <div className="flex flex-wrap gap-2">
                  {Array.from(wrongAreas).map((area) => (
                    <Badge key={area} variant="secondary">{area}</Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="w-full space-y-3">
              <Button
                className="w-full"
                onClick={() => router.push(`/curriculum`)}
              >
                Étudier la leçon
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/curriculum")}
              >
                Retour au programme
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }

  const progressPercent = ((currentIndex) / exercises.length) * 100;
  const isCorrectFill = submitted && exercise.kind === "fill_blank"
    ? normalize(fillAnswer) === normalize(exercise.correctAnswer)
    : false;

  return (
    <div className="min-h-screen px-4 py-6 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/curriculum")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <Progress value={progressPercent} className="h-2" />
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {currentIndex + 1}/{exercises.length}
        </span>
      </div>

      <p className="text-xs text-muted-foreground mb-1 text-center">
        Test de validation — {lesson.title}
      </p>

      {exercise.kind === "fill_blank" ? (
        <div className="flex flex-col items-center gap-6 mt-6">
          <Badge variant="secondary" className="text-xs">Complétez le mot</Badge>

          <Card className="w-full">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center gap-4">
              <p className="text-xl font-medium leading-relaxed">{exercise.question}</p>
              {exercise.hint && (
                <p className="text-base text-muted-foreground">{exercise.hint}</p>
              )}
            </CardContent>
          </Card>

          <form
            onSubmit={(e) => { e.preventDefault(); handleSubmitFill(); }}
            className="w-full space-y-4"
          >
            <input
              value={fillAnswer}
              onChange={(e) => setFillAnswer(e.target.value)}
              placeholder="Tapez votre réponse..."
              className={cn(
                "w-full text-center text-lg h-14 rounded-md border bg-background px-4",
                submitted && isCorrectFill && "border-green-500",
                submitted && !isCorrectFill && "border-red-500"
              )}
              disabled={submitted}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            {!submitted && (
              <Button type="submit" className="w-full" disabled={!fillAnswer.trim()}>
                Vérifier
              </Button>
            )}
          </form>

          {submitted && (
            <div className="w-full space-y-4">
              <div
                className={cn(
                  "flex items-center gap-2 justify-center p-3 rounded-lg",
                  isCorrectFill
                    ? "bg-green-500/10 text-green-700 dark:text-green-400"
                    : "bg-red-500/10 text-red-700 dark:text-red-400"
                )}
              >
                {isCorrectFill ? (
                  <>
                    <Check className="h-5 w-5" />
                    <span className="font-medium">Correct !</span>
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5" />
                    <span>
                      Réponse : <strong>{exercise.correctAnswer}</strong>
                    </span>
                  </>
                )}
              </div>
              <Button className="w-full" onClick={handleNext}>
                Continuer
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 mt-6">
          <Badge variant="secondary" className="text-xs">
            {exercise.kind === "mc_vocab" ? "Vocabulaire" : "Grammaire"}
          </Badge>

          <Card className="w-full">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Quelle est la traduction ?
              </p>
              <p className="text-2xl font-bold">{exercise.question}</p>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 w-full">
            {exercise.options?.map((option, i) => {
              const isThis = selected === option;
              const isThisCorrect = option === exercise.correctAnswer;

              return (
                <Button
                  key={i}
                  variant="outline"
                  className={cn(
                    "w-full h-auto min-h-[52px] text-left justify-start px-4 py-3 text-base whitespace-normal",
                    submitted && isThisCorrect && "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400",
                    submitted && isThis && !isThisCorrect && "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400",
                    !submitted && "hover:bg-accent"
                  )}
                  onClick={() => handleSelectOption(option)}
                  disabled={submitted}
                >
                  <span className="flex-1">{option}</span>
                  {submitted && isThisCorrect && (
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                  )}
                  {submitted && isThis && !isThisCorrect && (
                    <X className="h-5 w-5 text-red-500 shrink-0" />
                  )}
                </Button>
              );
            })}
          </div>

          {submitted && (
            <Button className="w-full" onClick={handleNext}>
              Continuer
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
