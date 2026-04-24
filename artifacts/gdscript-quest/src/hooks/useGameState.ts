import { useCallback, useEffect, useState } from "react";
import { curriculum } from "@/data/curriculum";

const STORAGE_KEY = "gdscript-quest:state:v1";

export interface GameState {
  xp: number;
  coins: number;
  completedChapters: string[];
  chapterProgress: Record<string, number>;
  completedSlides: Record<string, string[]>;
}

const initialState: GameState = {
  xp: 0,
  coins: 0,
  completedChapters: [],
  chapterProgress: {},
  completedSlides: {},
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
      chapterProgress: parsed.chapterProgress ?? {},
      completedSlides: parsed.completedSlides ?? {},
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
      if (idx === 0) return true;
      const prev = curriculum[idx - 1];
      return prev ? state.completedChapters.includes(prev.id) : false;
    },
    [state.completedChapters],
  );

  const isChapterComplete = useCallback(
    (chapterId: string) => state.completedChapters.includes(chapterId),
    [state.completedChapters],
  );

  const getChapterProgress = useCallback(
    (chapterId: string) => state.chapterProgress[chapterId] ?? 0,
    [state.chapterProgress],
  );

  const isSlideCompleted = useCallback(
    (chapterId: string, slideId: string) =>
      (state.completedSlides[chapterId] ?? []).includes(slideId),
    [state.completedSlides],
  );

  const totalSlides = curriculum.reduce((sum, c) => sum + c.slides.length, 0);
  const completedSlideCount = Object.values(state.completedSlides).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );
  const overallProgress = totalSlides ? completedSlideCount / totalSlides : 0;

  const awardSlide = useCallback(
    (chapterId: string, slideId: string, opts: { xp: number; coins: number }) => {
      setState((prev) => {
        const already = (prev.completedSlides[chapterId] ?? []).includes(slideId);
        if (already) return prev;
        const newCompleted = [
          ...(prev.completedSlides[chapterId] ?? []),
          slideId,
        ];
        return {
          ...prev,
          xp: prev.xp + opts.xp,
          coins: prev.coins + opts.coins,
          completedSlides: {
            ...prev.completedSlides,
            [chapterId]: newCompleted,
          },
        };
      });
    },
    [],
  );

  const setSlideIndex = useCallback((chapterId: string, idx: number) => {
    setState((prev) => ({
      ...prev,
      chapterProgress: { ...prev.chapterProgress, [chapterId]: idx },
    }));
  }, []);

  const completeChapter = useCallback((chapterId: string) => {
    setState((prev) => {
      if (prev.completedChapters.includes(chapterId)) return prev;
      return {
        ...prev,
        xp: prev.xp + 50,
        coins: prev.coins + 25,
        completedChapters: [...prev.completedChapters, chapterId],
      };
    });
  }, []);

  const resetAll = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    hydrated,
    overallProgress,
    isChapterUnlocked,
    isChapterComplete,
    getChapterProgress,
    isSlideCompleted,
    awardSlide,
    setSlideIndex,
    completeChapter,
    resetAll,
  };
}
