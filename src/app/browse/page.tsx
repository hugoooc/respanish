"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { VOCABULARY } from "@/data/vocabulary";
import { GRAMMAR } from "@/data/grammar";
import { PHRASES } from "@/data/phrases";
import { getAllCardProgress } from "@/lib/db";
import type { CardProgress } from "@/lib/types";
import { State } from "ts-fsrs";

function stateLabel(state: number): string {
  switch (state) {
    case State.New:
      return "Nouveau";
    case State.Learning:
      return "En cours";
    case State.Review:
      return "Révision";
    case State.Relearning:
      return "Ré-apprentissage";
    default:
      return "Inconnu";
  }
}

function stateBadgeVariant(
  state: number
): "default" | "secondary" | "outline" | "destructive" {
  switch (state) {
    case State.Review:
      return "default";
    case State.Learning:
      return "secondary";
    case State.Relearning:
      return "destructive";
    default:
      return "outline";
  }
}

export default function BrowsePage() {
  const [search, setSearch] = useState("");
  const [progressMap, setProgressMap] = useState<Map<string, CardProgress>>(
    new Map()
  );
  const [bandFilter, setBandFilter] = useState<number | null>(null);
  const [expandedGrammar, setExpandedGrammar] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const all = await getAllCardProgress();
      const map = new Map<string, CardProgress>();
      for (const c of all) {
        map.set(c.cardId, c);
      }
      setProgressMap(map);
    }
    load();
  }, []);

  const filteredVocab = useMemo(() => {
    return VOCABULARY.filter((v) => {
      const matchesSearch =
        !search ||
        v.spanish.toLowerCase().includes(search.toLowerCase()) ||
        v.french.toLowerCase().includes(search.toLowerCase());
      const matchesBand = bandFilter === null || v.band === bandFilter;
      return matchesSearch && matchesBand;
    });
  }, [search, bandFilter]);

  const filteredGrammar = useMemo(() => {
    return GRAMMAR.filter(
      (g) =>
        !search ||
        g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.explanation.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const filteredPhrases = useMemo(() => {
    return PHRASES.filter(
      (p) =>
        !search ||
        p.spanish.toLowerCase().includes(search.toLowerCase()) ||
        p.french.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const scenarios = useMemo(() => {
    const s = new Set(PHRASES.map((p) => p.scenario));
    return Array.from(s);
  }, []);

  return (
    <div className="min-h-screen px-4 py-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Explorer</h1>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Tabs defaultValue="vocab">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="vocab" className="flex-1">
            Vocabulaire
          </TabsTrigger>
          <TabsTrigger value="grammar" className="flex-1">
            Grammaire
          </TabsTrigger>
          <TabsTrigger value="phrases" className="flex-1">
            Phrases
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vocab" className="space-y-2">
          <div className="flex gap-2 mb-3 flex-wrap">
            {[null, 1, 2, 3].map((band) => (
              <Button
                key={band ?? "all"}
                variant={bandFilter === band ? "default" : "outline"}
                size="sm"
                onClick={() => setBandFilter(band)}
              >
                {band === null ? "Tout" : `Bande ${band}`}
              </Button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mb-2">
            {filteredVocab.length} mots
          </p>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filteredVocab.slice(0, 100).map((v) => {
              const prog = progressMap.get(v.id);
              return (
                <Card key={v.id}>
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{v.spanish}</span>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {v.pos}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {v.french}
                      </p>
                    </div>
                    {prog && (
                      <Badge
                        variant={stateBadgeVariant(prog.state)}
                        className="text-xs ml-2 shrink-0"
                      >
                        {stateLabel(prog.state)}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
            {filteredVocab.length > 100 && (
              <p className="text-center text-xs text-muted-foreground py-2">
                +{filteredVocab.length - 100} autres mots...
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="grammar" className="space-y-2">
          <p className="text-xs text-muted-foreground mb-2">
            {filteredGrammar.length} règles
          </p>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filteredGrammar.map((g) => (
              <Card key={g.id}>
                <CardContent className="p-3">
                  <button
                    className="w-full text-left flex items-center justify-between"
                    onClick={() =>
                      setExpandedGrammar(
                        expandedGrammar === g.id ? null : g.id
                      )
                    }
                  >
                    <div>
                      <p className="font-medium text-sm">{g.title}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        Niveau {g.difficulty}
                      </Badge>
                    </div>
                    {expandedGrammar === g.id ? (
                      <ChevronUp className="h-4 w-4 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    )}
                  </button>
                  {expandedGrammar === g.id && (
                    <div className="mt-3 space-y-3 border-t pt-3">
                      <p className="text-sm text-muted-foreground">
                        {g.explanation}
                      </p>
                      {g.conjugation_table &&
                        Object.entries(g.conjugation_table).map(
                          ([tense, forms]) => (
                            <div key={tense} className="space-y-1">
                              <p className="text-xs font-medium uppercase text-muted-foreground">
                                {tense}
                              </p>
                              <div className="grid grid-cols-2 gap-1 text-sm">
                                {Object.entries(forms).map(
                                  ([pronoun, form]) => (
                                    <div
                                      key={pronoun}
                                      className="flex justify-between bg-muted/50 px-2 py-1 rounded text-xs"
                                    >
                                      <span className="text-muted-foreground">
                                        {pronoun}
                                      </span>
                                      <span className="font-medium">
                                        {form}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )
                        )}
                      {g.examples.length > 0 && (
                        <div className="space-y-1">
                          {g.examples.map((ex, i) => (
                            <div key={i} className="text-sm">
                              <p className="italic">{ex.es}</p>
                              <p className="text-muted-foreground">
                                {ex.fr}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="phrases" className="space-y-2">
          <p className="text-xs text-muted-foreground mb-2">
            {filteredPhrases.length} phrases
          </p>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {scenarios.map((scenario) => {
              const scenarioPhrases = filteredPhrases.filter(
                (p) => p.scenario === scenario
              );
              if (scenarioPhrases.length === 0) return null;
              return (
                <div key={scenario}>
                  <h3 className="text-sm font-semibold mb-2">{scenario}</h3>
                  <div className="space-y-2">
                    {scenarioPhrases.map((p) => (
                      <Card key={p.id}>
                        <CardContent className="p-3">
                          <p className="font-medium text-sm">{p.spanish}</p>
                          <p className="text-sm text-muted-foreground">
                            {p.french}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {p.formal && (
                              <Badge variant="outline" className="text-xs">
                                formel
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
