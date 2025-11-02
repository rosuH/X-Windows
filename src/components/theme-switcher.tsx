"use client";

import * as Tabs from "@radix-ui/react-tabs";
import clsx from "clsx";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Platform } from "@/lib/device";
import { platformLabel } from "@/lib/device";
import type { ThemeMetadata } from "@/themes/metadata";

interface ThemeSwitcherProps {
  themes: ThemeMetadata[];
  value: string;
  onValueChange: (value: string) => void;
  platform: Platform;
}

type ShareState = "idle" | "shared" | "copied" | "error";

function ThemeCardActions({
  themeId,
  themeLabel,
  onShareClick,
  onCopyClick,
  shareState,
}: {
  themeId: string;
  themeLabel: string;
  onShareClick: (e: React.MouseEvent) => void;
  onCopyClick: (e: React.MouseEvent) => void;
  shareState: ShareState;
}) {
  const handleKeyDown = (e: React.KeyboardEvent, handler: (e: React.MouseEvent) => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      handler(e as unknown as React.MouseEvent);
    }
  };

  return (
    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      <Link
        href={`/theme/${themeId}`}
        className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-400 transition hover:border-white/20 hover:bg-white/10 hover:text-slate-200 sm:h-7 sm:w-7"
        aria-label={`Open ${themeLabel} standalone page`}
        title={`Open ${themeLabel} standalone page`}
        onClick={(e) => e.stopPropagation()}
      >
        <ExternalLinkIcon />
      </Link>
      <div
        role="button"
        tabIndex={0}
        onClick={onShareClick}
        onKeyDown={(e) => handleKeyDown(e, onShareClick)}
        className={clsx(
          "flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border transition focus:outline-none focus:ring-2 focus:ring-white/20 sm:h-7 sm:w-7",
          shareState === "shared" || shareState === "copied"
            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
            : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10 hover:text-slate-200",
        )}
        aria-label="Share theme"
        title="Share theme"
      >
        {shareState === "copied" ? (
          <CopyCheckIcon />
        ) : shareState === "shared" ? (
          <ShareCheckIcon />
        ) : (
          <ShareIcon />
        )}
      </div>
      <div
        role="button"
        tabIndex={0}
        onClick={onCopyClick}
        onKeyDown={(e) => handleKeyDown(e, onCopyClick)}
        className={clsx(
          "flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border transition focus:outline-none focus:ring-2 focus:ring-white/20 sm:h-7 sm:w-7",
          shareState === "copied"
            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
            : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10 hover:text-slate-200",
        )}
        aria-label="Copy URL"
        title="Copy URL"
      >
        {shareState === "copied" ? <CopyCheckIcon /> : <CopyIcon />}
      </div>
    </div>
  );
}

export function ThemeSwitcher({ themes, value, onValueChange, platform }: ThemeSwitcherProps) {
  const [shareStates, setShareStates] = useState<Record<string, ShareState>>({});

  const handleShare = useCallback(
    async (theme: ThemeMetadata, e: React.MouseEvent) => {
      e.stopPropagation();
      const themeId = theme.id;

      const url = typeof window !== "undefined" ? `${window.location.origin}?theme=${themeId}` : "";
      const payload = {
        title: `X-Windows • ${theme.label}`,
        text: theme.description,
        url,
      };

      try {
        if (navigator.share) {
          await navigator.share(payload);
          setShareStates((prev) => ({ ...prev, [themeId]: "shared" }));
          return;
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          setShareStates((prev) => ({ ...prev, [themeId]: "idle" }));
          return;
        }
      }

      try {
        await navigator.clipboard?.writeText?.(payload.url);
        setShareStates((prev) => ({ ...prev, [themeId]: "copied" }));
      } catch {
        setShareStates((prev) => ({ ...prev, [themeId]: "error" }));
      }
    },
    [],
  );

  const handleCopy = useCallback(
    async (theme: ThemeMetadata, e: React.MouseEvent) => {
      e.stopPropagation();
      const themeId = theme.id;

      const url = typeof window !== "undefined" ? `${window.location.origin}?theme=${themeId}` : "";

      try {
        await navigator.clipboard?.writeText?.(url);
        setShareStates((prev) => ({ ...prev, [themeId]: "copied" }));
      } catch {
        setShareStates((prev) => ({ ...prev, [themeId]: "error" }));
      }
    },
    [],
  );

  // Reset share states after 2 seconds
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    Object.keys(shareStates).forEach((themeId) => {
      if (shareStates[themeId] !== "idle" && shareStates[themeId] !== "error") {
        const timer = setTimeout(() => {
          setShareStates((prev) => ({ ...prev, [themeId]: "idle" }));
        }, 2000);
        timers.push(timer);
      }
    });
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [shareStates]);

  return (
    <div className="flex h-full flex-col gap-3 sm:gap-4">
      <div className="rounded-xl border border-white/10 bg-slate-950/50 p-3 text-[10px] uppercase tracking-wide text-slate-400 sm:rounded-2xl sm:p-4 sm:text-xs">
        Current device: <span className="text-slate-100">{platformLabel(platform)}</span>
      </div>
      <Tabs.Root
        orientation="vertical"
        value={value}
        onValueChange={onValueChange}
        className="flex flex-1 flex-col"
      >
        <Tabs.List className="flex flex-1 flex-col gap-2 sm:gap-3">
          {themes.map((theme) => {
            const isActive = theme.id === value;
            const isRecommended = theme.supportedPlatforms?.includes(platform);
            const accent = theme.accentColor ?? "#38bdf8";
            const shareState = shareStates[theme.id] ?? "idle";

            return (
              <Tabs.Trigger
                key={theme.id}
                value={theme.id}
                className={clsx(
                  "group relative flex w-full items-start gap-2 rounded-xl border border-transparent bg-slate-950/30 p-3 text-left transition sm:gap-3 sm:rounded-2xl sm:p-4",
                  isActive
                    ? "border-slate-500/60 bg-slate-800/60"
                    : "hover:border-slate-700/60 hover:bg-slate-900/60",
                )}
                style={
                  isActive
                    ? {
                        borderColor: accent,
                        boxShadow: `0 0 24px ${accent}40`,
                      }
                    : undefined
                }
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:gap-2">
                  <span className="text-xs font-semibold text-slate-100 sm:text-sm">{theme.label}</span>
                  <span className="text-[10px] text-slate-400 sm:text-xs">{theme.description}</span>
                  <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.15em] text-slate-500 sm:gap-2 sm:text-[10px] sm:tracking-[0.2em]">
                    <span className="h-0.5 w-5 rounded-full opacity-70 sm:h-1 sm:w-6" style={{ background: accent }} />
                    <span className={clsx(isRecommended ? "text-emerald-300" : "text-slate-500")}>
                      {isRecommended ? "Recommended" : "Explore"}
                    </span>
                  </span>
                </div>
                <ThemeCardActions
                  themeId={theme.id}
                  themeLabel={theme.label}
                  onShareClick={(e) => handleShare(theme, e)}
                  onCopyClick={(e) => handleCopy(theme, e)}
                  shareState={shareState}
                />
              </Tabs.Trigger>
            );
          })}
        </Tabs.List>
      </Tabs.Root>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.125 4.5H5.25C4.145 4.5 3.375 5.27 3.375 6.375V12.75C3.375 13.855 4.145 14.625 5.25 14.625H12.75C13.855 14.625 14.625 13.855 14.625 12.75V6.375C14.625 5.27 13.855 4.5 12.75 4.5H10.875M9 9.75V2.25M9 2.25L6.75 4.5M9 2.25L11.25 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 7.5C6 6.67157 6.67157 6 7.5 6H13.5C14.3284 6 15 6.67157 15 7.5V13.5C15 14.3284 14.3284 15 13.5 15H7.5C6.67157 15 6 14.3284 6 13.5V7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.75 10.5H3C2.17157 10.5 1.5 9.82843 1.5 9V3C1.5 2.17157 2.17157 1.5 3 1.5H9C9.82843 1.5 10.5 2.17157 10.5 3V3.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyCheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 7.5C6 6.67157 6.67157 6 7.5 6H13.5C14.3284 6 15 6.67157 15 7.5V13.5C15 14.3284 14.3284 15 13.5 15H7.5C6.67157 15 6 14.3284 6 13.5V7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.75 10.5H3C2.17157 10.5 1.5 9.82843 1.5 9V3C1.5 2.17157 2.17157 1.5 3 1.5H9C9.82843 1.5 10.5 2.17157 10.5 3V3.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 9L8 11L12 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShareCheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.125 4.5H5.25C4.145 4.5 3.375 5.27 3.375 6.375V12.75C3.375 13.855 4.145 14.625 5.25 14.625H12.75C13.855 14.625 14.625 13.855 14.625 12.75V6.375C14.625 5.27 13.855 4.5 12.75 4.5H10.875M9 9.75V2.25M9 2.25L6.75 4.5M9 2.25L11.25 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="13.5" cy="4.5" r="2" fill="currentColor" />
      <path
        d="M12.5 4.5L13.25 5.25L14.5 3.75"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.5 4.5H4.5C3.67157 4.5 3 5.17157 3 6V13.5C3 14.3284 3.67157 15 4.5 15H12C12.8284 15 13.5 14.3284 13.5 13.5V10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 3H15V7.5M15 3L9 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
