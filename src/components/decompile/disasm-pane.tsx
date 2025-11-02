"use client";

import type { BinaryStage, LineMapEntry } from "../../datasets/types";
import { StageCodeView } from "./stage-code-view";

interface DisasmPaneProps {
  stage: BinaryStage;
  activeMapEntry?: LineMapEntry;
}

export function DisasmPane({ stage, activeMapEntry }: DisasmPaneProps) {
  return (
    <StageCodeView
      stage={stage}
      accentOverride={stage.lang === "aarch64" ? "swift" : "android"}
      activeMapEntry={activeMapEntry}
      headline="Disassembly"
    />
  );
}

