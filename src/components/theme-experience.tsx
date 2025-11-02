"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Platform } from "@/lib/device";
import { platformLabel } from "@/lib/device";
import { PostShell } from "@/components/post-shell";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { themes, getThemeById } from "@/themes";

interface ThemeExperienceProps {
  initialThemeId: string;
  platform: Platform;
}

export function ThemeExperience({ initialThemeId, platform }: ThemeExperienceProps) {
  const [activeThemeId, setActiveThemeId] = useState(initialThemeId);

  useEffect(() => {
    setActiveThemeId(initialThemeId);
  }, [initialThemeId]);

  const theme = useMemo(() => {
    return getThemeById(activeThemeId) ?? themes[0];
  }, [activeThemeId]);

  const ThemeComponent = theme.component;
  const isRecommended = theme.supportedPlatforms?.includes(platform);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("theme", theme.id);
    window.history.replaceState({}, "", url.toString());
  }, [theme.id]);

  return (
    <PostShell
      sidebar={
        <ThemeSwitcher
          themes={themes}
          value={theme.id}
          onValueChange={setActiveThemeId}
          platform={platform}
        />
      }
    >
      <div className="flex min-h-[320px] flex-col gap-4">
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-5 py-4 text-sm text-slate-300">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="font-medium text-slate-100">{theme.label}</span>
              <span>{theme.description}</span>
            </div>
            <div className="flex flex-col items-end gap-2 text-xs text-slate-400">
              <span>
                Current device: <strong className="text-slate-100">{platformLabel(platform)}</strong>
              </span>
              <span className={isRecommended ? "text-emerald-300" : "text-slate-500"}>
                {isRecommended ? "Recommended for you" : "Can also play"}
              </span>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            <Link
              href={`/theme/${theme.id}`}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/10"
            >
              Open standalone route /theme/{theme.id}
            </Link>
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <ThemeComponent platform={platform} mode="embedded" />
        </div>
      </div>
    </PostShell>
  );
}
