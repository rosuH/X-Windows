import Image from "next/image";
import type { ThemeDefinition } from "@/themes/types";
import type { ThemeComponentProps } from "@/themes/types";
import { Sparkles } from "lucide-react";

function MemeTheme({}: ThemeComponentProps) {
  return (
    <div className="relative flex h-full min-h-[320px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black">
      <Image
        src="/meme_tom.png"
        alt="Meme tom"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}

export const memeTheme: ThemeDefinition = {
  id: "meme",
  label: "Meme Surprise",
  description: "Display fun images or animations to create surprises",
  kind: "media",
  component: MemeTheme,
  accentColor: "#F97316",
  supportedPlatforms: ["ios", "android", "desktop"],
  icon: Sparkles,
};
