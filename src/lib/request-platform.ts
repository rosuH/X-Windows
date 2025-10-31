import { headers } from "next/headers";
import { detectPlatform, type Platform } from "@/lib/device";

export async function getRequestPlatform(): Promise<Platform> {
  try {
    const headerList = await headers();
    const userAgent = headerList?.get?.("user-agent") ?? undefined;
    return detectPlatform(userAgent ?? undefined);
  } catch {
    return detectPlatform(undefined);
  }
}

