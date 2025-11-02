"use client";

import { useEffect, useMemo, useState } from "react";
import { highlightCode } from "@/lib/shiki";
import { CodeBlockEnhance } from "./code-block-enhance";

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
  const primaryHighlight = highlightLine ?? (highlightLines && highlightLines.length > 0 ? highlightLines[0] : undefined);
  const [html, setHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const allHighlightLines = useMemo(() => [
    ...(highlightLine ? [highlightLine] : []),
    ...(highlightLines || []),
  ], [highlightLine, highlightLines]);

  useEffect(() => {
    let cancelled = false;
    
    highlightCode(
      code.trim(),
      language,
      allHighlightLines.length > 0 ? allHighlightLines : undefined,
    ).then((result) => {
      if (!cancelled) {
        let processedHtml = result.html;
        // Add debug-style attribute to pre tag
        processedHtml = processedHtml.replace(
          /<pre class="xs-shiki-pre">/,
          `<pre class="xs-shiki-pre" data-debug-style="${debugStyle}">`,
        );
        setHtml(processedHtml);
        setIsLoading(false);
      }
    }).catch((error) => {
      if (!cancelled) {
        console.error("Failed to highlight code:", error);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [code, language, allHighlightLines, debugStyle]);

  const padding = variant === "frameless" ? "1.25rem" : "1.5rem 1.25rem";
  const fontSize = "0.85rem";
  const lineHeight = 1.65;

  if (isLoading) {
    return (
      <div className="relative xs-code-block-container">
        <div
          className="xs-code-block-html"
          style={{
            padding,
            fontSize,
            lineHeight,
            fontFamily: "var(--font-mono, 'Fira Code', monospace)",
            minHeight: "200px",
          }}
        >
          <div className="text-slate-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative xs-code-block-container">
        <div
          className="xs-code-block-html"
          dangerouslySetInnerHTML={{ __html: html }}
          style={{
            padding,
            fontSize,
            lineHeight,
            fontFamily: "var(--font-mono, 'Fira Code', monospace)",
          }}
          data-variant={variant}
          data-debug-style={debugStyle}
        />
      </div>
      {primaryHighlight && (
        <CodeBlockEnhance
          primaryHighlight={primaryHighlight}
          scrollToLine={scrollToLine}
          breakpointInfo={breakpointInfo}
          debugStyle={debugStyle}
          variant={variant}
        />
      )}
    </div>
  );
}
