import { useState } from "react";
import { motion } from "framer-motion";
import { Bug, Check, X } from "lucide-react";
import type { DebugStep as DebugStepType } from "@/data/curriculum";
import { GdCode } from "@/lib/gd-highlight";

interface Props {
  step: DebugStepType;
  answered: boolean;
  onAnswer: (correct: boolean) => void;
}

export function DebugStep({ step, answered, onAnswer }: Props) {
  const [picked, setPicked] = useState<number | null>(null);
  const [shakeKey, setShakeKey] = useState(0);

  const choose = (i: number) => {
    if (answered) return;
    setPicked(i);
    const correct = i === step.buggyLineIndex;
    if (!correct) setShakeKey((k) => k + 1);
    onAnswer(correct);
  };

  return (
    <div data-testid={`step-debug-${step.id}`} className="space-y-5">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/15 border border-destructive/30 text-destructive text-[11px] font-bold uppercase tracking-wider">
        <Bug className="w-3 h-3" />
        Find the bug
      </div>
      <h2 className="text-xl font-extrabold leading-tight">{step.prompt}</h2>

      <motion.div
        key={shakeKey}
        animate={shakeKey ? { x: [0, -8, 8, -6, 6, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="rounded-2xl bg-[#272822] border border-border/60 overflow-hidden"
      >
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          <span className="ml-2 text-[11px] text-white/40 font-mono">
            gdscript
          </span>
        </div>
        <div className="divide-y divide-white/5">
          {step.lines.map((line, i) => {
            const isBuggy = i === step.buggyLineIndex;
            const isPicked = picked === i;
            const correctReveal = answered && isBuggy;
            const wrongReveal = isPicked && !isBuggy && !answered;

            return (
              <button
                type="button"
                key={i}
                data-testid={`debug-line-${i}`}
                onClick={() => choose(i)}
                disabled={answered}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm font-mono active:scale-[.99] transition
                  ${
                    correctReveal
                      ? "bg-success/15"
                      : wrongReveal
                        ? "bg-destructive/15"
                        : "hover:bg-white/5"
                  }
                `}
              >
                <span className="w-6 text-right text-white/30 text-xs select-none">
                  {i + 1}
                </span>
                <span className="flex-1 whitespace-pre overflow-x-auto">
                  <GdCode code={line} />
                </span>
                {correctReveal && (
                  <Check className="w-4 h-4 text-success shrink-0" />
                )}
                {wrongReveal && (
                  <X className="w-4 h-4 text-destructive shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-success/10 border border-success/30 px-4 py-3 text-sm text-foreground/90 space-y-2"
        >
          <div className="text-xs uppercase tracking-widest text-success font-bold">
            Fixed line
          </div>
          <pre className="font-mono text-sm whitespace-pre overflow-x-auto">
            <GdCode code={step.fix} />
          </pre>
          {step.explanation && (
            <p className="text-foreground/80">{step.explanation}</p>
          )}
        </motion.div>
      )}
    </div>
  );
}
