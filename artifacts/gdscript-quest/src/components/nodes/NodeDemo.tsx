import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pause,
  Play,
  RefreshCw,
  Sparkles,
  StepForward,
  Hand,
  TerminalSquare,
  Lightbulb,
} from "lucide-react";
import type { NodeDemoSpec } from "@/data/nodes";

interface Props {
  spec: NodeDemoSpec;
  nodeName: string;
}

interface StageProps {
  playing: boolean;
  stepKey: number;
  resetKey: number;
  onLog: (msg: string) => void;
}

// =====================================================================
// NodeDemo wrapper — chrome (desc, controls, log, tip)
// =====================================================================

export function NodeDemo({ spec, nodeName }: Props) {
  const [playing, setPlaying] = useState(false);
  const [stepKey, setStepKey] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const onLog = useCallback((msg: string) => {
    setLogs((curr) => [...curr.slice(-2), msg]);
  }, []);

  const handleReset = () => {
    setPlaying(false);
    setLogs([]);
    setResetKey((k) => k + 1);
  };

  const stage = useMemo(() => {
    const props: StageProps = { playing, stepKey, resetKey, onLog };
    switch (spec.kind) {
      case "character_body":
        return <CharacterBodyStage {...props} />;
      case "area2d":
        return <Area2DStage {...props} />;
      case "button":
        return <ButtonStage {...props} />;
      case "camera2d":
        return <Camera2DStage {...props} />;
      case "collision_shape":
        return <CollisionShapeStage {...props} />;
    }
  }, [spec.kind, playing, stepKey, resetKey, onLog]);

  const showPlay = spec.controls.includes("play");
  const showStep = spec.controls.includes("step");
  const showTouch = spec.controls.includes("touch");

  return (
    <div data-testid={`node-demo-${nodeName}`} className="space-y-3">
      {/* Description */}
      <div className="text-sm text-foreground/85 leading-snug">
        {spec.description}
      </div>

      {/* Stage */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-secondary/40 to-card overflow-hidden">
        <div className="relative w-full h-36 overflow-hidden">{stage}</div>

        {/* Controls bar */}
        <div className="flex items-center gap-2 px-3 py-2 border-t border-border/60 bg-background/60 backdrop-blur">
          {showPlay && (
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              data-testid="demo-play"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold active:scale-95 transition ${
                playing
                  ? "bg-warning/20 text-warning border border-warning/40"
                  : "bg-primary text-primary-foreground glow-primary"
              }`}
            >
              {playing ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" fill="currentColor" />
              )}
              {playing ? "Pause" : "Play"}
            </button>
          )}
          {showStep && (
            <button
              type="button"
              onClick={() => setStepKey((k) => k + 1)}
              data-testid="demo-step"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-foreground/80 text-xs font-bold hover:bg-secondary/80 active:scale-95 transition"
            >
              <StepForward className="w-3.5 h-3.5" />
              Step
            </button>
          )}
          <button
            type="button"
            onClick={handleReset}
            data-testid="demo-reset"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-foreground/80 text-xs font-bold hover:bg-secondary/80 active:scale-95 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
          {showTouch && (
            <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-muted-foreground font-bold">
              <Hand className="w-3 h-3" />
              Touch enabled
            </span>
          )}
        </div>
      </div>

      {/* Event log */}
      <div className="rounded-2xl border border-border/60 bg-[#10131c] px-3 py-2.5 min-h-[64px]">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-accent font-extrabold mb-1">
          <TerminalSquare className="w-3 h-3" />
          Event log
        </div>
        <div className="font-mono text-[11.5px] text-foreground/85 leading-relaxed">
          {logs.length === 0 ? (
            <span className="text-muted-foreground italic">
              (Press Play or interact with the stage…)
            </span>
          ) : (
            <AnimatePresence initial={false}>
              {logs.map((l, i) => (
                <motion.div
                  key={`${l}-${i}-${logs.length}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="truncate"
                >
                  <span className="text-muted-foreground">›</span> {l}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Behavior + elements + teaching tip */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-3.5 space-y-2.5">
        <Row label="Behavior" body={spec.behavior} />
        <Row
          label="On stage"
          body={spec.elements.map((e) => `• ${e}`).join("  ")}
        />
      </div>

      <div className="rounded-2xl bg-warning/10 border border-warning/30 px-4 py-3 flex items-start gap-2.5">
        <Lightbulb className="w-4 h-4 text-warning shrink-0 mt-0.5" />
        <div>
          <div className="text-[10px] uppercase tracking-widest text-warning font-extrabold">
            Takeaway
          </div>
          <div className="text-sm text-foreground/90 leading-snug mt-0.5">
            {spec.teaching_tip}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
        {label}
      </div>
      <div className="text-xs text-foreground/85 leading-snug mt-0.5">
        {body}
      </div>
    </div>
  );
}

// =====================================================================
// SHARED helpers — animation loop driven by `playing` + step + reset
// =====================================================================

function useTickLoop({
  playing,
  stepKey,
  resetKey,
  onTick,
  onStep,
  onReset,
}: {
  playing: boolean;
  stepKey: number;
  resetKey: number;
  onTick: (dt: number) => void;
  onStep: () => void;
  onReset: () => void;
}) {
  // Continuous tick loop while playing
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      onTick(dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, onTick]);

  // Manual step
  const firstStepRef = useRef(true);
  useEffect(() => {
    if (firstStepRef.current) {
      firstStepRef.current = false;
      return;
    }
    onStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepKey]);

  // Reset
  const firstResetRef = useRef(true);
  useEffect(() => {
    if (firstResetRef.current) {
      firstResetRef.current = false;
      return;
    }
    onReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);
}

// =====================================================================
// 1) CharacterBody2D — slide left/right, bounce off walls
// =====================================================================

function CharacterBodyStage({ playing, stepKey, resetKey, onLog }: StageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(8); // percent from left
  const [dir, setDir] = useState<1 | -1>(1);
  const SPEED = 28; // percent per second
  const MIN = 6;
  const MAX = 88;

  useTickLoop({
    playing,
    stepKey,
    resetKey,
    onTick: (dt) => {
      setPos((p) => {
        let next = p + dir * SPEED * dt;
        if (next > MAX) {
          next = MAX;
          setDir(-1);
          onLog("hit wall — flip direction");
        } else if (next < MIN) {
          next = MIN;
          setDir(1);
          onLog("hit wall — flip direction");
        }
        return next;
      });
    },
    onStep: () => {
      setPos((p) => Math.max(MIN, Math.min(MAX, p + dir * 5)));
      onLog(`step → velocity.x = ${dir * 80}`);
    },
    onReset: () => {
      setPos(8);
      setDir(1);
    },
  });

  const handleTap = (e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = stageRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newDir: 1 | -1 = x < rect.width / 2 ? -1 : 1;
    setDir(newDir);
    onLog(`tap → velocity.x = ${newDir * 80}`);
  };

  return (
    <div
      ref={stageRef}
      onPointerDown={handleTap}
      className="absolute inset-0 cursor-pointer touch-none select-none"
    >
      <SkyBackdrop />
      {/* Player */}
      <div
        className="absolute bottom-5 w-7 h-7 rounded-md bg-gradient-to-br from-rose-400 to-rose-600 shadow-lg shadow-rose-500/40 transition-transform"
        style={{
          left: `${pos}%`,
          transform: `translateX(-50%) scaleX(${dir === 1 ? 1 : -1})`,
        }}
      >
        <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-white/90" />
        <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-white/90" />
      </div>
      <Ground />
      <Readout>
        velocity.x = <span className="text-warning">{dir * 80}</span>
      </Readout>
    </div>
  );
}

// =====================================================================
// 2) Area2D — detection zone glows when player inside
// =====================================================================

function Area2DStage({ playing, stepKey, resetKey, onLog }: StageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(15);
  const [dir, setDir] = useState<1 | -1>(1);
  const wasInsideRef = useRef(false);
  const dragRef = useRef(false);
  const SPEED = 22;
  const MIN = 8;
  const MAX = 92;
  const ZONE_X = 50;
  const ZONE_RADIUS = 14;

  const isInside = Math.abs(pos - ZONE_X) <= ZONE_RADIUS;

  // Edge-detect enter/leave
  useEffect(() => {
    if (isInside && !wasInsideRef.current) {
      wasInsideRef.current = true;
      onLog("_on_body_entered(player)");
    } else if (!isInside && wasInsideRef.current) {
      wasInsideRef.current = false;
      onLog("_on_body_exited(player)");
    }
  }, [isInside, onLog]);

  useTickLoop({
    playing,
    stepKey,
    resetKey,
    onTick: (dt) => {
      if (dragRef.current) return;
      setPos((p) => {
        let next = p + dir * SPEED * dt;
        if (next > MAX) {
          next = MAX;
          setDir(-1);
        } else if (next < MIN) {
          next = MIN;
          setDir(1);
        }
        return next;
      });
    },
    onStep: () => {
      setPos((p) => Math.max(MIN, Math.min(MAX, p + dir * 6)));
    },
    onReset: () => {
      setPos(15);
      setDir(1);
      wasInsideRef.current = false;
    },
  });

  const updateFromPointer = (e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = stageRef.current!.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(MIN, Math.min(MAX, pct)));
  };
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    updateFromPointer(e);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current) updateFromPointer(e);
  };
  const onPointerUp = () => {
    dragRef.current = false;
  };

  return (
    <div
      ref={stageRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="absolute inset-0 cursor-pointer touch-none select-none"
    >
      <SkyBackdrop />
      {/* Detection zone */}
      <div
        className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed transition-colors duration-150 ${
          isInside
            ? "bg-emerald-400/40 border-emerald-300 shadow-[0_0_24px_rgba(74,222,128,0.6)]"
            : "bg-emerald-500/10 border-emerald-400/60"
        }`}
        style={{
          left: `${ZONE_X}%`,
          width: `${ZONE_RADIUS * 2}%`,
          aspectRatio: "1",
        }}
      />
      <div
        className="absolute top-1/2 -translate-y-[150%] -translate-x-1/2 text-[9px] font-bold text-emerald-300 uppercase tracking-wider whitespace-nowrap"
        style={{ left: `${ZONE_X}%` }}
      >
        Area2D
      </div>
      {/* Player */}
      <div
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-md bg-gradient-to-br from-rose-400 to-rose-600 shadow-lg shadow-rose-500/40"
        style={{ left: `${pos}%` }}
      />
      <Ground />
      <Readout>
        inside ={" "}
        <span className={isInside ? "text-emerald-300" : "text-muted-foreground"}>
          {String(isInside)}
        </span>
      </Readout>
    </div>
  );
}

// =====================================================================
// 3) Button — tap fires signal arrow → player jumps
// =====================================================================

function ButtonStage({ stepKey, resetKey, onLog }: StageProps) {
  const [pulse, setPulse] = useState(0);
  const [jump, setJump] = useState(0);
  const [count, setCount] = useState(0);

  const fire = () => {
    setPulse((n) => n + 1);
    setJump((n) => n + 1);
    setCount((c) => c + 1);
    onLog("pressed → _on_pressed()");
  };

  // Step fires a programmatic click
  useTickLoop({
    playing: false,
    stepKey,
    resetKey,
    onTick: () => {},
    onStep: () => fire(),
    onReset: () => {
      setPulse(0);
      setJump(0);
      setCount(0);
    },
  });

  return (
    <div className="absolute inset-0 select-none">
      <SkyBackdrop />
      {/* The Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          fire();
        }}
        data-testid="demo-button-target"
        className="absolute top-1/2 -translate-y-1/2 left-[10%] px-4 py-2.5 rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs font-extrabold shadow-lg active:scale-95 transition"
      >
        ▶ Start
      </button>

      {/* Signal arrow */}
      <AnimatePresence>
        {pulse > 0 && (
          <motion.div
            key={pulse}
            initial={{ left: "26%", opacity: 0 }}
            animate={{ left: "76%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute top-1/2 -translate-y-1/2 text-accent font-bold text-lg"
          >
            ─►
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player */}
      <motion.div
        animate={
          jump > 0
            ? { y: [0, -22, 0], scale: [1, 1.1, 1] }
            : { y: 0, scale: 1 }
        }
        key={jump}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="absolute top-1/2 -translate-y-1/2 right-[12%] w-7 h-7 rounded-md bg-gradient-to-br from-rose-400 to-rose-600 shadow-lg shadow-rose-500/40"
      >
        <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-white/90" />
        <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-white/90" />
      </motion.div>

      <Ground />
      <Readout>
        presses = <span className="text-warning">{count}</span>
      </Readout>
    </div>
  );
}

// =====================================================================
// 4) Camera2D — world scrolls so player stays centered
// =====================================================================

function Camera2DStage({ playing, stepKey, resetKey, onLog }: StageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef(false);
  // Player in WORLD coords (px). World is 600 wide.
  const WORLD = 600;
  const [worldX, setWorldX] = useState(80);
  const [camX, setCamX] = useState(80);
  const SPEED = 90;
  const stageWidthRef = useRef(320);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => {
      stageWidthRef.current = el.clientWidth || 320;
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  useTickLoop({
    playing,
    stepKey,
    resetKey,
    onTick: (dt) => {
      if (!dragRef.current) {
        setWorldX((x) => Math.min(WORLD - 40, x + SPEED * dt));
      }
      setCamX((c) => lerp(c, worldX, Math.min(1, dt * 4)));
    },
    onStep: () => {
      setWorldX((x) => {
        const next = Math.min(WORLD - 40, x + 30);
        setCamX(next);
        onLog(`player.x = ${Math.round(next)} → camera follows`);
        return next;
      });
    },
    onReset: () => {
      setWorldX(80);
      setCamX(80);
    },
  });

  const updateFromPointer = (e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = stageRef.current!.getBoundingClientRect();
    const stagePx = e.clientX - rect.left;
    // Convert from screen to world: screenX = worldX - camX + stageWidth/2
    const next = stagePx + camX - rect.width / 2;
    setWorldX(Math.max(20, Math.min(WORLD - 40, next)));
  };
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    updateFromPointer(e);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current) updateFromPointer(e);
  };
  const onPointerUp = () => {
    dragRef.current = false;
  };

  // Translate world relative to stage center
  const stageW = stageWidthRef.current;
  const offset = stageW / 2 - camX;

  return (
    <div
      ref={stageRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="absolute inset-0 cursor-pointer touch-none select-none overflow-hidden"
    >
      <SkyBackdrop />
      {/* Moving world layer */}
      <div
        className="absolute top-0 bottom-0 left-0"
        style={{
          width: `${WORLD}px`,
          transform: `translateX(${offset}px)`,
        }}
      >
        {/* Trees / scenery markers */}
        {[40, 140, 240, 340, 440, 540].map((tx) => (
          <div
            key={tx}
            className="absolute bottom-5 w-3 h-8 rounded-sm bg-emerald-700/80"
            style={{ left: `${tx}px` }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-emerald-500/90" />
          </div>
        ))}
        {/* Player in world */}
        <div
          className="absolute bottom-5 w-7 h-7 rounded-md bg-gradient-to-br from-rose-400 to-rose-600 shadow-lg shadow-rose-500/40"
          style={{ left: `${worldX}px`, transform: "translateX(-50%)" }}
        >
          <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-white/90" />
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-white/90" />
        </div>
      </div>
      {/* Camera frame indicator */}
      <div className="absolute inset-2 border-2 border-dashed border-accent/60 rounded-lg pointer-events-none" />
      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-accent uppercase tracking-wider">
        Camera2D
      </div>
      <Ground />
      <Readout>
        cam.x = <span className="text-warning">{Math.round(camX)}</span>
      </Readout>
    </div>
  );
}

// =====================================================================
// 5) CollisionShape2D — visible hitbox stops at walls
// =====================================================================

function CollisionShapeStage({ playing, stepKey, resetKey, onLog }: StageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(20);
  const [dir, setDir] = useState<1 | -1>(1);
  const [bumpKey, setBumpKey] = useState(0);
  const SPEED = 22;
  const MIN = 14;
  const MAX = 86;

  const advance = (delta: number, source: "auto" | "step" | "tap") => {
    setPos((p) => {
      let next = p + delta;
      if (next >= MAX) {
        next = MAX;
        if (dir === 1 || source !== "auto") {
          setBumpKey((b) => b + 1);
          onLog("hitbox touched right wall — STOP");
          if (source === "auto") setDir(-1);
        }
      } else if (next <= MIN) {
        next = MIN;
        if (dir === -1 || source !== "auto") {
          setBumpKey((b) => b + 1);
          onLog("hitbox touched left wall — STOP");
          if (source === "auto") setDir(1);
        }
      }
      return next;
    });
  };

  useTickLoop({
    playing,
    stepKey,
    resetKey,
    onTick: (dt) => advance(dir * SPEED * dt, "auto"),
    onStep: () => advance(dir * 6, "step"),
    onReset: () => {
      setPos(20);
      setDir(1);
      setBumpKey(0);
    },
  });

  const handleTap = (e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = stageRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const tapDir: 1 | -1 = x < rect.width / 2 ? -1 : 1;
    setDir(tapDir);
    advance(tapDir * 8, "tap");
  };

  return (
    <div
      ref={stageRef}
      onPointerDown={handleTap}
      className="absolute inset-0 cursor-pointer touch-none select-none"
    >
      <SkyBackdrop />
      {/* Walls */}
      <div className="absolute left-[5%] top-3 bottom-5 w-2 rounded bg-gradient-to-b from-zinc-500 to-zinc-700 shadow-md" />
      <div className="absolute right-[5%] top-3 bottom-5 w-2 rounded bg-gradient-to-b from-zinc-500 to-zinc-700 shadow-md" />

      {/* Player + hitbox */}
      <div
        className="absolute bottom-5 -translate-x-1/2"
        style={{ left: `${pos}%` }}
      >
        {/* Hitbox outline (CollisionShape2D) */}
        <motion.div
          key={bumpKey}
          animate={
            bumpKey > 0
              ? { boxShadow: ["0 0 0 0 rgba(248,113,113,0)", "0 0 0 6px rgba(248,113,113,0.45)", "0 0 0 0 rgba(248,113,113,0)"] }
              : {}
          }
          transition={{ duration: 0.45 }}
          className="absolute -inset-1.5 rounded-md border-2 border-dashed border-cyan-300/80"
        />
        {/* Player sprite */}
        <div className="relative w-7 h-7 rounded-md bg-gradient-to-br from-rose-400 to-rose-600 shadow-lg shadow-rose-500/40">
          <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-white/90" />
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-white/90" />
        </div>
      </div>

      <Ground />
      <Readout>
        shape = <span className="text-cyan-300">RectangleShape2D</span>
      </Readout>
    </div>
  );
}

// =====================================================================
// SHARED stage primitives
// =====================================================================

function SkyBackdrop() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-slate-900/20 to-emerald-900/30" />
      <Sparkles className="absolute top-2 right-2 w-3 h-3 text-white/20" />
    </>
  );
}

function Ground() {
  return (
    <div className="absolute left-0 right-0 bottom-0 h-4 bg-gradient-to-t from-emerald-900/80 to-emerald-700/40 border-t border-emerald-400/30" />
  );
}

function Readout({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute top-1.5 left-2 px-1.5 py-0.5 rounded bg-black/40 backdrop-blur text-[10px] font-mono text-foreground/90">
      {children}
    </div>
  );
}
