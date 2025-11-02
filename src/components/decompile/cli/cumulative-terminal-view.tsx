"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BinaryStage, IrStage, LineMapEntry } from "../../../datasets/types";
import { CliTypewriter } from "./cli-typewriter";

export interface CompletedStage {
  stage: IrStage | BinaryStage;
  command: string;
  banner: string;
  codeLines: string[];
}

export interface CumulativeTerminalViewProps {
  completedStages: CompletedStage[];
  currentStage?: IrStage | BinaryStage;
  currentCommand?: string;
  currentBanner?: string;
  currentStageProgress: number;
  activeMapEntry?: LineMapEntry;
  reducedMotion?: boolean;
  showExitCommand?: boolean;
  exitCommandPrinted?: boolean;
  onExitCommandComplete?: () => void;
  hostname?: string;
}

const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

export function CumulativeTerminalView({
  completedStages,
  currentStage,
  currentCommand,
  currentBanner,
  currentStageProgress,
  activeMapEntry,
  reducedMotion = false,
  showExitCommand = false,
  exitCommandPrinted = false,
  onExitCommandComplete,
  hostname = "ios",
}: CumulativeTerminalViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [commandPrinted, setCommandPrinted] = useState(reducedMotion);
  const [currentCodeLines, setCurrentCodeLines] = useState<string[]>([]);
  const [bannerPrinted, setBannerPrinted] = useState(false);
  const [exitCommandComplete, setExitCommandComplete] = useState(false);

  const handleBannerComplete = useCallback(() => {
    setBannerPrinted(true);
  }, []);

  const handleCommandComplete = useCallback(() => {
    setCommandPrinted(true);
  }, []);

  const handleExitCommandComplete = useCallback(() => {
    setExitCommandComplete(true);
    onExitCommandComplete?.();
  }, [onExitCommandComplete]);

  // Reset when current stage changes
  useEffect(() => {
    if (currentStage) {
      setBannerPrinted(false);
      setCommandPrinted(reducedMotion);
      setCurrentCodeLines([]);
      setExitCommandComplete(false);
    }
  }, [currentStage, reducedMotion]);

  // Update current code lines based on progress
  const currentLines = useMemo(() => {
    if (!currentStage) return [];
    return currentStage.code.split(/\r?\n/);
  }, [currentStage]);

  const targetVisibleCount = useMemo(() => {
    if (!currentStage || !commandPrinted || reducedMotion) {
      return reducedMotion && currentStage ? currentLines.length : 0;
    }
    const eased = easeOutCubic(Math.min(Math.max(currentStageProgress, 0), 1));
    return Math.min(currentLines.length, Math.ceil(eased * currentLines.length));
  }, [commandPrinted, currentLines.length, currentStageProgress, reducedMotion, currentStage]);

  useEffect(() => {
    setCurrentCodeLines((prev) => {
      if (targetVisibleCount > prev.length) {
        return currentLines.slice(0, targetVisibleCount);
      }
      return prev;
    });
  }, [targetVisibleCount, currentLines]);

  // Auto scroll to bottom - find scrollable parent
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    
    // Find nearest scrollable parent
    let scrollContainer: HTMLElement | null = node.parentElement;
    while (scrollContainer) {
      const overflow = window.getComputedStyle(scrollContainer).overflowY;
      if (overflow === "auto" || overflow === "scroll") {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
        return;
      }
      scrollContainer = scrollContainer.parentElement;
    }
    
    // Fallback: scroll the node itself if it's scrollable
    if (node.scrollHeight > node.clientHeight) {
      node.scrollTop = node.scrollHeight;
    }
  }, [completedStages.length, currentCodeLines.length, commandPrinted, bannerPrinted, currentBanner, showExitCommand]);

  const highlightLine = activeMapEntry?.to ?? null;

  return (
    <div className="flex h-full w-full flex-col">
      <div ref={scrollRef} className="flex flex-col gap-6 pb-8">
        {/* Completed stages */}
        {completedStages.map((item, stageIndex) => (
          <div key={`completed-${stageIndex}`} className="flex flex-col gap-4">
            <div className="text-[1rem] text-emerald-300">
              x@{hostname} % echo &quot;{item.banner}&quot;
            </div>
            <div className="text-[0.95rem] text-emerald-200">
              {item.banner}
            </div>
            <div className="text-[1rem] text-emerald-300">
              x@{hostname} % {item.command}
            </div>
            <div
              className="flex flex-col gap-[2px] text-[0.92rem]"
              style={{
                borderLeft: "1px solid rgba(16, 203, 148, 0.18)",
                paddingLeft: "1rem",
              }}
            >
              {item.codeLines.map((line, index) => {
                const lineNumber = index + 1;
                return (
                  <div
                    key={`${stageIndex}-${lineNumber}`}
                    className="flex w-full items-start gap-4 whitespace-pre text-emerald-200"
                    style={{
                      padding: "2px 6px",
                      borderLeft: "3px solid transparent",
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
            {!reducedMotion && (
              <div className="mt-2 text-emerald-300 opacity-70">
                x@{hostname} %
                <span
                  className="ml-2 inline-block animate-pulse"
                  style={{ animationDuration: "0.9s" }}
                >
                  █
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Current stage banner */}
        {currentStage && currentBanner && !bannerPrinted && (
          <div className="flex flex-col gap-4">
            <CliTypewriter
              key={`banner-current`}
              text={`x@${hostname} % echo "${currentBanner}"`}
              reducedMotion={reducedMotion}
              charIntervalMs={20}
              onComplete={handleBannerComplete}
              className="text-[1rem] text-emerald-300"
            />
          </div>
        )}

        {/* Current stage banner output */}
        {currentStage && currentBanner && bannerPrinted && (
          <div className="text-[0.95rem] text-emerald-200">
            {currentBanner}
          </div>
        )}

        {/* Current stage command */}
        {currentStage && currentCommand && bannerPrinted && (
          <div className="flex flex-col gap-4">
            <CliTypewriter
              text={`x@${hostname} % ${currentCommand}`}
              reducedMotion={reducedMotion}
              onComplete={handleCommandComplete}
              charIntervalMs={24}
              className="block text-[1rem] text-emerald-300"
            />
          </div>
        )}

        {/* Current stage code */}
        {currentStage && commandPrinted && currentCodeLines.length > 0 && (
          <div
            className="flex flex-col gap-[2px] text-[0.92rem]"
            style={{
              borderLeft: "1px solid rgba(16, 203, 148, 0.18)",
              paddingLeft: "1rem",
            }}
          >
            {currentCodeLines.map((line, index) => {
              const lineNumber = index + 1;
              const isActive = highlightLine === lineNumber;
              return (
                <div
                  key={`current-${lineNumber}`}
                  className="flex w-full items-start gap-4 whitespace-pre"
                  style={{
                    transition: reducedMotion ? undefined : "background 180ms",
                    borderLeft: isActive
                      ? "3px solid rgba(66, 255, 193, 0.55)"
                      : "3px solid transparent",
                    padding: "2px 6px",
                    backgroundColor: isActive ? "rgba(16, 185, 129, 0.15)" : undefined,
                    color: isActive ? "rgb(209, 250, 229)" : "rgb(167, 243, 208)",
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
        )}

        {/* Current stage cursor */}
          {currentStage &&
          commandPrinted &&
          currentCodeLines.length >= currentLines.length &&
          !showExitCommand &&
          !reducedMotion && (
            <div className="mt-3 text-emerald-300 opacity-70">
              x@{hostname} %
              <span
                className="ml-2 inline-block animate-pulse"
                style={{ animationDuration: "0.9s" }}
              >
                █
              </span>
            </div>
          )}

        {/* Exit command */}
        {showExitCommand && (
          <div className="mt-4 flex flex-col gap-2">
            <CliTypewriter
              text={`x@${hostname} % exit`}
              reducedMotion={reducedMotion}
              charIntervalMs={24}
              onComplete={handleExitCommandComplete}
              className="block text-[1rem] text-emerald-300"
            />
          </div>
        )}
      </div>
    </div>
  );
}

