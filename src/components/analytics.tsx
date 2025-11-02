"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { track } from "@/lib/analytics";

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const src =
    process.env.NEXT_PUBLIC_UMAMI_SCRIPT_SRC || "https://cloud.umami.is/script.js";

  // Track page views on route changes
  useEffect(() => {
    if (websiteId) {
      track("page_view");
    }
  }, [pathname, searchParams?.toString()]);

  if (!websiteId) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[Analytics] NEXT_PUBLIC_UMAMI_WEBSITE_ID is not set. Analytics will be disabled.",
      );
    }
    return null;
  }

  return (
    <Script
      src={src}
      data-website-id={websiteId}
      strategy="afterInteractive"
      defer
    />
  );
}

