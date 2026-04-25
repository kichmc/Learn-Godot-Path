import { useState } from "react";
import Dashboard from "@/pages/Dashboard";
import Nodes from "@/pages/Nodes";
import Profile from "@/pages/Profile";
import type { NavView } from "@/components/BottomNav";

function App() {
  const [view, setView] = useState<NavView>("home");

  if (view === "nodes") return <Nodes onNavigate={setView} />;
  if (view === "profile") return <Profile onNavigate={setView} />;
  return <Dashboard onNavigate={setView} />;
}

export default App;
