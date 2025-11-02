import { ImageResponse } from "next/og";
import { isValidThemeId } from "@/themes/ids";
import { swiftuiTheme } from "@/themes/swiftui";
import { composeTheme } from "@/themes/compose";
import { memeTheme } from "@/themes/meme";
import type { ThemeDefinition } from "@/themes/types";

export const alt = "Theme";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const themesMap = new Map<string, ThemeDefinition>([
  [swiftuiTheme.id, swiftuiTheme],
  [composeTheme.id, composeTheme],
  [memeTheme.id, memeTheme],
]);

function getThemeById(id: string): ThemeDefinition | undefined {
  return themesMap.get(id);
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const theme = isValidThemeId(id) ? getThemeById(id) : undefined;
  const title = theme?.label || "Theme";
  const description = theme?.description || "View source code directly in X.";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: "bold",
            color: "#ffffff",
            marginBottom: 16,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#cbd5e1",
            maxWidth: 900,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          {description}
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#94a3b8",
          }}
        >
          X-Windows
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}

