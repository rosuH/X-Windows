"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Platform } from "@/lib/device";
import { platformLabel } from "@/lib/device";
import { PostShell } from "@/components/post-shell";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { themesMetadata, getThemeMetadataById, loadThemeComponent } from "@/themes";
import type { ThemeDefinition } from "@/themes/types";

interface ThemeExperienceProps {
  initialThemeId: string;
  platform: Platform;
}

export function ThemeExperience({ initialThemeId, platform }: ThemeExperienceProps) {
  const [activeThemeId, setActiveThemeId] = useState(initialThemeId);
  const [themeDefinition, setThemeDefinition] = useState<ThemeDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setActiveThemeId(initialThemeId);
  }, [initialThemeId]);

  // Load theme component dynamically
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    
    loadThemeComponent(activeThemeId).then((theme) => {
      if (!cancelled) {
        setThemeDefinition(theme);
        setIsLoading(false);
      }
    }).catch((error) => {
      if (!cancelled) {
        console.error("Failed to load theme:", error);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [activeThemeId]);

  const themeMetadata = useMemo(() => {
    return getThemeMetadataById(activeThemeId) ?? themesMetadata[0];
  }, [activeThemeId]);

  const isRecommended = themeMetadata.supportedPlatforms?.includes(platform);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("theme", themeMetadata.id);
    window.history.replaceState({}, "", url.toString());
  }, [themeMetadata.id]);

  if (isLoading || !themeDefinition) {
    return (
      <PostShell
        sidebar={
          <ThemeSwitcher
            themes={themesMetadata}
            value={themeMetadata.id}
            onValueChange={setActiveThemeId}
            platform={platform}
          />
        }
      >
        <div className="flex min-h-[280px] flex-col gap-3 sm:min-h-[320px] sm:gap-4">
          <div className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-3 text-xs text-slate-300 sm:rounded-2xl sm:px-5 sm:py-4 sm:text-sm">
            <div className="font-mono text-emerald-300">loading</div>
          </div>
        </div>
      </PostShell>
    );
  }

  const ThemeComponent = themeDefinition.component;

  return (
    <PostShell
      sidebar={
        <ThemeSwitcher
          themes={themesMetadata}
          value={themeMetadata.id}
          onValueChange={setActiveThemeId}
          platform={platform}
        />
      }
    >
      <div className="flex min-h-[280px] flex-col gap-3 sm:min-h-[320px] sm:gap-4">
        <div className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-3 text-xs text-slate-300 sm:rounded-2xl sm:px-5 sm:py-4 sm:text-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-medium text-slate-100">{themeMetadata.label}</span>
              <span className="text-xs sm:text-sm">{themeMetadata.description}</span>
            </div>
            <div className="flex flex-col gap-1.5 text-[10px] text-slate-400 sm:items-end sm:gap-2 sm:text-xs">
              <span>
                Current device: <strong className="text-slate-100">{platformLabel(platform)}</strong>
              </span>
              <span className={isRecommended ? "text-emerald-300" : "text-slate-500"}>
                {isRecommended ? "Recommended for you" : "Can also play"}
              </span>
            </div>
          </div>
          <div className="mt-3 text-[10px] text-slate-400 sm:text-xs">
            <Link
              href={`/theme/${themeMetadata.id}`}
              className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/10 sm:px-3"
            >
              <span className="hidden sm:inline">Open standalone route /theme/{themeMetadata.id}</span>
              <span className="sm:hidden">Standalone /theme/{themeMetadata.id}</span>
            </Link>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <ThemeComponent platform={platform} mode="embedded" />
        </div>
      </div>
    </PostShell>
  );
}
