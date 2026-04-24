import { GdCode } from "@/lib/gd-highlight";
import type { CodeSlide } from "@/data/curriculum";
import { Code2 } from "lucide-react";

export function CodeSlideView({ slide }: { slide: CodeSlide }) {
  return (
    <div className="space-y-4" data-testid={`slide-code-${slide.id}`}>
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary grid place-items-center">
          <Code2 className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold">Watch this</h2>
      </div>
      <GdCode code={slide.code} />
      <p className="text-sm text-muted-foreground leading-relaxed">
        {slide.explanation}
      </p>
    </div>
  );
}
