import { notFound } from "next/navigation";
import { ThemeStandalone } from "@/components/theme-standalone";
import { getRequestPlatform } from "@/lib/request-platform";
import { getThemeById } from "@/themes";

export default async function ThemePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const platform = await getRequestPlatform();
  const theme = getThemeById(id);

  if (!theme) {
    notFound();
  }

  return <ThemeStandalone themeId={theme.id} platformHint={platform} />;
}
