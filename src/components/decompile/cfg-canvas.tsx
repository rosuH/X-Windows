"use client";

import { useEffect, useRef } from "react";

interface CfgCanvasProps {
  stageProgress: number;
  accent?: "swift" | "android";
  height?: number;
  reducedMotion?: boolean;
}

const nodes = [
  { x: 60, y: 50 },
  { x: 180, y: 20 },
  { x: 180, y: 80 },
  { x: 300, y: 35 },
  { x: 300, y: 95 },
];

const edges: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4],
];

export function CfgCanvas({ stageProgress, accent = "swift", height = 160, reducedMotion = false }: CfgCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio ?? 1;
    const { clientWidth, clientHeight } = canvas;
    canvas.width = clientWidth * dpr;
    canvas.height = clientHeight * dpr;
    ctx.reset();
    ctx.scale(dpr, dpr);

    const edgeColor = accent === "swift" ? "rgba(140, 255, 210, 0.45)" : "rgba(80, 200, 255, 0.45)";
    const nodeColor = accent === "swift" ? "rgba(90, 232, 185, 0.95)" : "rgba(120, 200, 255, 0.95)";
    const inactiveColor = "rgba(148, 163, 184, 0.35)";

    ctx.fillStyle = "rgba(15, 23, 42, 0.45)";
    ctx.fillRect(0, 0, clientWidth, clientHeight);

    // Draw edges
    ctx.lineWidth = 1.6;
    const effectiveProgress = reducedMotion ? 1 : stageProgress;

    edges.forEach(([fromIndex, toIndex], idx) => {
      const from = nodes[fromIndex];
      const to = nodes[toIndex];
      const progressThreshold = effectiveProgress * edges.length;
      const intensity = Math.min(Math.max(progressThreshold - idx, 0), 1);
      const color = intensity > 0 ? edgeColor : inactiveColor;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach((node, idx) => {
      const progressThreshold = effectiveProgress * nodes.length;
      const intensity = Math.min(Math.max(progressThreshold - idx, 0), 1);
      const radius = 11 + intensity * 4;
      const gradient = ctx.createRadialGradient(
        node.x,
        node.y,
        0,
        node.x,
        node.y,
        radius
      );
      gradient.addColorStop(0, nodeColor);
      gradient.addColorStop(1, "rgba(255,255,255,0.05)");
      ctx.fillStyle = intensity > 0 ? gradient : inactiveColor;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(15,23,42,0.88)";
      ctx.font = "600 10px 'JetBrains Mono', 'Fira Code', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        `B${idx}`,
        node.x,
        node.y
      );
    });
  }, [stageProgress, accent, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-2xl border border-white/8 bg-slate-950/70"
      style={{ height }}
    />
  );
}

