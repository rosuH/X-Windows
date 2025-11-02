import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { Analytics } from "@/components/analytics";
import {
  generateOrganizationJsonLd,
  generateWebSiteJsonLd,
} from "@/lib/seo/jsonld";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://x-windows.rosuh.me";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "X-Windows",
    template: "%s | X-Windows",
  },
  description: "Mini IDE experience in X-style posts. View SwiftUI and Compose source code directly in X.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "X-Windows",
    title: "X-Windows",
    description: "Mini IDE experience in X-style posts. View SwiftUI and Compose source code directly in X.",
  },
  twitter: {
    card: "summary_large_image",
    title: "X-Windows",
    description: "Mini IDE experience in X-style posts. View SwiftUI and Compose source code directly in X.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a", // slate-950
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = generateOrganizationJsonLd(
    "X-Windows",
    siteUrl,
    "Mini IDE experience in X-style posts",
  );

  const websiteJsonLd = generateWebSiteJsonLd(
    "X-Windows",
    siteUrl,
    "Mini IDE experience in X-style posts",
  );

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 font-sans antialiased">
        <Script
          id="jsonld-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <Script
          id="jsonld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        {children}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <VercelAnalytics />
      </body>
    </html>
  );
}
