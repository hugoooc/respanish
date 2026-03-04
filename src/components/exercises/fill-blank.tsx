"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SessionCard, VocabEntry, PhraseEntry } from "@/lib/types";
import { Rating, type Grade } from "ts-fsrs";

interface FillBlankProps {
  sessionCard: SessionCard;
  onRate: (rating: Grade) => void;
}

export function FillBlank({ sessionCard, onRate }: FillBlankProps) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { content, cardType, sentence } = sessionCard;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sentenceWithBlank = sentence
    ? sentence.spanish.replace(
        sentence.blank_word,
        "________"
      )
    : null;

  const correctAnswer = sentence
    ? sentence.blank_word
    : cardType === "vocab"
      ? (content as VocabEntry).spanish
      : (content as PhraseEntry).spanish;

  const hint = (() => {
    if (sentence) return sentence.french;
    switch (cardType) {
      case "vocab":
        return (content as VocabEntry).french;
      case "phrase":
        return (content as PhraseEntry).french;
      default:
        return "";
    }
  })();

  const normalize = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const isCorrect = normalize(answer) === normalize(correctAnswer);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    setSubmitted(true);
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
        Complétez le mot
      </Badge>

      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center gap-4">
          {sentenceWithBlank ? (
            <p className="text-xl font-medium leading-relaxed">
              {sentenceWithBlank}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Écrivez le mot espagnol pour :
            </p>
          )}
          <p className="text-lg text-muted-foreground">{hint}</p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <Input
          ref={inputRef}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Tapez votre réponse..."
          className={cn(
            "text-center text-lg h-14",
            submitted && isCorrect && "border-green-500",
            submitted && !isCorrect && "border-red-500"
          )}
          disabled={submitted}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />

        {!submitted && (
          <Button type="submit" className="w-full" disabled={!answer.trim()}>
            Vérifier
          </Button>
        )}
      </form>

      {submitted && (
        <div className="w-full space-y-4">
          <div
            className={cn(
              "flex items-center gap-2 justify-center p-3 rounded-lg",
              isCorrect
                ? "bg-green-500/10 text-green-700 dark:text-green-400"
                : "bg-red-500/10 text-red-700 dark:text-red-400"
            )}
          >
            {isCorrect ? (
              <>
                <Check className="h-5 w-5" />
                <span className="font-medium">Correct !</span>
              </>
            ) : (
              <>
                <X className="h-5 w-5" />
                <span>
                  La bonne réponse est :{" "}
                  <strong>{correctAnswer}</strong>
                </span>
              </>
            )}
          </div>
          <Button className="w-full" onClick={handleContinue}>
            Continuer
          </Button>
        </div>
      )}
    </div>
  );
}
