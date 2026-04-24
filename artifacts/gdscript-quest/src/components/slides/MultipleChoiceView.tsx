import { useState } from "react";
import { Check, X, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import type { MultipleChoiceSlide } from "@/data/curriculum";
import { GdCode } from "@/lib/gd-highlight";

interface Props {
  slide: MultipleChoiceSlide;
  answered: boolean;
  onAnswer: (correct: boolean) => void;
}

export function MultipleChoiceView({ slide, answered, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [wrongTries, setWrongTries] = useState(0);

  const handlePick = (i: number) => {
    if (answered) return;
    const correct = i === slide.correct_option_index;
    setSelected(i);
    if (!correct) setWrongTries((c) => c + 1);
    onAnswer(correct);
    if (!correct) {
      setTimeout(() => setSelected(null), 600);
    }
  };

  return (
    <div className="space-y-5" data-testid={`slide-mc-${slide.id}`}>
      <h2 className="text-xl font-bold leading-snug text-balance">
        {slide.question}
      </h2>
      {slide.code_snippet && <GdCode code={slide.code_snippet} />}
      <div className="space-y-2.5">
        {slide.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = answered && i === slide.correct_option_index;
          const isWrongPick = isSelected && i !== slide.correct_option_index;
          return (
            <motion.button
              key={i}
              data-testid={`mc-option-${i}`}
              type="button"
              whileTap={{ scale: 0.98 }}
              disabled={answered}
              onClick={() => handlePick(i)}
              className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 font-medium font-mono text-sm
                transition-all flex items-center justify-between gap-3
                ${isCorrect ? "border-success bg-success/15 text-foreground" : ""}
                ${isWrongPick ? "border-destructive bg-destructive/15 text-foreground shake" : ""}
                ${!isSelected && !isCorrect ? "border-border bg-secondary/40 hover:border-primary/60 active:bg-secondary" : ""}
                ${answered && !isCorrect ? "opacity-60" : ""}
              `}
            >
              <span>{opt}</span>
              {isCorrect && <Check className="w-5 h-5 text-success" strokeWidth={3} />}
              {isWrongPick && <X className="w-5 h-5 text-destructive" strokeWidth={3} />}
            </motion.button>
          );
        })}
      </div>
      {wrongTries > 0 && !answered && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-warning/10 border border-warning/30">
          <Lightbulb className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="text-sm text-foreground">
            <div className="font-semibold text-warning mb-0.5">Hint</div>
            {slide.hint}
          </div>
        </div>
      )}
    </div>
  );
}
