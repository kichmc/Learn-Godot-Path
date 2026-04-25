import { Home, Boxes, User, Heart } from "lucide-react";

export type NavView = "home" | "nodes" | "profile";

interface Props {
  active?: NavView;
  onNavigate?: (view: NavView) => void;
}

export function BottomNav({ active = "home", onNavigate }: Props) {
  const supportHref = "upi://pay?pa=YOUR_UPI_ID@okaxis&pn=Adwaith";
  return (
    <nav
      data-testid="bottom-nav"
      className="fixed bottom-0 inset-x-0 z-30 backdrop-blur-xl bg-background/80 border-t border-border/60"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="max-w-md mx-auto px-3 py-2 flex items-center gap-2">
        <NavItem
          icon={<Home className="w-5 h-5" />}
          label="Home"
          active={active === "home"}
          onClick={() => onNavigate?.("home")}
          testid="nav-home"
        />
        <NavItem
          icon={<Boxes className="w-5 h-5" />}
          label="Nodes"
          active={active === "nodes"}
          onClick={() => onNavigate?.("nodes")}
          testid="nav-nodes"
        />
        <NavItem
          icon={<User className="w-5 h-5" />}
          label="Profile"
          active={active === "profile"}
          onClick={() => onNavigate?.("profile")}
          testid="nav-profile"
        />
        <a
          href={supportHref}
          data-testid="link-support-bottom"
          className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white text-sm font-semibold shadow-lg shadow-rose-500/30 active:scale-95 transition-transform"
        >
          <Heart className="w-4 h-4" fill="currentColor" />
          Support Me
        </a>
      </div>
    </nav>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  onClick,
  testid,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  testid?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testid}
      className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition active:scale-95 ${
        active
          ? "text-primary bg-primary/10"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
