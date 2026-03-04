"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2, Trophy, Plus, Clock } from "lucide-react";
import { Flashcard } from "@/components/exercises/flashcard";
import { MultipleChoice } from "@/components/exercises/multiple-choice";
import { FillBlank } from "@/components/exercises/fill-blank";
import { SentenceBuilder } from "@/components/exercises/sentence-builder";
import {
  buildSession,
  buildExtraNewCards,
  reviewCard,
  getDueSoonCards,
  getNextDueCard,
  Rating,
  type Grade,
} from "@/lib/fsrs-engine";
import { getSettings } from "@/lib/db";
import type { SessionCard, SessionSummary } from "@/lib/types";

type PageState = "loading" | "session" | "empty" | "summary";

export default function LearnPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>("loading");
  const [queue, setQueue] = useState<SessionCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [totalReviewed, setTotalReviewed] = useState(0);
  const [startTime] = useState(Date.now());
  const [nextDue, setNextDue] = useState<{ due: Date; count: number } | null>(
    null
  );

  const loadSession = useCallback(async () => {
    setPageState("loading");
    const settings = await getSettings();
    if (!settings.placementCompleted) {
      router.replace("/placement");
      return;
    }
    const cards = await buildSession();
    if (cards.length === 0) {
      const next = await getNextDueCard();
      setNextDue(next);
      setPageState("empty");
    } else {
      setQueue(cards);
      setCurrentIndex(0);
      setPageState("session");
    }
  }, [router]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const handleRate = useCallback(
    async (rating: Grade) => {
      const card = queue[currentIndex];
      await reviewCard(card.cardId, card.cardType, rating);

      const isCorrect = rating !== Rating.Again;
      setCorrectCount((c) => c + (isCorrect ? 1 : 0));
      setIncorrectCount((c) => c + (isCorrect ? 0 : 1));
      setTotalReviewed((c) => c + 1);

      const next = currentIndex + 1;
      if (next >= queue.length) {
        // Re-check for learning-step cards that became due during session
        const dueSoon = await getDueSoonCards();
        if (dueSoon.length > 0) {
          setQueue(dueSoon);
          setCurrentIndex(0);
        } else {
          const nextDueInfo = await getNextDueCard();
          setNextDue(nextDueInfo);
          setPageState("summary");
        }
      } else {
        setCurrentIndex(next);
      }
    },
    [queue, currentIndex]
  );

  const handleLearnMore = useCallback(async () => {
    setPageState("loading");
    const extra = await buildExtraNewCards(20);
    if (extra.length === 0) {
      const next = await getNextDueCard();
      setNextDue(next);
      setPageState("empty");
      return;
    }
    setQueue(extra);
    setCurrentIndex(0);
    setPageState("session");
  }, []);

  if (pageState === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (pageState === "empty") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-6">
        <Trophy className="h-16 w-16 text-yellow-500" />
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Tout est révisé !</h2>
          {nextDue && (
            <div className="flex items-center gap-2 justify-center text-muted-foreground mt-2">
              <Clock className="h-4 w-4" />
              <span>
                Prochaine révision : {formatDueTime(nextDue.due)} ({nextDue.count} cartes)
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <Button className="w-full gap-2" onClick={handleLearnMore}>
            <Plus className="h-4 w-4" />
            Apprendre 20 nouvelles cartes
          </Button>
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

  if (pageState === "summary") {
    const accuracy =
      totalReviewed > 0
        ? Math.round((correctCount / totalReviewed) * 100)
        : 0;
    const elapsed = (Date.now() - startTime) / 1000;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-6">
        <Trophy className="h-16 w-16 text-yellow-500" />
        <h2 className="text-2xl font-bold">Session terminée !</h2>

        <Card className="w-full max-w-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cartes révisées</span>
              <span className="font-bold">{totalReviewed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Précision</span>
              <span className="font-bold">{accuracy}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Temps moyen</span>
              <span className="font-bold">
                {totalReviewed > 0 ? Math.round(elapsed / totalReviewed) : 0}s
              </span>
            </div>
            {nextDue && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                <Clock className="h-4 w-4" />
                <span>
                  Prochaine révision : {formatDueTime(nextDue.due)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <Button className="w-full gap-2" onClick={handleLearnMore}>
            <Plus className="h-4 w-4" />
            Apprendre 20 nouvelles cartes
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => loadSession()}
          >
            Vérifier les révisions dues
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

function formatDueTime(due: Date): string {
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin <= 0) return "maintenant";
  if (diffMin < 60) return `dans ${diffMin} min`;

  const diffHours = Math.round(diffMin / 60);
  if (diffHours < 24) return `dans ${diffHours}h`;

  const diffDays = Math.round(diffHours / 24);
  return `dans ${diffDays} jour${diffDays > 1 ? "s" : ""}`;
}
