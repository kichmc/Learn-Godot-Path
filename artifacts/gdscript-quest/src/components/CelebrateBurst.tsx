import { motion } from "framer-motion";
import { useMemo } from "react";

export function CelebrateBurst({ show }: { show: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        angle: (Math.PI * 2 * i) / 18,
        dist: 60 + Math.random() * 40,
        color: ["#478CBF", "#22d3ee", "#facc15", "#34d399", "#f472b6"][i % 5],
      })),
    [],
  );
  if (!show) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
          animate={{
            x: Math.cos(p.angle) * p.dist,
            y: Math.sin(p.angle) * p.dist,
            opacity: 0,
            scale: 1,
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 w-2 h-2 rounded-sm"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}
