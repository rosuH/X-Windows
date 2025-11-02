import type { Metadata } from "next";
import { ThemeExperience } from "@/components/theme-experience";
import { getRequestPlatform } from "@/lib/request-platform";
import { isValidThemeId, themeIds } from "@/themes/ids";

type HomeSearchParams = Promise<{
  theme?: string;
}>;

export const metadata: Metadata = {
  title: "X-Windows",
  description: "Open a window in X post details. View source code and interactive content directly within X.",
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
