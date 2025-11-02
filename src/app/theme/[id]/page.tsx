import { notFound } from "next/navigation";
import { ThemeStandalone } from "@/components/theme-standalone";
import { getRequestPlatform } from "@/lib/request-platform";
import { isValidThemeId } from "@/themes/ids";

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
