import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Boxes,
  ChevronDown,
  Code2,
  GitBranch,
  Layers,
  MapPin,
  Search,
} from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav, type NavView } from "@/components/BottomNav";
import {
  nodeCategoryLabel,
  nodeDocs,
  type NodeCategory,
  type NodeDoc,
} from "@/data/nodes";
import { GdCode } from "@/lib/gd-highlight";
import { useGameState } from "@/hooks/useGameState";

interface Props {
  onNavigate: (view: NavView) => void;
}

const filters: { id: NodeCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "core", label: "Core" },
  { id: "2d", label: "2D" },
  { id: "physics", label: "Physics" },
  { id: "ui", label: "UI" },
];

export default function Nodes({ onNavigate }: Props) {
  const game = useGameState();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<NodeCategory | "all">("all");
  const [openName, setOpenName] = useState<string | null>(nodeDocs[0]?.name ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return nodeDocs.filter((n) => {
      if (category !== "all" && n.category !== category) return false;
      if (!q) return true;
      return (
        n.name.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.usage.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Header
        xp={game.state.xp}
        coins={game.state.coins}
        progress={game.overallProgress}
      />

      <main className="flex-1 max-w-md w-full mx-auto pb-32 pt-4 px-3">
        <HeroBanner />

        {/* Search */}
        <div className="mt-5 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search nodes…"
            data-testid="input-node-search"
            className="w-full pl-9 pr-3 py-3 rounded-2xl bg-card border border-border/60 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition"
          />
        </div>

        {/* Category chips */}
        <div className="mt-3 flex gap-2 overflow-x-auto -mx-3 px-3 pb-1">
          {filters.map((f) => {
            const active = category === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setCategory(f.id)}
                data-testid={`chip-${f.id}`}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border/60 hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Node list */}
        <div className="mt-4 space-y-3">
          {filtered.length === 0 && (
            <div className="text-center text-muted-foreground py-12 text-sm">
              No nodes match that search.
            </div>
          )}
          {filtered.map((node) => (
            <NodeCard
              key={node.name}
              node={node}
              open={openName === node.name}
              onToggle={() =>
                setOpenName((curr) => (curr === node.name ? null : node.name))
              }
            />
          ))}
        </div>
      </main>

      <BottomNav active="nodes" onNavigate={onNavigate} />
    </div>
  );
}

function HeroBanner() {
  return (
    <section
      data-testid="nodes-hero"
      className="relative overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/15 via-card to-primary/10 p-5"
    >
      <div className="absolute -top-10 -right-8 w-36 h-36 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent font-bold">
          <Boxes className="w-3.5 h-3.5" />
          Learn Nodes
        </div>
        <h1 className="text-2xl font-extrabold mt-1 leading-tight">
          The building blocks
          <br />
          of every Godot scene.
        </h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Tap a node to see what it does, where it's used, and a tiny example.
        </p>
      </div>
    </section>
  );
}

function NodeCard({
  node,
  open,
  onToggle,
}: {
  node: NodeDoc;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      data-testid={`node-card-${node.name}`}
      className={`rounded-2xl border transition overflow-hidden ${
        open
          ? "border-primary/50 bg-card/90 glow-primary"
          : "border-border/60 bg-card/60"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left active:scale-[.99] transition"
      >
        <CategoryIcon category={node.category} />
        <div className="flex-1 min-w-0">
          <div className="font-extrabold text-base leading-tight truncate">
            {node.name}
          </div>
          <div className="text-xs text-muted-foreground truncate mt-0.5">
            {node.description}
          </div>
        </div>
        <CategoryPill category={node.category} />
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="border-t border-border/60"
          >
            <div className="p-4 space-y-4">
              {node.parent && (
                <Field
                  icon={<GitBranch className="w-3.5 h-3.5" />}
                  label="Inherits from"
                  value={node.parent}
                />
              )}
              <Field
                icon={<MapPin className="w-3.5 h-3.5" />}
                label="Where it's used"
                value={node.usage}
              />
              <div>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-accent font-extrabold mb-1.5">
                  <Code2 className="w-3 h-3" />
                  Example
                </div>
                <div className="rounded-xl bg-[#272822] border border-border/60 overflow-hidden">
                  <pre className="px-3 py-3 text-[12.5px] font-mono leading-relaxed overflow-x-auto">
                    <GdCode code={node.example} />
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-0.5">
        {icon}
        {label}
      </div>
      <div className="text-sm text-foreground/90 leading-snug">{value}</div>
    </div>
  );
}

function CategoryIcon({ category }: { category: NodeCategory }) {
  const map: Record<NodeCategory, { bg: string; color: string }> = {
    core: { bg: "bg-primary/15", color: "text-primary" },
    "2d": { bg: "bg-accent/15", color: "text-accent" },
    physics: { bg: "bg-warning/15", color: "text-warning" },
    ui: { bg: "bg-pink-500/15", color: "text-pink-400" },
  };
  const m = map[category];
  return (
    <div
      className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 ${m.bg} ${m.color}`}
    >
      <Layers className="w-5 h-5" />
    </div>
  );
}

function CategoryPill({ category }: { category: NodeCategory }) {
  const map: Record<NodeCategory, string> = {
    core: "bg-primary/15 text-primary border-primary/30",
    "2d": "bg-accent/15 text-accent border-accent/30",
    physics: "bg-warning/15 text-warning border-warning/30",
    ui: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  };
  return (
    <span
      className={`hidden xs:inline-flex text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${map[category]}`}
    >
      {nodeCategoryLabel[category]}
    </span>
  );
}
