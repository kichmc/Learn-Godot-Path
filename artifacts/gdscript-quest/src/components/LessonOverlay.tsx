import { useEffect, useMemo, useState } from "react";
import {
  X,
  ArrowLeft,
  ArrowRight,
  Trophy,
  Sparkles,
  Coins,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Chapter, Lesson, Step } from "@/data/curriculum";
import { TextStep } from "./steps/TextStep";
import { QuizStep } from "./steps/QuizStep";
import { InputStep } from "./steps/InputStep";
import { VisualStep } from "./steps/VisualStep";
import { DebugStep } from "./steps/DebugStep";
import { PredictionStep } from "./steps/PredictionStep";
import { CelebrateBurst } from "./CelebrateBurst";
import { playDing, playPop, playBuzz } from "@/lib/sound";

interface Props {
  chapter: Chapter;
  lesson: Lesson;
  startIndex: number;
  onClose: () => void;
  onStepComplete: (
    stepId: string,
    opts: { xp: number; coins: number },
  ) => void;
  onLessonComplete: () => { chapterCompletedNow: boolean };
  onIndexChange: (idx: number) => void;
  isStepCompleted: (stepId: string) => boolean;
}

function isQuestion(s: Step) {
  return (
    s.type === "quiz" ||
    s.type === "input" ||
    s.type === "debug" ||
    s.type === "prediction"
  );
}

export function LessonOverlay({
  chapter,
  lesson,
  startIndex,
  onClose,
  onStepComplete,
  onLessonComplete,
  onIndexChange,
  isStepCompleted,
}: Props) {
  const total = lesson.steps.length;
  const [idx, setIdx] = useState(() =>
    Math.min(Math.max(startIndex, 0), total - 1),
  );
  const [answeredCorrect, setAnsweredCorrect] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [finished, setFinished] = useState(false);
  const [chapterDone, setChapterDone] = useState(false);
  const [earned, setEarned] = useState({ xp: 0, coins: 0 });

  const step = lesson.steps[idx]!;
  const stepKey = useMemo(
    () => `${chapter.id}:${lesson.id}:${step.id}`,
    [chapter.id, lesson.id, step.id],
  );

  const autoDone = !isQuestion(step); // text + visual auto-advance

  useEffect(() => {
    setAnsweredCorrect(false);
    setCelebrate(false);
    onIndexChange(idx);
    if (autoDone && !isStepCompleted(step.id)) {
      onStepComplete(step.id, { xp: 2, coins: 0 });
      setEarned((e) => ({ xp: e.xp + 2, coins: e.coins }));
    } else if (autoDone) {
      // Already completed before — no XP, but enable continue
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepKey]);

  const onAnswer = (correct: boolean) => {
    if (correct) {
      setAnsweredCorrect(true);
      setCelebrate(true);
      playDing();
      if (!isStepCompleted(step.id)) {
        onStepComplete(step.id, { xp: 10, coins: 5 });
        setEarned((e) => ({ xp: e.xp + 10, coins: e.coins + 5 }));
      }
      setTimeout(() => setCelebrate(false), 700);
    } else {
      playBuzz();
    }
  };

  const goNext = () => {
    if (idx + 1 >= total) {
      const result = onLessonComplete();
      setEarned((e) => ({
        xp: e.xp + 25 + (result.chapterCompletedNow ? 50 : 0),
        coins: e.coins + 10 + (result.chapterCompletedNow ? 25 : 0),
      }));
      setChapterDone(result.chapterCompletedNow);
      setFinished(true);
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
      className="fixed inset-0 z-[60] bg-background"
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
            <div className="text-[11px] text-muted-foreground mt-1 truncate">
              {chapter.title} · {lesson.title} · {idx + 1}/{total}
            </div>
          </div>
        </div>

        {/* Step body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 pb-32 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="relative"
            >
              <div className="absolute left-1/2 top-0 -translate-x-1/2 z-10 pointer-events-none">
                <CelebrateBurst show={celebrate} />
              </div>

              {step.type === "text" && <TextStep step={step} />}
              {step.type === "visual" && <VisualStep step={step} />}
              {step.type === "quiz" && (
                <QuizStep
                  step={step}
                  answered={answeredCorrect}
                  onAnswer={onAnswer}
                />
              )}
              {step.type === "input" && (
                <InputStep
                  step={step}
                  answered={answeredCorrect}
                  onAnswer={onAnswer}
                />
              )}
              {step.type === "debug" && (
                <DebugStep
                  step={step}
                  answered={answeredCorrect}
                  onAnswer={onAnswer}
                />
              )}
              {step.type === "prediction" && (
                <PredictionStep
                  step={step}
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
              data-testid="button-back-step"
              onClick={goBack}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-secondary text-foreground font-semibold active:scale-95 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              type="button"
              data-testid="button-continue-step"
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
              {idx + 1 >= total ? "Finish lesson" : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {finished && (
          <LessonCompleteScreen
            chapter={chapter}
            lesson={lesson}
            chapterDone={chapterDone}
            earned={earned}
            onClose={onClose}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LessonCompleteScreen({
  chapter,
  lesson,
  chapterDone,
  earned,
  onClose,
}: {
  chapter: Chapter;
  lesson: Lesson;
  chapterDone: boolean;
  earned: { xp: number; coins: number };
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-background/95 backdrop-blur-xl grid place-items-center px-6"
      data-testid="lesson-complete"
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
            {chapterDone ? "Chapter complete!" : "Lesson complete"}
          </div>
          <h2 className="text-3xl font-extrabold mt-1">
            {chapterDone ? chapter.title : lesson.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {chapterDone
              ? "You mastered the whole chapter."
              : "Great job. One step closer to making your first game."}
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
          data-testid="button-finish-lesson"
          className="w-full px-5 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold glow-primary active:scale-95 transition"
        >
          Continue your quest
        </button>
      </motion.div>
    </motion.div>
  );
}
