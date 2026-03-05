"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Trophy,
  Clock,
  BookOpen,
  Brain,
  Dumbbell,
  Square,
  ChevronRight,
} from "lucide-react";
import { Flashcard } from "@/components/exercises/flashcard";
import { MultipleChoice } from "@/components/exercises/multiple-choice";
import { FillBlank } from "@/components/exercises/fill-blank";
import { SentenceBuilder } from "@/components/exercises/sentence-builder";
import {
  buildSession,
  reviewCard,
  pickExerciseType,
  Rating,
  type Grade,
} from "@/lib/fsrs-engine";
import { getSettings, getDueCards } from "@/lib/db";
import {
  buildSessionPlan,
  getLesson,
  completeLesson,
} from "@/lib/curriculum-engine";
import type {
  SessionCard,
  Lesson,
  GrammarEntry,
  VocabEntry,
} from "@/lib/types";
import { fsrsCardToProgress } from "@/lib/types";
import { GRAMMAR } from "@/data/grammar";
import { VOCABULARY } from "@/data/vocabulary";
import { SENTENCES } from "@/data/sentences";
import { createEmptyCard } from "ts-fsrs";

type SessionPhase =
  | "loading"
  | "review"
  | "lesson_study"
  | "lesson_practice"
  | "summary";

const PHASE_CONFIG = {
  review: { label: "Révision", icon: Brain, color: "text-blue-500" },
  lesson_study: { label: "Étude", icon: BookOpen, color: "text-green-500" },
  lesson_practice: {
    label: "Exercices",
    icon: Dumbbell,
    color: "text-orange-500",
  },
} as const;

function buildLessonPracticeCards(lesson: Lesson): SessionCard[] {
  const cards: SessionCard[] = [];
  const now = new Date();

  for (const vocabId of lesson.vocabIds) {
    const content = VOCABULARY.find((v) => v.id === vocabId);
    if (!content) continue;
    const emptyCard = createEmptyCard(now);
    const progress = fsrsCardToProgress(emptyCard, vocabId, "vocab");
    const sentence = SENTENCES.find((s) => s.vocab_id === vocabId);
    cards.push({
      cardId: vocabId,
      cardType: "vocab",
      exerciseType: pickExerciseType(0, 0),
      progress,
      content,
      sentence,
    });
  }

  for (const grammarId of lesson.grammarIds) {
    const content = GRAMMAR.find((g) => g.id === grammarId);
    if (!content) continue;
    const emptyCard = createEmptyCard(now);
    const progress = fsrsCardToProgress(emptyCard, grammarId, "grammar");
    const sentence = SENTENCES.find((s) => s.grammar_id === grammarId);
    cards.push({
      cardId: grammarId,
      cardType: "grammar",
      exerciseType: pickExerciseType(0, 0),
      progress,
      content,
      sentence,
    });
  }

  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function renderExercise(
  card: SessionCard,
  onRate: (rating: Grade) => void
) {
  switch (card.exerciseType) {
    case "flashcard":
      return (
        <Flashcard key={card.cardId} sessionCard={card} onRate={onRate} />
      );
    case "multiple_choice":
      return (
        <MultipleChoice
          key={card.cardId}
          sessionCard={card}
          onRate={onRate}
        />
      );
    case "fill_blank":
      return (
        <FillBlank key={card.cardId} sessionCard={card} onRate={onRate} />
      );
    case "sentence_build":
      return (
        <SentenceBuilder
          key={card.cardId}
          sessionCard={card}
          onRate={onRate}
        />
      );
  }
}

function LessonStudyView({
  lesson,
  onContinue,
}: {
  lesson: Lesson;
  onContinue: () => void;
}) {
  const grammarEntries = lesson.grammarIds
    .map((id) => GRAMMAR.find((g) => g.id === id))
    .filter(Boolean) as GrammarEntry[];

  const vocabEntries = lesson.vocabIds
    .map((id) => VOCABULARY.find((v) => v.id === id))
    .filter(Boolean) as VocabEntry[];

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold">{lesson.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {lesson.description}
          </p>
        </div>

        {grammarEntries.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Grammaire
            </h3>
            {grammarEntries.map((g) => (
              <Card key={g.id}>
                <CardContent className="p-4 space-y-2">
                  <p className="font-medium">{g.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {g.explanation}
                  </p>
                  {g.examples[0] && (
                    <div className="text-sm bg-muted/50 rounded-md p-3 space-y-1">
                      <p className="italic">{g.examples[0].es}</p>
                      <p className="text-muted-foreground">
                        {g.examples[0].fr}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {vocabEntries.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Vocabulaire clé
            </h3>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {vocabEntries.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center gap-2 text-sm py-1"
                    >
                      <span className="font-medium min-w-[100px]">
                        {v.spanish}
                      </span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-muted-foreground">{v.french}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Button className="w-full gap-2" onClick={onContinue}>
          Continuer
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function ActiveSessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetMinutes = parseInt(searchParams.get("minutes") ?? "15", 10);
  const targetSeconds = targetMinutes * 60;

  const [phase, setPhase] = useState<SessionPhase>("loading");
  const [plan, setPlan] = useState<{
    reviewCount: number;
    lessonStudy: boolean;
    lessonPractice: boolean;
  } | null>(null);
  const [reviewQueue, setReviewQueue] = useState<SessionCard[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [practiceQueue, setPracticeQueue] = useState<SessionCard[]>([]);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [reviewCorrect, setReviewCorrect] = useState(0);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [practiceCorrect, setPracticeCorrect] = useState(0);
  const [practiceTotal, setPracticeTotal] = useState(0);
  const [lessonResult, setLessonResult] = useState<{
    passed: boolean;
  } | null>(null);

  useEffect(() => {
    if (phase === "summary") return;
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime, phase]);

  const advancePhase = useCallback(
    (from: SessionPhase) => {
      if (!plan) return;
      if (from === "review") {
        if (plan.lessonStudy && lesson) setPhase("lesson_study");
        else if (plan.lessonPractice && lesson) setPhase("lesson_practice");
        else setPhase("summary");
      } else if (from === "lesson_study") {
        if (plan.lessonPractice && lesson) setPhase("lesson_practice");
        else setPhase("summary");
      } else {
        setPhase("summary");
      }
    },
    [plan, lesson]
  );

  const loadSession = useCallback(async () => {
    const settings = await getSettings();
    if (!settings.placementCompleted) {
      router.replace("/placement");
      return;
    }

    const now = new Date();
    const dueCards = await getDueCards(now);
    const sessionPlan = buildSessionPlan(
      targetMinutes,
      dueCards.length,
      settings.currentLessonId
    );
    setPlan(sessionPlan);

    let reviews: SessionCard[] = [];
    if (sessionPlan.reviewCount > 0) {
      const allSession = await buildSession();
      reviews = allSession.slice(0, sessionPlan.reviewCount);
      setReviewQueue(reviews);
    }

    let currentLesson: Lesson | null = null;
    if (settings.currentLessonId) {
      currentLesson = getLesson(settings.currentLessonId) ?? null;
      setLesson(currentLesson);
    }

    let practice: SessionCard[] = [];
    if (sessionPlan.lessonPractice && currentLesson) {
      practice = buildLessonPracticeCards(currentLesson);
      setPracticeQueue(practice);
    }

    if (reviews.length > 0) {
      setPhase("review");
    } else if (sessionPlan.lessonStudy && currentLesson) {
      setPhase("lesson_study");
    } else if (practice.length > 0) {
      setPhase("lesson_practice");
    } else {
      setPhase("summary");
    }
  }, [targetMinutes, router]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const handleReviewRate = useCallback(
    async (rating: Grade) => {
      const card = reviewQueue[reviewIndex];
      await reviewCard(card.cardId, card.cardType, rating);
      const isCorrect = rating !== Rating.Again;
      setReviewCorrect((c) => c + (isCorrect ? 1 : 0));
      setReviewTotal((c) => c + 1);

      const next = reviewIndex + 1;
      if (next >= reviewQueue.length) {
        advancePhase("review");
      } else {
        setReviewIndex(next);
      }
    },
    [reviewQueue, reviewIndex, advancePhase]
  );

  const handlePracticeRate = useCallback(
    async (rating: Grade) => {
      const card = practiceQueue[practiceIndex];
      await reviewCard(card.cardId, card.cardType, rating);

      const isCorrect = rating !== Rating.Again;
      const newCorrect = practiceCorrect + (isCorrect ? 1 : 0);
      const newTotal = practiceTotal + 1;
      setPracticeCorrect(newCorrect);
      setPracticeTotal(newTotal);

      const next = practiceIndex + 1;
      if (next >= practiceQueue.length) {
        if (lesson) {
          const accuracy = Math.round((newCorrect / newTotal) * 100);
          const result = await completeLesson(lesson.id, accuracy);
          setLessonResult({ passed: result.passed });
        }
        setPhase("summary");
      } else {
        setPracticeIndex(next);
      }
    },
    [practiceQueue, practiceIndex, practiceCorrect, practiceTotal, lesson]
  );

  const handleEndEarly = useCallback(async () => {
    if (phase === "lesson_practice" && lesson && practiceTotal > 0) {
      const accuracy = Math.round((practiceCorrect / practiceTotal) * 100);
      const result = await completeLesson(lesson.id, accuracy);
      setLessonResult({ passed: result.passed });
    }
    setPhase("summary");
  }, [phase, lesson, practiceCorrect, practiceTotal]);

  const totalSteps =
    reviewQueue.length +
    (plan?.lessonStudy ? 1 : 0) +
    practiceQueue.length;
  const completedSteps = (() => {
    switch (phase) {
      case "review":
        return reviewIndex;
      case "lesson_study":
        return reviewQueue.length;
      case "lesson_practice":
        return (
          reviewQueue.length + (plan?.lessonStudy ? 1 : 0) + practiceIndex
        );
      case "summary":
        return totalSteps;
      default:
        return 0;
    }
  })();
  const overallProgress =
    totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  if (phase === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (phase === "summary") {
    const totalCorrect = reviewCorrect + practiceCorrect;
    const totalItems = reviewTotal + practiceTotal;
    const accuracy =
      totalItems > 0 ? Math.round((totalCorrect / totalItems) * 100) : 0;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-6">
        <Trophy className="h-16 w-16 text-yellow-500" />
        <h2 className="text-2xl font-bold">Session terminée !</h2>

        <Card className="w-full max-w-sm">
          <CardContent className="p-6 space-y-4">
            {reviewTotal > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cartes révisées</span>
                <span className="font-bold">{reviewTotal}</span>
              </div>
            )}
            {practiceTotal > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Exercices faits</span>
                <span className="font-bold">{practiceTotal}</span>
              </div>
            )}
            {totalItems > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Précision</span>
                <span className="font-bold">{accuracy}%</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Temps</span>
              <span className="font-bold">{formatTime(elapsed)}</span>
            </div>
            {lessonResult && (
              <div className="pt-2 border-t">
                <Badge
                  variant={lessonResult.passed ? "default" : "secondary"}
                >
                  {lessonResult.passed
                    ? "Leçon réussie !"
                    : "Leçon à reprendre"}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <Button
            className="w-full gap-2"
            onClick={() =>
              router.push(`/session/active?minutes=${targetMinutes}`)
            }
          >
            Nouvelle session
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/curriculum")}
          >
            Voir le parcours
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => router.push("/")}
          >
            Retour à l&apos;accueil
          </Button>
        </div>
      </div>
    );
  }

  const phaseConfig = PHASE_CONFIG[phase as keyof typeof PHASE_CONFIG];
  const PhaseIcon = phaseConfig?.icon ?? Brain;
  const timerOver = elapsed > targetSeconds;

  return (
    <div className="min-h-screen px-4 py-6 flex flex-col">
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PhaseIcon className={`h-4 w-4 ${phaseConfig?.color}`} />
            <span className="text-sm font-medium">{phaseConfig?.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-1 text-sm ${timerOver ? "text-red-500" : "text-muted-foreground"}`}
            >
              <Clock className="h-4 w-4" />
              <span>
                {formatTime(elapsed)} / {formatTime(targetSeconds)}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              onClick={handleEndEarly}
            >
              <Square className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>

      {phase === "review" && reviewQueue.length > 0 && (
        <div className="flex-1 flex items-center justify-center">
          {renderExercise(reviewQueue[reviewIndex], handleReviewRate)}
        </div>
      )}

      {phase === "lesson_study" && lesson && (
        <LessonStudyView
          lesson={lesson}
          onContinue={() => advancePhase("lesson_study")}
        />
      )}

      {phase === "lesson_practice" && practiceQueue.length > 0 && (
        <div className="flex-1 flex items-center justify-center">
          {renderExercise(
            practiceQueue[practiceIndex],
            handlePracticeRate
          )}
        </div>
      )}
    </div>
  );
}

export default function ActiveSessionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ActiveSessionContent />
    </Suspense>
  );
}
