# ReSpanish

Réapprenez l'espagnol rapidement avec la répétition espacée FSRS.

## Stack

- **Next.js 16** + TypeScript
- **Tailwind CSS 4** + shadcn/ui
- **ts-fsrs** (algorithme FSRS — état de l'art de la répétition espacée)
- **Dexie.js** (IndexedDB) pour la persistance locale
- Déployé sur **Vercel** (plan gratuit)

## Fonctionnalités

- Test de placement pour les re-apprenants
- 4 types d'exercices : flashcard, choix multiple, compléter le mot, construire la phrase
- Algorithme FSRS adaptatif (réduit les révisions de ~25% vs SM-2)
- Progression par bandes de fréquence (500 mots de vocabulaire, 60 règles de grammaire, 150 phrases)
- Statistiques détaillées et suivi de série
- Mode sombre par défaut
- Export/import des données
- Fonctionne hors ligne (PWA)

## Développement

```bash
npm install
npm run dev
```

## Déploiement

```bash
npm run build
# Ou déployer sur Vercel via git push
```
