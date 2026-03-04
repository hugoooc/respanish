"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2, Trophy } from "lucide-react";
import { Flashcard } from "@/components/exercises/flashcard";
import { MultipleChoice } from "@/components/exercises/multiple-choice";
import { FillBlank } from "@/components/exercises/fill-blank";
import { SentenceBuilder } from "@/components/exercises/sentence-builder";
import {
  buildSession,
  reviewCard,
  Rating,
  type Grade,
} from "@/lib/fsrs-engine";
import { getSettings } from "@/lib/db";
import type { SessionCard, SessionSummary } from "@/lib/types";

export default function LearnPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SessionCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    async function init() {
      const settings = await getSettings();
      if (!settings.placementCompleted) {
        router.replace("/placement");
        return;
      }
      const cards = await buildSession();
      setSession(cards);
      setLoading(false);
    }
    init();
  }, [router]);

  const handleRate = useCallback(
    async (rating: Grade) => {
      const card = session[currentIndex];
      await reviewCard(card.cardId, card.cardType, rating);

      if (rating === Rating.Again) {
        setIncorrectCount((c) => c + 1);
      } else {
        setCorrectCount((c) => c + 1);
      }

      const next = currentIndex + 1;
      if (next >= session.length) {
        const elapsed = (Date.now() - startTime) / 1000;
        setSummary({
          totalReviewed: session.length,
          newLearned: session.filter((s) => s.progress.state === 0).length,
          correctCount: correctCount + (rating !== Rating.Again ? 1 : 0),
          incorrectCount: incorrectCount + (rating === Rating.Again ? 1 : 0),
          averageTime: elapsed / session.length,
          streakDays: 0,
        });
      } else {
        setCurrentIndex(next);
      }
    },
    [session, currentIndex, correctCount, incorrectCount, startTime]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (session.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-6">
        <Trophy className="h-16 w-16 text-yellow-500" />
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Tout est révisé !</h2>
          <p className="text-muted-foreground">
            Pas de cartes à réviser pour le moment. Revenez plus tard ou ajoutez
            de nouvelles cartes.
          </p>
        </div>
        <Button onClick={() => router.push("/")}>Retour à l&apos;accueil</Button>
      </div>
    );
  }

  if (summary) {
    const accuracy =
      summary.totalReviewed > 0
        ? Math.round(
            (summary.correctCount / summary.totalReviewed) * 100
          )
        : 0;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-6">
        <Trophy className="h-16 w-16 text-yellow-500" />
        <h2 className="text-2xl font-bold">Session terminée !</h2>

        <Card className="w-full max-w-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cartes révisées</span>
              <span className="font-bold">{summary.totalReviewed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nouvelles cartes</span>
              <span className="font-bold">{summary.newLearned}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Précision</span>
              <span className="font-bold">{accuracy}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Temps moyen</span>
              <span className="font-bold">
                {Math.round(summary.averageTime)}s
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 w-full max-w-sm">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/")}
          >
            Accueil
          </Button>
          <Button
            className="flex-1"
            onClick={() => window.location.reload()}
          >
            Encore une session
          </Button>
        </div>
      </div>
    );
  }

  const currentCard = session[currentIndex];
  const progress = ((currentIndex) / session.length) * 100;

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
          {currentIndex + 1}/{session.length}
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {currentCard.exerciseType === "flashcard" && (
          <Flashcard sessionCard={currentCard} onRate={handleRate} />
        )}
        {currentCard.exerciseType === "multiple_choice" && (
          <MultipleChoice sessionCard={currentCard} onRate={handleRate} />
        )}
        {currentCard.exerciseType === "fill_blank" && (
          <FillBlank sessionCard={currentCard} onRate={handleRate} />
        )}
        {currentCard.exerciseType === "sentence_build" && (
          <SentenceBuilder sessionCard={currentCard} onRate={handleRate} />
        )}
      </div>
    </div>
  );
}
