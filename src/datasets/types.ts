export type CodeLang =
  | 'swift'
  | 'kotlin'
  | 'sil'
  | 'llvm-ir'
  | 'jvm-bytecode'
  | 'smali'
  | 'aarch64';

export type StageKind = 'source' | 'ast' | 'ir' | 'binary' | 'rev';

export type LineMapEntry = {
  from: number;
  to: number;
};

export type LineMap = LineMapEntry[];

export type AstNode = {
  id: string;
  label: string;
  children?: string[];
  details?: string;
};

export type SourceStage = {
  kind: 'source';
  lang: CodeLang;
  code: string;
  title?: string;
};

export type AstStage = {
  kind: 'ast';
  nodes: AstNode[];
  focusPath?: string[];
};

export type IrStage = {
  kind: 'ir';
  lang: CodeLang;
  code: string;
  map?: LineMap;
  title?: string;
};

export type BinaryStage = {
  kind: 'binary';
  lang: CodeLang;
  code: string;
  map?: LineMap;
  title?: string;
};

export type ReverseStage = {
  kind: 'rev';
  notes: string;
};

export type DecompileStage =
  | SourceStage
  | AstStage
  | IrStage
  | BinaryStage
  | ReverseStage;

export type DecompileDataset = {
  id: string;
  title: string;
  description?: string;
  stages: DecompileStage[];
};

export type DecompileSample = {
  dataset: DecompileDataset;
  themeId: 'swiftui' | 'compose';
};

