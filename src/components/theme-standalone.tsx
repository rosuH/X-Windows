"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Platform } from "@/lib/device";
import { themes, getThemeById } from "@/themes";

type ShareState = "idle" | "shared" | "copied" | "error";

interface ThemeStandaloneProps {
  themeId: string;
  platformHint: Platform;
}

export function ThemeStandalone({ themeId, platformHint }: ThemeStandaloneProps) {
  const theme = useMemo(() => getThemeById(themeId) ?? themes[0], [themeId]);
  const router = useRouter();

  const currentIndex = useMemo(() => {
    const found = themes.findIndex((item) => item.id === theme.id);
    return found >= 0 ? found : 0;
  }, [theme.id]);

  const effectivePlatform = useMemo<Platform>(() => {
    const supported = theme.supportedPlatforms ?? [];
    const mobileCandidates = supported.filter((p) => p === "ios" || p === "android");

    if (mobileCandidates.length > 0) {
      if (mobileCandidates.includes(platformHint) && (platformHint === "ios" || platformHint === "android")) {
        return platformHint;
      }
      return mobileCandidates[0];
    }

    return "ios";
  }, [platformHint, theme]);

  const ThemeComponent = theme.component;
  const [shareState, setShareState] = useState<ShareState>("idle");
  const ThemeIcon = theme.icon;
  const themeInitial = useMemo(() => theme.label.slice(0, 1).toUpperCase(), [theme.label]);

  const handleShare = useCallback(async () => {
    const payload = {
      title: `X-Windows • ${theme.label}`,
      text: theme.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(payload);
        setShareState("shared");
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setShareState("idle");
        return;
      }
    }

    try {
      await navigator.clipboard?.writeText?.(payload.url);
      setShareState("copied");
    } catch {
      setShareState("error");
    }
  }, [theme]);

  useEffect(() => {
    if (shareState === "idle") return;
    const timer = window.setTimeout(() => setShareState("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [shareState]);

  const shareLabel = {
    idle: "分享",
    shared: "已分享",
    copied: "已复制链接",
    error: "复制失败",
  }[shareState];

  const navigateTheme = useCallback(
    (offset: number) => {
      const nextIndex = (currentIndex + offset + themes.length) % themes.length;
      const target = themes[nextIndex];
      router.replace(`/theme/${target.id}`);
    },
    [currentIndex, router],
  );

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-slate-950 py-6 text-slate-100">
      <div className="w-full max-w-5xl px-2 pb-32 sm:px-4 lg:max-w-4xl xl:max-w-5xl">
        <ThemeComponent platform={effectivePlatform} mode="standalone" />
      </div>

      <div className="fixed bottom-4 left-0 right-0 px-3">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between rounded-2xl border border-white/10 bg-slate-900/85 px-3 py-3 shadow-[0_24px_48px_rgba(8,12,24,0.45)] backdrop-blur-xl">
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => navigateTheme(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-slate-100 transition hover:border-white/20 hover:bg-white/20"
              aria-label="上一主题"
            >
              <ArrowUpIcon />
            </button>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold uppercase text-slate-100">
              {ThemeIcon ? <ThemeIcon size={18} strokeWidth={1.8} aria-hidden /> : themeInitial}
            </span>
            <button
              type="button"
              onClick={() => navigateTheme(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-slate-100 transition hover:border-white/20 hover:bg-white/20"
              aria-label="下一主题"
            >
              <ArrowDownIcon />
            </button>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 sm:text-sm">
            <span className="hidden min-w-[96px] justify-end text-right sm:flex">{shareLabel}</span>
            <button
              type="button"
              onClick={handleShare}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-slate-100 transition hover:border-white/20 hover:bg-white/20"
              aria-label="分享主题"
              title={shareLabel}
            >
              <ShareIcon />
            </button>
            <Link
              href="https://github.com/rosuH/X-Windows"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-900 transition hover:bg-slate-200"
              aria-label="打开 GitHub 仓库"
            >
              <GitHubIcon />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 14.25V3.75M9 3.75L4.5 8.25M9 3.75L13.5 8.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 3.75V14.25M9 14.25L4.5 9.75M9 14.25L13.5 9.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
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

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0.5C5.648 0.5 0.5 5.648 0.5 12C0.5 17.303 4.035 21.794 8.839 23.25C9.439 23.358 9.667 22.99 9.667 22.676C9.667 22.397 9.656 21.631 9.651 20.676C6.297 21.402 5.593 19.095 5.593 19.095C5.047 17.739 4.259 17.373 4.259 17.373C3.171 16.632 4.342 16.646 4.342 16.646C5.547 16.731 6.172 17.889 6.172 17.889C7.247 19.735 8.985 19.206 9.646 18.908C9.754 18.134 10.06 17.606 10.4 17.314C7.57 17.019 4.594 15.98 4.594 11.385C4.594 10.079 5.062 9.019 5.83 8.197C5.709 7.902 5.3 6.665 5.94 5.053C5.94 5.053 6.939 4.741 9.64 6.49C10.576 6.232 11.576 6.103 12.576 6.098C13.576 6.103 14.576 6.232 15.512 6.49C18.213 4.741 19.212 5.053 19.212 5.053C19.852 6.665 19.443 7.902 19.322 8.197C20.09 9.019 20.558 10.079 20.558 11.385C20.558 15.994 17.576 17.016 14.736 17.306C15.16 17.674 15.542 18.423 15.542 19.563C15.542 21.145 15.526 22.303 15.526 22.676C15.526 22.991 15.75 23.363 16.359 23.249C21.166 21.791 24.699 17.303 24.699 12C24.699 5.648 19.551 0.5 13.199 0.5H12Z" />
    </svg>
  );
}


