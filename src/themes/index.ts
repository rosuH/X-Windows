import { composeTheme } from "@/themes/compose";
import { memeTheme } from "@/themes/meme";
import { swiftuiTheme } from "@/themes/swiftui";
import type { ThemeDefinition } from "@/themes/types";
import type { Platform } from "@/lib/device";

export const themes: ThemeDefinition[] = [swiftuiTheme, composeTheme, memeTheme];

const themesMap = new Map<string, ThemeDefinition>(
  themes.map((theme) => [theme.id, theme]),
);

export function getThemeById(id: string | undefined): ThemeDefinition | undefined {
  if (!id) {
    return undefined;
  }

  return themesMap.get(id);
}

export function getDefaultThemeForPlatform(platform: Platform): ThemeDefinition {
  const prioritized = themes.find((theme) =>
    theme.supportedPlatforms?.includes(platform),
  );

  return prioritized ?? themes[0];
}
