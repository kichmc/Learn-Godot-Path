import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Brain, Eye } from "lucide-react";
import type { PredictionStep as PredictionStepType } from "@/data/curriculum";
import { GdCode } from "@/lib/gd-highlight";

interface Props {
  step: PredictionStepType;
  answered: boolean;
  onAnswer: (correct: boolean) => void;
}

export function PredictionStep({ step, answered, onAnswer }: Props) {
  const [picked, setPicked] = useState<number | null>(null);
  const [shakeKey, setShakeKey] = useState(0);

  const choose = (i: number) => {
    if (answered) return;
    setPicked(i);
    const correct = i === step.correctIndex;
    if (!correct) setShakeKey((k) => k + 1);
    onAnswer(correct);
  };

  return (
    <div data-testid={`step-prediction-${step.id}`} className="space-y-5">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-[11px] font-bold uppercase tracking-wider">
        <Brain className="w-3 h-3" />
        Predict the output
      </div>
      <h2 className="text-xl font-extrabold leading-tight">{step.prompt}</h2>

      <div className="rounded-2xl bg-[#272822] border border-border/60 overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          <span className="ml-2 text-[11px] text-white/40 font-mono">
            gdscript
          </span>
        </div>
        <pre className="px-4 py-3 text-sm font-mono leading-relaxed overflow-x-auto">
          <GdCode code={step.code} />
        </pre>
      </div>

      <motion.div
        key={shakeKey}
        animate={shakeKey ? { x: [0, -8, 8, -6, 6, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-2 gap-2.5"
      >
        {step.options.map((opt, i) => {
          const isCorrect = i === step.correctIndex;
          const isPicked = picked === i;
          const showCorrect = answered && isCorrect;
          const showWrong = isPicked && !isCorrect && !answered;

          return (
            <button
              type="button"
              key={i}
              data-testid={`prediction-option-${i}`}
              onClick={() => choose(i)}
              disabled={answered}
              className={`px-4 py-3 rounded-2xl border-2 font-mono text-sm transition active:scale-[.97] text-center break-all
                ${
                  showCorrect
                    ? "border-success bg-success/10 text-success"
                    : showWrong
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border bg-card hover:border-primary/50"
                }
              `}
            >
              <div className="flex items-center justify-center gap-2">
                <span>{opt}</span>
                {showCorrect && <Check className="w-4 h-4 shrink-0" />}
                {showWrong && <X className="w-4 h-4 shrink-0" />}
              </div>
            </button>
          );
        })}
      </motion.div>

      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-success/10 border border-success/30 px-4 py-3 text-sm space-y-1"
        >
          <div className="flex items-center gap-1.5 text-success font-bold text-xs uppercase tracking-widest">
            <Eye className="w-3.5 h-3.5" />
            Output
          </div>
          <div className="font-mono text-foreground">
            {step.options[step.correctIndex]}
          </div>
          {step.explanation && (
            <p className="text-foreground/80 pt-1">{step.explanation}</p>
          )}
        </motion.div>
      )}
    </div>
  );
}
