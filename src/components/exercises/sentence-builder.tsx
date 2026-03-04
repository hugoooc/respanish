"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SessionCard } from "@/lib/types";
import { Rating, type Grade } from "ts-fsrs";

interface SentenceBuilderProps {
  sessionCard: SessionCard;
  onRate: (rating: Grade) => void;
}

export function SentenceBuilder({ sessionCard, onRate }: SentenceBuilderProps) {
  const { sentence } = sessionCard;

  const words = useMemo(
    () => sentence?.words_shuffled ?? [],
    [sentence]
  );

  const [selectedWords, setSelectedWords] = useState<
    { word: string; sourceIndex: number }[]
  >([]);
  const [submitted, setSubmitted] = useState(false);

  if (!sentence) {
    return (
      <div className="text-center text-muted-foreground p-8">
        Pas de phrase disponible pour cet exercice.
      </div>
    );
  }

  const correctSentence = sentence.spanish;
  const builtSentence = selectedWords.map((w) => w.word).join(" ");
  const isCorrect =
    builtSentence.replace(/\s+/g, " ").trim() ===
    correctSentence.replace(/\s+/g, " ").trim();

  const usedIndices = new Set(selectedWords.map((w) => w.sourceIndex));

  const handleWordTap = (word: string, sourceIndex: number) => {
    if (submitted) return;
    if (usedIndices.has(sourceIndex)) {
      setSelectedWords((prev) =>
        prev.filter((w) => w.sourceIndex !== sourceIndex)
      );
    } else {
      setSelectedWords((prev) => [...prev, { word, sourceIndex }]);
    }
  };

  const handleRemoveFromSentence = (sourceIndex: number) => {
    if (submitted) return;
    setSelectedWords((prev) =>
      prev.filter((w) => w.sourceIndex !== sourceIndex)
    );
  };

  const handleReset = () => {
    setSelectedWords([]);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (selectedWords.length === 0) return;
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
        Construisez la phrase
      </Badge>

      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center gap-3">
          <p className="text-sm text-muted-foreground">
            Traduisez en espagnol :
          </p>
          <p className="text-lg font-medium">{sentence.french}</p>
        </CardContent>
      </Card>

      {/* Built sentence area */}
      <div
        className={cn(
          "w-full min-h-[60px] rounded-lg border-2 border-dashed p-3 flex flex-wrap gap-2 items-start",
          submitted && isCorrect && "border-green-500 bg-green-500/5",
          submitted && !isCorrect && "border-red-500 bg-red-500/5",
          !submitted && "border-muted-foreground/30"
        )}
      >
        {selectedWords.length === 0 ? (
          <span className="text-muted-foreground text-sm m-auto">
            Touchez les mots ci-dessous pour construire la phrase
          </span>
        ) : (
          selectedWords.map((w, i) => (
            <button
              key={`selected-${i}`}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                "bg-primary text-primary-foreground",
                !submitted && "hover:bg-primary/80 cursor-pointer",
                submitted && "cursor-default"
              )}
              onClick={() => handleRemoveFromSentence(w.sourceIndex)}
              disabled={submitted}
            >
              {w.word}
            </button>
          ))
        )}
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap gap-2 justify-center w-full">
        {words.map((word, i) => (
          <button
            key={`bank-${i}`}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium border transition-all",
              usedIndices.has(i)
                ? "opacity-30 cursor-default border-transparent"
                : "bg-secondary hover:bg-secondary/80 cursor-pointer border-border",
              submitted && "cursor-default"
            )}
            onClick={() => handleWordTap(word, i)}
            disabled={usedIndices.has(i) || submitted}
          >
            {word}
          </button>
        ))}
      </div>

      {submitted && (
        <div
          className={cn(
            "flex items-center gap-2 justify-center p-3 rounded-lg w-full",
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
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center">
                <X className="h-5 w-5" />
                <span>Pas tout à fait...</span>
              </div>
              <p className="text-sm mt-1">
                Réponse : <strong>{correctSentence}</strong>
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 w-full">
        {!submitted ? (
          <>
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={selectedWords.length === 0}
            >
              Vérifier
            </Button>
          </>
        ) : (
          <Button className="flex-1" onClick={handleContinue}>
            Continuer
          </Button>
        )}
      </div>
    </div>
  );
}
