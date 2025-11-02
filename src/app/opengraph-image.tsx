import { ImageResponse } from "next/og";

export const alt = "X-Windows";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
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
            fontSize: 72,
            fontWeight: "bold",
            color: "#ffffff",
            marginBottom: 20,
          }}
        >
          X-Windows
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#cbd5e1",
            maxWidth: 800,
            textAlign: "center",
          }}
        >
          Mini IDE experience in X-style posts
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}

