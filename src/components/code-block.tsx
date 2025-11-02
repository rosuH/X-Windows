"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Menu } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language: string;
  variant?: "default" | "frameless";
  highlightLine?: number;
  highlightLines?: number[];
  breakpointInfo?: string;
  scrollToLine?: number;
  debugStyle?: "swift" | "android";
}

const languageAliases: Record<string, string> = {
  sil: "swift",
  "llvm-ir": "llvm",
  "jvm-bytecode": "java",
  smali: "asm",
  aarch64: "asm",
};

export function CodeBlock({
  code,
  language,
  variant = "default",
  highlightLine,
  highlightLines,
  breakpointInfo,
  scrollToLine,
  debugStyle = "swift",
}: CodeBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLElement | null>(null);
  const [breakpointTop, setBreakpointTop] = useState<number | undefined>(undefined);

  const resolvedLanguage = languageAliases[language] ?? language;
  const highlightSet = useMemo(() => {
    const set = new Set<number>();
    if (highlightLines) {
      highlightLines.forEach((line) => set.add(line));
    }
    if (highlightLine) {
      set.add(highlightLine);
    }
    return set;
  }, [highlightLine, highlightLines]);

  const primaryHighlight = useMemo(() => {
    if (highlightLine) return highlightLine;
    if (highlightLines && highlightLines.length > 0) return highlightLines[0];
    return undefined;
  }, [highlightLine, highlightLines]);

  useEffect(() => {
    const targetLine = scrollToLine ?? primaryHighlight;
    if (targetLine && containerRef.current) {
      const attemptScroll = (attempt: number = 0) => {
        const maxAttempts = 6;
        if (attempt >= maxAttempts) return;

        const lineElements = containerRef.current?.querySelectorAll('span[class*="react-syntax-highlighter-line-number"]');
        const targetLineElement = Array.from(lineElements || []).find((el) => {
          const text = el.textContent?.trim();
          return text === String(targetLine);
        });

        if (targetLineElement) {
          const lineContainer = targetLineElement.closest('span[class*="react-syntax-highlighter-line"]') as HTMLElement | null;
          if (lineContainer) {
            lineRef.current = lineContainer;
            try {
              lineContainer.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
            } catch {
              lineContainer.scrollIntoView({ block: "center", inline: "nearest" });
            }
            return;
          }
        }

        setTimeout(() => attemptScroll(attempt + 1), 120 * (attempt + 1));
      };

      const timer = setTimeout(() => attemptScroll(), 200);
      return () => clearTimeout(timer);
    }
  }, [scrollToLine, primaryHighlight, code]);

  // Update breakpoint position and blue graphic position
  useEffect(() => {
    if (primaryHighlight && containerRef.current) {
      let rafId: number | null = null;
      
      const updatePosition = () => {
        const container = containerRef.current;
        if (!container) return;

        // Find highlighted line element
        const lineElements = container.querySelectorAll('span[class*="react-syntax-highlighter-line-number"]');
        const targetLineElement = Array.from(lineElements).find((el) => {
          const text = el.textContent?.trim();
          return text === String(primaryHighlight);
        });

        if (targetLineElement) {
          const lineContainer = targetLineElement.closest('span[class*="react-syntax-highlighter-line"]') as HTMLElement;
          if (lineContainer) {
            lineRef.current = lineContainer;
            const containerRect = container.getBoundingClientRect();
            const lineRect = lineContainer.getBoundingClientRect();
            const lineTop = lineRect.top - containerRect.top + container.scrollTop;

            const scrollContainer = container.parentElement?.closest('[class*="overflow-auto"], [class*="overflow-y-auto"], [class*="overflow-x-auto"], [class*="overflow"]') || container.parentElement;
            if (scrollContainer) {
              const scrollContainerRect = scrollContainer.getBoundingClientRect();
              const scrollLineTop = lineRect.top - scrollContainerRect.top + scrollContainer.scrollTop;
              setBreakpointTop(scrollLineTop);
            } else {
              setBreakpointTop(lineTop);
            }
          }
        }
      };

      // Use requestAnimationFrame for smooth updates
      const scheduleUpdate = () => {
        if (rafId !== null) return;
        rafId = requestAnimationFrame(() => {
          updatePosition();
          rafId = null;
        });
      };

      // Initial update
      const timer = setTimeout(updatePosition, 100);
      updatePosition();

      // Find all possible scroll containers and listen to scroll events
      const scrollContainers: Element[] = [];
      let currentElement: Element | null = containerRef.current;
      
      while (currentElement) {
        const parent: Element | null = currentElement.parentElement;
        if (!parent) break;
        
        // Check if it's a scroll container
        const style = window.getComputedStyle(parent);
        const overflow = style.overflow + style.overflowX + style.overflowY;
        if (overflow.includes('auto') || overflow.includes('scroll')) {
          scrollContainers.push(parent);
        }
        
        currentElement = parent;
      }

      // Listen to scroll events on all scroll containers
      const handleScroll = () => {
        scheduleUpdate();
      };

      scrollContainers.forEach(container => {
        container.addEventListener('scroll', handleScroll, { passive: true });
      });

      // Listen to window scroll events (handle body/html scrolling)
      window.addEventListener('scroll', handleScroll, { passive: true });

      // Use ResizeObserver to monitor container size changes
      const resizeObserver = new ResizeObserver(() => {
        scheduleUpdate();
      });
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        clearTimeout(timer);
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
        scrollContainers.forEach(container => {
          container.removeEventListener('scroll', handleScroll);
        });
        window.removeEventListener('scroll', handleScroll);
        resizeObserver.disconnect();
      };
    }
  }, [primaryHighlight]);

  const lineProps = (lineNumber: number) => {
    if (highlightSet.has(lineNumber)) {
      const classes = ["xs-debug-line"];
      classes.push(debugStyle === "android" ? "xs-debug-line--android" : "xs-debug-line--swift");
      return {
        className: classes.join(" "),
      };
    }
    return {};
  };

  const getLineNumberStyle = (lineNumber: number) => {
    const baseStyle = {
      color: "rgba(148, 163, 184, 0.45)",
      marginRight: "1rem",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "flex-end",
      width: "2.75rem",
      minWidth: "2.75rem",
      position: "relative" as const,
      textAlign: "right" as const,
      zIndex: highlightSet.has(lineNumber) ? 15 : 1,
    };

    if (highlightSet.has(lineNumber)) {
      if (debugStyle === "android") {
        return {
          ...baseStyle,
          color: "transparent",
        };
      }
      return {
        ...baseStyle,
        color: "#ffffff",
      };
    }

    return baseStyle;
  };

  const padding = variant === "frameless" ? 1.25 : 1.5;
  const fontSize = 0.85;
  const lineHeight = 1.65;
  const lineHeightPx = fontSize * lineHeight;

  return (
    <>
      <style>{`
        .xs-debug-line {
          position: relative;
          display: block !important;
          width: 100%;
          overflow: visible;
        }

        .xs-debug-line::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 0.35rem;
          z-index: 0;
        }

        .xs-debug-line span[class*="react-syntax-highlighter-line-number"],
        .xs-debug-line span[class*="react-syntax-highlighter-line-content"] {
          position: relative;
          z-index: 1;
        }

        .xs-debug-line--swift::after {
          background-color: rgba(92, 184, 92, 0.25);
        }

        .xs-debug-line--swift [class*="react-syntax-highlighter-line-number"] {
          color: #ffffff !important;
        }

        .xs-debug-line--swift [class*="react-syntax-highlighter-line-number"]::before {
          content: "";
          position: absolute;
          top: 50%;
          left: -0.5rem;
          transform: translateY(-50%);
          width: 2.75rem;
          height: 1.55rem;
          background: #007AFF;
          border-radius: 0.45rem;
          z-index: 2;
        }

        .xs-debug-line--android::after {
          background-color: rgba(0, 122, 255, 0.35);
        }

        .xs-debug-line--android [class*="react-syntax-highlighter-line-number"] {
          color: transparent !important;
        }

        .xs-debug-line--android [class*="react-syntax-highlighter-line-number"]::before {
          content: "✓";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #DC3545;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          line-height: 18px;
          text-align: center;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          z-index: 2;
        }
      `}</style>
      <div className="relative" ref={containerRef}>
      <SyntaxHighlighter
        language={resolvedLanguage}
        style={oneDark}
        showLineNumbers
        wrapLines
        customStyle={{
          background: "transparent",
          margin: 0,
          padding: variant === "frameless" ? "1.25rem" : "1.5rem 1.25rem",
          fontSize: "0.85rem",
          lineHeight: 1.65,
        }}
        lineNumberStyle={getLineNumberStyle}
        lineProps={lineProps}
        codeTagProps={{
          style: {
            fontFamily: "var(--font-mono, 'Fira Code', monospace)",
          },
        }}
      >
        {code.trim()}
      </SyntaxHighlighter>
      {primaryHighlight && breakpointInfo && (
        <div
          className="absolute right-4 flex items-center gap-2 text-xs font-medium pointer-events-none z-10"
          style={{
            top: breakpointTop !== undefined 
              ? `${breakpointTop}px`
              : `calc(${padding}rem + ${(primaryHighlight - 1) * lineHeightPx}rem)`,
            color: "#5cb85c",
            lineHeight: `${lineHeightPx}rem`,
            alignItems: "center",
            display: "flex",
          }}
        >
          <Menu size={12} className="flex-shrink-0" strokeWidth={2} />
          <span className="whitespace-nowrap">{breakpointInfo}</span>
        </div>
      )}
      </div>
    </>
  );
}
