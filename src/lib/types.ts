import type { Card, ReviewLog as FSRSReviewLog } from "ts-fsrs";

export interface VocabEntry {
  id: string;
  spanish: string;
  french: string;
  frequency_rank: number;
  band: 1 | 2 | 3;
  pos: string;
  example_es: string;
  example_fr: string;
  tags: string[];
}

export interface GrammarEntry {
  id: string;
  title: string;
  explanation: string;
  conjugation_table?: Record<string, Record<string, string>>;
  examples: { es: string; fr: string }[];
  difficulty: 1 | 2 | 3;
}

export interface PhraseEntry {
  id: string;
  spanish: string;
  french: string;
  scenario: string;
  formal: boolean;
  tags: string[];
}

export interface SentenceEntry {
  id: string;
  spanish: string;
  french: string;
  blank_word: string;
  words_shuffled: string[];
  vocab_id?: string;
  grammar_id?: string;
}

export type CardType = "vocab" | "grammar" | "phrase";

export type ExerciseType =
  | "flashcard"
  | "multiple_choice"
  | "fill_blank"
  | "sentence_build";

export interface CardProgress {
  cardId: string;
  cardType: CardType;
  due: Date;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: number;
  last_review?: Date;
}

export interface ReviewLogEntry {
  id?: number;
  cardId: string;
  cardType: CardType;
  rating: number;
  reviewedAt: Date;
  elapsed_days: number;
  scheduled_days: number;
  state: number;
}

export interface UserSettings {
  id: number;
  dailyNewCards: number;
  dailyMaxReviews: number;
  targetRetention: number;
  placementCompleted: boolean;
  currentBand: number;
  streakDays: number;
  lastSessionDate: string | null;
}

export const DEFAULT_SETTINGS: UserSettings = {
  id: 1,
  dailyNewCards: 20,
  dailyMaxReviews: 100,
  targetRetention: 0.9,
  placementCompleted: false,
  currentBand: 1,
  streakDays: 0,
  lastSessionDate: null,
};

export interface SessionCard {
  cardId: string;
  cardType: CardType;
  exerciseType: ExerciseType;
  progress: CardProgress;
  content: VocabEntry | GrammarEntry | PhraseEntry;
  sentence?: SentenceEntry;
}

export interface SessionSummary {
  totalReviewed: number;
  newLearned: number;
  correctCount: number;
  incorrectCount: number;
  averageTime: number;
  streakDays: number;
}

export function fsrsCardToProgress(
  card: Card,
  cardId: string,
  cardType: CardType
): CardProgress {
  return {
    cardId,
    cardType,
    due: card.due,
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsed_days,
    scheduled_days: card.scheduled_days,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    last_review: card.last_review,
  };
}

export function progressToFSRSCard(progress: CardProgress): Card {
  return {
    due: new Date(progress.due),
    stability: progress.stability,
    difficulty: progress.difficulty,
    elapsed_days: progress.elapsed_days,
    scheduled_days: progress.scheduled_days,
    reps: progress.reps,
    lapses: progress.lapses,
    state: progress.state,
    last_review: progress.last_review
      ? new Date(progress.last_review)
      : undefined,
  } as Card;
}
