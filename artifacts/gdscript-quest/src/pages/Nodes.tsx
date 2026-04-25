import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Boxes,
  ChevronRight,
  Code2,
  Eye,
  Flame,
  GitBranch,
  Layers,
  MapPin,
  Search,
  Sparkles,
  Star,
  Lightbulb,
} from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav, type NavView } from "@/components/BottomNav";
import {
  findCategory,
  findCategoryOf,
  nodeCategories,
  type NodeCategory,
  type NodeCategoryId,
  type NodeDoc,
} from "@/data/nodes";
import { GdCode } from "@/lib/gd-highlight";
import { useGameState } from "@/hooks/useGameState";
import { NodeDemo } from "@/components/nodes/NodeDemo";

interface Props {
  onNavigate: (view: NavView) => void;
  focusName?: string | null;
  onFocusConsumed?: () => void;
}

type View =
  | { kind: "categories" }
  | { kind: "category"; id: NodeCategoryId }
  | { kind: "node"; categoryId: NodeCategoryId; name: string };

export default function Nodes({
  onNavigate,
  focusName,
  onFocusConsumed,
}: Props) {
  const game = useGameState();
  const [view, setView] = useState<View>({ kind: "categories" });
  const [query, setQuery] = useState("");

  // Deep-link from a code block: jump straight into the node detail.
  useEffect(() => {
    if (!focusName) return;
    const cat = findCategoryOf(focusName);
    if (cat) {
      setView({ kind: "node", categoryId: cat.id, name: focusName });
      setQuery("");
    }
    onFocusConsumed?.();
  }, [focusName, onFocusConsumed]);

  // Search overrides the navigation stack and shows a flat list.
  const searchResults = useMemo<NodeDoc[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return nodeCategories
      .flatMap((c) => c.nodes)
      .filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q) ||
          n.use_case.toLowerCase().includes(q),
      );
  }, [query]);

  const goBack = () => {
    if (view.kind === "node") {
      setView({ kind: "category", id: view.categoryId });
    } else if (view.kind === "category") {
      setView({ kind: "categories" });
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Header
        xp={game.state.xp}
        coins={game.state.coins}
        progress={game.overallProgress}
      />

      <main className="flex-1 max-w-md w-full mx-auto pb-32 pt-3 px-3">
        {/* Top bar — back button when nested */}
        <TopBar
          view={view}
          onBack={goBack}
          onHome={() => setView({ kind: "categories" })}
        />

        {/* Search (always visible) */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any node…"
            data-testid="input-node-search"
            className="w-full pl-9 pr-3 py-3 rounded-2xl bg-card border border-border/60 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition"
          />
        </div>

        <div className="mt-4">
          <AnimatePresence mode="wait">
            {query ? (
              <SearchView
                key="search"
                results={searchResults}
                query={query}
                onPick={(n) =>
                  setView({
                    kind: "node",
                    categoryId: n.category,
                    name: n.name,
                  })
                }
              />
            ) : view.kind === "categories" ? (
              <CategoriesView
                key="cats"
                onPick={(id) => setView({ kind: "category", id })}
              />
            ) : view.kind === "category" ? (
              <CategoryView
                key={`cat-${view.id}`}
                category={findCategory(view.id)!}
                onPick={(n) =>
                  setView({ kind: "node", categoryId: view.id, name: n.name })
                }
              />
            ) : (
              <NodeDetailView
                key={`node-${view.name}`}
                node={
                  findCategory(view.categoryId)!.nodes.find(
                    (n) => n.name === view.name,
                  )!
                }
                category={findCategory(view.categoryId)!}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      <BottomNav active="nodes" onNavigate={onNavigate} />
    </div>
  );
}

// =====================================================================
// TOP BAR
// =====================================================================

function TopBar({
  view,
  onBack,
  onHome,
}: {
  view: View;
  onBack: () => void;
  onHome: () => void;
}) {
  if (view.kind === "categories") {
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
            Pick a category, then tap a node to see what it does and how it's
            used.
          </p>
        </div>
      </section>
    );
  }

  // Breadcrumb-style bar with a back button
  let title = "";
  let subtitle = "";
  if (view.kind === "category") {
    const c = findCategory(view.id);
    title = c?.title ?? "";
    subtitle = c?.description ?? "";
  } else {
    const c = findCategory(view.categoryId);
    title = view.name;
    subtitle = c?.title ?? "";
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onBack}
        data-testid="button-nodes-back"
        className="w-10 h-10 grid place-items-center rounded-xl bg-card border border-border/60 active:scale-95 transition shrink-0"
        aria-label="Back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-accent font-bold flex items-center gap-1">
          <button
            type="button"
            onClick={onHome}
            className="hover:text-foreground transition"
          >
            Nodes
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="truncate">{subtitle}</span>
        </div>
        <div className="text-xl font-extrabold truncate leading-tight mt-0.5">
          {title}
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// CATEGORIES VIEW — list of categories
// =====================================================================

function CategoriesView({
  onPick,
}: {
  onPick: (id: NodeCategoryId) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-bold mt-4 mb-1">
        <Layers className="w-3.5 h-3.5" />
        Categories
      </div>
      {nodeCategories.map((c) => {
        const importantCount = c.nodes.filter((n) => n.important).length;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onPick(c.id)}
            data-testid={`category-${c.id}`}
            className="w-full text-left rounded-2xl p-4 border border-border/60 bg-card/60 hover:bg-card hover:border-primary/40 active:scale-[.99] transition flex items-start gap-3"
          >
            <CategoryIcon id={c.id} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="font-extrabold text-base truncate">
                  {c.title}
                </div>
                {importantCount > 0 && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-warning bg-warning/15 border border-warning/30 px-1.5 py-0.5 rounded-full">
                    <Star className="w-2.5 h-2.5" fill="currentColor" />
                    {importantCount}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {c.description}
              </div>
              <div className="text-[11px] text-muted-foreground/70 mt-1.5 font-medium">
                {c.nodes.length} node{c.nodes.length === 1 ? "" : "s"}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground self-center shrink-0" />
          </button>
        );
      })}
    </motion.div>
  );
}

// =====================================================================
// CATEGORY VIEW — list of nodes inside a category
// =====================================================================

function CategoryView({
  category,
  onPick,
}: {
  category: NodeCategory;
  onPick: (n: NodeDoc) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.2 }}
      className="space-y-2.5 mt-4"
    >
      {category.nodes.map((n) => (
        <button
          key={n.name}
          type="button"
          onClick={() => onPick(n)}
          data-testid={`node-row-${n.name}`}
          className="w-full text-left rounded-2xl p-3.5 border border-border/60 bg-card/60 hover:border-primary/40 active:scale-[.99] transition flex items-start gap-3"
        >
          <CategoryIcon id={n.category} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <div className="font-extrabold text-sm truncate">{n.name}</div>
              {n.important && (
                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-warning bg-warning/15 border border-warning/30 px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                  <Flame className="w-2.5 h-2.5" />
                  Key
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
              {n.description}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground self-center shrink-0" />
        </button>
      ))}
    </motion.div>
  );
}

// =====================================================================
// SEARCH VIEW — flat list of matches
// =====================================================================

function SearchView({
  results,
  query,
  onPick,
}: {
  results: NodeDoc[];
  query: string;
  onPick: (n: NodeDoc) => void;
}) {
  if (!results.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center text-muted-foreground py-12 text-sm"
      >
        No nodes match "{query}".
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-2.5 mt-2"
    >
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold mb-1">
        {results.length} result{results.length === 1 ? "" : "s"}
      </div>
      {results.map((n) => (
        <button
          key={n.name}
          type="button"
          onClick={() => onPick(n)}
          data-testid={`search-result-${n.name}`}
          className="w-full text-left rounded-2xl p-3.5 border border-border/60 bg-card/60 hover:border-primary/40 active:scale-[.99] transition flex items-start gap-3"
        >
          <CategoryIcon id={n.category} />
          <div className="flex-1 min-w-0">
            <div className="font-extrabold text-sm truncate">{n.name}</div>
            <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
              {n.description}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground self-center shrink-0" />
        </button>
      ))}
    </motion.div>
  );
}

// =====================================================================
// NODE DETAIL VIEW
// =====================================================================

function NodeDetailView({
  node,
  category,
}: {
  node: NodeDoc;
  category: NodeCategory;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.2 }}
      className="space-y-4 mt-4"
    >
      {/* Hero */}
      <div className="rounded-3xl p-5 border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-accent/10">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-accent">
          <Sparkles className="w-3 h-3" />
          {category.title}
        </div>
        <div className="mt-1 flex items-center gap-2 flex-wrap">
          <h2 className="text-2xl font-extrabold leading-tight">{node.name}</h2>
          {node.important && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-warning bg-warning/15 border border-warning/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
              <Flame className="w-3 h-3" />
              Most important
            </span>
          )}
        </div>
        <p className="text-sm text-foreground/85 mt-2 leading-relaxed">
          {node.description}
        </p>
      </div>

      {/* Visual hint */}
      <Field
        icon={<Eye className="w-3.5 h-3.5" />}
        label="What it looks like"
        tone="accent"
      >
        <div className="rounded-2xl px-4 py-3 bg-accent/10 border border-accent/30 text-sm text-foreground/90 leading-snug">
          {node.visual_hint}
        </div>
      </Field>

      {/* Interactive demo */}
      {node.demo && (
        <Field
          icon={<Sparkles className="w-3.5 h-3.5" />}
          label="Try it — interactive demo"
          tone="accent"
        >
          <NodeDemo spec={node.demo} nodeName={node.name} />
        </Field>
      )}

      {/* Use case */}
      <Field
        icon={<MapPin className="w-3.5 h-3.5" />}
        label="Where it's used"
      >
        <div className="text-sm text-foreground/90 leading-snug">
          {node.use_case}
        </div>
      </Field>

      {/* Where used in real games */}
      {node.where_used && node.where_used.length > 0 && (
        <Field
          icon={<Lightbulb className="w-3.5 h-3.5" />}
          label="Real game examples"
        >
          <div className="flex flex-wrap gap-1.5">
            {node.where_used.map((u) => (
              <span
                key={u}
                className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary"
              >
                {u}
              </span>
            ))}
          </div>
        </Field>
      )}

      {/* Inheritance */}
      {node.parent && (
        <Field
          icon={<GitBranch className="w-3.5 h-3.5" />}
          label="Inherits from"
        >
          <div className="text-sm font-mono text-foreground/90">
            {node.parent}
          </div>
        </Field>
      )}

      {/* Example */}
      <Field
        icon={<Code2 className="w-3.5 h-3.5" />}
        label="Example"
        tone="accent"
      >
        <div className="rounded-2xl bg-[#272822] border border-border/60 overflow-hidden">
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            <span className="ml-2 text-[11px] text-white/40 font-mono">
              {node.name}.gd
            </span>
          </div>
          <pre className="px-3 py-3 text-[12.5px] font-mono leading-relaxed overflow-x-auto">
            <GdCode code={node.example} />
          </pre>
        </div>
      </Field>
    </motion.div>
  );
}

// =====================================================================
// SHARED bits
// =====================================================================

function Field({
  icon,
  label,
  tone,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  tone?: "accent";
  children: React.ReactNode;
}) {
  const labelColor = tone === "accent" ? "text-accent" : "text-muted-foreground";
  return (
    <div>
      <div
        className={`flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-extrabold mb-1.5 ${labelColor}`}
      >
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}

function CategoryIcon({
  id,
  size = "md",
}: {
  id: NodeCategoryId;
  size?: "md" | "lg";
}) {
  const map: Record<NodeCategoryId, { bg: string; color: string }> = {
    base: { bg: "bg-secondary", color: "text-foreground/70" },
    "2d": { bg: "bg-accent/15", color: "text-accent" },
    ui: { bg: "bg-pink-500/15", color: "text-pink-400" },
    "3d": { bg: "bg-purple-500/15", color: "text-purple-400" },
    audio: { bg: "bg-blue-500/15", color: "text-blue-400" },
    anim: { bg: "bg-warning/15", color: "text-warning" },
    logic: { bg: "bg-primary/15", color: "text-primary" },
    nav: { bg: "bg-emerald-500/15", color: "text-emerald-400" },
    special: { bg: "bg-rose-500/15", color: "text-rose-400" },
  };
  const m = map[id];
  const s = size === "lg" ? "w-12 h-12" : "w-10 h-10";
  const ic = size === "lg" ? "w-6 h-6" : "w-5 h-5";
  return (
    <div
      className={`${s} rounded-xl grid place-items-center shrink-0 ${m.bg} ${m.color}`}
    >
      <Layers className={ic} />
    </div>
  );
}
