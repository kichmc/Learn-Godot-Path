import { Lock, Check, Play } from "lucide-react";
import { motion } from "framer-motion";
import type { Chapter } from "@/data/curriculum";

interface Props {
  chapter: Chapter;
  index: number;
  unlocked: boolean;
  completed: boolean;
  isNext: boolean;
  progress: { done: number; total: number };
  side: "left" | "right" | "center";
  onClick: () => void;
}

export function ChapterNode({
  chapter,
  index,
  unlocked,
  completed,
  isNext,
  progress,
  side,
  onClick,
}: Props) {
  const align =
    side === "left"
      ? "items-start"
      : side === "right"
        ? "items-end"
        : "items-center";

  const status = completed ? "completed" : unlocked ? "unlocked" : "locked";

  const ringColor =
    status === "completed"
      ? "stroke-success"
      : status === "unlocked"
        ? "stroke-primary"
        : "stroke-border";

  const dashArray = 2 * Math.PI * 36;
  const pct = progress.total ? progress.done / progress.total : 0;

  return (
    <div className={`flex flex-col ${align} w-full px-2`}>
      <motion.button
        data-testid={`chapter-node-${chapter.id}`}
        type="button"
        disabled={!unlocked}
        onClick={onClick}
        whileTap={unlocked ? { scale: 0.92 } : undefined}
        className={`relative group ${isNext ? "float-bounce" : ""}`}
      >
        {/* Glow ring */}
        <div
          className={`absolute -inset-2 rounded-full blur-xl opacity-60 transition ${
            status === "unlocked"
              ? "bg-primary/40"
              : status === "completed"
                ? "bg-success/40"
                : "bg-transparent"
          }`}
        />

        <div
          className={`relative w-[88px] h-[88px] rounded-full grid place-items-center
            ${
              status === "locked"
                ? "bg-secondary/60 text-muted-foreground"
                : status === "completed"
                  ? "bg-success/15 text-success"
                  : "bg-gradient-to-br from-primary to-accent text-primary-foreground"
            }
            shadow-xl border border-white/5
          `}
        >
          {/* Progress ring */}
          <svg
            className="absolute inset-0 -rotate-90"
            viewBox="0 0 80 80"
            width="88"
            height="88"
          >
            <circle cx="40" cy="40" r="36" className="stroke-border/30" strokeWidth="4" fill="none" />
            <circle
              cx="40"
              cy="40"
              r="36"
              className={ringColor}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={dashArray}
              strokeDashoffset={dashArray * (1 - pct)}
              style={{ transition: "stroke-dashoffset .8s ease" }}
            />
          </svg>

          <div className="relative z-[1]">
            {status === "locked" && <Lock className="w-7 h-7" />}
            {status === "completed" && <Check className="w-9 h-9" strokeWidth={3} />}
            {status === "unlocked" && (
              <div className="flex flex-col items-center">
                <Play className="w-7 h-7" fill="currentColor" />
              </div>
            )}
          </div>

          {/* Chapter number badge */}
          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background border-2 border-border grid place-items-center text-xs font-bold">
            {index + 1}
          </div>
        </div>
      </motion.button>

      <div
        className={`mt-3 max-w-[260px] ${
          side === "right" ? "text-right" : side === "left" ? "text-left" : "text-center"
        }`}
      >
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          Chapter {index + 1}
        </div>
        <div className="text-base font-bold leading-tight">{chapter.title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {chapter.description}
        </div>
        {unlocked && !completed && progress.done > 0 && (
          <div className="text-[11px] text-primary mt-1 font-semibold">
            {progress.done}/{progress.total} steps
          </div>
        )}
        {completed && (
          <div className="text-[11px] text-success mt-1 font-semibold">
            Mastered
          </div>
        )}
      </div>
    </div>
  );
}
