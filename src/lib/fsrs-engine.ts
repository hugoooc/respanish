import {
  fsrs,
  createEmptyCard,
  generatorParameters,
  Rating,
  State,
  type Card,
  type FSRS,
  type Grade,
} from "ts-fsrs";
import {
  type CardProgress,
  type CardType,
  type ExerciseType,
  type SessionCard,
  type ReviewLogEntry,
  type VocabEntry,
  type GrammarEntry,
  type PhraseEntry,
  type SentenceEntry,
  fsrsCardToProgress,
  progressToFSRSCard,
} from "./types";
import {
  getCardProgress,
  upsertCardProgress,
  addReviewLog,
  getDueCards,
  getAllCardProgress,
  getTodayNewCardCount,
  getSettings,
  updateStreak,
} from "./db";
import { VOCABULARY } from "@/data/vocabulary";
import { GRAMMAR } from "@/data/grammar";
import { PHRASES } from "@/data/phrases";
import { SENTENCES } from "@/data/sentences";

let _fsrs: FSRS | null = null;

async function getFSRS(): Promise<FSRS> {
  if (_fsrs) return _fsrs;
  const settings = await getSettings();
  const params = generatorParameters({
    enable_fuzz: true,
    request_retention: settings.targetRetention,
  });
  _fsrs = fsrs(params);
  return _fsrs;
}

export function resetFSRSInstance(): void {
  _fsrs = null;
}

export function getContentById(
  cardId: string,
  cardType: CardType
): VocabEntry | GrammarEntry | PhraseEntry | undefined {
  switch (cardType) {
    case "vocab":
      return VOCABULARY.find((v) => v.id === cardId);
    case "grammar":
      return GRAMMAR.find((g) => g.id === cardId);
    case "phrase":
      return PHRASES.find((p) => p.id === cardId);
  }
}

export function getSentenceForCard(
  cardId: string
): SentenceEntry | undefined {
  return SENTENCES.find(
    (s) => s.vocab_id === cardId || s.grammar_id === cardId
  );
}

export function pickExerciseType(state: number, reps: number): ExerciseType {
  if (state === State.New || state === State.Relearning) {
    return "multiple_choice";
  }
  if (state === State.Learning || reps <= 2) {
    return "fill_blank";
  }
  if (reps >= 6) {
    return "sentence_build";
  }
  return "flashcard";
}

export async function seedKnownCard(
  cardId: string,
  cardType: CardType
): Promise<void> {
  const f = await getFSRS();
  const now = new Date();
  const emptyCard = createEmptyCard(now);
  const result = f.next(emptyCard, now, Rating.Easy as Grade);

  await upsertCardProgress(
    fsrsCardToProgress(result.card, cardId, cardType)
  );
}

export async function seedUnknownCard(
  cardId: string,
  cardType: CardType
): Promise<void> {
  const now = new Date();
  const emptyCard = createEmptyCard(now);
  await upsertCardProgress(fsrsCardToProgress(emptyCard, cardId, cardType));
}

export async function reviewCard(
  cardId: string,
  cardType: CardType,
  rating: Grade
): Promise<CardProgress> {
  const f = await getFSRS();
  const now = new Date();

  let progress = await getCardProgress(cardId);
  let card: Card;

  if (!progress) {
    card = createEmptyCard(now);
  } else {
    card = progressToFSRSCard(progress);
  }

  const result = f.next(card, now, rating);

  const newProgress = fsrsCardToProgress(result.card, cardId, cardType);
  await upsertCardProgress(newProgress);

  const logEntry: ReviewLogEntry = {
    cardId,
    cardType,
    rating,
    reviewedAt: now,
    elapsed_days: result.log.elapsed_days,
    scheduled_days: result.log.scheduled_days,
    state: result.log.state,
  };
  await addReviewLog(logEntry);
  await updateStreak();

  return newProgress;
}

function getAllContentIds(): { cardId: string; cardType: CardType; band: number }[] {
  const items: { cardId: string; cardType: CardType; band: number }[] = [];

  for (const v of VOCABULARY) {
    items.push({ cardId: v.id, cardType: "vocab", band: v.band });
  }
  for (const g of GRAMMAR) {
    items.push({ cardId: g.id, cardType: "grammar", band: g.difficulty });
  }
  for (const p of PHRASES) {
    items.push({ cardId: p.id, cardType: "phrase", band: 1 });
  }

  return items;
}

export async function buildSession(): Promise<SessionCard[]> {
  const settings = await getSettings();
  const now = new Date();
  const session: SessionCard[] = [];

  const dueCards = await getDueCards(now);
  const dueReviewCards = dueCards.filter(
    (c) => c.state === State.Review || c.state === State.Relearning
  );

  for (const progress of dueReviewCards.slice(0, settings.dailyMaxReviews)) {
    const content = getContentById(progress.cardId, progress.cardType);
    if (!content) continue;

    const exerciseType = pickExerciseType(progress.state, progress.reps);
    const sentence = getSentenceForCard(progress.cardId);

    session.push({
      cardId: progress.cardId,
      cardType: progress.cardType,
      exerciseType,
      progress,
      content,
      sentence,
    });
  }

  const dueLearningCards = dueCards.filter(
    (c) => c.state === State.Learning
  );
  for (const progress of dueLearningCards) {
    const content = getContentById(progress.cardId, progress.cardType);
    if (!content) continue;
    const exerciseType = pickExerciseType(progress.state, progress.reps);
    const sentence = getSentenceForCard(progress.cardId);
    session.push({
      cardId: progress.cardId,
      cardType: progress.cardType,
      exerciseType,
      progress,
      content,
      sentence,
    });
  }

  const todayNewCount = await getTodayNewCardCount();
  const remainingNew = Math.max(0, settings.dailyNewCards - todayNewCount);

  if (remainingNew > 0) {
    const allProgress = await getAllCardProgress();
    const knownIds = new Set(allProgress.map((c) => c.cardId));
    const allContent = getAllContentIds();

    const unseen = allContent
      .filter(
        (c) => !knownIds.has(c.cardId) && c.band <= settings.currentBand
      )
      .slice(0, remainingNew);

    for (const item of unseen) {
      const emptyCard = createEmptyCard(now);
      const progress = fsrsCardToProgress(
        emptyCard,
        item.cardId,
        item.cardType
      );

      const content = getContentById(item.cardId, item.cardType);
      if (!content) continue;

      const sentence = getSentenceForCard(item.cardId);
      session.push({
        cardId: item.cardId,
        cardType: item.cardType,
        exerciseType: "multiple_choice",
        progress,
        content,
        sentence,
      });
    }
  }

  return shuffleArray(session);
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function buildExtraNewCards(count: number = 20): Promise<SessionCard[]> {
  const settings = await getSettings();
  const now = new Date();
  const session: SessionCard[] = [];

  const allProgress = await getAllCardProgress();
  const knownIds = new Set(allProgress.map((c) => c.cardId));
  const allContent = getAllContentIds();

  const unseen = allContent
    .filter(
      (c) => !knownIds.has(c.cardId) && c.band <= settings.currentBand
    )
    .slice(0, count);

  for (const item of unseen) {
    const emptyCard = createEmptyCard(now);
    const progress = fsrsCardToProgress(emptyCard, item.cardId, item.cardType);
    const content = getContentById(item.cardId, item.cardType);
    if (!content) continue;
    const sentence = getSentenceForCard(item.cardId);
    session.push({
      cardId: item.cardId,
      cardType: item.cardType,
      exerciseType: "multiple_choice",
      progress,
      content,
      sentence,
    });
  }

  return shuffleArray(session);
}

export async function getNextDueCard(): Promise<{ due: Date; count: number } | null> {
  const allProgress = await getAllCardProgress();
  const now = new Date();

  const futureCards = allProgress
    .filter((c) => new Date(c.due) > now)
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());

  if (futureCards.length === 0) return null;

  return {
    due: new Date(futureCards[0].due),
    count: futureCards.length,
  };
}

export async function getDueSoonCards(): Promise<SessionCard[]> {
  const now = new Date();
  const dueCards = await getDueCards(now);
  const session: SessionCard[] = [];

  for (const progress of dueCards) {
    const content = getContentById(progress.cardId, progress.cardType);
    if (!content) continue;
    const exerciseType = pickExerciseType(progress.state, progress.reps);
    const sentence = getSentenceForCard(progress.cardId);
    session.push({
      cardId: progress.cardId,
      cardType: progress.cardType,
      exerciseType,
      progress,
      content,
      sentence,
    });
  }

  return session;
}

export function getDistractors(
  correctAnswer: string,
  cardType: CardType,
  count: number = 3
): string[] {
  let pool: string[] = [];

  switch (cardType) {
    case "vocab":
      pool = VOCABULARY.map((v) => v.french);
      break;
    case "grammar":
      pool = GRAMMAR.flatMap((g) => g.examples.map((e) => e.fr));
      break;
    case "phrase":
      pool = PHRASES.map((p) => p.french);
      break;
  }

  const filtered = pool.filter((w) => w !== correctAnswer);
  const shuffled = shuffleArray(filtered);
  return shuffled.slice(0, count);
}

export { Rating, State };
export type { Grade };
