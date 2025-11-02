import type { ReactElement } from "react";
import type { LucideIcon } from "lucide-react";
import type { FC, SVGProps } from "react";
import type { Platform } from "@/lib/device";

export type ThemeKind = "code" | "media" | "experiment";
export type ThemeComponentMode = "embedded" | "standalone";

export interface ThemeComponentProps {
  platform: Platform;
  mode?: ThemeComponentMode;
}

export type ThemeRenderer = (props: ThemeComponentProps) => ReactElement;

export type IconComponent = FC<SVGProps<SVGSVGElement>>;

export interface ThemeDefinition {
  id: string;
  label: string;
  description: string;
  kind: ThemeKind;
  component: ThemeRenderer;
  accentColor?: string;
  supportedPlatforms?: Platform[];
  icon?: LucideIcon | IconComponent;
}
