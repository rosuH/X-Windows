import type { ThemeDefinition } from "@/themes/types";
import { themesMetadata, type ThemeMetadata } from "@/themes/metadata";

// Dynamic loader for theme components
export async function loadThemeComponent(themeId: string): Promise<ThemeDefinition | null> {
  try {
    switch (themeId) {
      case "swiftui":
        const { swiftuiTheme } = await import("@/themes/swiftui");
        return swiftuiTheme;
      case "compose":
        const { composeTheme } = await import("@/themes/compose");
        return composeTheme;
      case "meme":
        const { memeTheme } = await import("@/themes/meme");
        return memeTheme;
      default:
        return null;
    }
  } catch (error) {
    console.error(`Failed to load theme ${themeId}:`, error);
    return null;
  }
}

// Re-export metadata
export { themesMetadata, getThemeMetadataById, getDefaultThemeMetadataForPlatform, themeIds, isValidThemeId } from "@/themes/metadata";
export type { ThemeMetadata } from "@/themes/metadata";

