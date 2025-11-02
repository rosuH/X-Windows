"use client";

import clsx from "clsx";
import { useMemo } from "react";
import type { AstNode, AstStage } from "../../datasets/types";

interface AstTreeViewProps {
  stage: AstStage;
  focusPath?: string[];
  accent?: "swift" | "android";
}

export function AstTreeView({ stage, focusPath, accent = "swift" }: AstTreeViewProps) {
  const nodes = stage.nodes;
  const nodeMap = useMemo(() => {
    return new Map<string, AstNode>(nodes.map((node) => [node.id, node]));
  }, [nodes]);

  const computedFocusPath = focusPath ?? stage.focusPath ?? [];
  const focusSet = useMemo(() => new Set(computedFocusPath), [computedFocusPath]);
  const activeId = computedFocusPath[computedFocusPath.length - 1];

  const roots = useMemo(() => {
    const childIds = new Set<string>();
    nodes.forEach((node) => {
      node.children?.forEach((child) => childIds.add(child));
    });
    return nodes
      .filter((node) => !childIds.has(node.id))
      .map((node) => node.id);
  }, [nodes]);

  const renderNode = (id: string, depth: number) => {
    const node = nodeMap.get(id);
    if (!node) return null;

    const isInFocus = focusSet.has(id);
    const isActive = activeId === id;

    return (
      <li key={id} className="relative">
        <div
          className={clsx(
            "relative rounded-2xl border px-4 py-3 transition-colors",
            accent === "swift"
              ? isInFocus
                ? "border-emerald-400/40 bg-emerald-500/5"
                : "border-white/8 bg-slate-900/60"
              : isInFocus
              ? "border-sky-400/50 bg-sky-500/5"
              : "border-white/8 bg-slate-900/60"
          )}
          style={isActive ? { boxShadow: "0 0 25px rgba(80,220,180,0.35)" } : undefined}
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-semibold text-slate-200" style={{ fontSize: "0.8rem" }}>
              {node.label}
            </span>
            <span
              className="uppercase text-slate-500"
              style={{ fontSize: "0.6rem", letterSpacing: "0.2em" }}
            >
              {node.id}
            </span>
          </div>
          {node.details && (
            <p className="mt-2 text-slate-400" style={{ fontSize: "0.65rem" }}>
              {node.details}
            </p>
          )}
        </div>
        {node.children && node.children.length > 0 && (
          <ul className="ml-6 mt-3 space-y-3 border-l border-white/10 pl-5">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <section className="relative flex h-full flex-col gap-4 border border-white/6 bg-slate-950/70 p-6">
      <header className="flex items-center justify-between">
        <div className="text-xs uppercase text-slate-400" style={{ letterSpacing: "0.35em" }}>
          AST
        </div>
        <span
          className={clsx(
            "rounded-full px-3 py-1 font-medium",
            accent === "swift"
              ? "bg-emerald-500/10 text-emerald-200"
              : "bg-sky-500/10 text-sky-200"
          )}
          style={{ fontSize: "0.65rem" }}
        >
          {`${nodes.length} 节点`}
        </span>
      </header>
      <div className="scrollbar-thin overflow-y-auto pr-2 text-xs text-slate-300">
        <ul className="space-y-3">
          {(roots.length > 0 ? roots : nodes.map((node) => node.id)).map((id) =>
            renderNode(id, 0)
          )}
        </ul>
      </div>
    </section>
  );
}

