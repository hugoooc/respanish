"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Brain, Calendar, BarChart3 } from "lucide-react";
import { getAllCardProgress, getReviewLogs, getSettings } from "@/lib/db";
import type { CardProgress, ReviewLogEntry, UserSettings } from "@/lib/types";
import { State, Rating } from "ts-fsrs";

interface StatsData {
  settings: UserSettings;
  progress: CardProgress[];
  logs: ReviewLogEntry[];
}

export default function StatsPage() {
  const [data, setData] = useState<StatsData | null>(null);

  useEffect(() => {
    async function load() {
      const [settings, progress, logs] = await Promise.all([
        getSettings(),
        getAllCardProgress(),
        getReviewLogs(),
      ]);
      setData({ settings, progress, logs });
    }
    load();
  }, []);

  const stats = useMemo(() => {
    if (!data) return null;

    const { progress, logs } = data;

    const newCards = progress.filter((c) => c.state === State.New).length;
    const learning = progress.filter((c) => c.state === State.Learning).length;
    const review = progress.filter((c) => c.state === State.Review).length;
    const relearning = progress.filter(
      (c) => c.state === State.Relearning
    ).length;

    const totalReviews = logs.length;
    const correctReviews = logs.filter(
      (l) => l.rating !== Rating.Again
    ).length;
    const accuracy =
      totalReviews > 0 ? Math.round((correctReviews / totalReviews) * 100) : 0;

    const avgStability =
      progress.length > 0
        ? progress.reduce((sum, c) => sum + c.stability, 0) / progress.length
        : 0;

    const last7Days = getLast7DaysActivity(logs);
    const last30Days = getLast30DaysActivity(logs);

    return {
      newCards,
      learning,
      review,
      relearning,
      totalReviews,
      accuracy,
      avgStability: Math.round(avgStability * 10) / 10,
      last7Days,
      last30Days,
    };
  }, [data]);

  if (!data || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Statistiques</h1>

      {/* Card states */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Brain className="h-4 w-4" />
            État des cartes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-blue-500/10 p-3 text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.newCards}
              </p>
              <p className="text-xs text-muted-foreground">Nouvelles</p>
            </div>
            <div className="rounded-lg bg-yellow-500/10 p-3 text-center">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.learning}
              </p>
              <p className="text-xs text-muted-foreground">En cours</p>
            </div>
            <div className="rounded-lg bg-green-500/10 p-3 text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.review}
              </p>
              <p className="text-xs text-muted-foreground">Révision</p>
            </div>
            <div className="rounded-lg bg-red-500/10 p-3 text-center">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.relearning}
              </p>
              <p className="text-xs text-muted-foreground">Ré-apprentissage</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key metrics */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Métriques clés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Total révisions
            </span>
            <span className="font-medium">{stats.totalReviews}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Précision</span>
            <Badge
              variant={stats.accuracy >= 80 ? "default" : "secondary"}
            >
              {stats.accuracy}%
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Stabilité moyenne
            </span>
            <span className="font-medium">
              {stats.avgStability} jours
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Série</span>
            <span className="font-medium">
              {data.settings.streakDays} jours
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 7-day activity */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            7 derniers jours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-1 h-24">
            {stats.last7Days.map((day) => {
              const maxCount = Math.max(...stats.last7Days.map((d) => d.count), 1);
              const height = (day.count / maxCount) * 100;
              return (
                <div
                  key={day.date}
                  className="flex flex-col items-center gap-1 flex-1"
                >
                  <span className="text-xs font-medium">{day.count}</span>
                  <div
                    className="w-full rounded-t bg-primary/80 transition-all min-h-[4px]"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 30-day overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            30 derniers jours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {stats.last30Days.map((day) => {
              const intensity =
                day.count === 0
                  ? "bg-muted"
                  : day.count < 10
                    ? "bg-primary/20"
                    : day.count < 30
                      ? "bg-primary/50"
                      : "bg-primary/80";
              return (
                <div
                  key={day.date}
                  className={`aspect-square rounded-sm ${intensity}`}
                  title={`${day.date}: ${day.count} révisions`}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-2 justify-end">
            <span className="text-xs text-muted-foreground">Moins</span>
            <div className="flex gap-0.5">
              <div className="w-3 h-3 rounded-sm bg-muted" />
              <div className="w-3 h-3 rounded-sm bg-primary/20" />
              <div className="w-3 h-3 rounded-sm bg-primary/50" />
              <div className="w-3 h-3 rounded-sm bg-primary/80" />
            </div>
            <span className="text-xs text-muted-foreground">Plus</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getLast7DaysActivity(
  logs: ReviewLogEntry[]
): { date: string; label: string; count: number }[] {
  const days: { date: string; label: string; count: number }[] = [];
  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const count = logs.filter((l) => {
      const logDate = new Date(l.reviewedAt).toISOString().split("T")[0];
      return logDate === dateStr;
    }).length;
    days.push({
      date: dateStr,
      label: dayNames[d.getDay()],
      count,
    });
  }

  return days;
}

function getLast30DaysActivity(
  logs: ReviewLogEntry[]
): { date: string; count: number }[] {
  const days: { date: string; count: number }[] = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const count = logs.filter((l) => {
      const logDate = new Date(l.reviewedAt).toISOString().split("T")[0];
      return logDate === dateStr;
    }).length;
    days.push({ date: dateStr, count });
  }

  return days;
}
