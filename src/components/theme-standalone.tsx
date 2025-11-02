"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DecompilePipelineOverlay } from "@/components/decompile/decompile-pipeline-overlay";
import { TopOverlayActions } from "@/components/top-overlay-actions";
import { composeButtonDataset } from "@/datasets/compose/button";
import { swiftuiButtonDataset } from "@/datasets/swiftui/button";
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
    const mobileCandidates = supported.filter((p): p is "ios" | "android" => p === "ios" || p === "android");

    if (mobileCandidates.length > 0) {
      if ((platformHint === "ios" || platformHint === "android") && mobileCandidates.includes(platformHint)) {
        return platformHint;
      }
      return mobileCandidates[0];
    }

    return "ios";
  }, [platformHint, theme]);

  const ThemeComponent = theme.component;
  const dataset = useMemo(() => {
    if (theme.id === "swiftui") return swiftuiButtonDataset;
    if (theme.id === "compose") return composeButtonDataset;
    return undefined;
  }, [theme.id]);
  const [overlayMode, setOverlayMode] = useState<"hidden" | "autoplay" | "manual">("hidden");
  const [overlayNonce, setOverlayNonce] = useState(0);
  const [shareState, setShareState] = useState<ShareState>("idle");
  const ThemeIcon = theme.icon;
  const themeInitial = useMemo(() => theme.label.slice(0, 1).toUpperCase(), [theme.label]);

  useEffect(() => {
    if (!dataset) {
      setOverlayMode("hidden");
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    // Always autoplay on first load
    setOverlayMode((mode) => {
      if (mode !== "autoplay") {
        setOverlayNonce((nonce) => nonce + 1);
        return "autoplay";
      }
      return mode;
    });
  }, [dataset]);

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
    idle: "Share",
    shared: "Shared",
    copied: "Link copied",
    error: "Copy failed",
  }[shareState];

  const navigateTheme = useCallback(
    (offset: number) => {
      const nextIndex = (currentIndex + offset + themes.length) % themes.length;
      const target = themes[nextIndex];
      router.replace(`/theme/${target.id}`);
    },
    [currentIndex, router],
  );

  const handleOverlayResolve = useCallback(() => {
    setOverlayMode("hidden");
  }, []);

  const triggerOverlay = useCallback(() => {
    if (!dataset) return;
    setOverlayMode(() => {
      setOverlayNonce((nonce) => nonce + 1);
      return "manual";
    });
  }, [dataset]);

  const showOverlay = Boolean(dataset && overlayMode !== "hidden");
  const overlayAutoPlay = overlayMode !== "hidden";

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-slate-950 text-slate-100">
      {showOverlay && dataset && (
        <DecompilePipelineOverlay
          key={`${theme.id}-${overlayNonce}`}
          dataset={dataset}
          themeId={theme.id === "compose" ? "compose" : "swiftui"}
          autoPlay={overlayAutoPlay}
          onFinish={handleOverlayResolve}
          onSkip={handleOverlayResolve}
        />
      )}
      <div className="w-full max-w-5xl pb-32 sm:px-4 lg:max-w-4xl xl:max-w-5xl">
        <ThemeComponent platform={effectivePlatform} mode="standalone" />
      </div>

      <TopOverlayActions
        label={shareLabel}
        onPrev={() => navigateTheme(-1)}
        onNext={() => navigateTheme(1)}
        onShare={handleShare}
        githubUrl="https://github.com/rosuH/X-Windows"
        themeIcon={ThemeIcon}
        themeInitial={themeInitial}
        onDecompile={dataset ? triggerOverlay : undefined}
        decompileLabel="Replay decompile pipeline"
      />
    </div>
  );
}

