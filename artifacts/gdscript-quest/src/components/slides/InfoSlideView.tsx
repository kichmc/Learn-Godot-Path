import { ImageIcon } from "lucide-react";
import type { InfoSlide } from "@/data/curriculum";

export function InfoSlideView({ slide }: { slide: InfoSlide }) {
  return (
    <div className="space-y-5" data-testid={`slide-info-${slide.id}`}>
      <h2 className="text-2xl font-extrabold text-balance leading-tight">
        {slide.title}
      </h2>
      <p className="text-base text-muted-foreground leading-relaxed text-balance">
        {slide.body}
      </p>
      {slide.image_caption && (
        <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-5 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary grid place-items-center flex-shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div className="text-sm text-muted-foreground italic leading-relaxed">
            {slide.image_caption.replace(/^\[|\]$/g, "")}
          </div>
        </div>
      )}
    </div>
  );
}
