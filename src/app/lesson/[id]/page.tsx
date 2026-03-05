"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  MessageSquare,
  Volume2,
  Languages,
  ChevronDown,
  ChevronUp,
  Loader2,
  Play,
  Lightbulb,
} from "lucide-react";
import { getLesson, getUnitForLesson, getLessonStatusMap } from "@/lib/curriculum-engine";
import { getLessonProgress } from "@/lib/db";
import { VOCABULARY } from "@/data/vocabulary";
import { GRAMMAR } from "@/data/grammar";
import { PHRASES } from "@/data/phrases";
import type { Lesson, Unit, VocabEntry, GrammarEntry, PhraseEntry, LessonStatus } from "@/lib/types";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [unit, setUnit] = useState<Unit | null>(null);
  const [status, setStatus] = useState<LessonStatus>("locked");
  const [flippedVocab, setFlippedVocab] = useState<Set<string>>(new Set());
  const [flippedPhrases, setFlippedPhrases] = useState<Set<string>>(new Set());
  const [expandedGrammar, setExpandedGrammar] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      const l = getLesson(lessonId);
      if (!l) {
        router.replace("/curriculum");
        return;
      }

      const u = getUnitForLesson(lessonId);
      const statusMap = await getLessonStatusMap();
      const s = statusMap.get(lessonId) ?? "locked";

      if (s === "locked") {
        router.replace("/curriculum");
        return;
      }

      setLesson(l);
      setUnit(u ?? null);
      setStatus(s);
      setExpandedGrammar(new Set(l.grammarIds));
      setLoading(false);
    }
    load();
  }, [lessonId, router]);

  const grammarEntries = useMemo(() => {
    if (!lesson) return [];
    const grammarMap = new Map(GRAMMAR.map((g) => [g.id, g]));
    return lesson.grammarIds
      .map((id) => grammarMap.get(id))
      .filter((g): g is GrammarEntry => g !== undefined);
  }, [lesson]);

  const vocabEntries = useMemo(() => {
    if (!lesson) return [];
    const vocabMap = new Map(VOCABULARY.map((v) => [v.id, v]));
    return lesson.vocabIds
      .map((id) => vocabMap.get(id))
      .filter((v): v is VocabEntry => v !== undefined);
  }, [lesson]);

  const phraseEntries = useMemo(() => {
    if (!lesson) return [];
    const phraseMap = new Map(PHRASES.map((p) => [p.id, p]));
    return lesson.phraseIds
      .map((id) => phraseMap.get(id))
      .filter((p): p is PhraseEntry => p !== undefined);
  }, [lesson]);

  function toggleVocab(id: string) {
    setFlippedVocab((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function togglePhrase(id: string) {
    setFlippedPhrases((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleGrammar(id: string) {
    setExpandedGrammar((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!lesson || !unit) return null;

  return (
    <div className="min-h-screen px-4 py-6 pb-24 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/curriculum")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">
            Unité {unit.order}: {unit.title}
          </p>
          <h1 className="text-xl font-bold truncate">{lesson.title}</h1>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 space-y-2">
          <p className="text-sm text-muted-foreground">{lesson.description}</p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary" className="gap-1">
              <BookOpen className="h-3 w-3" />
              {lesson.grammarFocus}
            </Badge>
            <Badge variant="outline">
              {vocabEntries.length} mots
            </Badge>
            <Badge variant="outline">
              {phraseEntries.length} phrases
            </Badge>
          </div>
        </CardContent>
      </Card>

      {grammarEntries.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Languages className="h-5 w-5 text-primary" />
            Grammaire
          </h2>
          <div className="space-y-3">
            {grammarEntries.map((g) => {
              const isExpanded = expandedGrammar.has(g.id);
              return (
                <Card key={g.id}>
                  <CardHeader
                    className="p-4 cursor-pointer select-none"
                    onClick={() => toggleGrammar(g.id)}
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 -rotate-90" />
                      )}
                      <CardTitle className="text-sm">{g.title}</CardTitle>
                    </div>
                  </CardHeader>
                  {isExpanded && (
                    <CardContent className="px-4 pb-4 pt-0 space-y-4">
                      <p className="text-sm text-muted-foreground">{g.explanation}</p>

                      {g.conjugation_table && Object.entries(g.conjugation_table).map(([tense, forms]) => (
                        <div key={tense}>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                            {tense}
                          </p>
                          <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted/50 p-3">
                            {Object.entries(forms).map(([pronoun, form]) => (
                              <div key={pronoun} className="flex gap-2 text-sm">
                                <span className="text-muted-foreground min-w-[5rem]">{pronoun}</span>
                                <span className="font-medium">{form}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {g.examples.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                            Exemples
                          </p>
                          <div className="space-y-2">
                            {g.examples.map((ex, i) => (
                              <div key={i} className="rounded-lg bg-muted/30 p-3 space-y-1">
                                <p className="text-sm font-medium">{ex.es}</p>
                                <p className="text-xs text-muted-foreground">{ex.fr}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {vocabEntries.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Vocabulaire
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {vocabEntries.map((v) => {
              const isFlipped = flippedVocab.has(v.id);
              return (
                <Card
                  key={v.id}
                  className="cursor-pointer active:scale-[0.97] transition-transform"
                  onClick={() => toggleVocab(v.id)}
                >
                  <CardContent className="p-3 text-center min-h-[5rem] flex flex-col items-center justify-center">
                    {isFlipped ? (
                      <>
                        <p className="text-sm font-medium text-primary">{v.french}</p>
                        <p className="text-xs text-muted-foreground mt-1">{v.pos}</p>
                        <p className="text-xs text-muted-foreground mt-1 italic">{v.example_es}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-base font-semibold">{v.spanish}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Toucher pour voir
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {phraseEntries.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Phrases utiles
          </h2>
          <div className="space-y-2">
            {phraseEntries.map((p) => {
              const isFlipped = flippedPhrases.has(p.id);
              return (
                <Card
                  key={p.id}
                  className="cursor-pointer active:scale-[0.99] transition-transform"
                  onClick={() => togglePhrase(p.id)}
                >
                  <CardContent className="p-3">
                    <p className="text-sm font-medium">{p.spanish}</p>
                    {isFlipped ? (
                      <p className="text-sm text-primary mt-1">{p.french}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">
                        Toucher pour voir la traduction
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <Card className="mb-6">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            {lesson.scenarioTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <p className="text-sm text-muted-foreground">{lesson.scenarioDescription}</p>
        </CardContent>
      </Card>

      <Button
        className="w-full h-14 text-lg gap-2"
        onClick={() => router.push(`/lesson/${lessonId}/practice`)}
      >
        <Play className="h-5 w-5" />
        Commencer l&apos;exercice
      </Button>
    </div>
  );
}
