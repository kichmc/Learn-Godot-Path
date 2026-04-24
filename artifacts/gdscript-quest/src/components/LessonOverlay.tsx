import { useEffect, useMemo, useState } from "react";
import { X, ArrowLeft, ArrowRight, Trophy, Sparkles, Coins } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Chapter, Slide } from "@/data/curriculum";
import { InfoSlideView } from "./slides/InfoSlideView";
import { CodeSlideView } from "./slides/CodeSlideView";
import { MultipleChoiceView } from "./slides/MultipleChoiceView";
import { FillInBlankView } from "./slides/FillInBlankView";
import { DragDropView } from "./slides/DragDropView";
import { CodePracticeView } from "./slides/CodePracticeView";
import { CelebrateBurst } from "./CelebrateBurst";
import { playDing, playPop, playBuzz } from "@/lib/sound";

interface Props {
  chapter: Chapter;
  startIndex: number;
  onClose: () => void;
  onSlideComplete: (slideId: string, opts: { xp: number; coins: number }) => void;
  onChapterComplete: () => void;
  onIndexChange: (idx: number) => void;
  isSlideCompleted: (slideId: string) => boolean;
}

function isQuestion(s: Slide) {
  return (
    s.type === "multiple_choice" ||
    s.type === "fill_in_blank" ||
    s.type === "drag_drop" ||
    s.type === "code_practice"
  );
}

export function LessonOverlay({
  chapter,
  startIndex,
  onClose,
  onSlideComplete,
  onChapterComplete,
  onIndexChange,
  isSlideCompleted,
}: Props) {
  const [idx, setIdx] = useState(() =>
    Math.min(Math.max(startIndex, 0), chapter.slides.length - 1),
  );
  const [answeredCorrect, setAnsweredCorrect] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [finished, setFinished] = useState(false);
  const [earned, setEarned] = useState({ xp: 0, coins: 0 });

  const slide = chapter.slides[idx]!;
  const total = chapter.slides.length;
  const sessionEarned = earned;

  const slideKey = useMemo(() => `${chapter.id}:${slide.id}`, [chapter.id, slide.id]);

  // For info/code slides — auto-mark done & enable Continue
  const autoDone = !isQuestion(slide);

  useEffect(() => {
    setAnsweredCorrect(false);
    setCelebrate(false);
    onIndexChange(idx);
    if (autoDone) {
      // award small completion bonus once for new slides
      if (!isSlideCompleted(slide.id)) {
        onSlideComplete(slide.id, { xp: 2, coins: 0 });
        setEarned((e) => ({ xp: e.xp + 2, coins: e.coins }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideKey]);

  const onAnswer = (correct: boolean) => {
    if (correct) {
      setAnsweredCorrect(true);
      setCelebrate(true);
      playDing();
      if (!isSlideCompleted(slide.id)) {
        onSlideComplete(slide.id, { xp: 10, coins: 5 });
        setEarned((e) => ({ xp: e.xp + 10, coins: e.coins + 5 }));
      }
      setTimeout(() => setCelebrate(false), 700);
    } else {
      playBuzz();
    }
  };

  const goNext = () => {
    if (idx + 1 >= total) {
      // finished chapter
      setFinished(true);
      onChapterComplete();
      setEarned((e) => ({ xp: e.xp + 50, coins: e.coins + 25 }));
      return;
    }
    playPop();
    setIdx((i) => i + 1);
  };

  const goBack = () => {
    if (idx === 0) {
      onClose();
      return;
    }
    playPop();
    setIdx((i) => i - 1);
  };

  const canContinue = autoDone || answeredCorrect;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background"
      data-testid="lesson-overlay"
    >
      <div className="flex flex-col h-[100dvh] max-w-md mx-auto">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 pt-3 pb-3 border-b border-border/60">
          <button
            type="button"
            onClick={onClose}
            data-testid="button-close-lesson"
            className="w-9 h-9 grid place-items-center rounded-xl hover:bg-secondary transition"
            aria-label="Close lesson"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div
                initial={false}
                animate={{ width: `${((idx + 1) / total) * 100}%` }}
                transition={{ type: "spring", stiffness: 130, damping: 22 }}
                className="h-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              {chapter.title} • {idx + 1} / {total}
            </div>
          </div>
        </div>

        {/* Slide body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 pb-32 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="relative"
            >
              <div className="absolute left-1/2 top-4 -translate-x-1/2 z-10">
                <CelebrateBurst show={celebrate} />
              </div>
              {slide.type === "info" && <InfoSlideView slide={slide} />}
              {slide.type === "code" && <CodeSlideView slide={slide} />}
              {slide.type === "multiple_choice" && (
                <MultipleChoiceView
                  slide={slide}
                  answered={answeredCorrect}
                  onAnswer={onAnswer}
                />
              )}
              {slide.type === "fill_in_blank" && (
                <FillInBlankView
                  slide={slide}
                  answered={answeredCorrect}
                  onAnswer={onAnswer}
                />
              )}
              {slide.type === "drag_drop" && (
                <DragDropView
                  slide={slide}
                  answered={answeredCorrect}
                  onAnswer={onAnswer}
                />
              )}
              {slide.type === "code_practice" && (
                <CodePracticeView
                  slide={slide}
                  answered={answeredCorrect}
                  onAnswer={onAnswer}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom action bar */}
        <div
          className="sticky bottom-0 inset-x-0 backdrop-blur-xl bg-background/85 border-t border-border/60 px-4 py-3"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + .75rem)" }}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-testid="button-back-slide"
              onClick={goBack}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-secondary text-foreground font-semibold active:scale-95 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              type="button"
              data-testid="button-continue-slide"
              onClick={goNext}
              disabled={!canContinue}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full font-semibold active:scale-95 transition
                ${
                  canContinue
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary"
                    : "bg-secondary text-muted-foreground"
                }
              `}
            >
              {idx + 1 >= total ? "Finish Chapter" : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {finished && (
          <ChapterCompleteScreen
            chapter={chapter}
            earned={sessionEarned}
            onClose={onClose}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ChapterCompleteScreen({
  chapter,
  earned,
  onClose,
}: {
  chapter: Chapter;
  earned: { xp: number; coins: number };
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl grid place-items-center px-6"
      data-testid="chapter-complete"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="max-w-sm w-full text-center space-y-5 relative"
      >
        <div className="absolute left-1/2 -top-2 -translate-x-1/2">
          <CelebrateBurst show={true} />
        </div>
        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center glow-primary">
          <Trophy className="w-10 h-10 text-primary-foreground" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-accent font-bold">
            Chapter Complete
          </div>
          <h2 className="text-3xl font-extrabold mt-1">{chapter.title}</h2>
          <p className="text-sm text-muted-foreground mt-2">
            You leveled up your Godot skills.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30 text-primary font-semibold">
            <Sparkles className="w-4 h-4" />+{earned.xp} XP
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-warning/15 border border-warning/30 text-warning font-semibold">
            <Coins className="w-4 h-4" />+{earned.coins}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          data-testid="button-finish-chapter"
          className="w-full px-5 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold glow-primary active:scale-95 transition"
        >
          Continue your quest
        </button>
      </motion.div>
    </motion.div>
  );
}
