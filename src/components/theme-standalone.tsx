"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DecompilePipelineOverlay } from "@/components/decompile/decompile-pipeline-overlay";
import { TopOverlayActions } from "@/components/top-overlay-actions";
import { composeButtonDataset } from "@/datasets/compose/button";
import { swiftuiButtonDataset } from "@/datasets/swiftui/button";
import type { Platform } from "@/lib/device";
import { themesMetadata, getThemeMetadataById, loadThemeComponent } from "@/themes";
import type { ThemeDefinition } from "@/themes/types";
import type { ThemeMetadata } from "@/themes/metadata";

type ShareState = "idle" | "shared" | "copied" | "error";

interface ThemeStandaloneProps {
  themeId: string;
  platformHint: Platform;
}

export function ThemeStandalone({ themeId, platformHint }: ThemeStandaloneProps) {
  const [themeDefinition, setThemeDefinition] = useState<ThemeDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const themeMetadata = useMemo(() => {
    return getThemeMetadataById(themeId) ?? themesMetadata[0];
  }, [themeId]);

  // Load theme component dynamically
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    
    loadThemeComponent(themeId).then((theme) => {
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
  }, [themeId]);

  const currentIndex = useMemo(() => {
    const found = themesMetadata.findIndex((item: ThemeMetadata) => item.id === themeMetadata.id);
    return found >= 0 ? found : 0;
  }, [themeMetadata.id]);

  const effectivePlatform = useMemo<Platform>(() => {
    const supported = themeMetadata.supportedPlatforms ?? [];
    const mobileCandidates = supported.filter((p: Platform): p is "ios" | "android" => p === "ios" || p === "android");

    if (mobileCandidates.length > 0) {
      if ((platformHint === "ios" || platformHint === "android") && mobileCandidates.includes(platformHint)) {
        return platformHint;
      }
      return mobileCandidates[0];
    }

    return "ios";
  }, [platformHint, themeMetadata]);

  const dataset = useMemo(() => {
    if (themeMetadata.id === "swiftui") return swiftuiButtonDataset;
    if (themeMetadata.id === "compose") return composeButtonDataset;
    return undefined;
  }, [themeMetadata.id]);
  const [overlayMode, setOverlayMode] = useState<"hidden" | "autoplay" | "manual">("hidden");
  const [overlayNonce, setOverlayNonce] = useState(0);
  const [shareState, setShareState] = useState<ShareState>("idle");
  const ThemeIcon = themeMetadata.icon;
  const themeInitial = useMemo(() => themeMetadata.label.slice(0, 1).toUpperCase(), [themeMetadata.label]);

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
      title: `X-Windows • ${themeMetadata.label}`,
      text: themeMetadata.description,
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
  }, [themeMetadata]);

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
      const nextIndex = (currentIndex + offset + themesMetadata.length) % themesMetadata.length;
      const target = themesMetadata[nextIndex];
      router.replace(`/theme/${target.id}`);
    },
    [currentIndex, router],
  );

  const handleHome = useCallback(() => {
    router.push("/");
  }, [router]);

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

  if (isLoading || !themeDefinition) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center bg-slate-950 text-slate-100">
        <div className="text-slate-400">Loading theme...</div>
      </div>
    );
  }

  const ThemeComponent = themeDefinition.component;

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-slate-950 text-slate-100">
      {showOverlay && dataset && (
        <DecompilePipelineOverlay
          key={`${themeMetadata.id}-${overlayNonce}`}
          dataset={dataset}
          themeId={themeMetadata.id === "compose" ? "compose" : "swiftui"}
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
        onHome={handleHome}
        githubUrl="https://github.com/rosuH/X-Windows"
        themeIcon={ThemeIcon}
        themeInitial={themeInitial}
        onDecompile={dataset ? triggerOverlay : undefined}
        decompileLabel="Replay decompile pipeline"
      />
    </div>
  );
}

