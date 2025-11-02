"use client";

import clsx from "clsx";
import { useMemo } from "react";

export interface CliFrameProps {
  children: React.ReactNode;
  reducedMotion?: boolean;
  className?: string;
}

/**
 * 提供全屏 CLI 终端外观，带扫描线/噪点效果并可降级。
 */
export function CliFrame({
  children,
  reducedMotion = false,
  className,
}: CliFrameProps) {
  const noiseDataUrl = useMemo(() => {
    if (typeof window === "undefined" || reducedMotion) return undefined;

    // 生成简易噪点 data URL，避免额外静态资源。
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const context = canvas.getContext("2d");
      if (!context) return undefined;

      const imageData = context.createImageData(canvas.width, canvas.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const shade = 24 + Math.random() * 16;
        imageData.data[i] = shade;
        imageData.data[i + 1] = shade;
        imageData.data[i + 2] = shade;
        imageData.data[i + 3] = 35;
      }
      context.putImageData(imageData, 0, 0);
      return canvas.toDataURL();
    } catch (error) {
      console.warn("CLI noise generation failed", error);
      return undefined;
    }
  }, [reducedMotion]);

  return (
    <div
      className={clsx(
        "relative h-full w-full overflow-hidden text-[0.9rem] leading-relaxed",
        "font-mono text-green-100",
        className
      )}
      style={{
        backgroundColor: "#03070d",
      }}
    >
      {!reducedMotion && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(180deg, rgba(12, 24, 32, 0.35) 0px, rgba(12, 24, 32, 0.35) 1px, transparent 1px, transparent 3px)",
          }}
        />
      )}
      {!reducedMotion && noiseDataUrl && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-30"
          style={{
            backgroundImage: `url(${noiseDataUrl})`,
            backgroundSize: "256px 256px",
            animation: "cliNoiseShift 1.8s steps(2) infinite",
          }}
        />
      )}
      <div
        className="relative h-full w-full min-h-full overflow-y-auto px-8 py-10"
        style={{
          boxShadow: "0 0 55px rgba(0, 255, 170, 0.06)",
        }}
      >
        {children}
      </div>
      {!reducedMotion && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
          style={{
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent 65%)",
          }}
        />
      )}
    </div>
  );
}

const styleSheet = typeof document !== "undefined" ? document.createElement("style") : null;

if (styleSheet) {
  styleSheet.textContent = `@keyframes cliNoiseShift { from { transform: translate3d(0,0,0); } to { transform: translate3d(-12px,-18px,0); } }`;
  document.head.appendChild(styleSheet);
}


