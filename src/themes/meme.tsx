"use client";

import Image from "next/image";
import { useMemo } from "react";
import type { ThemeDefinition } from "@/themes/types";
import type { ThemeComponentProps } from "@/themes/types";
import { Sparkles } from "lucide-react";

function MemeTheme({}: ThemeComponentProps) {
  // Check if meme theme is active by checking URL or window location
  const isActive = useMemo(() => {
    if (typeof window === "undefined") return false;
    const url = new URL(window.location.href);
    const themeParam = url.searchParams.get("theme");
    const pathname = window.location.pathname;
    return themeParam === "meme" || pathname.includes("/theme/meme");
  }, []);

  // Detect language: use Chinese version if language starts with 'zh'
  const imageSrc = useMemo(() => {
    if (typeof window === "undefined") return "/meme_tom.webp";
    const lang = navigator.language || navigator.languages?.[0] || "en";
    return lang.startsWith("zh") ? "/meme_tom_zh.webp" : "/meme_tom.webp";
  }, []);

  return (
    <div className="relative flex h-full min-h-[320px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black">
      <Image
        src={imageSrc}
        alt="Meme tom"
        fill
        className="object-contain"
        priority={isActive}
      />
    </div>
  );
}

export const memeTheme: ThemeDefinition = {
  id: "meme",
  label: "Meme Surprise",
  description: "Display fun images or animations to create surprises",
  kind: "media",
  component: MemeTheme,
  accentColor: "#F97316",
  supportedPlatforms: ["ios", "android", "desktop"],
  icon: Sparkles,
};
