"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Zap, Clock, BookOpen, Brain, Loader2 } from "lucide-react";
import { getCurriculumStats, buildSessionPlan } from "@/lib/curriculum-engine";
import { getDueCards } from "@/lib/db";

interface TimePreset {
  minutes: number;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const PRESETS: TimePreset[] = [
  {
    minutes: 5,
    label: "Rapide",
    icon: <Zap className="h-8 w-8" />,
    description: "Quelques révisions express",
  },
  {
    minutes: 15,
    label: "Régulier",
    icon: <Clock className="h-8 w-8" />,
    description: "Révisions + étude de leçon",
  },
  {
    minutes: 30,
    label: "Approfondi",
    icon: <BookOpen className="h-8 w-8" />,
    description: "Révisions + leçon complète",
  },
  {
    minutes: 60,
    label: "Marathon",
    icon: <Brain className="h-8 w-8" />,
    description: "Session intensive complète",
  },
];

export default function SessionPage() {
  const router = useRouter();
  const [selectedMinutes, setSelectedMinutes] = useState(15);
  const [customMode, setCustomMode] = useState(false);
  const [dueReviewCount, setDueReviewCount] = useState(0);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [stats, dueCards] = await Promise.all([
        getCurriculumStats(),
        getDueCards(new Date()),
      ]);
      setDueReviewCount(dueCards.length);
      setCurrentLessonId(stats.currentLesson?.id ?? null);
      setLoading(false);
    }
    load();
  }, []);

  const plan = buildSessionPlan(selectedMinutes, dueReviewCount, currentLessonId);

  const previewText = useCallback(() => {
    const parts: string[] = [];
    if (plan.reviewCount > 0) parts.push(`~${plan.reviewCount} révisions`);
    if (plan.lessonStudy) parts.push("étude de leçon");
    if (plan.lessonPractice) parts.push("exercices pratiques");
    if (plan.nextLessonStudy) parts.push("prochaine leçon");
    return parts.length > 0 ? parts.join(" + ") : "Session vide";
  }, [plan]);

  const handlePresetSelect = (minutes: number) => {
    setSelectedMinutes(minutes);
    setCustomMode(false);
  };

  const handleCustomChange = (value: number[]) => {
    setSelectedMinutes(value[0]);
    setCustomMode(true);
  };

  const handleGo = () => {
    router.push(`/session/active?minutes=${selectedMinutes}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Nouvelle session</h1>
          <p className="text-muted-foreground mt-1">
            De combien de temps disposez-vous ?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {PRESETS.map((preset) => (
            <Card
              key={preset.minutes}
              className={`cursor-pointer transition-all active:scale-[0.97] ${
                !customMode && selectedMinutes === preset.minutes
                  ? "ring-2 ring-primary shadow-lg"
                  : "hover:shadow-md"
              }`}
              onClick={() => handlePresetSelect(preset.minutes)}
            >
              <CardContent className="flex flex-col items-center text-center p-5 gap-2">
                <div
                  className={
                    !customMode && selectedMinutes === preset.minutes
                      ? "text-primary"
                      : "text-muted-foreground"
                  }
                >
                  {preset.icon}
                </div>
                <span className="font-semibold">{preset.label}</span>
                <span className="text-xs text-muted-foreground">
                  {preset.minutes} min
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  {preset.description}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Durée personnalisée
            </span>
            <span className="text-sm font-semibold">{selectedMinutes} min</span>
          </div>
          <Slider
            value={[selectedMinutes]}
            onValueChange={handleCustomChange}
            min={5}
            max={60}
            step={5}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5 min</span>
            <span>60 min</span>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">
              Votre session inclura :
            </p>
            <p className="text-sm font-medium">{previewText()}</p>
            <p className="text-xs text-muted-foreground mt-2">
              ~{plan.estimatedMinutes} min estimées
              {dueReviewCount > 0 && ` · ${dueReviewCount} cartes à réviser`}
            </p>
          </CardContent>
        </Card>

        <Button className="w-full h-14 text-lg" onClick={handleGo}>
          C&apos;est parti !
        </Button>
      </div>
    </div>
  );
}
