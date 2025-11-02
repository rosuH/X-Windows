# X-Windows Development Roadmap

## Product Goal Alignment

- **Core Experience**: After users click a link in a post detail within the X iOS official app and jump to our page, their intuitive feeling should be "still in the app, but with an official hidden source code panel enabled".
- **Interface Baseline**: All themes first serve the SwiftUI scenario, rendering real code, and creating an "official source code viewer" illusion through details like window shells, status bars, and traffic lights.
- **Animation Expectations**: When entering the page, the post background should slightly sink and blur, with the code panel floating up; interactive controls must avoid X's embedded browser system toolbar and safe areas.

## Milestones

### M0 · Project Foundation (Weeks 0-1)

- [x] Initialize Next.js 16 + TypeScript + Tailwind project, configure ESLint, Prettier, Husky.
- [x] Build basic routing structure: `/` post container, `/theme/[id]` dynamic routes, meeting iOS embedded browser display requirements.
- [x] Implement theme registry and example themes (SwiftUI/Compose/Meme), providing source code viewer skeleton.
- [x] Integrate Vercel Analytics, add `.env.example`, `vercel.json`, and one-click deployment button.

### M1 · Core Experience (Weeks 2-3)

- [ ] Complete SwiftUI code theme: EditorChrome viewer shell, Xcode-style highlighting, mobile font size and safe area optimization.
- [ ] Complete Compose code theme: Android Studio visuals, code segment switching, maintaining the "official hidden feature" narrative.
- [ ] Implement theme list UI, platform auto-detection and manual switching logic, defaulting to `theme=swiftui`.
- [ ] Introduce Framer Motion, simulate X iOS "post sinking + source code panel floating" animation, support entry/return transitions.

### M2 · Multimedia & Sharing (Weeks 4-5)

- [ ] Add Meme, Lottie, video themes, continuing the "native app source code panel" feeling in visual language.
- [ ] Design sharing routes (`?theme=...&platform=...`) and OG image generation, ensuring copy emphasizes "viewing source code in X".
- [ ] Integrate simple theme access statistics panel, distinguishing iOS embedded browser access data.
- [ ] Improve responsive layout, desktop shows "experience preview mode" while still conveying mobile scenarios.

### M3 · Community Collaboration (Weeks 6+)

- [ ] Publish contribution guidelines, PR templates, theme submission instructions, clarifying "X iOS embedded experience" as the acceptance criteria for all contributions.
- [ ] Launch theme request/voting process, supporting external data sources (Sheet, Notion).
- [ ] Plan native embedding experiments (Capacitor/Expo or iOS Swift bridging), exploring deeper app integration.
- [ ] Launch official theme curation, regularly sharing best cases of "viewing source code in X" in the community.

## Development Task Breakdown

- **Project Initialization**: `pnpm` management, Git Hooks, environment variable templates.
- **Theme System**: Define `ThemeDefinition` interface, registry, renderer.
- **UI Shell**: Build X-style post framework, top status bar, action bar, prioritizing X iOS embedded browser safe area adaptation.
- **Animation Layer**: Encapsulate page transitions, theme switching animations, implement "post sinking + panel floating" effects.
- **Analytics & Logging**: Unified event reporting API, privacy compliance strategy.
- **Deployment Scripts**: Vercel/Cloudflare configuration, GitHub Actions automation, verify iOS embedded browser compatibility.

## Collaboration Process

- **Issue Label Suggestions**
  - `type:feature`: Feature development requirements
  - `type:bug`: Bug reports
  - `type:theme`: Theme submission/iteration
  - `good first issue`: Small tasks suitable for newcomers

- **Template Drafts**
  - `Bug Report`: Reproduction steps, expected behavior, screenshots/logs.
  - `Feature Request`: Problem motivation, proposed solution, alternatives.
  - `Theme Proposal`: Theme name, target platform, display materials, interaction design.

- **Contribution Guidelines**
  - Unified explanation in `CONTRIBUTING.md` for branch strategy, code standards, testing requirements.
  - Provide theme development tutorial: create files, import resources, test and submit.
  - Encourage submitting demo screenshots or screen recordings for review.

## Promotion Actions

- Publish project blog posts/tweets introducing inspiration and demo videos.
- Design open source social cards, embed Star/Fork badges in README.
- Plan Hackathon/community events, invite developers to submit themes.

