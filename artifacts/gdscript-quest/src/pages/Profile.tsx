import { Award, Coins, Flame, Trophy, Zap } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav, type NavView } from "@/components/BottomNav";
import { useGameState } from "@/hooks/useGameState";
import { curriculum } from "@/data/curriculum";

interface Props {
  onNavigate: (view: NavView) => void;
}

export default function Profile({ onNavigate }: Props) {
  const game = useGameState();

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Header
        xp={game.state.xp}
        coins={game.state.coins}
        progress={game.overallProgress}
      />

      <main className="flex-1 max-w-md w-full mx-auto pb-32 pt-4 px-3">
        <section className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-accent/10 p-6 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-2xl font-extrabold text-primary-foreground glow-primary">
            A
          </div>
          <div className="mt-3 text-xl font-extrabold">Adwaith</div>
          <div className="text-xs text-muted-foreground">
            GDScript Quest learner
          </div>
        </section>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <StatCard
            icon={<Zap className="w-4 h-4" />}
            value={game.state.xp}
            label="XP earned"
            color="text-warning"
            bg="bg-warning/10"
            border="border-warning/30"
          />
          <StatCard
            icon={<Coins className="w-4 h-4" />}
            value={game.state.coins}
            label="Coins"
            color="text-accent"
            bg="bg-accent/10"
            border="border-accent/30"
          />
          <StatCard
            icon={<Trophy className="w-4 h-4" />}
            value={game.lessonsDone}
            total={game.totalLessonsCount}
            label="Lessons done"
            color="text-primary"
            bg="bg-primary/10"
            border="border-primary/30"
          />
          <StatCard
            icon={<Flame className="w-4 h-4" />}
            value={game.chaptersDone}
            total={game.totalChaptersCount}
            label="Chapters done"
            color="text-pink-400"
            bg="bg-pink-500/10"
            border="border-pink-500/30"
          />
        </div>

        <section className="mt-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent font-bold mb-3">
            <Award className="w-3.5 h-3.5" />
            Chapters
          </div>
          <div className="space-y-2">
            {curriculum.map((c) => {
              const done = game.isChapterComplete(c.id);
              const cp = game.getChapterProgress(c.id);
              const progress = cp.total
                ? Math.round((cp.done / cp.total) * 100)
                : 0;
              return (
                <div
                  key={c.id}
                  data-testid={`profile-chapter-${c.id}`}
                  className={`rounded-2xl p-3 border ${
                    done
                      ? "border-primary/40 bg-primary/5"
                      : "border-border/60 bg-card/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-bold text-sm truncate">{c.title}</div>
                    <div
                      className={`text-[11px] font-bold ${
                        done ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {progress}%
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <BottomNav active="profile" onNavigate={onNavigate} />
    </div>
  );
}

function StatCard({
  icon,
  value,
  total,
  label,
  color,
  bg,
  border,
}: {
  icon: React.ReactNode;
  value: number;
  total?: number;
  label: string;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <div className={`rounded-2xl p-4 border ${bg} ${border}`}>
      <div className={`flex items-center gap-1.5 ${color}`}>
        {icon}
        <span className="text-[10px] uppercase tracking-widest font-bold">
          {label}
        </span>
      </div>
      <div className={`mt-1 text-2xl font-extrabold tabular-nums ${color}`}>
        {value}
        {total != null && (
          <span className="text-muted-foreground font-normal text-base">
            /{total}
          </span>
        )}
      </div>
    </div>
  );
}
