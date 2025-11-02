/**
 * JSON-LD structured data helpers
 */

export interface OrganizationJsonLd {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  description?: string;
}

export interface WebSiteJsonLd {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description?: string;
}

export function generateOrganizationJsonLd(
  name: string,
  url: string,
  description?: string,
): OrganizationJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    ...(description && { description }),
  };
}

export function generateWebSiteJsonLd(
  name: string,
  url: string,
  description?: string,
): WebSiteJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    ...(description && { description }),
  };
}

