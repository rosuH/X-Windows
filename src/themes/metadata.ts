import type { ThemeKind } from "@/themes/types";
import type { Platform } from "@/lib/device";
import type { LucideIcon } from "lucide-react";
import type { FC, SVGProps } from "react";
import { Sparkles } from "lucide-react";
import { SwiftIcon } from "@/lib/icons";
import { AndroidHead3DIcon } from "@/lib/icons";

export type IconComponent = FC<SVGProps<SVGSVGElement>>;

// Theme metadata only (no component)
export interface ThemeMetadata {
  id: string;
  label: string;
  description: string;
  kind: ThemeKind;
  accentColor?: string;
  supportedPlatforms?: Platform[];
  icon?: LucideIcon | IconComponent;
}

// Theme metadata registry
export const themesMetadata: ThemeMetadata[] = [
  {
    id: "swiftui",
    label: "SwiftUI Code",
    description: "Present SwiftUI editor experience in X-style page",
    kind: "code",
    accentColor: "#0A84FF",
    supportedPlatforms: ["ios", "desktop"],
    icon: SwiftIcon,
  },
  {
    id: "compose",
    label: "Compose UI",
    description: "Present Jetpack Compose editor experience for Android visitors",
    kind: "code",
    accentColor: "#3DDC84",
    supportedPlatforms: ["android", "desktop"],
    icon: AndroidHead3DIcon,
  },
  {
    id: "meme",
    label: "Meme Surprise",
    description: "Display fun images or animations to create surprises",
    kind: "media",
    accentColor: "#F97316",
    supportedPlatforms: ["ios", "android", "desktop"],
    icon: Sparkles,
  },
];

const themesMetadataMap = new Map<string, ThemeMetadata>(
  themesMetadata.map((theme) => [theme.id, theme]),
);

export function getThemeMetadataById(id: string | undefined): ThemeMetadata | undefined {
  if (!id) {
    return undefined;
  }
  return themesMetadataMap.get(id);
}

export function getDefaultThemeMetadataForPlatform(platform: Platform): ThemeMetadata {
  const prioritized = themesMetadata.find((theme) =>
    theme.supportedPlatforms?.includes(platform),
  );
  return prioritized ?? themesMetadata[0];
}

export const themeIds = ["swiftui", "compose", "meme"] as const;

export function isValidThemeId(id: string): boolean {
  return themeIds.includes(id as any);
}

