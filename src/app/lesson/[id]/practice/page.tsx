"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2, Trophy, RefreshCw, ChevronRight } from "lucide-react";
import { Flashcard } from "@/components/exercises/flashcard";
import { MultipleChoice } from "@/components/exercises/multiple-choice";
import { FillBlank } from "@/components/exercises/fill-blank";
import { SentenceBuilder } from "@/components/exercises/sentence-builder";
import {
  reviewCard,
  pickExerciseType,
  getContentById,
  getSentenceForCard,
  Rating,
  type Grade,
} from "@/lib/fsrs-engine";
import { getCardProgress } from "@/lib/db";
import { getLesson, completeLesson } from "@/lib/curriculum-engine";
import { createEmptyCard } from "ts-fsrs";
import type {
  SessionCard,
  CardType,
  Lesson,
} from "@/lib/types";
import { fsrsCardToProgress } from "@/lib/types";

type PageState = "loading" | "session" | "not_found" | "summary";

interface LessonResult {
  accuracy: number;
  passed: boolean;
  nextLessonId: string | null;
  totalReviewed: number;
  correctCount: number;
}

export default function LessonPracticePage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.id as string;

  const [pageState, setPageState] = useState<PageState>("loading");
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [queue, setQueue] = useState<SessionCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalReviewed, setTotalReviewed] = useState(0);
  const [result, setResult] = useState<LessonResult | null>(null);

  const buildLessonQueue = useCallback(async (lesson: Lesson): Promise<SessionCard[]> => {
    const now = new Date();
    const cards: SessionCard[] = [];

    const items: { cardId: string; cardType: CardType }[] = [
      ...lesson.vocabIds.map((id) => ({ cardId: id, cardType: "vocab" as CardType })),
      ...lesson.grammarIds.map((id) => ({ cardId: id, cardType: "grammar" as CardType })),
      ...lesson.phraseIds.map((id) => ({ cardId: id, cardType: "phrase" as CardType })),
    ];

    for (const item of items) {
      const content = getContentById(item.cardId, item.cardType);
      if (!content) continue;

      let progress = await getCardProgress(item.cardId);
      if (!progress) {
        const emptyCard = createEmptyCard(now);
        progress = fsrsCardToProgress(emptyCard, item.cardId, item.cardType);
      }

      const exerciseType = pickExerciseType(progress.state, progress.reps);
      const sentence = getSentenceForCard(item.cardId);

      cards.push({
        cardId: item.cardId,
        cardType: item.cardType,
        exerciseType,
        progress,
        content,
        sentence,
      });
    }

    for (const sentenceId of lesson.sentenceIds) {
      const existing = cards.find((c) => c.sentence?.id === sentenceId);
      if (existing) continue;

      const vocabCard = cards.find((c) => c.cardType === "vocab" && c.sentence);
      if (vocabCard) continue;
    }

    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    if (lesson.scenarioDescription && shuffled.length > 0) {
      const scenarioCard = shuffled.find(
        (c) => c.sentence && c.exerciseType !== "flashcard"
      );
      if (scenarioCard) {
        const idx = shuffled.indexOf(scenarioCard);
        const card = shuffled.splice(idx, 1)[0];
        card.exerciseType = card.sentence ? "sentence_build" : "fill_blank";
        shuffled.push(card);
      }
    }

    return shuffled.slice(0, 15);
  }, []);

  const loadLesson = useCallback(async () => {
    setPageState("loading");
    const lessonData = getLesson(lessonId);
    if (!lessonData) {
      setPageState("not_found");
      return;
    }
    setLesson(lessonData);
    const cards = await buildLessonQueue(lessonData);
    setQueue(cards);
    setCurrentIndex(0);
    setCorrectCount(0);
    setTotalReviewed(0);
    setResult(null);
    setPageState("session");
  }, [lessonId, buildLessonQueue]);

  useEffect(() => {
    loadLesson();
  }, [loadLesson]);

  const handleRate = useCallback(
    async (rating: Grade) => {
      const card = queue[currentIndex];
      await reviewCard(card.cardId, card.cardType, rating);

      const isCorrect = rating !== Rating.Again;
      const newCorrect = correctCount + (isCorrect ? 1 : 0);
      const newTotal = totalReviewed + 1;
      setCorrectCount(newCorrect);
      setTotalReviewed(newTotal);

      const next = currentIndex + 1;
      if (next >= queue.length) {
        const accuracy = newTotal > 0 ? Math.round((newCorrect / newTotal) * 100) : 0;
        const completionResult = await completeLesson(lessonId, accuracy);
        setResult({
          accuracy,
          passed: completionResult.passed,
          nextLessonId: completionResult.nextLessonId,
          totalReviewed: newTotal,
          correctCount: newCorrect,
        });
        setPageState("summary");
      } else {
        setCurrentIndex(next);
      }
    },
    [queue, currentIndex, correctCount, totalReviewed, lessonId]
  );

  if (pageState === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (pageState === "not_found") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-6">
        <h2 className="text-2xl font-bold">Leçon introuvable</h2>
        <Button variant="outline" onClick={() => router.push("/")}>
          Retour à l&apos;accueil
        </Button>
      </div>
    );
  }

  if (pageState === "summary" && result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-6">
        <Trophy
          className={`h-16 w-16 ${result.passed ? "text-yellow-500" : "text-muted-foreground"}`}
        />
        <h2 className="text-2xl font-bold">
          {result.passed ? "Leçon terminée !" : "Continuez vos efforts !"}
        </h2>

        {lesson && (
          <p className="text-muted-foreground text-center">{lesson.title}</p>
        )}

        <Card className="w-full max-w-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Exercices</span>
              <span className="font-bold">{result.totalReviewed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Réponses correctes</span>
              <span className="font-bold">{result.correctCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Précision</span>
              <span
                className={`font-bold ${result.passed ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                {result.accuracy}%
              </span>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground text-center">
                {result.passed
                  ? "Bravo ! Vous avez réussi avec ≥ 70% de précision."
                  : "Il faut au moins 70% pour valider la leçon."}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          {result.passed && result.nextLessonId && (
            <Button
              className="w-full gap-2"
              onClick={() =>
                router.push(`/lesson/${result.nextLessonId}/practice`)
              }
            >
              Leçon suivante
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
          {!result.passed && (
            <Button className="w-full gap-2" onClick={loadLesson}>
              <RefreshCw className="h-4 w-4" />
              Réessayer
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/")}
          >
            Retour à l&apos;accueil
          </Button>
        </div>
      </div>
    );
  }

  const currentCard = queue[currentIndex];
  const progress = (currentIndex / queue.length) * 100;

  return (
    <div className="min-h-screen px-4 py-6 flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <Progress value={progress} className="h-2" />
        </div>
        <span className="text-sm text-muted-foreground min-w-[48px] text-right">
          {currentIndex + 1}/{queue.length}
        </span>
      </div>

      {lesson && (
        <p className="text-sm text-muted-foreground text-center mb-4">
          {lesson.title}
        </p>
      )}

      <div className="flex-1 flex items-center justify-center">
        {currentCard.exerciseType === "flashcard" && (
          <Flashcard key={currentCard.cardId} sessionCard={currentCard} onRate={handleRate} />
        )}
        {currentCard.exerciseType === "multiple_choice" && (
          <MultipleChoice key={currentCard.cardId} sessionCard={currentCard} onRate={handleRate} />
        )}
        {currentCard.exerciseType === "fill_blank" && (
          <FillBlank key={currentCard.cardId} sessionCard={currentCard} onRate={handleRate} />
        )}
        {currentCard.exerciseType === "sentence_build" && (
          <SentenceBuilder key={currentCard.cardId} sessionCard={currentCard} onRate={handleRate} />
        )}
      </div>
    </div>
  );
}
