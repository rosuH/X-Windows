import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ThemeStandalone } from "@/components/theme-standalone";
import { getRequestPlatform } from "@/lib/request-platform";
import { isValidThemeId } from "@/themes/ids";
import { swiftuiTheme } from "@/themes/swiftui";
import { composeTheme } from "@/themes/compose";
import { memeTheme } from "@/themes/meme";
import type { ThemeDefinition } from "@/themes/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://x-windows.rosuh.me";

// Server-side safe theme map
const themesMap = new Map<string, ThemeDefinition>([
  [swiftuiTheme.id, swiftuiTheme],
  [composeTheme.id, composeTheme],
  [memeTheme.id, memeTheme],
]);

function getThemeById(id: string): ThemeDefinition | undefined {
  return themesMap.get(id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const theme = getThemeById(id);

  if (!theme || !isValidThemeId(id)) {
    return {
      title: "Theme Not Found",
    };
  }

  const themeUrl = `${siteUrl}/theme/${id}`;
  const title = `${theme.label} | X-Windows`;
  const description = theme.description || `View ${theme.label} source code directly in X.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/theme/${id}`,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: themeUrl,
      siteName: "X-Windows",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ThemePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const platform = await getRequestPlatform();
  
  if (!isValidThemeId(id)) {
    notFound();
  }

  return <ThemeStandalone themeId={id} platformHint={platform} />;
}
