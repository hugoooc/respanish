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
  ArrowRight,
  Calendar,
  Trophy,
  BookOpenCheck,
  Languages,
  MessageCircle,
} from "lucide-react";
import {
  getSettings,
  getDueCards,
  getAllCardProgress,
  getTodayReviewCount,
} from "@/lib/db";
import { getCurriculumStats, computeDimensionScores } from "@/lib/curriculum-engine";
import { State } from "ts-fsrs";

interface DashboardData {
  streakDays: number;
  dueCount: number;
  completedLessons: number;
  totalLessons: number;
  currentUnitTitle: string;
  currentLessonTitle: string;
  progressPercent: number;
  currentWeek: number;
  totalWeeks: number;
  onTrack: boolean;
  lessonsPerWeekNeeded: number;
  estimatedCompletion: Date | null;
  vocabMastery: number;
  grammarMastery: number;
  situationalMastery: number;
  placementDone: boolean;
}

function getTrackStatus(onTrack: boolean, completedLessons: number, totalLessons: number, currentWeek: number, totalWeeks: number) {
  const expectedProgress = (currentWeek / totalWeeks) * totalLessons;
  const diff = completedLessons - expectedProgress;

  if (diff >= 2) return { label: "En avance", color: "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30" };
  if (diff >= -1) return { label: "En bonne voie", color: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30" };
  return { label: "En retard", color: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30" };
}

function DimensionRing({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-16 w-16">
        <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-muted/30"
          />
          <path
            d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${value}, 100`}
            className="text-primary transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <span className="text-xs text-muted-foreground text-center">{label}</span>
      <span className="text-sm font-semibold">{value}%</span>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function load() {
      const settings = await getSettings();

      if (!settings.placementCompleted) {
        setData({ placementDone: false } as DashboardData);
        return;
      }

      const [dueCards, stats, dimensions] = await Promise.all([
        getDueCards(new Date()),
        getCurriculumStats(),
        computeDimensionScores(),
      ]);

      setData({
        streakDays: settings.streakDays,
        dueCount: dueCards.length,
        completedLessons: stats.completedLessons,
        totalLessons: stats.totalLessons,
        currentUnitTitle: stats.currentUnit
          ? `Unité ${stats.currentUnit.order}: ${stats.currentUnit.title}`
          : "Unité 1",
        currentLessonTitle: stats.currentLesson?.title ?? "Première leçon",
        progressPercent: stats.progressPercent,
        currentWeek: stats.currentWeek,
        totalWeeks: stats.totalWeeks,
        onTrack: stats.onTrack,
        lessonsPerWeekNeeded: stats.lessonsPerWeekNeeded,
        estimatedCompletion: stats.estimatedCompletion,
        vocabMastery: dimensions.vocabMastery,
        grammarMastery: dimensions.grammarMastery,
        situationalMastery: dimensions.situationalMastery,
        placementDone: true,
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

  const trackStatus = getTrackStatus(
    data.onTrack,
    data.completedLessons,
    data.totalLessons,
    data.currentWeek,
    data.totalWeeks
  );

  const behindCount = Math.max(
    0,
    Math.round((data.currentWeek / data.totalWeeks) * data.totalLessons) - data.completedLessons
  );

  return (
    <div className="min-h-screen px-4 py-6 max-w-md mx-auto pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Re<span className="text-primary">Spanish</span>
        </h1>
      </div>

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
            <p className="text-2xl font-bold">{data.completedLessons}</p>
            <p className="text-xs text-muted-foreground">leçons</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent className="p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Position actuelle
          </p>
          <p className="font-semibold text-base">{data.currentUnitTitle}</p>
          <p className="text-sm text-muted-foreground mb-4">
            Leçon : {data.currentLessonTitle}
          </p>
          <Button
            className="w-full gap-2"
            onClick={() => router.push("/session")}
          >
            Continuer
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            Progression du programme
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={data.progressPercent} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{data.progressPercent}% du programme</span>
            <span>Semaine {data.currentWeek}/{data.totalWeeks}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            Dimensions de maîtrise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <DimensionRing
              label="Vocabulaire"
              value={data.vocabMastery}
              icon={<BookOpenCheck className="h-5 w-5 text-primary" />}
            />
            <DimensionRing
              label="Grammaire"
              value={data.grammarMastery}
              icon={<Languages className="h-5 w-5 text-primary" />}
            />
            <DimensionRing
              label="Situationnel"
              value={data.situationalMastery}
              icon={<MessageCircle className="h-5 w-5 text-primary" />}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            Objectif B2
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Semaine {data.currentWeek} sur {data.totalWeeks}
              </span>
            </div>
            <Badge variant="outline" className={trackStatus.color}>
              {trackStatus.label}
            </Badge>
          </div>

          {behindCount > 0 && (
            <p className="text-sm text-orange-600 dark:text-orange-400">
              Complétez {behindCount} leçon{behindCount > 1 ? "s" : ""} cette semaine pour rattraper
            </p>
          )}

          {data.estimatedCompletion && (
            <p className="text-xs text-muted-foreground">
              Fin estimée : {data.estimatedCompletion.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="h-12 gap-2"
          onClick={() => router.push("/learn")}
        >
          <Target className="h-4 w-4" />
          Révision rapide
        </Button>
        <Button
          variant="outline"
          className="h-12 gap-2"
          onClick={() => router.push("/curriculum")}
        >
          <BookOpen className="h-4 w-4" />
          Voir le programme
        </Button>
      </div>
    </div>
  );
}
