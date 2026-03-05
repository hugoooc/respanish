import Dexie, { type EntityTable } from "dexie";
import type {
  CardProgress,
  ReviewLogEntry,
  UserSettings,
  LessonProgress,
  CardType,
} from "./types";
import { DEFAULT_SETTINGS } from "./types";

class ReSpanishDB extends Dexie {
  cardProgress!: EntityTable<CardProgress, "cardId">;
  reviewLogs!: EntityTable<ReviewLogEntry, "id">;
  settings!: EntityTable<UserSettings, "id">;
  lessonProgress!: EntityTable<LessonProgress, "lessonId">;

  constructor() {
    super("respanish");
    this.version(1).stores({
      cardProgress: "cardId, cardType, due, state, [cardType+state]",
      reviewLogs: "++id, cardId, reviewedAt, [cardId+reviewedAt]",
      settings: "id",
    });
    this.version(2).stores({
      cardProgress: "cardId, cardType, due, state, [cardType+state]",
      reviewLogs: "++id, cardId, reviewedAt, [cardId+reviewedAt]",
      settings: "id",
      lessonProgress: "lessonId, status",
    });
  }
}

export const db = new ReSpanishDB();

export async function getSettings(): Promise<UserSettings> {
  const s = await db.settings.get(1);
  if (s) return s;
  await db.settings.put(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}

export async function updateSettings(
  patch: Partial<UserSettings>
): Promise<void> {
  const current = await getSettings();
  await db.settings.put({ ...current, ...patch, id: 1 });
}

export async function getCardProgress(
  cardId: string
): Promise<CardProgress | undefined> {
  return db.cardProgress.get(cardId);
}

export async function upsertCardProgress(card: CardProgress): Promise<void> {
  await db.cardProgress.put(card);
}

export async function getDueCards(
  now: Date = new Date()
): Promise<CardProgress[]> {
  return db.cardProgress.where("due").belowOrEqual(now).toArray();
}

export async function getCardsByType(
  cardType: CardType
): Promise<CardProgress[]> {
  return db.cardProgress.where("cardType").equals(cardType).toArray();
}

export async function getAllCardProgress(): Promise<CardProgress[]> {
  return db.cardProgress.toArray();
}

export async function addReviewLog(log: ReviewLogEntry): Promise<void> {
  await db.reviewLogs.add(log);
}

export async function getReviewLogs(
  cardId?: string
): Promise<ReviewLogEntry[]> {
  if (cardId) {
    return db.reviewLogs.where("cardId").equals(cardId).toArray();
  }
  return db.reviewLogs.toArray();
}

export async function getReviewLogsForDate(
  date: Date
): Promise<ReviewLogEntry[]> {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return db.reviewLogs
    .where("reviewedAt")
    .between(start, end, true, true)
    .toArray();
}

export async function getTodayReviewCount(): Promise<number> {
  const logs = await getReviewLogsForDate(new Date());
  return logs.length;
}

export async function getTodayNewCardCount(): Promise<number> {
  const logs = await getReviewLogsForDate(new Date());
  const newCardIds = new Set(logs.filter((l) => l.state === 0).map((l) => l.cardId));
  return newCardIds.size;
}

export async function getStreakDays(): Promise<number> {
  const settings = await getSettings();
  return settings.streakDays;
}

export async function updateStreak(): Promise<number> {
  const settings = await getSettings();
  const today = new Date().toISOString().split("T")[0];

  if (settings.lastSessionDate === today) {
    return settings.streakDays;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let newStreak: number;
  if (settings.lastSessionDate === yesterdayStr) {
    newStreak = settings.streakDays + 1;
  } else if (settings.lastSessionDate === null) {
    newStreak = 1;
  } else {
    newStreak = 1;
  }

  await updateSettings({
    streakDays: newStreak,
    lastSessionDate: today,
  });

  return newStreak;
}

export async function exportAllData(): Promise<string> {
  const [cardProgress, reviewLogs, settings, lessonProgress] = await Promise.all([
    db.cardProgress.toArray(),
    db.reviewLogs.toArray(),
    db.settings.toArray(),
    db.lessonProgress.toArray(),
  ]);
  return JSON.stringify({ cardProgress, reviewLogs, settings, lessonProgress }, null, 2);
}

export async function importAllData(jsonStr: string): Promise<void> {
  const data = JSON.parse(jsonStr);
  await db.transaction(
    "rw",
    [db.cardProgress, db.reviewLogs, db.settings, db.lessonProgress],
    async () => {
      await db.cardProgress.clear();
      await db.reviewLogs.clear();
      await db.settings.clear();
      await db.lessonProgress.clear();
      if (data.cardProgress) await db.cardProgress.bulkPut(data.cardProgress);
      if (data.reviewLogs) await db.reviewLogs.bulkPut(data.reviewLogs);
      if (data.settings) await db.settings.bulkPut(data.settings);
      if (data.lessonProgress) await db.lessonProgress.bulkPut(data.lessonProgress);
    }
  );
}

export async function clearAllData(): Promise<void> {
  await db.transaction(
    "rw",
    [db.cardProgress, db.reviewLogs, db.settings, db.lessonProgress],
    async () => {
      await db.cardProgress.clear();
      await db.reviewLogs.clear();
      await db.settings.clear();
      await db.lessonProgress.clear();
    }
  );
}

// ─── Lesson Progress ─────────────────────────────────────────────

export async function getLessonProgress(
  lessonId: string
): Promise<LessonProgress | undefined> {
  return db.lessonProgress.get(lessonId);
}

export async function getAllLessonProgress(): Promise<LessonProgress[]> {
  return db.lessonProgress.toArray();
}

export async function upsertLessonProgress(
  progress: LessonProgress
): Promise<void> {
  await db.lessonProgress.put(progress);
}

export async function completeLessonProgress(
  lessonId: string,
  accuracy: number
): Promise<void> {
  const existing = await getLessonProgress(lessonId);
  const attempts = (existing?.attempts ?? 0) + 1;
  const passed = accuracy >= 70;

  await db.lessonProgress.put({
    lessonId,
    status: passed ? "completed" : "in_progress",
    completedAt: passed ? new Date() : existing?.completedAt,
    bestAccuracy: Math.max(accuracy, existing?.bestAccuracy ?? 0),
    attempts,
  });
}

export async function markLessonMastered(lessonId: string): Promise<void> {
  const existing = await getLessonProgress(lessonId);
  await db.lessonProgress.put({
    lessonId,
    status: "mastered",
    completedAt: existing?.completedAt ?? new Date(),
    bestAccuracy: existing?.bestAccuracy ?? 100,
    attempts: existing?.attempts ?? 0,
  });
}

export async function initCurriculumProgress(
  startLessonId: string,
  startUnitId: string
): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  await updateSettings({
    currentLessonId: startLessonId,
    currentUnitId: startUnitId,
    curriculumStartDate: today,
  });
}
