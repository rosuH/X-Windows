import { MetadataRoute } from "next";
import { themeIds } from "@/themes/ids";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://x-windows.rosuh.me";
  const base = new URL(baseUrl);

  const routes = ["/", ...themeIds.map((id) => `/theme/${id}`)];

  return routes.map((path) => ({
    url: new URL(path, base).toString(),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
}

