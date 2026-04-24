import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Lightbulb, Pencil } from "lucide-react";
import type { InputStep as InputStepType } from "@/data/curriculum";
import { GdCode } from "@/lib/gd-highlight";

interface Props {
  step: InputStepType;
  answered: boolean;
  onAnswer: (correct: boolean) => void;
}

function splitTemplate(template: string): string[] {
  return template.split("___");
}

export function InputStep({ step, answered, onAnswer }: Props) {
  const parts = splitTemplate(step.template);
  const blanksCount = parts.length - 1;
  const [values, setValues] = useState<string[]>(() =>
    Array(blanksCount).fill(""),
  );
  const [shakeKey, setShakeKey] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => firstRef.current?.focus(), 250);
  }, []);

  const allCorrect =
    values.length === step.answers.length &&
    values.every(
      (v, i) =>
        v.trim().toLowerCase() === (step.answers[i] ?? "").trim().toLowerCase(),
    );

  const submit = () => {
    if (answered) return;
    if (allCorrect) {
      onAnswer(true);
    } else {
      setShakeKey((k) => k + 1);
      onAnswer(false);
    }
  };

  return (
    <div data-testid={`step-input-${step.id}`} className="space-y-5">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-[11px] font-bold uppercase tracking-wider">
        <Pencil className="w-3 h-3" />
        Type it
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
        <div className="px-4 py-4 text-sm font-mono leading-relaxed flex flex-wrap items-center gap-y-2">
          {parts.map((part, i) => (
            <span key={i} className="contents">
              <PartDisplay text={part} />
              {i < parts.length - 1 && (
                <input
                  ref={i === 0 ? firstRef : undefined}
                  type="text"
                  value={values[i] ?? ""}
                  onChange={(e) =>
                    setValues((v) => {
                      const next = [...v];
                      next[i] = e.target.value;
                      return next;
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submit();
                  }}
                  disabled={answered}
                  data-testid={`input-blank-${i}`}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  className={`min-w-[3ch] px-2 py-0.5 mx-0.5 rounded-md font-mono text-sm outline-none border-2 transition
                    ${
                      answered
                        ? "border-success/60 bg-success/15 text-success"
                        : "border-accent/60 bg-black/40 text-white focus:border-accent"
                    }
                  `}
                  style={{ width: `${Math.max((values[i]?.length ?? 0) + 2, 4)}ch` }}
                />
              )}
            </span>
          ))}
        </div>
      </motion.div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={answered || values.every((v) => !v.trim())}
          data-testid="button-check-input"
          className={`flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full font-bold transition active:scale-95
            ${
              answered
                ? "bg-success/20 text-success"
                : "bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary disabled:opacity-50 disabled:from-secondary disabled:to-secondary disabled:text-muted-foreground"
            }
          `}
        >
          {answered ? (
            <>
              <Check className="w-4 h-4" />
              Correct
            </>
          ) : (
            "Check"
          )}
        </button>
        {step.hint && !answered && (
          <button
            type="button"
            onClick={() => setShowHint((v) => !v)}
            data-testid="button-hint"
            className="px-3 py-3 rounded-full bg-secondary text-foreground/80 hover:bg-secondary/80 active:scale-95 transition"
            aria-label="Toggle hint"
          >
            <Lightbulb className="w-4 h-4" />
          </button>
        )}
      </div>

      {showHint && step.hint && !answered && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-warning/10 border border-warning/30 px-4 py-3 text-sm text-warning"
        >
          {step.hint}
        </motion.div>
      )}

      {answered && step.explanation && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-success/10 border border-success/30 px-4 py-3 text-sm text-foreground/90"
        >
          {step.explanation}
        </motion.div>
      )}
    </div>
  );
}

function PartDisplay({ text }: { text: string }) {
  // Render code template part with whitespace preserved + newlines
  const lines = text.split("\n");
  return (
    <>
      {lines.map((ln, i) => (
        <span key={i} className="contents">
          {i > 0 && <br />}
          <span className="whitespace-pre">
            <GdCode code={ln} />
          </span>
        </span>
      ))}
    </>
  );
}
