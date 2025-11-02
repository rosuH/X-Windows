# X-Windows

The core goal of X-Windows is to replicate the disorienting experience of "viewing source code directly within the X iOS official app" through web pages. When visitors jump from an X post to our page, they should feel like they're still within the native app, as if they've enabled X's "F12 view source" mode.

## Product Goals

- **Entry Scenario**: Users click links in posts within the X iOS native client, and pages open through the app's embedded browser; the experience must be optimized primarily for this environment.
- **Perception Gap**: The first screen reconstructs the X post's UI framework and simulates a "post sinking + code panel floating" animation, making users believe they've opened an official hidden feature.
- **Source Code Presentation**: The main body displays real SwiftUI / Compose source code, adopting a "source code viewer" style window shell with status information, but provides no editing functionality; font size, color scheme, and hierarchy are all optimized for mobile readability.
- **Interaction Design**: The core CTA is sharing/switching themes, positioned to avoid X's embedded browser bottom toolbar, with dynamic adjustment based on safe areas.

## Expected Experience

- Default to `theme=swiftui` to present SwiftUI code windows; subsequent themes must continue the "native app hidden feature" narrative in both appearance and interaction.
- After the first screen loads, there should be subtle background scaling and blur, emphasizing the post content "receding" and the code window "floating forward".
- All copy, hints, and sharing text revolve around "viewing source code directly in X", avoiding a "regular website" tone.

## Quick Start

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` to experience. Use `?theme=swiftui` and other parameters to directly specify themes.

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Analytics - Umami (Cookie-less)
NEXT_PUBLIC_UMAMI_SCRIPT_SRC=https://cloud.umami.is/script.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id-here

# Site URL for SEO
NEXT_PUBLIC_SITE_URL=https://x-windows.rosuh.me
```

**Note**: Analytics will be disabled if `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is not set. The site will still function normally, but page views won't be tracked.

## Key Features

- X Post Shell: Recreates the X iOS post detail page, supporting "sinking" and panel "floating" animations.
- SwiftUI / Compose Source Code: Displays real source code in a native-style "source code viewer" window shell, with font size and line spacing optimized for mobile, with no editing entry point.
- Platform Detection: Prioritizes iOS embedded browser adaptation based on UA, automatically enters demo mode on desktop.
- Sharing and Theme Switching: Bottom control bar avoids safe areas, ensuring stable access within X's embedded browser.

## SEO & Analytics

### SEO Features

This project includes comprehensive SEO optimization:

- **Metadata**: Dynamic metadata for site pages and theme pages with proper titles, descriptions, and canonical URLs
- **Open Graph & Twitter Cards**: Auto-generated OG images and Twitter card metadata for better social sharing
- **Structured Data**: JSON-LD structured data (Organization and WebSite) for better search engine understanding
- **Sitemap**: Auto-generated `sitemap.xml` at `/sitemap.xml` including all theme pages
- **Robots.txt**: Configured `robots.txt` at `/robots.txt` allowing all crawlers

### Analytics

The project uses **Umami Analytics** (cookie-less, privacy-friendly) for tracking page views:

- **Privacy**: No cookies, no individual tracking, GDPR-compliant
- **Automatic Tracking**: Page views are automatically tracked on route changes
- **Custom Events**: Use the `track()` function from `@/lib/analytics` to track custom events:

```typescript
import { track } from "@/lib/analytics";

// Track a custom event
track("button_click", { button_id: "share", theme: "swiftui" });
```

### Adding a New Analytics Provider

The analytics system is designed to be extensible. To add a new provider:

1. Update `src/components/analytics.tsx` to load the new provider's script
2. Update `src/lib/analytics/index.ts` to support the new provider's tracking API
3. Add the necessary environment variables for the new provider

The current implementation supports Umami, but can be extended to support Google Analytics, Plausible, Vercel Analytics, etc.

## Routing

- `/`: Post shell + theme list, with theme switching available at the top of the page.
- `/theme/[id]`: Displays only theme content, suitable for embedding in X posts or sharing.

## Contributing

Feel free to fork the repository (https://github.com/rosuH/X-Windows) and submit PRs for themes or experience improvements!

---

**Note**: This codebase was collaboratively created by Cursor, Composer 1, and GPT.
