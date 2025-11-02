# X iOS Embedded Experience Gap Analysis (SwiftUI Source Code Viewer)

## Current Screenshot Status (2025-11-02)

- **Entry Environment**: X official app on iPhone, page opens via embedded browser at `x-windows.rosuh.me/theme/swiftui`.
- **Structural Performance**: Screen only shows bare SwiftUI source code with pure black background, lacking post shell, status bar, window frame, and other "official viewer" cues.
- **Interaction State**: X app's bottom toolbar covers our potential share/switch controls, no other visible action buttons in the page.
- **Reading Experience**: Font size approximately 12px, tight line spacing, using one-dark theme, significantly different from Xcode's source code viewing style.
- **Narrative Gap**: No description indicating "viewing source code within X", making it difficult for users to understand the surprise we're trying to create.

## Target Experience Review

> Goal: After users click a link in the X iOS app, they should mistakenly believe they've discovered an official "view source code" hidden feature.

- **Visual Shell Layer**: Retain post shell, source code floats forward in a viewer window, with traffic lights, title, labels, and other read-only cues.
- **Animation Rhythm**: On entry, post background sinks and blurs, source code viewer floats up, emphasizing the disorienting effect.
- **Control Distribution**: Core CTAs (share, theme switching) must avoid system toolbar, uniformly use safe area positioning.
- **Reading Standards**: Font size ≥ 14px, line height ≥ 1.7, highlighting close to Xcode's keyword, type, and string styles.
- **Copy Context**: From title to hints, all emphasize "viewing source code in X", avoiding words like "edit" or "IDE".

## Gap Analysis

| ID | Current Gap | Impact | Priority | Suggested Action |
| --- | --- | --- | --- | --- |
| G1 | Missing post shell and sinking/floating animation | Loses the feeling of "still in X app" | High | Render `PostShell` in embedded mode, use Framer Motion to implement post receding and viewer floating forward |
| G2 | Source code blocks lack viewer shell | Cannot form "official source code panel" narrative | High | Use `EditorChrome`/custom shell to wrap `CodeBlock`, remove any editing hints |
| G3 | Control area covered by system toolbar | Share and switch functions unusable | High | Adjust floating control bar: top overlay or `bottom: calc(env(safe-area-inset-bottom) + 16px)` |
| G4 | Font size/highlighting doesn't meet viewer expectations | Code difficult to read, insufficient immersion | Medium | Customize Prism theme, enlarge font size, optimize line spacing, replicate Xcode color palette |
| G5 | Missing "official source code" hints and sharing copy | Users don't understand the surprise point | Medium | Add "X source code viewer" narrative to window title, placeholder text, and sharing text |
| G6 | Default theme not locked to SwiftUI | First-time experience not focused on main path | Low | Detect iOS UA to default to `theme=swiftui`, and remember user selection |

## Implementation Rhythm Suggestions

1. **Restore Visual/Animation Shell (G1 + G2)**: First screen must immediately present the official source code viewer feeling.
2. **Restore Control Accessibility (G3)**: Ensure share/switch buttons are visible and usable in X embedded browser.
3. **Strengthen Reading and Narrative (G4 + G5)**: Adjust highlighting and copy to clearly explain this is a source code viewing experience.
4. **Finalize Experience Path (G6)**: Optimize default theme to ensure first-time visits go directly to SwiftUI source code.

## Acceptance Checklist

- [ ] When accessing `/theme/swiftui` in real X iOS app, see post shell and animated source code viewer.
- [ ] Share/switch buttons are within safe area, identifiable and accessible within 1 second.
- [ ] Source code font size and highlighting show no significant gap compared to real Xcode viewing window.
- [ ] Copy and sharing titles emphasize "viewing source code directly in X", with no editing-related wording.
- [ ] Other themes share the same viewer shell and animations, maintaining consistent experience.

