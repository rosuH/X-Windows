"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  DecompileDataset,
  DecompileStage,
  LineMapEntry,
} from "../../datasets/types";

export type SequenceStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed"
  | "skipped";

export interface UseDecompileSequenceOptions {
  autoPlay?: boolean;
  totalDurationMs?: number;
  reducedMotionDurationMs?: number;
}

const DEFAULT_TOTAL_DURATION = 15000;
const DEFAULT_REDUCED_DURATION = 5000;

interface SequenceTiming {
  durations: number[];
  offsets: number[];
  total: number;
}

const buildTiming = (stageCount: number, total: number): SequenceTiming => {
  if (stageCount <= 0) {
    return { durations: [], offsets: [], total: 0 };
  }

  const base = total / stageCount;
  const durations = Array.from({ length: stageCount }, () => base);
  const offsets: number[] = [];
  durations.reduce((acc, duration) => {
    offsets.push(acc);
    return acc + duration;
  }, 0);

  return { durations, offsets, total };
};

const usePrefersReducedMotion = (): boolean => {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = (event: MediaQueryListEvent) => {
      setPrefers(event.matches);
    };

    setPrefers(mediaQuery.matches);
    mediaQuery.addEventListener("change", listener);

    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  return prefers;
};

export interface DecompileSequenceControls {
  play: () => void;
  pause: () => void;
  restart: () => void;
  skip: () => void;
  jumpTo: (index: number) => void;
}

export interface DecompileSequenceState {
  stages: DecompileStage[];
  currentIndex: number;
  currentStage: DecompileStage | undefined;
  status: SequenceStatus;
  progress: number;
  stageProgress: number;
  prefersReducedMotion: boolean;
  activeMapEntry?: LineMapEntry;
  totalDuration: number;
  stageDuration: number;
}

export type UseDecompileSequenceReturn = {
  state: DecompileSequenceState;
  controls: DecompileSequenceControls;
};

export function useDecompileSequence(
  dataset: DecompileDataset,
  options: UseDecompileSequenceOptions = {}
): UseDecompileSequenceReturn {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Filter out source, ast, and rev stages, only show IR (SIL) and beyond
  const stages = useMemo(() => {
    return dataset.stages.filter(
      (stage) => stage.kind !== "source" && stage.kind !== "ast" && stage.kind !== "rev"
    );
  }, [dataset.stages]);

  const [status, setStatus] = useState<SequenceStatus>(
    options.autoPlay ? "running" : "idle"
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  const [activeMapIndex, setActiveMapIndex] = useState(0);

  const totalDuration = prefersReducedMotion
    ? options.reducedMotionDurationMs ?? DEFAULT_REDUCED_DURATION
    : options.totalDurationMs ?? DEFAULT_TOTAL_DURATION;

  const timing = useMemo(
    () => buildTiming(stages.length, totalDuration),
    [stages.length, totalDuration]
  );

  const statusRef = useRef(status);
  const indexRef = useRef(currentIndex);
  const animationFrameRef = useRef<number | null>(null);
  const mapIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);

  const clearAnimationFrame = () => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const clearMapInterval = () => {
    if (mapIntervalRef.current !== null) {
      window.clearInterval(mapIntervalRef.current);
      mapIntervalRef.current = null;
    }
  };

  const scheduleStage = useCallback(
    (stageIndex: number) => {
      if (stages.length === 0) return;
      clearAnimationFrame();

      const stageDuration = timing.durations[stageIndex] ?? 0;
      const stageOffset = timing.offsets[stageIndex] ?? 0;
      const start = performance.now();

      const tick = (now: number) => {
        if (statusRef.current !== "running") {
          return;
        }

        const elapsed = Math.min(now - start, stageDuration);
        const totalElapsed = stageOffset + elapsed;
        const nextProgress = timing.total
          ? Math.min(totalElapsed / timing.total, 1)
          : 0;

        setStageProgress(stageDuration ? elapsed / stageDuration : 1);
        setProgress(nextProgress);

        if (elapsed >= stageDuration - 16) {
          clearAnimationFrame();
          if (stageIndex >= stages.length - 1) {
            setStatus("completed");
            setCurrentIndex(stageIndex);
          } else {
            setCurrentIndex(stageIndex + 1);
          }
          return;
        }

        animationFrameRef.current = requestAnimationFrame(tick);
      };

      animationFrameRef.current = requestAnimationFrame(tick);
    },
    [stages.length, timing]
  );

  useEffect(() => {
    if (status !== "running") {
      clearAnimationFrame();
      return;
    }

    scheduleStage(currentIndex);

    return () => {
      clearAnimationFrame();
    };
  }, [status, currentIndex, scheduleStage]);

  useEffect(() => {
    clearMapInterval();
    const stage = stages[currentIndex];
    setActiveMapIndex(0);

    if (!stage || status !== "running" || prefersReducedMotion) {
      return;
    }

    if (
      (stage.kind === "ir" || stage.kind === "binary") &&
      stage.map &&
      stage.map.length > 0
    ) {
      // Update activeMapIndex even if map.length === 1, to ensure activeMapEntry is set
      if (stage.map.length === 1) {
        // Keep activeMapIndex at 0 for single entry
        return;
      }
      
      const intervalDuration = Math.max(
        160,
        (timing.durations[currentIndex] ?? 600) / stage.map.length
      );

      mapIntervalRef.current = window.setInterval(() => {
        setActiveMapIndex((current) => {
          if (!stage.map) return 0;
          return (current + 1) % stage.map.length;
        });
      }, intervalDuration);
    }

    return () => {
      clearMapInterval();
    };
  }, [stages, currentIndex, status, timing.durations, prefersReducedMotion]);

  const play = useCallback(() => {
    setStatus((prev) => {
      if (prev === "running") return prev;
      if (prev === "completed" || prev === "skipped") {
        setCurrentIndex(0);
        setProgress(0);
      }
      return "running";
    });
  }, []);

  const pause = useCallback(() => {
    setStatus((prev) => (prev === "running" ? "paused" : prev));
  }, []);

  const restart = useCallback(() => {
    clearAnimationFrame();
    clearMapInterval();
    setCurrentIndex(0);
    setProgress(0);
    setStageProgress(0);
    setActiveMapIndex(0);
    setStatus("running");
  }, []);

  const skip = useCallback(() => {
    clearAnimationFrame();
    clearMapInterval();
    setCurrentIndex(Math.max(0, stages.length - 1));
    setProgress(1);
    setStageProgress(1);
    setActiveMapIndex(0);
    setStatus("skipped");
  }, [stages.length]);

  const jumpTo = useCallback(
    (index: number) => {
      if (!(index >= 0 && index < stages.length)) return;
      clearAnimationFrame();
      clearMapInterval();
      setCurrentIndex(index);
      const stageOffset = timing.offsets[index] ?? 0;
      const nextProgress = timing.total
        ? Math.min(stageOffset / timing.total, 1)
        : 0;
      setStageProgress(0);
      setProgress(nextProgress);
      setStatus("paused");
    },
    [stages.length, timing.offsets, timing.total]
  );

  useEffect(() => () => {
    clearAnimationFrame();
    clearMapInterval();
  }, []);

  useEffect(() => {
    if (!options.autoPlay) return;
    setStatus("running");
  }, [options.autoPlay]);

  const currentStage = stages[currentIndex];
  const activeMapEntry =
    currentStage &&
    (currentStage.kind === "ir" || currentStage.kind === "binary") &&
    currentStage.map &&
    currentStage.map.length > 0
      ? currentStage.map[Math.min(activeMapIndex, currentStage.map.length - 1)]
      : undefined;

  const state: DecompileSequenceState = {
    stages,
    currentIndex,
    currentStage,
    status,
    progress,
    stageProgress,
    prefersReducedMotion,
    activeMapEntry,
    totalDuration: timing.total,
    stageDuration: timing.durations[currentIndex] ?? 0,
  };

  const controls: DecompileSequenceControls = {
    play,
    pause,
    restart,
    skip,
    jumpTo,
  };

  return { state, controls };
}

