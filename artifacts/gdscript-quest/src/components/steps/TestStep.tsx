import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Lightbulb,
  Trophy,
  RefreshCw,
  Flame,
  Sparkles,
} from "lucide-react";
import type { TestStep as TestStepType } from "@/data/curriculum";
import { GdCode } from "@/lib/gd-highlight";
import { VisualSimulation } from "@/components/VisualSimulation";

interface Props {
  step: TestStepType;
  answered: boolean;
  onAnswer: (correct: boolean) => void;
}

function splitTemplate(template: string): string[] {
  return template.split("___");
}

// VALIDATION: trim + lowercase compare; works for code (`+=`, "ui_right", etc.)
function isCorrect(values: string[], answers: string[]): boolean {
  if (values.length !== answers.length) return false;
  return values.every(
    (v, i) =>
      v.trim().toLowerCase() === (answers[i] ?? "").trim().toLowerCase(),
  );
}

export function TestStep({ step, answered, onAnswer }: Props) {
  const parts = splitTemplate(step.code);
  const blanksCount = Math.max(parts.length - 1, 0);

  const [values, setValues] = useState<string[]>(() =>
    Array(blanksCount).fill(""),
  );
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "wrong" | "correct">(
    "idle",
  );
  const [shakeKey, setShakeKey] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => firstRef.current?.focus(), 250);
  }, []);

  const submit = () => {
    if (answered) return;
    if (values.every((v) => !v.trim())) return;

    const correct = isCorrect(values, step.answers);
    setAttempts((a) => a + 1);
    if (correct) {
      setFeedback("correct");
      onAnswer(true);
    } else {
      setFeedback("wrong");
      setShakeKey((k) => k + 1);
      onAnswer(false);
      // auto-clear "Try again" banner after a moment so retry feels fresh
      setTimeout(
        () => setFeedback((f) => (f === "wrong" ? "idle" : f)),
        1400,
      );
    }
  };

  const reveal = () => {
    if (answered) return;
    // After a few attempts, let them peek at the answer and continue
    setValues([...step.answers]);
    setFeedback("correct");
    onAnswer(true);
  };

  const diffLabel =
    step.difficulty === "medium" ? "Medium" : "Easy starter";

  return (
    <div data-testid={`step-test-${step.id}`} className="space-y-5">
      {/* Header banner — clearly mark this as the lesson test */}
      <div className="rounded-2xl border border-warning/40 bg-gradient-to-r from-warning/10 via-primary/10 to-accent/10 px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-warning/20 grid place-items-center text-warning shrink-0">
          <Trophy className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-widest text-warning font-extrabold flex items-center gap-1">
            <Flame className="w-3 h-3" />
            Lesson Test · {diffLabel}
          </div>
          <div className="text-sm font-bold leading-tight truncate">
            Show what you learned
          </div>
        </div>
      </div>

      <h2 className="text-xl font-extrabold leading-snug">{step.question}</h2>

      {/* Code block with inline inputs */}
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
            test.gd
          </span>
        </div>
        <div className="px-4 py-4 text-sm font-mono leading-relaxed">
          {parts.map((part, i) => (
            <span key={i} className="contents">
              <CodePart text={part} />
              {i < parts.length - 1 && (
                <BlankInput
                  inputRef={i === 0 ? firstRef : undefined}
                  value={values[i] ?? ""}
                  onChange={(v) =>
                    setValues((prev) => {
                      const next = [...prev];
                      next[i] = v;
                      return next;
                    })
                  }
                  onSubmit={submit}
                  disabled={answered}
                  state={feedback}
                />
              )}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Big mobile-friendly action button */}
      {!answered && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={submit}
            disabled={values.every((v) => !v.trim())}
            data-testid="button-test-check"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-extrabold text-base transition active:scale-[.98]
              bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary
              disabled:opacity-50 disabled:from-secondary disabled:to-secondary disabled:text-muted-foreground"
          >
            Check answer
          </button>
          {step.hint && (
            <button
              type="button"
              onClick={() => setShowHint((v) => !v)}
              data-testid="button-test-hint"
              className="px-4 py-4 rounded-2xl bg-secondary text-foreground/80 hover:bg-secondary/80 active:scale-95 transition"
              aria-label="Toggle hint"
            >
              <Lightbulb className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* "Show me" reveal escape hatch after 3 wrong tries */}
      {!answered && attempts >= 3 && (
        <button
          type="button"
          onClick={reveal}
          data-testid="button-test-reveal"
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-secondary/70 text-muted-foreground text-sm font-semibold hover:bg-secondary transition"
        >
          <RefreshCw className="w-4 h-4" />
          Show me the answer
        </button>
      )}

      {/* FEEDBACK */}
      <AnimatePresence mode="wait">
        {feedback === "wrong" && !answered && (
          <FeedbackBanner
            key="wrong"
            tone="wrong"
            title="Try again"
            body="That's not quite right — peek at the hint or read the code carefully."
          />
        )}
        {feedback === "correct" && (
          <FeedbackBanner
            key="correct"
            tone="correct"
            title="Correct!"
            body="Why this works:"
            explanation={step.explanation}
          />
        )}
      </AnimatePresence>

      {/* HINT */}
      {showHint && step.hint && !answered && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-warning/10 border border-warning/30 px-4 py-3 text-sm text-warning"
        >
          <span className="font-bold">Hint: </span>
          {step.hint}
        </motion.div>
      )}

      {/* VISUAL RESULT — plays after the test is correct */}
      {answered && step.simulation && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-2"
        >
          <div className="text-[11px] uppercase tracking-widest text-accent font-bold inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            See your code run
          </div>
          <VisualSimulation spec={step.simulation} />
        </motion.div>
      )}
    </div>
  );
}

// --- Sub-components ---

function CodePart({ text }: { text: string }) {
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

function BlankInput({
  inputRef,
  value,
  onChange,
  onSubmit,
  disabled,
  state,
}: {
  inputRef?: React.RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  state: "idle" | "wrong" | "correct";
}) {
  const colorClass =
    state === "correct"
      ? "border-success bg-success/15 text-success"
      : state === "wrong"
        ? "border-destructive bg-destructive/15 text-destructive"
        : "border-accent/60 bg-black/40 text-white focus:border-accent";

  return (
    <input
      ref={inputRef ?? undefined}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSubmit();
      }}
      disabled={disabled}
      data-testid="test-blank"
      spellCheck={false}
      autoCapitalize="off"
      autoCorrect="off"
      placeholder="?"
      className={`min-w-[3ch] px-2 py-1 mx-0.5 rounded-md font-mono text-base outline-none border-2 transition placeholder:text-white/30 ${colorClass}`}
      style={{ width: `${Math.max(value.length + 2, 4)}ch` }}
    />
  );
}

function FeedbackBanner({
  tone,
  title,
  body,
  explanation,
}: {
  tone: "wrong" | "correct";
  title: string;
  body: string;
  explanation?: string;
}) {
  const isCorrect = tone === "correct";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22 }}
      className={`rounded-2xl px-4 py-3 flex items-start gap-3 border ${
        isCorrect
          ? "bg-success/10 border-success/40 text-success"
          : "bg-destructive/10 border-destructive/40 text-destructive"
      }`}
      data-testid={`feedback-${tone}`}
    >
      <div
        className={`w-8 h-8 rounded-full grid place-items-center shrink-0 ${
          isCorrect ? "bg-success/20" : "bg-destructive/20"
        }`}
      >
        {isCorrect ? (
          <Check className="w-5 h-5" strokeWidth={3} />
        ) : (
          <X className="w-5 h-5" strokeWidth={3} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-extrabold leading-tight">{title}</div>
        <div className="text-sm text-foreground/85 leading-snug mt-0.5">
          {body}
          {explanation && (
            <div className="mt-1 text-foreground/90">{explanation}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
