import { motion } from "framer-motion";
import { ArrowLeft, Lock, Check, Play, BookOpen } from "lucide-react";
import type { Chapter, Lesson } from "@/data/curriculum";

interface Props {
  chapter: Chapter;
  chapterIndex: number;
  isLessonUnlocked: (lessonId: string) => boolean;
  isLessonComplete: (lessonId: string) => boolean;
  getLessonStepsDone: (lessonId: string) => number;
  onBack: () => void;
  onOpenLesson: (lesson: Lesson) => void;
}

export function ChapterScreen({
  chapter,
  chapterIndex,
  isLessonUnlocked,
  isLessonComplete,
  getLessonStepsDone,
  onBack,
  onOpenLesson,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 bg-background"
      data-testid={`chapter-screen-${chapter.id}`}
    >
      <div className="flex flex-col h-[100dvh] max-w-md mx-auto">
        {/* Header */}
        <div className="px-4 pt-3 pb-4 border-b border-border/60 flex items-start gap-3">
          <button
            type="button"
            onClick={onBack}
            data-testid="button-back-chapter"
            className="w-9 h-9 grid place-items-center rounded-xl hover:bg-secondary transition shrink-0"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] uppercase tracking-widest text-accent font-bold">
              Chapter {chapterIndex + 1}
            </div>
            <h1 className="text-2xl font-extrabold leading-tight truncate">
              {chapter.title}
            </h1>
            <div className="text-xs text-muted-foreground mt-0.5">
              {chapter.description}
            </div>
          </div>
        </div>

        {/* Lessons */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
          {chapter.lessons.map((lesson, i) => {
            const unlocked = isLessonUnlocked(lesson.id);
            const completed = isLessonComplete(lesson.id);
            const stepsDone = getLessonStepsDone(lesson.id);
            const total = lesson.steps.length;
            return (
              <button
                key={lesson.id}
                type="button"
                disabled={!unlocked}
                onClick={() => onOpenLesson(lesson)}
                data-testid={`lesson-card-${lesson.id}`}
                className={`w-full text-left rounded-2xl border p-4 flex items-center gap-3 transition active:scale-[.99]
                  ${
                    completed
                      ? "border-success/40 bg-success/5"
                      : unlocked
                        ? "border-primary/30 bg-card hover:border-primary/60"
                        : "border-border/60 bg-card/50 opacity-60 cursor-not-allowed"
                  }
                `}
              >
                <div
                  className={`w-12 h-12 rounded-xl grid place-items-center shrink-0 font-extrabold text-lg
                    ${
                      completed
                        ? "bg-success/15 text-success"
                        : unlocked
                          ? "bg-gradient-to-br from-primary to-accent text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                    }
                  `}
                >
                  {completed ? (
                    <Check className="w-6 h-6" strokeWidth={3} />
                  ) : unlocked ? (
                    <Play className="w-5 h-5" fill="currentColor" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                    Lesson {i + 1}
                  </div>
                  <div className="font-bold leading-tight truncate">
                    {lesson.title}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {lesson.subtitle}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full ${
                          completed
                            ? "bg-success"
                            : "bg-gradient-to-r from-primary to-accent"
                        }`}
                        style={{
                          width: `${total ? (stepsDone / total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <div className="text-[11px] text-muted-foreground tabular-nums shrink-0">
                      {stepsDone}/{total}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
          <div className="pt-3 text-center text-[11px] text-muted-foreground inline-flex items-center gap-1.5 justify-center w-full">
            <BookOpen className="w-3 h-3" />
            {chapter.lessons.length} lessons in this chapter
          </div>
        </div>
      </div>
    </motion.div>
  );
}
