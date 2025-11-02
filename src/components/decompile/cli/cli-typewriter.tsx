"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";

export interface CliTypewriterProps {
  text: string;
  /** 每个字符的毫秒数 */
  charIntervalMs?: number;
  /** 首次延迟显示 */
  startDelayMs?: number;
  cursor?: string;
  reducedMotion?: boolean;
  onComplete?: () => void;
  className?: string;
}

const DEFAULT_INTERVAL = 28;

export function CliTypewriter({
  text,
  charIntervalMs = DEFAULT_INTERVAL,
  startDelayMs = 60,
  cursor = "█",
  reducedMotion = false,
  onComplete,
  className,
}: CliTypewriterProps) {
  const [visibleLength, setVisibleLength] = useState(() =>
    reducedMotion ? text.length : 0
  );
  const intervalRef = useRef<number | null>(null);
  const startTimeoutRef = useRef<number | null>(null);
  const targetLength = text.length;
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const emitComplete = useCallback(() => {
    if (typeof window === "undefined") {
      onCompleteRef.current?.();
      return;
    }
    window.setTimeout(() => onCompleteRef.current?.(), 0);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setVisibleLength(text.length);
      return;
    }

    setVisibleLength(0);
  }, [text, reducedMotion]);

  const display = useMemo(() => text.slice(0, visibleLength), [text, visibleLength]);

  useEffect(() => {
    if (reducedMotion) {
      emitComplete();
      return () => undefined;
    }

    if (targetLength === 0) {
      emitComplete();
      return () => undefined;
    }

    const cleanup = () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (startTimeoutRef.current !== null) {
        window.clearTimeout(startTimeoutRef.current);
        startTimeoutRef.current = null;
      }
    };

    cleanup();

    startTimeoutRef.current = window.setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        setVisibleLength((current) => {
          if (current >= targetLength) {
            cleanup();
            emitComplete();
            return targetLength;
          }
          const next = current + 1;
          if (next >= targetLength) {
            cleanup();
            emitComplete();
            return targetLength;
          }
          return next;
        });
      }, Math.max(8, charIntervalMs));
    }, Math.max(0, startDelayMs));

    return cleanup;
  }, [charIntervalMs, startDelayMs, reducedMotion, targetLength, emitComplete]);

  const isDone = visibleLength >= targetLength;

  return (
    <span className={className} aria-live="polite">
      {display}
      {!reducedMotion && !isDone ? (
        <span
          className="ml-1 inline-block animate-pulse"
          style={{ animationDuration: "0.9s" }}
        >
          {cursor}
        </span>
      ) : null}
    </span>
  );
}


