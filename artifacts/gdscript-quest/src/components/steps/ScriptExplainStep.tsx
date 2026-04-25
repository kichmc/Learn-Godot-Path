import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointerClick, Lightbulb } from "lucide-react";
import type { ScriptExplainStep as ScriptExplainStepType } from "@/data/curriculum";
import { GdCode } from "@/lib/gd-highlight";

interface Props {
  step: ScriptExplainStepType;
}

export function ScriptExplainStep({ step }: Props) {
  const [selected, setSelected] = useState<number | null>(0);

  return (
    <div data-testid={`step-script-explain-${step.id}`} className="space-y-4">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-[11px] font-bold uppercase tracking-wider">
        <MousePointerClick className="w-3 h-3" />
        Script walkthrough
      </div>

      {step.title && (
        <h2 className="text-2xl font-extrabold leading-tight">{step.title}</h2>
      )}
      {step.intro && (
        <p className="text-sm text-foreground/80 leading-relaxed">
          {step.intro}
        </p>
      )}

      {/* Tappable code block */}
      <div className="rounded-2xl bg-[#272822] border border-border/60 overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          <span className="ml-2 text-[11px] text-white/40 font-mono">
            example.gd
          </span>
        </div>
        <div className="py-2">
          {step.code.map((row, i) => {
            const active = selected === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelected(active ? null : i)}
                data-testid={`script-line-${i}`}
                className={`w-full text-left flex items-start gap-3 px-3 py-2 font-mono text-sm transition group
                  ${
                    active
                      ? "bg-accent/15 border-l-2 border-accent"
                      : "border-l-2 border-transparent hover:bg-white/5"
                  }`}
              >
                <span
                  className={`w-5 shrink-0 text-right tabular-nums select-none transition ${
                    active ? "text-accent font-bold" : "text-white/30"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="whitespace-pre-wrap break-words flex-1">
                  <GdCode code={row.line} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation panel */}
      <AnimatePresence mode="wait">
        {selected !== null && step.code[selected] && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl bg-accent/10 border border-accent/30 px-4 py-3 flex gap-3"
            data-testid="script-explain-panel"
          >
            <div className="w-8 h-8 rounded-full bg-accent/20 grid place-items-center text-accent shrink-0">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-widest text-accent font-extrabold">
                Line {selected + 1}
              </div>
              <div className="text-sm text-foreground/90 leading-snug mt-0.5">
                {step.code[selected].explanation}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
