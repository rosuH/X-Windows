"use client";

import clsx from "clsx";
import type { DecompileStage } from "../../datasets/types";
import type { SequenceStatus } from "./use-decompile-sequence";

interface TimelineScrubberProps {
  stages: DecompileStage[];
  progress: number;
  currentIndex: number;
  status: SequenceStatus;
  accent: "swift" | "android";
  prefersReducedMotion?: boolean;
  onSelectStage?: (index: number) => void;
  onSkip: () => void;
  onRestart: () => void;
}

export function TimelineScrubber({
  stages,
  progress,
  currentIndex,
  status,
  accent,
  prefersReducedMotion,
  onSelectStage,
  onSkip,
  onRestart,
}: TimelineScrubberProps) {
  const progressPercent = Math.min(Math.max(progress * 100, 0), 100);

  const accentBar =
    accent === "swift"
      ? "from-emerald-400 via-emerald-300 to-teal-200"
      : "from-sky-400 via-cyan-300 to-indigo-300";

  const stageLabel = (stage: DecompileStage) => {
    if ("title" in stage && stage.title) return stage.title;
    switch (stage.kind) {
      case "source":
        return "源代码";
      case "ast":
        return "AST";
      case "ir":
        return "IR";
      case "binary":
        return "反汇编";
      case "rev":
      default:
        return "逆向";
    }
  };

  const canReplay = status === "completed" || status === "skipped";

  return (
    <div className="flex flex-col gap-4 px-8 pb-8 pt-6">
      <div
        className="flex items-center justify-between uppercase text-slate-500"
        style={{ fontSize: "0.7rem", letterSpacing: "0.3em" }}
      >
        <span>Pipeline Progress</span>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onSkip}
            className="rounded-full border border-white/15 px-3 py-1 font-semibold uppercase text-slate-200 transition hover:border-white/35 hover:text-white"
            style={{ fontSize: "0.65rem" }}
          >
            Skip
          </button>
          <button
            type="button"
            onClick={canReplay ? onRestart : onSkip}
            className="rounded-full border border-white/15 px-3 py-1 font-semibold uppercase text-slate-200 transition hover:border-white/35 hover:text-white"
            style={{ fontSize: "0.65rem" }}
          >
            {canReplay ? "Replay" : "Fast Forward"}
          </button>
        </div>
      </div>
      <div className="relative flex h-14 items-center">
        <div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-full bg-slate-800/60"
          style={{ height: "6px" }}
        >
          <div
            className={clsx(
              "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r",
              accentBar
            )}
            style={{
              width: `${progressPercent}%`,
              transition: prefersReducedMotion ? "width 160ms linear" : "width 360ms ease",
            }}
          />
        </div>
        <div className="relative z-10 flex w-full items-center justify-between">
          {stages.map((stage, index) => {
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;
            return (
              <button
                key={`${stage.kind}-${index}`}
                type="button"
                onClick={() => onSelectStage?.(index)}
                className={clsx(
                  "group flex flex-col items-center gap-2 focus:outline-none",
                  onSelectStage ? "cursor-pointer" : "cursor-default"
                )}
                aria-label={`跳转到 ${stageLabel(stage)}`}
                aria-current={isActive ? "step" : undefined}
                aria-disabled={onSelectStage ? undefined : true}
              >
                <span
                  className={clsx(
                    "flex h-3 w-3 items-center justify-center rounded-full border-2",
                    accent === "swift"
                      ? isCompleted
                        ? "border-emerald-300 bg-emerald-300/70"
                        : "border-emerald-200/60"
                      : isCompleted
                      ? "border-sky-300 bg-sky-300/70"
                      : "border-sky-200/50",
                    isActive && "scale-110"
                  )}
                  style={isActive ? { boxShadow: "0 0 12px rgba(90,220,255,0.75)" } : undefined}
                />
                <span
                  className={clsx(
                    "rounded-full px-3 py-1 font-medium uppercase",
                    isActive
                      ? accent === "swift"
                        ? "bg-emerald-500/10 text-emerald-200"
                        : "bg-sky-500/10 text-sky-200"
                      : "text-slate-500"
                  )}
                  style={{ fontSize: "0.65rem", letterSpacing: "0.2em" }}
                >
                  {stageLabel(stage)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

