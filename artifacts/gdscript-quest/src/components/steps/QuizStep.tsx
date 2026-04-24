import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, HelpCircle } from "lucide-react";
import type { QuizStep as QuizStepType } from "@/data/curriculum";

interface Props {
  step: QuizStepType;
  answered: boolean;
  onAnswer: (correct: boolean) => void;
}

export function QuizStep({ step, answered, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [shakeKey, setShakeKey] = useState(0);

  const choose = (i: number) => {
    if (answered) return;
    setSelected(i);
    const correct = i === step.correctIndex;
    if (!correct) setShakeKey((k) => k + 1);
    onAnswer(correct);
  };

  return (
    <div data-testid={`step-quiz-${step.id}`} className="space-y-5">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-[11px] font-bold uppercase tracking-wider">
        <HelpCircle className="w-3 h-3" />
        Quiz
      </div>
      <h2 className="text-xl font-extrabold leading-tight">{step.question}</h2>
      <motion.div
        key={shakeKey}
        animate={shakeKey ? { x: [0, -8, 8, -6, 6, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="space-y-2.5"
      >
        {step.options.map((opt, i) => {
          const isCorrect = i === step.correctIndex;
          const isSelected = selected === i;
          const showCorrect = answered && isCorrect;
          const showWrong = isSelected && !isCorrect && !answered;

          return (
            <button
              type="button"
              key={i}
              data-testid={`option-${i}`}
              onClick={() => choose(i)}
              disabled={answered}
              className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 font-mono text-sm transition active:scale-[.98]
                ${
                  showCorrect
                    ? "border-success bg-success/10 text-success"
                    : showWrong
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border bg-card hover:border-primary/50"
                }
              `}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="break-all">{opt}</span>
                {showCorrect && <Check className="w-5 h-5 shrink-0" />}
                {showWrong && <X className="w-5 h-5 shrink-0" />}
              </div>
            </button>
          );
        })}
      </motion.div>
      {answered && step.explanation && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-success/10 border border-success/30 px-4 py-3 text-sm text-foreground/90"
        >
          <span className="font-bold text-success">Got it. </span>
          {step.explanation}
        </motion.div>
      )}
    </div>
  );
}
