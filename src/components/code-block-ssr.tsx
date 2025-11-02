import { highlightCode } from "@/lib/shiki";

interface CodeBlockSSRProps {
  code: string;
  language: string;
  variant?: "default" | "frameless";
  highlightLine?: number;
  highlightLines?: number[];
  debugStyle?: "swift" | "android";
}

export async function CodeBlockSSR({
  code,
  language,
  variant = "default",
  highlightLine,
  highlightLines,
  debugStyle = "swift",
}: CodeBlockSSRProps) {
  const allHighlightLines = [
    ...(highlightLine ? [highlightLine] : []),
    ...(highlightLines || []),
  ];
  
  let { html } = await highlightCode(
    code.trim(),
    language,
    allHighlightLines.length > 0 ? allHighlightLines : undefined,
  );

  // Add debug-style attribute to pre tag
  html = html.replace(
    /<pre class="xs-shiki-pre">/,
    `<pre class="xs-shiki-pre" data-debug-style="${debugStyle}">`,
  );

  const padding = variant === "frameless" ? "1.25rem" : "1.5rem 1.25rem";
  const fontSize = "0.85rem";
  const lineHeight = 1.65;

  return (
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
  );
}

