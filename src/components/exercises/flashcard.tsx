"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  SessionCard,
  VocabEntry,
  GrammarEntry,
  PhraseEntry,
} from "@/lib/types";
import { Rating, type Grade } from "ts-fsrs";

interface FlashcardProps {
  sessionCard: SessionCard;
  onRate: (rating: Grade) => void;
}

export function Flashcard({ sessionCard, onRate }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const { content, cardType } = sessionCard;

  const handleFlip = useCallback(() => setFlipped(true), []);

  const front = (() => {
    switch (cardType) {
      case "vocab":
        return (content as VocabEntry).spanish;
      case "grammar":
        return (content as GrammarEntry).title;
      case "phrase":
        return (content as PhraseEntry).spanish;
    }
  })();

  const back = (() => {
    switch (cardType) {
      case "vocab": {
        const v = content as VocabEntry;
        return v.french;
      }
      case "grammar": {
        const g = content as GrammarEntry;
        return g.explanation;
      }
      case "phrase": {
        const p = content as PhraseEntry;
        return p.french;
      }
    }
  })();

  const example = (() => {
    switch (cardType) {
      case "vocab": {
        const v = content as VocabEntry;
        return { es: v.example_es, fr: v.example_fr };
      }
      case "grammar": {
        const g = content as GrammarEntry;
        return g.examples[0] ? { es: g.examples[0].es, fr: g.examples[0].fr } : null;
      }
      case "phrase":
        return null;
    }
  })();

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <Badge variant="secondary" className="text-xs">
        {cardType === "vocab"
          ? (content as VocabEntry).pos
          : cardType === "grammar"
            ? "grammaire"
            : "phrase"}
      </Badge>

      <Card
        className={cn(
          "w-full min-h-[280px] cursor-pointer transition-all duration-300 select-none",
          !flipped && "hover:shadow-lg active:scale-[0.98]"
        )}
        onClick={!flipped ? handleFlip : undefined}
      >
        <CardContent className="flex flex-col items-center justify-center min-h-[280px] p-8 text-center gap-4">
          {!flipped ? (
            <>
              <p className="text-3xl font-bold">{front}</p>
              <p className="text-sm text-muted-foreground mt-4">
                Touchez pour révéler
              </p>
            </>
          ) : (
            <>
              <p className="text-lg text-muted-foreground">{front}</p>
              <div className="w-12 h-px bg-border" />
              <p className="text-2xl font-bold">{back}</p>
              {example && (
                <div className="mt-4 text-sm text-muted-foreground space-y-1">
                  <p className="italic">&ldquo;{example.es}&rdquo;</p>
                  <p>{example.fr}</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {flipped && (
        <div className="flex gap-2 w-full">
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => onRate(Rating.Again)}
          >
            À revoir
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => onRate(Rating.Hard)}
          >
            Difficile
          </Button>
          <Button
            variant="default"
            className="flex-1"
            onClick={() => onRate(Rating.Good)}
          >
            Bien
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onRate(Rating.Easy)}
          >
            Facile
          </Button>
        </div>
      )}
    </div>
  );
}
