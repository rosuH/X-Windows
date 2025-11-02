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

## Key Features

- X Post Shell: Recreates the X iOS post detail page, supporting "sinking" and panel "floating" animations.
- SwiftUI / Compose Source Code: Displays real source code in a native-style "source code viewer" window shell, with font size and line spacing optimized for mobile, with no editing entry point.
- Platform Detection: Prioritizes iOS embedded browser adaptation based on UA, automatically enters demo mode on desktop.
- Sharing and Theme Switching: Bottom control bar avoids safe areas, ensuring stable access within X's embedded browser.

## Routing

- `/`: Post shell + theme list, with theme switching available at the top of the page.
- `/theme/[id]`: Displays only theme content, suitable for embedding in X posts or sharing.

## Contributing

Feel free to fork the repository (https://github.com/rosuH/X-Windows) and submit PRs for themes or experience improvements!

---

**Note**: This codebase was collaboratively created by Cursor, Composer 1, and GPT.
