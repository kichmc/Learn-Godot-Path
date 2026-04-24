import { useEffect, useState } from "react";
import { Coins, Sparkles, Heart, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  xp: number;
  coins: number;
  progress: number; // 0..1
}

function Counter({
  value,
  icon,
  className,
  testId,
}: {
  value: number;
  icon: React.ReactNode;
  className: string;
  testId: string;
}) {
  const [bump, setBump] = useState(false);
  useEffect(() => {
    setBump(true);
    const t = setTimeout(() => setBump(false), 400);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div
      data-testid={testId}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-semibold ${className} ${bump ? "pop" : ""}`}
    >
      {icon}
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="tabular-nums"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export function Header({ xp, coins, progress }: Props) {
  const supportHref = "upi://pay?pa=YOUR_UPI_ID@okaxis&pn=Adwaith";

  return (
    <header
      data-testid="app-header"
      className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/60"
    >
      <div className="max-w-md mx-auto px-4 pt-3 pb-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 grid place-items-center">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <div className="leading-tight">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                GDScript
              </div>
              <div className="text-base font-bold -mt-0.5">Quest</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Counter
              value={xp}
              icon={<Sparkles className="w-4 h-4" />}
              className="bg-primary/15 text-primary border border-primary/30"
              testId="counter-xp"
            />
            <Counter
              value={coins}
              icon={<Coins className="w-4 h-4" />}
              className="bg-warning/15 text-warning border border-warning/30"
              testId="counter-coins"
            />
            <a
              href={supportHref}
              data-testid="link-support-header"
              aria-label="Support Adwaith via UPI"
              className="w-9 h-9 grid place-items-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-rose-500/25 active:scale-95 transition"
            >
              <Heart className="w-4 h-4" fill="currentColor" />
            </a>
          </div>
        </div>

        <div className="mt-3">
          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
            <motion.div
              data-testid="progress-bar"
              initial={false}
              animate={{ width: `${Math.round(progress * 100)}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[11px] text-muted-foreground">
              {Math.round(progress * 100)}% complete
            </span>
            <span className="text-[11px] text-muted-foreground">
              Level {Math.floor(xp / 100) + 1}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
