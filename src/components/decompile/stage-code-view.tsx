"use client";

import clsx from "clsx";
import type {
  BinaryStage,
  LineMapEntry,
  SourceStage,
  IrStage,
} from "../../datasets/types";
import { CodeBlock } from "../code-block";

type Stage = SourceStage | IrStage | BinaryStage;

interface StageCodeViewProps {
  stage: Stage;
  headline?: string;
  accentOverride?: "swift" | "android";
  activeMapEntry?: LineMapEntry;
  compact?: boolean;
}

const accentByLang: Record<Stage["lang"], "swift" | "android"> = {
  swift: "swift",
  sil: "swift",
  "llvm-ir": "swift",
  aarch64: "swift",
  kotlin: "android",
  "jvm-bytecode": "android",
  smali: "android",
};

const badgeLabelByKind: Record<Stage["kind"], string> = {
  source: "SOURCE",
  ir: "IR",
  binary: "BIN",
};

export function StageCodeView({
  stage,
  headline,
  accentOverride,
  activeMapEntry,
  compact = false,
}: StageCodeViewProps) {
  const accent = accentOverride ?? accentByLang[stage.lang];
  const highlightLine = activeMapEntry?.to;
  const breakpointInfo = activeMapEntry
    ? `源 L${activeMapEntry.from} ↔︎ ${stage.lang.toUpperCase()} L${activeMapEntry.to}`
    : undefined;

  return (
    <section className="relative flex h-full w-full flex-col">
      <div className="relative h-full w-full overflow-hidden">
        <CodeBlock
          code={stage.code}
          language={stage.lang}
          variant="frameless"
          highlightLine={highlightLine}
          breakpointInfo={breakpointInfo}
          debugStyle={accent}
        />
      </div>
    </section>
  );
}

