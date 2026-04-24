import { useEffect, useState } from "react";
import { Lightbulb, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { DragDropSlide } from "@/data/curriculum";

interface Props {
  slide: DragDropSlide;
  answered: boolean;
  onAnswer: (correct: boolean) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function DragDropView({ slide, answered, onAnswer }: Props) {
  const [bank, setBank] = useState<string[]>(() => shuffle(slide.tokens));
  const [placed, setPlaced] = useState<string[]>([]);
  const [shake, setShake] = useState(false);
  const [wrongTries, setWrongTries] = useState(0);

  useEffect(() => {
    setBank(shuffle(slide.tokens));
    setPlaced([]);
    setShake(false);
    setWrongTries(0);
  }, [slide.id]);

  const place = (idx: number) => {
    if (answered) return;
    const token = bank[idx];
    if (!token) return;
    const newBank = bank.filter((_, i) => i !== idx);
    const newPlaced = [...placed, token];
    setBank(newBank);
    setPlaced(newPlaced);
    if (newBank.length === 0) {
      const correct = newPlaced.every((t, i) => t === slide.correct_order[i]);
      if (correct) {
        onAnswer(true);
      } else {
        setShake(true);
        setWrongTries((c) => c + 1);
        setTimeout(() => {
          setShake(false);
          setBank(shuffle(slide.tokens));
          setPlaced([]);
        }, 600);
        onAnswer(false);
      }
    }
  };

  const reset = () => {
    if (answered) return;
    setBank(shuffle(slide.tokens));
    setPlaced([]);
  };

  return (
    <div className="space-y-5" data-testid={`slide-dd-${slide.id}`}>
      <h2 className="text-xl font-bold leading-snug">
        Tap the tokens in the right order to build the line.
      </h2>

      <motion.div
        animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.35 }}
        className="gd-code min-h-[64px] flex flex-wrap items-center gap-2"
      >
        {placed.length === 0 && (
          <span className="text-muted-foreground italic text-sm">
            Your code will appear here…
          </span>
        )}
        {placed.map((t, i) => (
          <motion.span
            key={`p-${i}-${t}`}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block px-2 py-1 rounded-md bg-primary/20 border border-primary/40 text-primary"
          >
            {t}
          </motion.span>
        ))}
      </motion.div>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {bank.map((t, i) => (
            <motion.button
              key={`${t}-${i}`}
              data-testid={`dd-token-${i}`}
              type="button"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileTap={{ scale: 0.92 }}
              disabled={answered}
              onClick={() => place(i)}
              className="px-3.5 py-2 rounded-xl bg-secondary border border-border text-sm font-mono font-semibold hover:border-primary/60 active:bg-primary/15 transition"
            >
              {t}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3">
        {!answered && placed.length > 0 && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {wrongTries > 0 && !answered && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-warning/10 border border-warning/30">
          <Lightbulb className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-semibold text-warning mb-0.5">Hint</div>
            Try arranging the tokens left-to-right in the order GDScript expects.
          </div>
        </div>
      )}
    </div>
  );
}
