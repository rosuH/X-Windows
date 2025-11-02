"use client";

import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  DecompileDataset,
  DecompileStage,
  LineMapEntry,
} from "../../datasets/types";
import { CliFrame } from "./cli/cli-frame";
import { CumulativeTerminalView, type CompletedStage } from "./cli/cumulative-terminal-view";
import { useDecompileSequence } from "./use-decompile-sequence";

interface DecompilePipelineOverlayProps {
  dataset: DecompileDataset;
  themeId: "swiftui" | "compose";
  autoPlay?: boolean;
  onFinish?: () => void;
  onSkip?: () => void;
}

const fallbackCommandByLang: Record<string, string> = {
  sil: "swiftc -emit-sil -O -module-name XApp Main.swift",
  "llvm-ir": "swiftc -emit-ir -O -module-name XApp Main.swift",
  "mach-o": "otool -tV XApp.app/XApp",
  aarch64: "llvm-objdump -d --no-show-raw-insn XApp.app/XApp",
  kotlin: "kotlinc Main.kt -Xuse-ir -produce ir",
  "jvm-bytecode": "javap -c -classpath build/Main.class",
  smali: "baksmali disassemble XApp.dex",
};

function getStageCommand(
  stage: DecompileStage,
  theme: DecompilePipelineOverlayProps["themeId"]
): string {
  const langKey = "lang" in stage ? stage.lang : undefined;
  if (!langKey) {
    return theme === "swiftui"
      ? "swiftc -emit-sil -O -module-name XApp Main.swift"
      : "kotlinc Main.kt -Xuse-ir";
  }

  if (theme === "swiftui") {
    if (langKey === "sil") {
      return "swiftc -emit-sil -O -module-name XApp Main.swift";
    }
    if (langKey === "llvm-ir") {
      return "swiftc -emit-ir -O -module-name XApp Main.swift";
    }
    if (langKey === "aarch64") {
      return "otool -tV XApp.app/XApp";
    }
  }

  if (theme === "compose") {
    if (langKey === "kotlin") {
      return "kotlinc Main.kt -Xuse-ir -P plugin:androidx.compose.compiler.plugin";
    }
    if (langKey === "jvm-bytecode") {
      return "javap -classpath build/classes MainKt";
    }
    if (langKey === "smali") {
      return "baksmali disassemble XApp.apk";
    }
  }

  return fallbackCommandByLang[langKey] ?? "printf 'no-command'";
}

function getBannerText(
  stage: DecompileStage | undefined,
  themeId: DecompilePipelineOverlayProps["themeId"]
): string {
  if (!stage) return "Initializing pipeline";
  const stageTitle = "title" in stage && stage.title ? stage.title : stage.kind.toUpperCase();
  const appType = themeId === "compose" ? "Android App" : "iOS App";
  return `[${stageTitle}] Decompiling X ${appType}`;
}

export function DecompilePipelineOverlay({
  dataset,
  themeId,
  autoPlay = true,
  onFinish,
  onSkip,
}: DecompilePipelineOverlayProps) {
  const { state, controls } = useDecompileSequence(dataset, {
    autoPlay,
  });
  const { skip: skipSequence, restart: restartSequence, jumpTo } = controls;
  const { stages, currentStage, currentIndex, status, prefersReducedMotion, stageProgress } = state;
  const [isExiting, setIsExiting] = useState(false);
  const [showExitCommand, setShowExitCommand] = useState(false);
  const [exitCommandPrinted, setExitCommandPrinted] = useState(false);
  const [completedStages, setCompletedStages] = useState<CompletedStage[]>([]);
  const finishedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastCompletedIndexRef = useRef(-1);

  const activeMapEntry = useMemo<LineMapEntry | undefined>(() => {
    return state.activeMapEntry;
  }, [state.activeMapEntry]);

  // Track completed stages - add previous stage when moving to next
  useEffect(() => {
    if (currentIndex > lastCompletedIndexRef.current && currentIndex > 0) {
      const prevStageIndex = currentIndex - 1;
      const prevStage = stages[prevStageIndex];
      
      if (
        prevStage &&
        (prevStage.kind === "ir" || prevStage.kind === "binary")
      ) {
        const alreadyAdded = completedStages.some((cs) => cs.stage === prevStage);
        if (!alreadyAdded) {
          const codeLines = prevStage.code.split(/\r?\n/);
          const banner = getBannerText(prevStage, themeId);
          const command = getStageCommand(prevStage, themeId);

          setCompletedStages((prev) => [
            ...prev,
            {
              stage: prevStage,
              banner,
              command,
              codeLines,
            },
          ]);
        }
        lastCompletedIndexRef.current = prevStageIndex;
      }
    }
  }, [currentIndex, stages, themeId, completedStages]);

  // Handle final stage completion
  useEffect(() => {
    if (
      (status === "completed" || status === "skipped") &&
      currentStage &&
      (currentStage.kind === "ir" || currentStage.kind === "binary") &&
      lastCompletedIndexRef.current < currentIndex
    ) {
      const codeLines = currentStage.code.split(/\r?\n/);
      const banner = getBannerText(currentStage, themeId);
      const command = getStageCommand(currentStage, themeId);

      setCompletedStages((prev) => [
        ...prev,
        {
          stage: currentStage,
          banner,
          command,
          codeLines,
        },
      ]);
      lastCompletedIndexRef.current = currentIndex;
    }
  }, [status, currentStage, currentIndex, themeId]);

  // Reset completed stages on restart
  useEffect(() => {
    if (status === "running" && currentIndex === 0) {
      setCompletedStages([]);
      lastCompletedIndexRef.current = -1;
    }
  }, [status, currentIndex]);

  useEffect(() => {
    if (finishedRef.current) return;
    if (status === "completed" || status === "skipped") {
      finishedRef.current = true;
      // Show exit command first
      setShowExitCommand(true);
    }
    return undefined;
  }, [status]);

  const handleExitCommandComplete = useCallback(() => {
    // After exit command is printed, start window close animation
    setExitCommandPrinted(true);
    setIsExiting(true);
    
    // Then close the overlay
    window.setTimeout(() => {
      onFinish?.();
    }, prefersReducedMotion ? 120 : 400);
  }, [onFinish, prefersReducedMotion]);

  const handleSkip = useCallback(() => {
    if (status === "completed" || status === "skipped") {
      onFinish?.();
      return;
    }
    skipSequence();
    onSkip?.();
  }, [status, onFinish, skipSequence, onSkip]);

  const handleRestart = useCallback(() => {
    finishedRef.current = false;
    setIsExiting(false);
    setShowExitCommand(false);
    setExitCommandPrinted(false);
    setCompletedStages([]);
    lastCompletedIndexRef.current = -1;
    restartSequence();
  }, [restartSequence]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    node.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((status === "completed" || status === "skipped") && event.key === "Enter") {
        event.preventDefault();
        handleRestart();
        return;
      }

      switch (event.key) {
        case "Escape":
          event.preventDefault();
          handleSkip();
          break;
        case " ": // Space key
        case "Spacebar":
          event.preventDefault();
          handleSkip();
          break;
        case "ArrowRight":
          event.preventDefault();
          jumpTo(Math.min(currentIndex + 1, stages.length - 1));
          break;
        case "ArrowLeft":
          event.preventDefault();
          jumpTo(Math.max(currentIndex - 1, 0));
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSkip, handleRestart, jumpTo, currentIndex, stages.length, status]);

  return (
    <div
      className={clsx(
        "fixed inset-0 flex flex-col text-white transition-all",
        isExiting ? "opacity-0 scale-95" : "opacity-100 scale-100"
      )}
      style={{
        background: "radial-gradient(circle at top, rgba(7,17,45,0.98), rgba(2,6,23,0.99))",
        transitionDuration: prefersReducedMotion ? "150ms" : exitCommandPrinted ? "400ms" : "350ms",
        transitionTimingFunction: exitCommandPrinted ? "cubic-bezier(0.4, 0.0, 0.2, 1)" : "ease-out",
        transformOrigin: "center center",
        zIndex: 80,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Compilation pipeline"
      tabIndex={-1}
      ref={containerRef}
    >
      <CliFrame reducedMotion={prefersReducedMotion} className="flex-1 min-h-full">
        <CumulativeTerminalView
          completedStages={completedStages}
          currentStage={
            currentStage &&
            (currentStage.kind === "ir" || currentStage.kind === "binary") &&
            !completedStages.some((cs) => cs.stage === currentStage) &&
            !showExitCommand
              ? currentStage
              : undefined
          }
          currentCommand={
            currentStage &&
            (currentStage.kind === "ir" || currentStage.kind === "binary") &&
            !completedStages.some((cs) => cs.stage === currentStage) &&
            !showExitCommand
              ? getStageCommand(currentStage, themeId)
              : undefined
          }
          currentBanner={
            currentStage &&
            (currentStage.kind === "ir" || currentStage.kind === "binary") &&
            !completedStages.some((cs) => cs.stage === currentStage) &&
            !showExitCommand
              ? getBannerText(currentStage, themeId)
              : undefined
          }
          currentStageProgress={stageProgress}
          activeMapEntry={activeMapEntry}
          reducedMotion={prefersReducedMotion}
          showExitCommand={showExitCommand}
          exitCommandPrinted={exitCommandPrinted}
          onExitCommandComplete={handleExitCommandComplete}
          hostname={themeId === "compose" ? "android" : "ios"}
        />
      </CliFrame>
    </div>
  );
}

