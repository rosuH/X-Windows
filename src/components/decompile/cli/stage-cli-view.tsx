"use client";

import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BinaryStage, IrStage, LineMapEntry } from "../../../datasets/types";
import { CliTypewriter } from "./cli-typewriter";

export interface StageCliViewProps {
  stage: IrStage | BinaryStage;
  command: string;
  activeMapEntry?: LineMapEntry;
  stageProgress: number;
  reducedMotion?: boolean;
}

const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

export function StageCliView({
  stage,
  command,
  activeMapEntry,
  stageProgress,
  reducedMotion = false,
}: StageCliViewProps) {
  const lines = useMemo(() => stage.code.split(/\r?\n/), [stage.code]);
  const [commandPrinted, setCommandPrinted] = useState(reducedMotion);
  const [visibleCount, setVisibleCount] = useState(
    reducedMotion ? lines.length : 0
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset on stage change
  useEffect(() => {
    setCommandPrinted(reducedMotion);
    setVisibleCount(reducedMotion ? lines.length : 0);
  }, [stage, reducedMotion, lines.length]);

  const handleCommandComplete = useCallback(() => {
    setCommandPrinted(true);
  }, []);

  // Auto reveal lines after command typed
  const targetVisible = useMemo(() => {
    if (reducedMotion) return lines.length;
    if (!commandPrinted) return 0;
    const eased = easeOutCubic(Math.min(Math.max(stageProgress, 0), 1));
    return Math.min(lines.length, Math.ceil(eased * lines.length));
  }, [commandPrinted, lines.length, reducedMotion, stageProgress]);

  useEffect(() => {
    setVisibleCount((current: number) => {
      if (targetVisible > current) return targetVisible;
      if (targetVisible === 0) return 0;
      return current;
    });
  }, [targetVisible]);

  // Scroll to bottom as lines reveal
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [visibleCount, commandPrinted]);

  const highlightLine = activeMapEntry?.to ?? null;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-shrink-0">
        <CliTypewriter
          text={`x@ios % ${command}`}
          reducedMotion={reducedMotion}
          onComplete={handleCommandComplete}
          charIntervalMs={24}
          className="block text-[1rem] text-emerald-300"
        />
      </div>

      <div
        ref={scrollRef}
        className="mt-4 flex-1 overflow-hidden"
        style={{
          borderLeft: "1px solid rgba(16, 203, 148, 0.18)",
          paddingLeft: "1rem",
          position: "relative",
        }}
      >
        <div className="flex flex-col gap-[2px] text-[0.92rem]">
          {lines.slice(0, visibleCount).map((line: string, index: number) => {
            const lineNumber = index + 1;
            const isActive = highlightLine === lineNumber;
            return (
              <div
                key={`${stage.kind}-${lineNumber}`}
                className={clsx(
                  "flex w-full items-start gap-4 whitespace-pre",
                  isActive
                    ? "bg-emerald-500/15 text-emerald-100"
                    : "text-emerald-200"
                )}
                style={{
                  transition: reducedMotion ? undefined : "background 180ms",
                  borderLeft: isActive
                    ? "3px solid rgba(66, 255, 193, 0.55)"
                    : "3px solid transparent",
                  padding: "2px 6px",
                }}
              >
                <span
                  className="select-none text-right"
                  style={{
                    minWidth: "3.5rem",
                    color: "rgba(102, 255, 205, 0.55)",
                  }}
                >
                  {String(lineNumber).padStart(3, "0")}
                </span>
                <span className="flex-1">{line || " "}</span>
              </div>
            );
          })}
        </div>
        {!reducedMotion && commandPrinted && visibleCount >= lines.length && (
          <div className="mt-3 text-emerald-300 opacity-70">
            x@ios %
            <span
              className="ml-2 inline-block animate-pulse"
              style={{ animationDuration: "0.9s" }}
            >
              █
            </span>
          </div>
        )}
      </div>
    </div>
  );
}


