"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Star,
  CheckCircle2,
  Trophy,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Map as MapIcon,
  Loader2,
  ArrowLeft,
  Circle,
} from "lucide-react";
import { getLessonStatusMap, getCurriculumStats, getAllUnits } from "@/lib/curriculum-engine";
import type { Unit, LessonStatus } from "@/lib/types";

const STATUS_CONFIG: Record<
  LessonStatus,
  { icon: typeof Lock; label: string; color: string }
> = {
  locked: { icon: Lock, label: "Verrouillée", color: "text-muted-foreground/50" },
  available: { icon: Star, label: "Disponible", color: "text-yellow-500" },
  in_progress: { icon: Circle, label: "En cours", color: "text-blue-500" },
  completed: { icon: CheckCircle2, label: "Terminée", color: "text-green-500" },
  mastered: { icon: Trophy, label: "Maîtrisée", color: "text-amber-500" },
};

export default function CurriculumPage() {
  const router = useRouter();
  const [statusMap, setStatusMap] = useState<Map<string, LessonStatus>>(() => new Map<string, LessonStatus>());
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getCurriculumStats>> | null>(null);
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(() => new Set<string>());
  const [loading, setLoading] = useState(true);

  const units = getAllUnits();

  useEffect(() => {
    async function load() {
      const [sm, st] = await Promise.all([getLessonStatusMap(), getCurriculumStats()]);
      setStatusMap(sm);
      setStats(st);

      if (st.currentUnit) {
        setExpandedUnits(new Set([st.currentUnit.id]));
      }
      setLoading(false);
    }
    load();
  }, []);

  function toggleUnit(unitId: string) {
    setExpandedUnits((prev) => {
      const next = new Set(prev);
      if (next.has(unitId)) {
        next.delete(unitId);
      } else {
        next.add(unitId);
      }
      return next;
    });
  }

  function getUnitProgress(unit: Unit): number {
    const done = unit.lessons.filter((l) => {
      const s = statusMap.get(l.id);
      return s === "completed" || s === "mastered";
    }).length;
    return unit.lessons.length > 0 ? Math.round((done / unit.lessons.length) * 100) : 0;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-24 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapIcon className="h-6 w-6 text-primary" />
            Parcours
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            12 unités &middot; {stats?.totalLessons ?? 0} leçons
          </p>
        </div>
      </div>

      {stats && (
        <Card className="mb-6">
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progression globale</span>
              <span className="font-medium">{stats.progressPercent}%</span>
            </div>
            <Progress value={stats.progressPercent} className="h-3" />
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">
                {stats.completedLessons} / {stats.totalLessons} leçons
              </Badge>
              {stats.masteredLessons > 0 && (
                <Badge variant="outline" className="gap-1">
                  <Trophy className="h-3 w-3" />
                  {stats.masteredLessons} maîtrisées
                </Badge>
              )}
              <Badge variant="outline">Semaine {stats.currentWeek}/{stats.totalWeeks}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {units.map((unit) => {
          const isExpanded = expandedUnits.has(unit.id);
          const unitProgress = getUnitProgress(unit);
          const isCurrent = stats?.currentUnit?.id === unit.id;

          return (
            <Card
              key={unit.id}
              className={isCurrent ? "ring-2 ring-primary/50" : ""}
            >
              <CardHeader
                className="p-4 cursor-pointer select-none"
                onClick={() => toggleUnit(unit.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-base">
                        Unité {unit.order}: {unit.title}
                      </CardTitle>
                      {isCurrent && (
                        <Badge variant="default" className="text-xs shrink-0">En cours</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{unit.theme}</p>
                    <p className="text-xs text-muted-foreground/70 mt-0.5">
                      {unit.grammarFocus}
                    </p>
                    {unitProgress > 0 && (
                      <Progress value={unitProgress} className="h-1.5 mt-2" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="px-4 pb-4 pt-0">
                  <div className="space-y-2 ml-8">
                    {unit.lessons.map((lesson) => {
                      const status = statusMap.get(lesson.id) ?? "locked";
                      const config = STATUS_CONFIG[status];
                      const StatusIcon = config.icon;
                      const isLocked = status === "locked";
                      const isClickable = !isLocked;

                      return (
                        <button
                          key={lesson.id}
                          className={`w-full text-left flex items-center gap-3 p-3 rounded-lg transition-colors ${
                            isLocked
                              ? "opacity-40 cursor-not-allowed"
                              : "hover:bg-muted/50 cursor-pointer active:bg-muted"
                          }`}
                          disabled={isLocked}
                          onClick={() => {
                            if (isClickable) router.push(`/lesson/${lesson.id}`);
                          }}
                        >
                          <StatusIcon className={`h-5 w-5 shrink-0 ${config.color}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {lesson.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {lesson.grammarFocus}
                            </p>
                          </div>
                          {!isLocked && (
                            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
