"use client";

import * as Tabs from "@radix-ui/react-tabs";
import clsx from "clsx";
import type { Platform } from "@/lib/device";
import { platformLabel } from "@/lib/device";
import type { ThemeDefinition } from "@/themes/types";

interface ThemeSwitcherProps {
  themes: ThemeDefinition[];
  value: string;
  onValueChange: (value: string) => void;
  platform: Platform;
}

export function ThemeSwitcher({ themes, value, onValueChange, platform }: ThemeSwitcherProps) {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-xs uppercase tracking-wide text-slate-400">
        Current device: <span className="text-slate-100">{platformLabel(platform)}</span>
      </div>
      <Tabs.Root
        orientation="vertical"
        value={value}
        onValueChange={onValueChange}
        className="flex flex-1 flex-col"
      >
        <Tabs.List className="flex flex-1 flex-col gap-3">
          {themes.map((theme) => {
            const isActive = theme.id === value;
            const isRecommended = theme.supportedPlatforms?.includes(platform);
            const accent = theme.accentColor ?? "#38bdf8";
            return (
              <Tabs.Trigger
                key={theme.id}
                value={theme.id}
                className={clsx(
                  "group flex w-full flex-col gap-2 rounded-2xl border border-transparent bg-slate-950/30 p-4 text-left transition",
                  isActive
                    ? "border-slate-500/60 bg-slate-800/60"
                    : "hover:border-slate-700/60 hover:bg-slate-900/60",
                )}
                style={
                  isActive
                    ? {
                        borderColor: accent,
                        boxShadow: `0 0 32px ${accent}40`,
                      }
                    : undefined
                }
              >
                <span className="text-sm font-semibold text-slate-100">{theme.label}</span>
                <span className="text-xs text-slate-400">{theme.description}</span>
                <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  <span className="h-1 w-6 rounded-full opacity-70" style={{ background: accent }} />
                  <span className={clsx(isRecommended ? "text-emerald-300" : "text-slate-500")}>
                    {isRecommended ? "Recommended" : "Explore"}
                  </span>
                </span>
              </Tabs.Trigger>
            );
          })}
        </Tabs.List>
      </Tabs.Root>
    </div>
  );
}
