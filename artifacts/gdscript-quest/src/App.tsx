import { useCallback, useState } from "react";
import Dashboard from "@/pages/Dashboard";
import Nodes from "@/pages/Nodes";
import Profile from "@/pages/Profile";
import type { NavView } from "@/components/BottomNav";
import { NodeLinkProvider } from "@/lib/node-link";

function App() {
  const [view, setView] = useState<NavView>("home");
  const [focusNode, setFocusNode] = useState<string | null>(null);

  const handleOpenNode = useCallback((name: string) => {
    setFocusNode(name);
    setView("nodes");
  }, []);

  const handleNavigate = useCallback((next: NavView) => {
    setView(next);
    if (next !== "nodes") setFocusNode(null);
  }, []);

  return (
    <NodeLinkProvider onOpenNode={handleOpenNode}>
      {view === "nodes" ? (
        <Nodes
          onNavigate={handleNavigate}
          focusName={focusNode}
          onFocusConsumed={() => setFocusNode(null)}
        />
      ) : view === "profile" ? (
        <Profile onNavigate={handleNavigate} />
      ) : (
        <Dashboard onNavigate={handleNavigate} />
      )}
    </NodeLinkProvider>
  );
}

export default App;
