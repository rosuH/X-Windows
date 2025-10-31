"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  code: string;
  language: string;
  variant?: "default" | "frameless";
}

export function CodeBlock({ code, language, variant = "default" }: CodeBlockProps) {
  return (
    <SyntaxHighlighter
      language={language}
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
      lineNumberStyle={{ color: "rgba(148, 163, 184, 0.45)", marginRight: "1rem" }}
      codeTagProps={{
        style: {
          fontFamily: "var(--font-mono, 'Fira Code', monospace)",
        },
      }}
    >
      {code.trim()}
    </SyntaxHighlighter>
  );
}
