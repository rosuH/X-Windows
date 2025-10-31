import type { Metadata } from "next";
import { ThemeExperience } from "@/components/theme-experience";
import { getRequestPlatform } from "@/lib/request-platform";
import { getDefaultThemeForPlatform, getThemeById } from "@/themes";

type HomeSearchParams = Promise<{
  theme?: string;
}>;

export const metadata: Metadata = {
  title: "X-Windows",
  description: "在 X 风格帖子里打开迷你 IDE 的跨平台实验场",
};

export default async function Home({
  searchParams,
}: {
  searchParams: HomeSearchParams;
}) {
  const params = await searchParams;
  const platform = await getRequestPlatform();
  const requestedTheme = getThemeById(params?.theme);
  const initialTheme = requestedTheme ?? getDefaultThemeForPlatform(platform);

  return (
    <ThemeExperience initialThemeId={initialTheme.id} platform={platform} />
  );
}
