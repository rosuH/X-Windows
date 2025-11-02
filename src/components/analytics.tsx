"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { track } from "@/lib/analytics";

// Dynamically import Vercel Analytics with no SSR and lazy loading
const VercelAnalytics = dynamic(
  () => import("@vercel/analytics/react").then((mod) => mod.Analytics),
  { ssr: false }
);

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

  return (
    <>
      {websiteId && (
        <Script
          src={src}
          data-website-id={websiteId}
          strategy="lazyOnload"
          defer
        />
      )}
      <VercelAnalytics />
    </>
  );
}

