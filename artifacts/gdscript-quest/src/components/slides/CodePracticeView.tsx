import { useState, useEffect } from "react";
import { Lightbulb, Play, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import type { CodePracticeSlide } from "@/data/curriculum";

interface Props {
  slide: CodePracticeSlide;
  answered: boolean;
  onAnswer: (correct: boolean) => void;
}

export function CodePracticeView({ slide, answered, onAnswer }: Props) {
  const [code, setCode] = useState("");
  const [shake, setShake] = useState(false);
  const [wrongTries, setWrongTries] = useState(0);
  const [showExpected, setShowExpected] = useState(false);

  useEffect(() => {
    setCode("");
    setShake(false);
    setWrongTries(0);
    setShowExpected(false);
  }, [slide.id]);

  const submit = () => {
    if (answered) return;
    const v = code.trim();
    if (!v) return;
    if (v === slide.target_line.trim()) {
      onAnswer(true);
    } else {
      const next = wrongTries + 1;
      setWrongTries(next);
      setShake(true);
      setTimeout(() => setShake(false), 400);
      if (next >= 2) setShowExpected(true);
      onAnswer(false);
    }
  };

  return (
    <div className="space-y-5" data-testid={`slide-cp-${slide.id}`}>
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent grid place-items-center">
          <Terminal className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold">Your turn — write the code</h2>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {slide.prompt}
      </p>

      <motion.div animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.35 }}>
        <textarea
          data-testid="cp-editor"
          className="gd-editor"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="// type your line here"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          rows={3}
        />
      </motion.div>

      {showExpected && !answered && (
        <div className="rounded-xl bg-secondary/60 border border-border p-3">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">
            Expected
          </div>
          <code className="font-mono text-sm text-accent">
            {slide.target_line}
          </code>
        </div>
      )}

      {wrongTries > 0 && !answered && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-warning/10 border border-warning/30">
          <Lightbulb className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-semibold text-warning mb-0.5">Hint</div>
            {slide.hint}
          </div>
        </div>
      )}

      {!answered && (
        <button
          type="button"
          data-testid="cp-run"
          onClick={submit}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-accent-foreground font-semibold active:scale-95 transition"
        >
          <Play className="w-4 h-4" fill="currentColor" />
          Run
        </button>
      )}
    </div>
  );
}
