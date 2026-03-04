"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Check, X, ArrowRight } from "lucide-react";
import { VOCABULARY } from "@/data/vocabulary";
import { seedKnownCard, seedUnknownCard } from "@/lib/fsrs-engine";
import { updateSettings } from "@/lib/db";

const BATCH_SIZE = 20;
const BANDS = [1, 2, 3] as const;

function getBandLabel(band: number): string {
  switch (band) {
    case 1:
      return "Basique (Top 200)";
    case 2:
      return "Intermédiaire (201-400)";
    case 3:
      return "Avancé (401+)";
    default:
      return "";
  }
}

export default function PlacementPage() {
  const router = useRouter();
  const [currentBand, setCurrentBand] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [knownCount, setKnownCount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [finished, setFinished] = useState(false);
  const [bandResults, setBandResults] = useState<
    { band: number; known: number; total: number }[]
  >([]);

  const bandWords = useMemo(() => {
    return BANDS.map((band) => {
      const words = VOCABULARY.filter((v) => v.band === band);
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, BATCH_SIZE);
    });
  }, []);

  const currentBatch = bandWords[currentBand] ?? [];
  const currentWord = currentBatch[currentWordIndex];
  const totalWords = BANDS.length * BATCH_SIZE;
  const globalIndex = currentBand * BATCH_SIZE + currentWordIndex;
  const progress = (globalIndex / totalWords) * 100;

  const handleAnswer = useCallback(
    async (known: boolean) => {
      if (processing || !currentWord) return;
      setProcessing(true);

      if (known) {
        await seedKnownCard(currentWord.id, "vocab");
        setKnownCount((c) => c + 1);
      } else {
        await seedUnknownCard(currentWord.id, "vocab");
      }

      const nextIndex = currentWordIndex + 1;
      if (nextIndex >= currentBatch.length) {
        const newBandResults = [
          ...bandResults,
          {
            band: BANDS[currentBand],
            known: knownCount + (known ? 1 : 0),
            total: currentBatch.length,
          },
        ];
        setBandResults(newBandResults);

        const nextBand = currentBand + 1;
        if (nextBand >= BANDS.length) {
          const maxBand = determineUserBand(newBandResults);
          await updateSettings({
            placementCompleted: true,
            currentBand: maxBand,
          });
          setFinished(true);
        } else {
          setCurrentBand(nextBand);
          setCurrentWordIndex(0);
          setKnownCount(0);
        }
      } else {
        setCurrentWordIndex(nextIndex);
      }
      setProcessing(false);
    },
    [
      processing,
      currentWord,
      currentWordIndex,
      currentBatch,
      currentBand,
      bandResults,
      knownCount,
    ]
  );

  if (finished) {
    const userBand = bandResults.length > 0
      ? determineUserBand(bandResults)
      : 1;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Placement terminé !</h1>
          <p className="text-muted-foreground">
            Voici vos résultats par niveau
          </p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          {bandResults.map((r) => (
            <Card key={r.band}>
              <CardContent className="flex items-center justify-between p-4">
                <span className="font-medium">
                  {getBandLabel(r.band)}
                </span>
                <Badge
                  variant={
                    r.known / r.total >= 0.5
                      ? "default"
                      : "secondary"
                  }
                >
                  {r.known}/{r.total} connus
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-1">
          <p className="font-medium">
            Votre niveau : Bande {userBand}
          </p>
          <p className="text-sm text-muted-foreground">
            {userBand === 3
              ? "Vous avez un bon niveau ! On va tout consolider."
              : userBand === 2
                ? "Bon socle de base. On va renforcer et élargir."
                : "On commence par les fondamentaux. Courage !"}
          </p>
        </div>

        <Button
          className="w-full max-w-sm gap-2"
          onClick={() => router.replace("/")}
        >
          Commencer à apprendre
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (!currentWord) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col px-4 py-6">
      <div className="space-y-2 mb-8">
        <div className="flex items-center justify-between">
          <Badge variant="outline">
            {getBandLabel(BANDS[currentBand])}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {globalIndex + 1}/{totalWords}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Connaissez-vous ce mot ?
          </p>
        </div>

        <Card className="w-full max-w-sm">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-3xl font-bold">{currentWord.spanish}</p>
            <Badge variant="secondary" className="text-xs">
              {currentWord.pos}
            </Badge>
          </CardContent>
        </Card>

        <div className="flex gap-4 w-full max-w-sm">
          <Button
            variant="destructive"
            className="flex-1 h-14 gap-2 text-base"
            onClick={() => handleAnswer(false)}
            disabled={processing}
          >
            <X className="h-5 w-5" />
            Non
          </Button>
          <Button
            className="flex-1 h-14 gap-2 text-base"
            onClick={() => handleAnswer(true)}
            disabled={processing}
          >
            <Check className="h-5 w-5" />
            Oui
          </Button>
        </div>
      </div>
    </div>
  );
}

function determineUserBand(
  results: { band: number; known: number; total: number }[]
): number {
  let maxBand = 1;
  for (const r of results) {
    if (r.known / r.total >= 0.4) {
      maxBand = Math.max(maxBand, r.band);
    }
  }
  return maxBand;
}
