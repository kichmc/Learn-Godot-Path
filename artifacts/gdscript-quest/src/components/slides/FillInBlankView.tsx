import { useState, useRef, useEffect } from "react";
import { Lightbulb, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { FillInBlankSlide } from "@/data/curriculum";

interface Props {
  slide: FillInBlankSlide;
  answered: boolean;
  onAnswer: (correct: boolean) => void;
}

function tokenize(input: string): boolean {
  return /^-?\d+(\.\d+)?$/.test(input.trim());
}

export function FillInBlankView({ slide, answered, onAnswer }: Props) {
  const [value, setValue] = useState("");
  const [shake, setShake] = useState(false);
  const [wrongTries, setWrongTries] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue("");
    setShake(false);
    setWrongTries(0);
  }, [slide.id]);

  const submit = () => {
    if (answered) return;
    const v = value.trim();
    if (!v) return;
    const correct = slide.accept_any_number
      ? tokenize(v)
      : v.toLowerCase() === slide.answer.trim().toLowerCase();
    if (correct) {
      onAnswer(true);
    } else {
      setShake(true);
      setWrongTries((c) => c + 1);
      setTimeout(() => setShake(false), 400);
      onAnswer(false);
    }
  };

  return (
    <div className="space-y-5" data-testid={`slide-fb-${slide.id}`}>
      <h2 className="text-xl font-bold leading-snug">
        Complete the code by filling the blank.
      </h2>
      <motion.div
        animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.35 }}
        className="gd-code"
      >
        <span style={{ whiteSpace: "pre" }}>{slide.code_snippet_before}</span>
        <input
          ref={inputRef}
          data-testid="fb-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          disabled={answered}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="inline-block w-28 px-2 py-0.5 mx-1 rounded-md bg-background/80 border-2 border-primary/60 text-primary font-mono focus:outline-none focus:border-primary"
          placeholder="?"
        />
        <span style={{ whiteSpace: "pre" }}>{slide.code_snippet_after}</span>
      </motion.div>

      {wrongTries > 0 && !answered && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-warning/10 border border-warning/30">
          <Lightbulb className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="text-sm text-foreground">
            <div className="font-semibold text-warning mb-0.5">Hint</div>
            {slide.hint}
          </div>
        </div>
      )}

      {!answered && (
        <button
          type="button"
          data-testid="fb-submit"
          onClick={submit}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold active:scale-95 transition"
        >
          Check
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
