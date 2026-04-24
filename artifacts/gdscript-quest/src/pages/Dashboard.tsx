import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ChapterNode } from "@/components/ChapterNode";
import { ChapterScreen } from "@/components/ChapterScreen";
import { LessonOverlay } from "@/components/LessonOverlay";
import { curriculum, type Lesson } from "@/data/curriculum";
import { useGameState } from "@/hooks/useGameState";
import { Sparkles } from "lucide-react";

export default function Dashboard() {
  const game = useGameState();
  const [openChapterId, setOpenChapterId] = useState<string | null>(null);
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);

  const openChapter = openChapterId
    ? curriculum.find((c) => c.id === openChapterId) ?? null
    : null;
  const openChapterIndex = openChapter
    ? curriculum.findIndex((c) => c.id === openChapter.id)
    : -1;
  const openLesson: Lesson | null =
    openChapter && openLessonId
      ? openChapter.lessons.find((l) => l.id === openLessonId) ?? null
      : null;

  const nextChapterId =
    curriculum.find(
      (c) =>
        game.isChapterUnlocked(c.id) && !game.isChapterComplete(c.id),
    )?.id ?? null;

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Header
        xp={game.state.xp}
        coins={game.state.coins}
        progress={game.overallProgress}
      />

      <main className="flex-1 max-w-md w-full mx-auto pb-32 pt-4 px-3">
        <Hero
          xp={game.state.xp}
          totalChapters={game.totalChaptersCount}
          completedChapters={game.chaptersDone}
          totalLessons={game.totalLessonsCount}
          completedLessons={game.lessonsDone}
        />

        <div className="mt-6 relative">
          <PathBackbone />
          <div className="relative space-y-12">
            {curriculum.map((chapter, i) => {
              const sides: ("left" | "center" | "right")[] = [
                "center",
                "right",
                "left",
                "right",
                "left",
                "center",
              ];
              const side = sides[i] ?? (i % 2 === 0 ? "left" : "right");
              const progress = game.getChapterProgress(chapter.id);
              return (
                <ChapterNode
                  key={chapter.id}
                  chapter={chapter}
                  index={i}
                  unlocked={game.isChapterUnlocked(chapter.id)}
                  completed={game.isChapterComplete(chapter.id)}
                  isNext={nextChapterId === chapter.id}
                  progress={progress}
                  side={side}
                  onClick={() => {
                    if (game.isChapterUnlocked(chapter.id)) {
                      setOpenChapterId(chapter.id);
                    }
                  }}
                />
              );
            })}
          </div>
        </div>

        <ResetFooter resetAll={game.resetAll} />
      </main>

      <BottomNav />

      <AnimatePresence>
        {openChapter && !openLesson && (
          <ChapterScreen
            key={`chapter-${openChapter.id}`}
            chapter={openChapter}
            chapterIndex={openChapterIndex}
            isLessonUnlocked={(lessonId) =>
              game.isLessonUnlocked(openChapter.id, lessonId)
            }
            isLessonComplete={(lessonId) =>
              game.isLessonComplete(openChapter.id, lessonId)
            }
            getLessonStepsDone={(lessonId) =>
              (game.state.completedSteps[openChapter.id]?.[lessonId] ?? [])
                .length
            }
            onBack={() => setOpenChapterId(null)}
            onOpenLesson={(l) => setOpenLessonId(l.id)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openChapter && openLesson && (
          <LessonOverlay
            key={`lesson-${openLesson.id}`}
            chapter={openChapter}
            lesson={openLesson}
            startIndex={game.getLessonProgress(openChapter.id, openLesson.id)}
            isStepCompleted={(stepId) =>
              game.isStepComplete(openChapter.id, openLesson.id, stepId)
            }
            onIndexChange={(idx) =>
              game.setLessonStepIndex(openChapter.id, openLesson.id, idx)
            }
            onStepComplete={(stepId, opts) =>
              game.awardStep(openChapter.id, openLesson.id, stepId, opts)
            }
            onLessonComplete={() =>
              game.completeLesson(openChapter.id, openLesson.id)
            }
            onClose={() => setOpenLessonId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Hero({
  xp,
  totalChapters,
  completedChapters,
  totalLessons,
  completedLessons,
}: {
  xp: number;
  totalChapters: number;
  completedChapters: number;
  totalLessons: number;
  completedLessons: number;
}) {
  return (
    <section
      data-testid="hero-card"
      className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card to-accent/10 p-5"
    >
      <div className="absolute -top-12 -right-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-12 -left-10 w-40 h-40 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          Your quest
        </div>
        <h1 className="text-2xl font-extrabold mt-1 leading-tight">
          Learn GDScript,
          <br />
          one tap at a time.
        </h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Bite-sized lessons inspired by Godot Engine docs and GDQuest. Build
          real game logic on your phone.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <Stat
            value={completedChapters}
            total={totalChapters}
            label="Chapters"
            color="text-primary"
          />
          <Stat
            value={completedLessons}
            total={totalLessons}
            label="Lessons"
            color="text-accent"
          />
          <Stat value={xp} label="XP" color="text-warning" />
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  total,
  label,
  color,
}: {
  value: number;
  total?: number;
  label: string;
  color: string;
}) {
  return (
    <div>
      <div className={`text-2xl font-extrabold tabular-nums ${color}`}>
        {value}
        {total != null && (
          <span className="text-muted-foreground font-normal text-base">
            /{total}
          </span>
        )}
      </div>
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function PathBackbone() {
  return (
    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[3px] bg-gradient-to-b from-primary/0 via-primary/40 to-accent/30 rounded-full" />
  );
}

function ResetFooter({ resetAll }: { resetAll: () => void }) {
  return (
    <div className="mt-12 text-center">
      <button
        type="button"
        onClick={() => {
          if (
            confirm(
              "Reset all progress? Your XP, coins, and completed chapters will be cleared.",
            )
          ) {
            resetAll();
          }
        }}
        className="text-[11px] text-muted-foreground/70 hover:text-muted-foreground transition underline-offset-2 hover:underline"
      >
        Reset progress
      </button>
    </div>
  );
}
