import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  Play,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { SimulationSpec } from "@/data/curriculum";

interface Props {
  spec: SimulationSpec;
}

// A small responsive stage that visually simulates GDScript concepts.
export function VisualSimulation({ spec }: Props) {
  const [runId, setRunId] = useState(0);
  const [autoPlayed, setAutoPlayed] = useState(false);

  useEffect(() => {
    if (autoPlayed) return;
    const t = setTimeout(() => setRunId((n) => n + 1), 350);
    setAutoPlayed(true);
    return () => clearTimeout(t);
  }, [autoPlayed]);

  const replay = () => setRunId((n) => n + 1);

  return (
    <div
      className="relative w-full rounded-2xl border border-border/60 bg-gradient-to-b from-secondary/40 to-card overflow-hidden"
      data-testid="visual-simulation"
    >
      <div className="aspect-[4/3] sm:aspect-[16/10] relative">
        <Stage spec={spec} runId={runId} />
      </div>
      <div className="flex items-center justify-between px-3 py-2 border-t border-border/60 bg-background/60 backdrop-blur">
        <div className="text-xs text-muted-foreground">
          {spec.caption ?? "Simulation"}
        </div>
        <button
          type="button"
          onClick={replay}
          data-testid="button-replay-sim"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-secondary text-foreground/80 text-xs font-semibold active:scale-95 transition hover:bg-secondary/80"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Replay
        </button>
      </div>
    </div>
  );
}

function Stage({ spec, runId }: { spec: SimulationSpec; runId: number }) {
  switch (spec.kind) {
    case "move":
      return <MoveStage spec={spec} key={runId} />;
    case "jump":
      return <JumpStage key={runId} />;
    case "gravity":
      return <GravityStage key={runId} />;
    case "signal":
      return <SignalStage key={runId} />;
    case "input":
      return <InputStage spec={spec} key={runId} />;
    case "collision":
      return <CollisionStage key={runId} />;
    case "score":
      return <ScoreStage spec={spec} key={runId} />;
    case "chase":
      return <ChaseStage key={runId} />;
    default:
      return null;
  }
}

// ---------- Reusable bits ----------

function Player({ size = 36, color = "bg-primary" }: { size?: number; color?: string }) {
  return (
    <div
      className={`rounded-xl ${color} grid place-items-center text-primary-foreground font-bold shadow-lg`}
      style={{ width: size, height: size }}
    >
      <div className="flex gap-1">
        <span className="block w-1 h-1 rounded-full bg-white/90" />
        <span className="block w-1 h-1 rounded-full bg-white/90" />
      </div>
    </div>
  );
}

function Floor() {
  return (
    <div className="absolute inset-x-3 bottom-3 h-3 rounded-full bg-foreground/10" />
  );
}

// ---------- Stages ----------

function MoveStage({ spec }: { spec: SimulationSpec }) {
  const dir = spec.direction ?? "right";
  const distance = 110;
  const offset = {
    right: { x: distance, y: 0 },
    left: { x: -distance, y: 0 },
    up: { x: 0, y: -distance },
    down: { x: 0, y: distance },
  }[dir];

  const Arrow =
    dir === "right" ? ArrowRight : dir === "left" ? ArrowLeft : dir === "up" ? ArrowUp : ArrowDown;

  return (
    <div className="absolute inset-0">
      <Floor />
      <motion.div
        className="absolute"
        style={{ left: "50%", top: "50%" }}
        initial={{ x: -18, y: -18 }}
        animate={{ x: offset.x - 18, y: offset.y - 18 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <Player />
      </motion.div>
      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/70 border border-border/60 text-xs">
        <Arrow className="w-3.5 h-3.5 text-accent" />
        Vector2 motion
      </div>
    </div>
  );
}

function JumpStage() {
  return (
    <div className="absolute inset-0">
      <Floor />
      <motion.div
        className="absolute"
        style={{ left: "50%", bottom: 12 }}
        initial={{ x: -18, y: 0 }}
        animate={{ y: [0, -120, -160, -120, 0] }}
        transition={{ duration: 1.6, ease: "easeOut", times: [0, 0.4, 0.5, 0.6, 1] }}
      >
        <Player />
      </motion.div>
      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/70 border border-border/60 text-xs">
        <ArrowUp className="w-3.5 h-3.5 text-accent" />
        velocity.y = -300
      </div>
    </div>
  );
}

function GravityStage() {
  return (
    <div className="absolute inset-0">
      {/* No floor — falls off */}
      <motion.div
        className="absolute"
        style={{ left: "50%" }}
        initial={{ x: -18, y: 12 }}
        animate={{ y: 240 }}
        transition={{ duration: 1.6, ease: [0.4, 0, 1, 1] }}
      >
        <Player />
      </motion.div>
      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/70 border border-border/60 text-xs">
        <ArrowDown className="w-3.5 h-3.5 text-warning" />
        gravity * delta
      </div>
    </div>
  );
}

function SignalStage() {
  return (
    <div className="absolute inset-0 grid grid-cols-2">
      {/* Button */}
      <div className="relative grid place-items-center">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 0.85, 1] }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="px-3 py-1.5 rounded-xl bg-accent text-accent-foreground font-bold shadow-lg"
        >
          Button
        </motion.div>
      </div>
      {/* Player */}
      <div className="relative grid place-items-center">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 0.4, delay: 1.05 }}
        >
          <Player />
        </motion.div>
      </div>
      {/* Signal arrow */}
      <SignalArrow />
      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/70 border border-border/60 text-xs">
        <ArrowRight className="w-3.5 h-3.5 text-primary" />
        signal
      </div>
    </div>
  );
}

function SignalArrow() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 60"
      preserveAspectRatio="none"
    >
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-primary" />
        </marker>
      </defs>
      <motion.path
        d="M 28 30 Q 50 10 72 30"
        fill="none"
        className="stroke-primary"
        strokeWidth="1.2"
        strokeDasharray="3 3"
        markerEnd="url(#arrow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      />
    </svg>
  );
}

function InputStage({ spec }: { spec: SimulationSpec }) {
  const dir = spec.direction ?? "right";
  const offset = {
    right: { x: 90, y: 0 },
    left: { x: -90, y: 0 },
    up: { x: 0, y: -100 },
    down: { x: 0, y: 100 },
  }[dir];
  return (
    <div className="absolute inset-0">
      <Floor />
      <motion.div
        className="absolute left-6 top-6 w-14 h-14 rounded-2xl bg-background border-2 border-border grid place-items-center font-extrabold text-lg"
        initial={{ scale: 1, borderColor: "var(--border)" }}
        animate={{ scale: [1, 0.85, 1] }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {spec.fromKey ?? "→"}
      </motion.div>
      <motion.div
        className="absolute"
        style={{ left: "50%", top: "55%" }}
        initial={{ x: -18, y: -18 }}
        animate={{ x: offset.x - 18, y: offset.y - 18 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
      >
        <Player />
      </motion.div>
      <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/70 border border-border/60 text-xs">
        Input.is_action_pressed
      </div>
    </div>
  );
}

function CollisionStage() {
  return (
    <div className="absolute inset-0">
      <Floor />
      <motion.div
        className="absolute"
        style={{ left: "20%", bottom: 22 }}
        initial={{ x: 0 }}
        animate={{ x: [0, 70, 70] }}
        transition={{ duration: 1.4, times: [0, 0.7, 1], ease: "easeInOut" }}
      >
        <Player />
      </motion.div>
      <motion.div
        className="absolute"
        style={{ right: "20%", bottom: 22 }}
        initial={{ x: 0 }}
        animate={{ x: [0, -70, -70] }}
        transition={{ duration: 1.4, times: [0, 0.7, 1], ease: "easeInOut" }}
      >
        <div className="w-9 h-9 rounded-xl bg-destructive grid place-items-center text-destructive-foreground shadow-lg font-bold">
          E
        </div>
      </motion.div>
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-warning/20 border border-warning/40 text-warning text-xs font-bold"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.1, 1], opacity: [0, 1, 1] }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        BOOM
      </motion.div>
    </div>
  );
}

function ScoreStage({ spec }: { spec: SimulationSpec }) {
  const from = spec.fromValue ?? 0;
  const to = spec.toValue ?? 5;
  const [n, setN] = useState(from);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    setN(from);
    let i = from;
    ref.current = window.setInterval(() => {
      i += 1;
      setN(i);
      if (i >= to && ref.current) {
        clearInterval(ref.current);
      }
    }, 220);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [from, to]);

  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="text-center">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
          Score
        </div>
        <motion.div
          key={n}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="text-6xl font-extrabold text-warning tabular-nums"
        >
          {n}
        </motion.div>
        <div className="text-xs text-muted-foreground mt-2">score += 1</div>
      </div>
    </div>
  );
}

function ChaseStage() {
  return (
    <div className="absolute inset-0">
      <Floor />
      <motion.div
        className="absolute"
        style={{ left: "60%", bottom: 22 }}
        initial={{ x: 0 }}
        animate={{ x: [0, 30, 0, -30, 0] }}
        transition={{ duration: 2.4, repeat: 0, ease: "easeInOut" }}
      >
        <Player />
      </motion.div>
      <motion.div
        className="absolute"
        style={{ left: "10%", bottom: 22 }}
        initial={{ x: 0 }}
        animate={{ x: [0, 80, 100, 130, 150] }}
        transition={{ duration: 2.4, ease: "easeInOut" }}
      >
        <div className="w-9 h-9 rounded-xl bg-destructive grid place-items-center text-destructive-foreground shadow-lg font-bold">
          E
        </div>
      </motion.div>
      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/70 border border-border/60 text-xs">
        <Play className="w-3.5 h-3.5 text-destructive" fill="currentColor" />
        Enemy chases player
      </div>
    </div>
  );
}
