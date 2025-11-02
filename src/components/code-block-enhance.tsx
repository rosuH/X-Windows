"use client";

import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";

interface CodeBlockEnhanceProps {
  primaryHighlight?: number;
  scrollToLine?: number;
  breakpointInfo?: string;
  debugStyle?: "swift" | "android";
  variant?: "default" | "frameless";
}

export function CodeBlockEnhance({
  primaryHighlight,
  scrollToLine,
  breakpointInfo,
  debugStyle = "swift",
  variant = "default",
}: CodeBlockEnhanceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [breakpointTop, setBreakpointTop] = useState<number | undefined>(undefined);
  const rafIdRef = useRef<number | null>(null);

  const targetLine = scrollToLine ?? primaryHighlight;
  const padding = variant === "frameless" ? 1.25 : 1.5;
  const fontSize = 0.85;
  const lineHeight = 1.65;
  const lineHeightPx = fontSize * lineHeight;

  // Find container on mount
  useEffect(() => {
    if (!containerRef.current) {
      // Try to find the container in the DOM - search for the closest .xs-code-block-container
      const findContainer = () => {
        const container = document.querySelector(".xs-code-block-container");
        if (container instanceof HTMLDivElement) {
          containerRef.current = container;
          return true;
        }
        return false;
      };

      // Try immediately
      if (!findContainer()) {
        // If not found, try after a short delay
        const timer = setTimeout(() => {
          findContainer();
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Scroll to target line
  useEffect(() => {
    if (!targetLine) return;

    const attemptScroll = (attempt: number = 0) => {
      const maxAttempts = 6;
      if (attempt >= maxAttempts) return;

      const container = containerRef.current || document.querySelector(".xs-code-block-container");
      if (!container) {
        setTimeout(() => attemptScroll(attempt + 1), 120 * (attempt + 1));
        return;
      }

      const lineElements = container.querySelectorAll('.code-line[data-line]');
      const targetLineElement = Array.from(lineElements).find((el) => {
        const lineNum = el.getAttribute("data-line");
        return lineNum === String(targetLine);
      });

      if (targetLineElement) {
        try {
          targetLineElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        } catch {
          targetLineElement.scrollIntoView({
            block: "center",
            inline: "nearest",
          });
        }
        return;
      }

      setTimeout(() => attemptScroll(attempt + 1), 120 * (attempt + 1));
    };

    const timer = setTimeout(() => attemptScroll(), 200);
    return () => clearTimeout(timer);
  }, [targetLine]);

  // Update breakpoint position (only if we have breakpoint info)
  useEffect(() => {
    if (!primaryHighlight || !breakpointInfo) {
      setBreakpointTop(undefined);
      return;
    }

    const scheduleUpdate = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = requestAnimationFrame(() => {
        updatePosition();
        rafIdRef.current = null;
      });
    };

    const updatePosition = () => {
      const container = containerRef.current || document.querySelector(".xs-code-block-container");
      if (!container) return;

      const lineElements = container.querySelectorAll('.code-line[data-line]');
      const targetLineElement = Array.from(lineElements).find((el) => {
        const lineNum = el.getAttribute("data-line");
        return lineNum === String(primaryHighlight);
      });

      if (targetLineElement) {
        const containerRect = container.getBoundingClientRect();
        const lineRect = targetLineElement.getBoundingClientRect();
        const lineTop = lineRect.top - containerRect.top + container.scrollTop;

        // Find scroll container
        let scrollContainer: Element | null = container.parentElement;
        while (scrollContainer) {
          const style = window.getComputedStyle(scrollContainer);
          const overflow = style.overflow + style.overflowX + style.overflowY;
          if (overflow.includes("auto") || overflow.includes("scroll")) {
            break;
          }
          scrollContainer = scrollContainer.parentElement;
        }

        if (scrollContainer) {
          const scrollContainerRect = scrollContainer.getBoundingClientRect();
          const scrollLineTop = lineRect.top - scrollContainerRect.top + scrollContainer.scrollTop;
          setBreakpointTop(scrollLineTop);
        } else {
          setBreakpointTop(lineTop);
        }
      }
    };

    // Initial update
    const timer = setTimeout(updatePosition, 100);
    updatePosition();

    // Listen to scroll events (only on the nearest scroll container and window)
    const handleScroll = () => {
      scheduleUpdate();
    };

    let scrollContainer: Element | null = containerRef.current?.parentElement || 
      document.querySelector(".xs-code-block-container")?.parentElement;
    while (scrollContainer) {
      const style = window.getComputedStyle(scrollContainer);
      const overflow = style.overflow + style.overflowX + style.overflowY;
      if (overflow.includes("auto") || overflow.includes("scroll")) {
        scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
        break;
      }
      scrollContainer = scrollContainer.parentElement;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Use ResizeObserver for container (only one)
    const resizeObserver = new ResizeObserver(() => {
      scheduleUpdate();
    });
    const container = containerRef.current || document.querySelector(".xs-code-block-container");
    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      clearTimeout(timer);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [primaryHighlight, breakpointInfo]);

  if (!primaryHighlight || !breakpointInfo) {
    return null;
  }

  return (
    <div
      className="absolute right-4 flex items-center gap-2 text-xs font-medium pointer-events-none z-10"
      style={{
        top:
          breakpointTop !== undefined
            ? `${breakpointTop}px`
            : `calc(${padding}rem + ${(primaryHighlight - 1) * lineHeightPx}rem)`,
        color: "#5cb85c",
        lineHeight: `${lineHeightPx}rem`,
      }}
    >
      <Menu size={12} className="flex-shrink-0" strokeWidth={2} />
      <span className="whitespace-nowrap">{breakpointInfo}</span>
    </div>
  );
}

