import { CURRICULUM } from "@/data/curriculum";
import {
  getSettings,
  updateSettings,
  getAllLessonProgress,
  getLessonProgress,
  upsertLessonProgress,
  completeLessonProgress,
  getAllCardProgress,
  getReviewLogs,
} from "./db";
import type { Unit, Lesson, LessonStatus, LessonProgress, UserSettings } from "./types";
import { State } from "ts-fsrs";

export function getAllUnits(): Unit[] {
  return CURRICULUM;
}

export function getUnit(unitId: string): Unit | undefined {
  return CURRICULUM.find((u) => u.id === unitId);
}

export function getLesson(lessonId: string): Lesson | undefined {
  for (const unit of CURRICULUM) {
    const lesson = unit.lessons.find((l) => l.id === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
}

export function getUnitForLesson(lessonId: string): Unit | undefined {
  return CURRICULUM.find((u) => u.lessons.some((l) => l.id === lessonId));
}

export function getAllLessonsFlat(): Lesson[] {
  return CURRICULUM.flatMap((u) => u.lessons);
}

export function getNextLesson(currentLessonId: string): Lesson | undefined {
  const all = getAllLessonsFlat();
  const idx = all.findIndex((l) => l.id === currentLessonId);
  if (idx === -1 || idx >= all.length - 1) return undefined;
  return all[idx + 1];
}

export function getPreviousLesson(currentLessonId: string): Lesson | undefined {
  const all = getAllLessonsFlat();
  const idx = all.findIndex((l) => l.id === currentLessonId);
  if (idx <= 0) return undefined;
  return all[idx - 1];
}

export function getFirstLesson(): Lesson {
  return CURRICULUM[0].lessons[0];
}

export async function getLessonStatusMap(): Promise<Map<string, LessonStatus>> {
  const progressList = await getAllLessonProgress();
  const progressMap = new Map(progressList.map((p) => [p.lessonId, p]));
  const settings = await getSettings();
  const allLessons = getAllLessonsFlat();
  const statusMap = new Map<string, LessonStatus>();

  for (let i = 0; i < allLessons.length; i++) {
    const lesson = allLessons[i];
    const progress = progressMap.get(lesson.id);

    if (progress) {
      statusMap.set(lesson.id, progress.status);
      continue;
    }

    if (i === 0) {
      statusMap.set(lesson.id, "available");
      continue;
    }

    if (settings.currentLessonId === lesson.id) {
      statusMap.set(lesson.id, "available");
      continue;
    }

    const prevLesson = allLessons[i - 1];
    const prevProgress = progressMap.get(prevLesson.id);
    if (
      prevProgress &&
      (prevProgress.status === "completed" || prevProgress.status === "mastered")
    ) {
      statusMap.set(lesson.id, "available");
    } else {
      statusMap.set(lesson.id, "locked");
    }
  }

  return statusMap;
}

export async function completeLesson(
  lessonId: string,
  accuracy: number
): Promise<{ passed: boolean; nextLessonId: string | null }> {
  const passed = accuracy >= 70;
  await completeLessonProgress(lessonId, accuracy);

  if (passed) {
    const next = getNextLesson(lessonId);
    if (next) {
      const nextProgress = await getLessonProgress(next.id);
      if (!nextProgress || nextProgress.status === "locked") {
        await upsertLessonProgress({
          lessonId: next.id,
          status: "available",
          attempts: 0,
        });
      }
      const nextUnit = getUnitForLesson(next.id);
      await updateSettings({
        currentLessonId: next.id,
        currentUnitId: nextUnit?.id ?? null,
      });
      return { passed: true, nextLessonId: next.id };
    }
    return { passed: true, nextLessonId: null };
  }

  return { passed: false, nextLessonId: null };
}

export async function getCurriculumStats(): Promise<{
  totalLessons: number;
  completedLessons: number;
  masteredLessons: number;
  currentUnit: Unit | null;
  currentLesson: Lesson | null;
  progressPercent: number;
  currentWeek: number;
  totalWeeks: number;
  onTrack: boolean;
  estimatedCompletion: Date | null;
  lessonsPerWeekNeeded: number;
}> {
  const settings = await getSettings();
  const allLessons = getAllLessonsFlat();
  const progressList = await getAllLessonProgress();
  const completedStatuses: LessonStatus[] = ["completed", "mastered"];

  const completedLessons = progressList.filter((p) =>
    completedStatuses.includes(p.status)
  ).length;
  const masteredLessons = progressList.filter(
    (p) => p.status === "mastered"
  ).length;

  const currentUnit = settings.currentUnitId
    ? getUnit(settings.currentUnitId) ?? null
    : CURRICULUM[0];
  const currentLesson = settings.currentLessonId
    ? getLesson(settings.currentLessonId) ?? null
    : getFirstLesson();

  const totalLessons = allLessons.length;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const totalWeeks = 12;
  let currentWeek = 1;
  let onTrack = true;
  let estimatedCompletion: Date | null = null;
  let lessonsPerWeekNeeded = Math.ceil(totalLessons / totalWeeks);

  if (settings.curriculumStartDate) {
    const startDate = new Date(settings.curriculumStartDate);
    const now = new Date();
    const daysPassed = Math.max(
      1,
      Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    );
    currentWeek = Math.min(totalWeeks, Math.ceil(daysPassed / 7));

    const expectedLessons = Math.round(
      (currentWeek / totalWeeks) * totalLessons
    );
    onTrack = completedLessons >= expectedLessons;

    const remaining = totalLessons - completedLessons;
    const weeksRemaining = totalWeeks - currentWeek;
    lessonsPerWeekNeeded =
      weeksRemaining > 0 ? Math.ceil(remaining / weeksRemaining) : remaining;

    if (completedLessons > 0) {
      const lessonsPerDay = completedLessons / daysPassed;
      const daysNeeded =
        lessonsPerDay > 0 ? Math.ceil(remaining / lessonsPerDay) : 999;
      estimatedCompletion = new Date(
        now.getTime() + daysNeeded * 24 * 60 * 60 * 1000
      );
    }
  }

  return {
    totalLessons,
    completedLessons,
    masteredLessons,
    currentUnit,
    currentLesson,
    progressPercent,
    currentWeek,
    totalWeeks,
    onTrack,
    estimatedCompletion,
    lessonsPerWeekNeeded,
  };
}

export async function computeDimensionScores(): Promise<{
  vocabMastery: number;
  grammarMastery: number;
  situationalMastery: number;
}> {
  const allProgress = await getAllCardProgress();
  const progressList = await getAllLessonProgress();
  const allLessons = getAllLessonsFlat();

  const allVocabIds = new Set(allLessons.flatMap((l) => l.vocabIds));
  const allGrammarIds = new Set(allLessons.flatMap((l) => l.grammarIds));
  const totalScenarios = allLessons.length;

  const vocabReviewed = allProgress.filter(
    (c) =>
      c.cardType === "vocab" &&
      allVocabIds.has(c.cardId) &&
      c.state === State.Review
  ).length;
  const vocabMastery =
    allVocabIds.size > 0
      ? Math.round((vocabReviewed / allVocabIds.size) * 100)
      : 0;

  const grammarReviewed = allProgress.filter(
    (c) =>
      c.cardType === "grammar" &&
      allGrammarIds.has(c.cardId) &&
      c.state === State.Review
  ).length;
  const grammarMastery =
    allGrammarIds.size > 0
      ? Math.round((grammarReviewed / allGrammarIds.size) * 100)
      : 0;

  const completedWithScenario = progressList.filter(
    (p) => p.status === "completed" || p.status === "mastered"
  ).length;
  const situationalMastery =
    totalScenarios > 0
      ? Math.round((completedWithScenario / totalScenarios) * 100)
      : 0;

  await updateSettings({ vocabMastery, grammarMastery, situationalMastery });

  return { vocabMastery, grammarMastery, situationalMastery };
}

export function buildSessionPlan(
  targetMinutes: number,
  dueReviewCount: number,
  currentLessonId: string | null
): {
  reviewCount: number;
  lessonStudy: boolean;
  lessonPractice: boolean;
  nextLessonStudy: boolean;
  estimatedMinutes: number;
} {
  const REVIEW_TIME = 0.5;
  const LESSON_STUDY_TIME = 5;
  const LESSON_PRACTICE_TIME = 8;

  let remaining = targetMinutes;
  let reviewCount = 0;
  let lessonStudy = false;
  let lessonPractice = false;
  let nextLessonStudy = false;

  const reviewTime = Math.min(dueReviewCount * REVIEW_TIME, remaining);
  reviewCount = Math.min(dueReviewCount, Math.floor(remaining / REVIEW_TIME));
  remaining -= reviewCount * REVIEW_TIME;

  if (remaining >= LESSON_STUDY_TIME && currentLessonId) {
    lessonStudy = true;
    remaining -= LESSON_STUDY_TIME;
  }

  if (remaining >= LESSON_PRACTICE_TIME && currentLessonId) {
    lessonPractice = true;
    remaining -= LESSON_PRACTICE_TIME;
  }

  if (remaining >= LESSON_STUDY_TIME) {
    nextLessonStudy = true;
    remaining -= LESSON_STUDY_TIME;
  }

  const estimatedMinutes = targetMinutes - remaining;

  return {
    reviewCount,
    lessonStudy,
    lessonPractice,
    nextLessonStudy,
    estimatedMinutes,
  };
}
