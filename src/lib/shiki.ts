import { codeToHtml } from "shiki";
import type { BundledLanguage, BundledTheme, ShikiTransformer } from "shiki";

// Language aliases to match react-syntax-highlighter
const languageAliases: Record<string, string> = {
  sil: "swift",
  "llvm-ir": "llvm",
  "jvm-bytecode": "java",
  smali: "asm",
  aarch64: "asm",
};

export async function highlightCode(
  code: string,
  language: string,
  highlightLines?: number[],
): Promise<{ html: string; highlightLines: number[] }> {
  const resolvedLanguage = languageAliases[language] ?? language;
  const highlightSet = highlightLines ? new Set(highlightLines) : new Set<number>();

  try {
    // Create custom transformer for line numbers and highlighting
    const lineNumberTransformer: ShikiTransformer = {
      name: "line-numbers",
      line(node, line) {
        const lineNumber = line + 1;
        const isHighlighted = highlightSet.has(lineNumber);
        
        // Add data-line attribute
        node.properties = node.properties || {};
        node.properties["data-line"] = lineNumber;
        
        // Add classes
        const classList = (node.properties.class as string[]) || [];
        classList.push("code-line");
        if (isHighlighted) {
          classList.push("code-line-highlighted");
        }
        node.properties.class = classList;
        
        // Add line number as first child
        if (node.type === "element" && Array.isArray(node.children)) {
          const lineNumberSpan = {
            type: "element" as const,
            tagName: "span",
            properties: {
              class: ["code-line-number"],
              "data-line": lineNumber,
            },
            children: [{ type: "text" as const, value: String(lineNumber) }],
          };
          
          // Wrap existing content in code-line-content span
          const contentSpan = {
            type: "element" as const,
            tagName: "span",
            properties: {
              class: ["code-line-content"],
            },
            children: node.children,
          };
          
          node.children = [lineNumberSpan, contentSpan];
        }
      },
    };

    const html = await codeToHtml(code, {
      lang: resolvedLanguage as BundledLanguage,
      theme: "one-dark-pro" as BundledTheme,
      transformers: [lineNumberTransformer],
    });

    // Add class to pre tag
    const processedHtml = html.replace(/<pre[^>]*>/, `<pre class="xs-shiki-pre">`);

    return { html: processedHtml, highlightLines: highlightLines || [] };
  } catch (error) {
    // Fallback: return plain code with line numbers if highlighting fails
    const lines = code.split("\n");
    const html = `<pre class="xs-shiki-pre"><code>${lines
      .map(
        (line, idx) => {
          const lineNum = idx + 1;
          const isHighlighted = highlightSet.has(lineNum);
          const highlightClass = isHighlighted ? " code-line-highlighted" : "";
          return `<span class="code-line${highlightClass}" data-line="${lineNum}"><span class="code-line-number">${lineNum}</span><span class="code-line-content">${escapeHtml(line)}</span></span>`;
        }
      )
      .join("\n")}</code></pre>`;
    return { html, highlightLines: highlightLines || [] };
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

