import type { TextStep as TextStepType } from "@/data/curriculum";
import { GdCode } from "@/lib/gd-highlight";
import { BookOpen } from "lucide-react";

export function TextStep({ step }: { step: TextStepType }) {
  return (
    <div data-testid={`step-text-${step.id}`} className="space-y-4">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-[11px] font-bold uppercase tracking-wider">
        <BookOpen className="w-3 h-3" />
        Concept
      </div>
      {step.title && (
        <h2 className="text-2xl font-extrabold leading-tight">{step.title}</h2>
      )}
      <p className="text-base text-foreground/85 leading-relaxed">
        {step.body}
      </p>
      {step.code && (
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
      )}
    </div>
  );
}
