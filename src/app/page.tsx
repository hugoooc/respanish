"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Flame,
  Target,
  BookOpen,
  Loader2,
  Zap,
} from "lucide-react";
import {
  getSettings,
  getDueCards,
  getAllCardProgress,
  getTodayReviewCount,
  getTodayNewCardCount,
} from "@/lib/db";
import { VOCABULARY } from "@/data/vocabulary";
import { GRAMMAR } from "@/data/grammar";
import { PHRASES } from "@/data/phrases";
import { State } from "ts-fsrs";

interface DashboardData {
  dueCount: number;
  streakDays: number;
  todayReviewed: number;
  todayNew: number;
  totalCards: number;
  learnedCards: number;
  matureCards: number;
  dailyGoal: number;
  placementDone: boolean;
  currentBand: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function load() {
      const settings = await getSettings();
      const now = new Date();
      const dueCards = await getDueCards(now);
      const allProgress = await getAllCardProgress();
      const todayReviewed = await getTodayReviewCount();
      const todayNew = await getTodayNewCardCount();

      const totalContent =
        VOCABULARY.length + GRAMMAR.length + PHRASES.length;

      const matureCards = allProgress.filter(
        (c) => c.state === State.Review && c.reps >= 3
      ).length;

      setData({
        dueCount: dueCards.length,
        streakDays: settings.streakDays,
        todayReviewed,
        todayNew,
        totalCards: totalContent,
        learnedCards: allProgress.length,
        matureCards,
        dailyGoal: settings.dailyMaxReviews,
        placementDone: settings.placementCompleted,
        currentBand: settings.currentBand,
      });
    }
    load();
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data.placementDone) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold">
            Re<span className="text-primary">Spanish</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Réapprenez l&apos;espagnol rapidement
          </p>
        </div>
        <Card className="w-full max-w-sm">
          <CardContent className="p-6 text-center space-y-4">
            <GraduationCap className="h-12 w-12 mx-auto text-primary" />
            <h2 className="text-xl font-semibold">Test de placement</h2>
            <p className="text-sm text-muted-foreground">
              Commençons par évaluer votre niveau actuel en espagnol.
              Cela prend environ 2 minutes.
            </p>
            <Button
              className="w-full"
              onClick={() => router.push("/placement")}
            >
              Commencer le test
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dailyProgress = Math.min(
    100,
    (data.todayReviewed / data.dailyGoal) * 100
  );
  const overallProgress =
    data.totalCards > 0
      ? Math.round((data.learnedCards / data.totalCards) * 100)
      : 0;

  return (
    <div className="min-h-screen px-4 py-6 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Re<span className="text-primary">Spanish</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Votre progression quotidienne
        </p>
      </div>

      {/* Streak and stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="h-6 w-6 mx-auto mb-1 text-orange-500" />
            <p className="text-2xl font-bold">{data.streakDays}</p>
            <p className="text-xs text-muted-foreground">jours</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 mx-auto mb-1 text-blue-500" />
            <p className="text-2xl font-bold">{data.dueCount}</p>
            <p className="text-xs text-muted-foreground">à réviser</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-6 w-6 mx-auto mb-1 text-green-500" />
            <p className="text-2xl font-bold">{data.matureCards}</p>
            <p className="text-xs text-muted-foreground">maîtrisés</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily progress */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            Objectif quotidien
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={dailyProgress} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {data.todayReviewed} révisées ({data.todayNew} nouvelles)
            </span>
            <span>{data.dailyGoal} objectif</span>
          </div>
        </CardContent>
      </Card>

      {/* Start session button */}
      <Button
        className="w-full h-14 text-lg gap-2 mb-6"
        onClick={() => router.push("/learn")}
      >
        <GraduationCap className="h-5 w-5" />
        {data.dueCount > 0
          ? `Réviser (${data.dueCount} cartes)`
          : "Apprendre"}
      </Button>

      {/* Overall progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            Progression globale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Cartes apprises
            </span>
            <span className="font-medium">
              {data.learnedCards} / {data.totalCards}
            </span>
          </div>
          <Progress value={overallProgress} className="h-2" />
          <div className="flex gap-2">
            <Badge variant="outline">Bande {data.currentBand}</Badge>
            <Badge variant="secondary">{overallProgress}%</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
