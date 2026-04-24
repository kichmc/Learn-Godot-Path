import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ChapterNode } from "@/components/ChapterNode";
import { LessonOverlay } from "@/components/LessonOverlay";
import { curriculum } from "@/data/curriculum";
import { useGameState } from "@/hooks/useGameState";
import { Sparkles } from "lucide-react";

export default function Dashboard() {
  const game = useGameState();
  const [openChapterId, setOpenChapterId] = useState<string | null>(null);

  // Find first unlocked-but-not-completed chapter
  const nextChapterId =
    curriculum.find(
      (c) =>
        game.isChapterUnlocked(c.id) && !game.isChapterComplete(c.id),
    )?.id ?? null;

  const openChapter = openChapterId
    ? curriculum.find((c) => c.id === openChapterId) ?? null
    : null;

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
          totalChapters={curriculum.length}
          completedChapters={game.state.completedChapters.length}
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
              ];
              const side = sides[i] ?? (i % 2 === 0 ? "left" : "right");
              const completedSlideIds =
                game.state.completedSlides[chapter.id] ?? [];
              return (
                <ChapterNode
                  key={chapter.id}
                  chapter={chapter}
                  index={i}
                  unlocked={game.isChapterUnlocked(chapter.id)}
                  completed={game.isChapterComplete(chapter.id)}
                  isNext={nextChapterId === chapter.id}
                  progress={{
                    done: completedSlideIds.length,
                    total: chapter.slides.length,
                  }}
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
        {openChapter && (
          <LessonOverlay
            key={openChapter.id}
            chapter={openChapter}
            startIndex={game.getChapterProgress(openChapter.id)}
            isSlideCompleted={(slideId) =>
              game.isSlideCompleted(openChapter.id, slideId)
            }
            onIndexChange={(idx) => game.setSlideIndex(openChapter.id, idx)}
            onSlideComplete={(slideId, opts) =>
              game.awardSlide(openChapter.id, slideId, opts)
            }
            onChapterComplete={() => game.completeChapter(openChapter.id)}
            onClose={() => setOpenChapterId(null)}
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
}: {
  xp: number;
  totalChapters: number;
  completedChapters: number;
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
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div>
            <div className="text-2xl font-extrabold text-primary tabular-nums">
              {completedChapters}
              <span className="text-muted-foreground font-normal text-base">
                /{totalChapters}
              </span>
            </div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Chapters
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <div className="text-2xl font-extrabold text-warning tabular-nums">
              {xp}
            </div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Total XP
            </div>
          </div>
        </div>
      </div>
    </section>
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
