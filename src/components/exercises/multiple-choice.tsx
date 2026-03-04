"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  SessionCard,
  VocabEntry,
  GrammarEntry,
  PhraseEntry,
} from "@/lib/types";
import { Rating, type Grade } from "ts-fsrs";
import { getDistractors } from "@/lib/fsrs-engine";

interface MultipleChoiceProps {
  sessionCard: SessionCard;
  onRate: (rating: Grade) => void;
}

export function MultipleChoice({ sessionCard, onRate }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const { content, cardType } = sessionCard;

  const question = (() => {
    switch (cardType) {
      case "vocab":
        return (content as VocabEntry).spanish;
      case "grammar":
        return (content as GrammarEntry).examples[0]?.es ?? (content as GrammarEntry).title;
      case "phrase":
        return (content as PhraseEntry).spanish;
    }
  })();

  const correctAnswer = (() => {
    switch (cardType) {
      case "vocab":
        return (content as VocabEntry).french;
      case "grammar":
        return (content as GrammarEntry).examples[0]?.fr ?? (content as GrammarEntry).explanation;
      case "phrase":
        return (content as PhraseEntry).french;
    }
  })();

  const options = useMemo(() => {
    const distractors = getDistractors(correctAnswer, cardType, 3);
    const all = [correctAnswer, ...distractors];
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return all;
  }, [correctAnswer, cardType]);

  const isCorrect = selected === correctAnswer;
  const hasAnswered = selected !== null;

  const handleSelect = (option: string) => {
    if (hasAnswered) return;
    setSelected(option);
  };

  const handleContinue = () => {
    if (isCorrect) {
      onRate(Rating.Good);
    } else {
      onRate(Rating.Again);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <Badge variant="secondary" className="text-xs">
        Choix multiple
      </Badge>

      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Quelle est la traduction ?
          </p>
          <p className="text-2xl font-bold">{question}</p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 w-full">
        {options.map((option, i) => {
          const isThis = selected === option;
          const isThisCorrect = option === correctAnswer;

          return (
            <Button
              key={i}
              variant="outline"
              className={cn(
                "w-full h-auto min-h-[52px] text-left justify-start px-4 py-3 text-base whitespace-normal",
                hasAnswered && isThisCorrect && "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400",
                hasAnswered && isThis && !isThisCorrect && "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400",
                !hasAnswered && "hover:bg-accent"
              )}
              onClick={() => handleSelect(option)}
              disabled={hasAnswered}
            >
              <span className="flex-1">{option}</span>
              {hasAnswered && isThisCorrect && (
                <Check className="h-5 w-5 text-green-500 shrink-0" />
              )}
              {hasAnswered && isThis && !isThisCorrect && (
                <X className="h-5 w-5 text-red-500 shrink-0" />
              )}
            </Button>
          );
        })}
      </div>

      {hasAnswered && (
        <Button className="w-full" onClick={handleContinue}>
          Continuer
        </Button>
      )}
    </div>
  );
}
