"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Upload,
  Trash2,
  Moon,
  Sun,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  getSettings,
  updateSettings,
  exportAllData,
  importAllData,
  clearAllData,
} from "@/lib/db";
import { resetFSRSInstance } from "@/lib/fsrs-engine";
import type { UserSettings } from "@/lib/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    async function load() {
      const s = await getSettings();
      setSettings(s);
    }
    load();
  }, []);

  const handleUpdate = async (patch: Partial<UserSettings>) => {
    await updateSettings(patch);
    const updated = await getSettings();
    setSettings(updated);

    if (patch.targetRetention !== undefined) {
      resetFSRSInstance();
    }

    toast.success("Paramètres sauvegardés");
  };

  const handleExport = async () => {
    try {
      const data = await exportAllData();
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `respanish-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Données exportées avec succès");
    } catch {
      toast.error("Erreur lors de l'exportation");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await importAllData(text);
      const updated = await getSettings();
      setSettings(updated);
      toast.success("Données importées avec succès");
    } catch {
      toast.error("Erreur lors de l'importation");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReset = async () => {
    try {
      await clearAllData();
      const updated = await getSettings();
      setSettings(updated);
      resetFSRSInstance();
      toast.success("Toutes les données ont été supprimées");
    } catch {
      toast.error("Erreur lors de la réinitialisation");
    }
  };

  if (!settings || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>

      {/* Appearance */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Apparence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {theme === "dark" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              <Label>Mode sombre</Label>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Learning settings */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Apprentissage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Nouvelles cartes / jour</Label>
              <Badge variant="secondary">{settings.dailyNewCards}</Badge>
            </div>
            <Slider
              value={[settings.dailyNewCards]}
              onValueChange={([val]) =>
                handleUpdate({ dailyNewCards: val })
              }
              min={5}
              max={50}
              step={5}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Révisions max / jour</Label>
              <Badge variant="secondary">{settings.dailyMaxReviews}</Badge>
            </div>
            <Slider
              value={[settings.dailyMaxReviews]}
              onValueChange={([val]) =>
                handleUpdate({ dailyMaxReviews: val })
              }
              min={20}
              max={300}
              step={10}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Rétention cible</Label>
              <Badge variant="secondary">
                {Math.round(settings.targetRetention * 100)}%
              </Badge>
            </div>
            <Slider
              value={[settings.targetRetention * 100]}
              onValueChange={([val]) =>
                handleUpdate({ targetRetention: val / 100 })
              }
              min={70}
              max={97}
              step={1}
            />
            <p className="text-xs text-muted-foreground">
              Plus c&apos;est élevé, plus les révisions sont fréquentes
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Bande de contenu</Label>
              <Badge variant="secondary">Bande {settings.currentBand}</Badge>
            </div>
            <Slider
              value={[settings.currentBand]}
              onValueChange={([val]) =>
                handleUpdate({ currentBand: val })
              }
              min={1}
              max={3}
              step={1}
            />
            <p className="text-xs text-muted-foreground">
              Bande 1 = basique, Bande 3 = avancé
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data management */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Données</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            Exporter les données
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            Importer les données
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />

          <Separator />

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full justify-start gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Réinitialiser toutes les données
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Confirmer la réinitialisation
                </DialogTitle>
                <DialogDescription>
                  Cette action supprimera toutes vos données de progression,
                  historique de révisions et paramètres. Cette action est
                  irréversible.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Annuler</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="destructive" onClick={handleReset}>
                    Tout supprimer
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardContent className="p-4 text-center text-sm text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">
            Re<span className="text-primary">Spanish</span>
          </p>
          <p>Algorithme FSRS — Répétition espacée de pointe</p>
          <p>Données stockées localement dans votre navigateur</p>
        </CardContent>
      </Card>
    </div>
  );
}
