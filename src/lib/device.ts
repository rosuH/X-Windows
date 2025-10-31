export type Platform = "ios" | "android" | "desktop";

const IOS_MATCHER = /(ipad|iphone|ipod|ios)/i;
const ANDROID_MATCHER = /android/i;

export function detectPlatform(userAgent?: string | null): Platform {
  if (!userAgent) {
    return "desktop";
  }

  if (IOS_MATCHER.test(userAgent)) {
    return "ios";
  }

  if (ANDROID_MATCHER.test(userAgent)) {
    return "android";
  }

  return "desktop";
}

export function platformLabel(platform: Platform): string {
  switch (platform) {
    case "ios":
      return "iOS";
    case "android":
      return "Android";
    default:
      return "Desktop";
  }
}

export function isMobile(platform: Platform): boolean {
  return platform === "ios" || platform === "android";
}
