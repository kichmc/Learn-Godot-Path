import { useCallback, useEffect, useMemo, useState } from "react";
import { curriculum, totalLessons, totalSteps } from "@/data/curriculum";

const STORAGE_KEY = "gdscript-quest:state:v2";

export interface GameState {
  xp: number;
  coins: number;
  // chapterId -> true when every lesson in it is done
  completedChapters: string[];
  // chapterId -> lessonId[]
  completedLessons: Record<string, string[]>;
  // chapterId -> lessonId -> stepId[]
  completedSteps: Record<string, Record<string, string[]>>;
  // chapterId -> lessonId -> last step index
  lessonProgress: Record<string, Record<string, number>>;
}

const initialState: GameState = {
  xp: 0,
  coins: 0,
  completedChapters: [],
  completedLessons: {},
  completedSteps: {},
  lessonProgress: {},
};

function loadState(): GameState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<GameState>;
    return {
      xp: parsed.xp ?? 0,
      coins: parsed.coins ?? 0,
      completedChapters: parsed.completedChapters ?? [],
      completedLessons: parsed.completedLessons ?? {},
      completedSteps: parsed.completedSteps ?? {},
      lessonProgress: parsed.lessonProgress ?? {},
    };
  } catch {
    return initialState;
  }
}

function saveState(state: GameState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function useGameState() {
  const [state, setState] = useState<GameState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const isChapterUnlocked = useCallback(
    (chapterId: string) => {
      const idx = curriculum.findIndex((c) => c.id === chapterId);
      if (idx <= 0) return true;
      const prev = curriculum[idx - 1]!;
      return state.completedChapters.includes(prev.id);
    },
    [state.completedChapters],
  );

  const isChapterComplete = useCallback(
    (chapterId: string) => state.completedChapters.includes(chapterId),
    [state.completedChapters],
  );

  const isLessonUnlocked = useCallback(
    (chapterId: string, lessonId: string) => {
      if (!isChapterUnlocked(chapterId)) return false;
      const ch = curriculum.find((c) => c.id === chapterId);
      if (!ch) return false;
      const idx = ch.lessons.findIndex((l) => l.id === lessonId);
      if (idx <= 0) return true;
      const prev = ch.lessons[idx - 1]!;
      return (state.completedLessons[chapterId] ?? []).includes(prev.id);
    },
    [isChapterUnlocked, state.completedLessons],
  );

  const isLessonComplete = useCallback(
    (chapterId: string, lessonId: string) =>
      (state.completedLessons[chapterId] ?? []).includes(lessonId),
    [state.completedLessons],
  );

  const isStepComplete = useCallback(
    (chapterId: string, lessonId: string, stepId: string) =>
      (state.completedSteps[chapterId]?.[lessonId] ?? []).includes(stepId),
    [state.completedSteps],
  );

  const getLessonProgress = useCallback(
    (chapterId: string, lessonId: string) =>
      state.lessonProgress[chapterId]?.[lessonId] ?? 0,
    [state.lessonProgress],
  );

  const getChapterProgress = useCallback(
    (chapterId: string) => {
      const ch = curriculum.find((c) => c.id === chapterId);
      if (!ch) return { done: 0, total: 0 };
      const done = (state.completedLessons[chapterId] ?? []).length;
      return { done, total: ch.lessons.length };
    },
    [state.completedLessons],
  );

  const totalDoneSteps = useMemo(() => {
    return Object.values(state.completedSteps).reduce(
      (s, lessons) =>
        s + Object.values(lessons).reduce((ss, arr) => ss + arr.length, 0),
      0,
    );
  }, [state.completedSteps]);

  const overallProgress = useMemo(() => {
    const total = totalSteps();
    return total ? Math.min(1, totalDoneSteps / total) : 0;
  }, [totalDoneSteps]);

  const chaptersDone = state.completedChapters.length;
  const lessonsDone = Object.values(state.completedLessons).reduce(
    (s, arr) => s + arr.length,
    0,
  );

  const setLessonStepIndex = useCallback(
    (chapterId: string, lessonId: string, idx: number) => {
      setState((prev) => ({
        ...prev,
        lessonProgress: {
          ...prev.lessonProgress,
          [chapterId]: {
            ...(prev.lessonProgress[chapterId] ?? {}),
            [lessonId]: idx,
          },
        },
      }));
    },
    [],
  );

  const awardStep = useCallback(
    (
      chapterId: string,
      lessonId: string,
      stepId: string,
      opts: { xp: number; coins: number },
    ) => {
      setState((prev) => {
        const lessonsDoneSteps = prev.completedSteps[chapterId] ?? {};
        const stepsForLesson = lessonsDoneSteps[lessonId] ?? [];
        if (stepsForLesson.includes(stepId)) return prev;
        return {
          ...prev,
          xp: prev.xp + opts.xp,
          coins: prev.coins + opts.coins,
          completedSteps: {
            ...prev.completedSteps,
            [chapterId]: {
              ...lessonsDoneSteps,
              [lessonId]: [...stepsForLesson, stepId],
            },
          },
        };
      });
    },
    [],
  );

  const completeLesson = useCallback(
    (
      chapterId: string,
      lessonId: string,
    ): { chapterCompletedNow: boolean } => {
      let chapterCompletedNow = false;
      setState((prev) => {
        const lessonsForChapter = prev.completedLessons[chapterId] ?? [];
        let newLessons = lessonsForChapter;
        let xpDelta = 0;
        let coinDelta = 0;
        if (!lessonsForChapter.includes(lessonId)) {
          newLessons = [...lessonsForChapter, lessonId];
          xpDelta += 25;
          coinDelta += 10;
        }
        const ch = curriculum.find((c) => c.id === chapterId);
        let completedChapters = prev.completedChapters;
        if (
          ch &&
          ch.lessons.every((l) => newLessons.includes(l.id)) &&
          !prev.completedChapters.includes(chapterId)
        ) {
          completedChapters = [...prev.completedChapters, chapterId];
          xpDelta += 50;
          coinDelta += 25;
          chapterCompletedNow = true;
        }
        return {
          ...prev,
          xp: prev.xp + xpDelta,
          coins: prev.coins + coinDelta,
          completedLessons: {
            ...prev.completedLessons,
            [chapterId]: newLessons,
          },
          completedChapters,
        };
      });
      return { chapterCompletedNow };
    },
    [],
  );

  const resetAll = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    hydrated,
    overallProgress,
    chaptersDone,
    lessonsDone,
    totalLessonsCount: totalLessons(),
    totalChaptersCount: curriculum.length,
    isChapterUnlocked,
    isChapterComplete,
    isLessonUnlocked,
    isLessonComplete,
    isStepComplete,
    getLessonProgress,
    getChapterProgress,
    setLessonStepIndex,
    awardStep,
    completeLesson,
    resetAll,
  };
}
