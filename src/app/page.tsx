import type { Metadata } from "next";
import { ThemeExperience } from "@/components/theme-experience";
import { getRequestPlatform } from "@/lib/request-platform";
import { isValidThemeId, themeIds } from "@/themes/ids";

type HomeSearchParams = Promise<{
  theme?: string;
}>;

export const metadata: Metadata = {
  title: "X-Windows",
  description: "Cross-platform playground for opening mini IDE in X-style posts",
};

export default async function Home({
  searchParams,
}: {
  searchParams: HomeSearchParams;
}) {
  const params = await searchParams;
  const platform = await getRequestPlatform();
  // Use the first theme as default, actual component lookup happens on client side
  const initialThemeId = (params?.theme && isValidThemeId(params.theme)) 
    ? params.theme 
    : themeIds[0];

  return (
    <ThemeExperience initialThemeId={initialThemeId} platform={platform} />
  );
}
