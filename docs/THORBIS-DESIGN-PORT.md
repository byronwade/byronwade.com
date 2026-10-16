# Thorbis Design port

byronwade.com adopts [Thorbis Design](https://design.thorbis.com), sourced from
[byronwade/thorbis-design](https://github.com/byronwade/thorbis-design) at
`46b6654d02fda9d8fde737395185c3141df52cd2` (October 16, 2026 inspection).
The reference checkout `D:/Dev/thorbis-design` is read-only.

## Distribution decision

This is a **port**, not an installed Thorbis package. Upstream package.json names
`app-builder-workspace`, sets `private: true`, and exposes no package export.
`rg --files D:/Dev/thorbis-design -g registry.json -g !node_modules` found no
shadcn registry manifest. `npm search thorbis --json` returned `[]`.
No new runtime dependency or second primitive library is required.

## Source map

All paths below are relative to the pinned upstream commit. Each port header
links to this map. Preserve semantics and source values, translate the styling
mechanism (StyleX to CSS/Tailwind), and keep this app's Base UI and Next APIs.

| Local owner | Thorbis source | Translation |
| --- | --- | --- |
| app/globals.css token block | src/styles/tokens.generated.css; scripts/generate-stylex-tokens.mjs | Color, spacing, control dimensions, type sizes/line heights, radii, shadows, motion and layers copied; color names prefixed --thorbis- to avoid Tailwind collisions |
| app/globals.css theme overrides | src/styles.css, all explicit light/dark semantic corrections and modern shadow overrides | Explicit light canvas, text, marker, panel, field, on-panel and elevation retune; .dark restores source dark values |
| app/globals.css semantic aliases | Same color tokens | background=bg, foreground=fg, muted-foreground=marker, card/popover=panel, primary=fg, brand=accent, ring=focus, secondary/muted=on-panel, input/border=border; dock/sidebar derive from the same surface family |
| lib/utils.ts | src/stylex/tokens.stylex.ts type roles | Extend the existing class merger with Thorbis size names so color classes cannot erase typography |
| app/globals.css font block; public/fonts/UcCo* and UcC53*; app/layout.tsx; lib/fonts.ts | src/styles.css Inter @font-face blocks; public/fonts (14 Inter subsets and inter-OFL.txt); src/stylex/tokens.stylex.ts | Exact Inter font files/faces and license copied, Latin explicitly preloaded; Geist Mono self-hosted with next/font; signature retained only for resume |
| components/ui/button.tsx | src/components/ui/button.tsx; button-dimensions.stylex.ts | Lifted neutral commit and electric-blue action, compact/comfortable/touch sizes, source radii, source shadows; existing Base UI render/nativeButton contract preserved |
| components/ui/link.tsx; .link-underline | src/components/site/site-shell.stylex.ts link/focusRing | Next link adapter, visible outline, text-decoration and inherited color |
| components/ui/card.tsx | src/components/ui/card.tsx | Panel tone, source large radius and panel elevation; existing slots and size contract |
| components/ui/badge.tsx; status-pill.tsx | src/components/ui/badge.tsx; status-pill.tsx | Neutral on-panel badge and source pill shape; existing Base UI render and semantic variants |
| components/ui/input.tsx; textarea.tsx | src/components/ui/input.tsx; textarea.tsx | Sunk field material/elevation, source radius, mobile 16px text, visible focus, existing Base UI/native APIs |
| components/layout/nav-dock.tsx | src/components/site/site-shell.stylex.ts navLink/navLinkActive | Inter 13px, source pill, selected tone/short shadow, 44px targets; all destinations visible without JS |
| conditional-layout.tsx; dock-toolbar.tsx; site-shell.tsx | src/components/site/site-header.tsx; site-shell.stylex.ts headerBase/tools/page | One sticky header in flow, panel/radius/elevation, reserved utilities, navigation wraps to separate row; existing launcher/search/theme/support retained |
| components/layout/page.tsx; common/index-list.tsx | src/components/rules/page.tsx; site-shell.stylex.ts section | Source 32px title/20px section roles; stable-contrast evidence rows, shared focus |
| components/home/home-hero.tsx, home-projects.tsx, home-blog.tsx | src/components/rules/page.tsx; src/components/ui/card.tsx; site-shell.stylex.ts | Site-specific claim/proof composition using source roles, panel and existing content loaders |
| components/layout/footer.tsx | src/components/site/site-footer.tsx; site-shell.stylex.ts footer | Brand/author and navigation regions, source type/tone, textual social links, source attribution; existing obfuscated email |

Every row is pinned to the full commit above. An unlisted source is not authority
for introducing a new visual choice.

## Intentional site adaptations

- Public portfolio Showcase, Evidence and Guided surfaces; no trades Workbench.
- Existing URLs, Markdown/front-matter, API contracts and contact flow preserved.
- The light theme stays the default; next-themes owns persistence and dark mode.
- No page-entry/scroll fade. Content is server-rendered and immediately visible.
- A single sticky header in flow and wrapping text navigation replace independently fixed capsules.
  This retains the header landmark and prevents tablet overlap and focus clipping.
- Categories use neutral marker labels instead of a competing taxonomy palette.
- Source default-button hover text is adapted to preserve contrasting text rather
  than copying an upstream same-tone foreground/background defect.
- Canvas-computed contrast exposed small status text at 4.09:1 (warning) and
  4.42:1 (success) on tinted badges. Apply the source badge warning foreground
  recipe (76% status / 24% foreground) to both and compose StatusPill from Badge.
  The dark blue action uses the source canvas for its label to meet AA; source
  token values remain unchanged. Input/textarea rims use the source marker role
  for 3:1 field-boundary contrast. These are explicit accessibility adaptations.
- The footer uses source-style text links. Its obsolete animated GitHub preview
  and the unused Framer/hover-card paths were removed. Closed contact code loads
  on first intentional open and remains mounted to preserve drafts. Shared/home
  navigation starts route requests on navigation instead of speculative prefetch.
- The unused global query-state provider is removed. Toasts load with contact
  forms, retaining feedback after an inline close; breadcrumb popover code loads
  only on routes with a breadcrumb. These move dependencies to their consumers.
- Inter uses the pinned font bytes and source face descriptors. The generated
  next/font manifest was empty in the local Windows webpack build, delaying
  Inter until CSS discovery. Explicit source-font preload removes that dependency
  without an experimental CSS flag. A rendered contract checks the preload.
- The browser favicon reuses the existing 32px image instead of fetching the
  239KB original. The original remains at public/icon-original.png; /icon.png
  stays owned by the app route. A regression test prevents public shadowing.
- Personal resume signature is an identity asset, never a second body/heading typeface.

## Synchronization

1. Select and read an upstream commit; inspect DESIGN.md, COMPONENTS.md, source
   token and component diffs. Verify package/registry availability again.
2. Update the script pin after reviewing the selected revision. With the reference
   checked out by its owner, run:
   `node scripts/port-thorbis-tokens.mjs D:/Dev/thorbis-design`.
   This only reads upstream, replaces marked token/font blocks and copies source
   Inter files/license into this app.
3. Review generated changes. Update headers and this map with the script pin
   together. Keep aliases as the only bridge; do not leave old/new palettes or displaced font assets.
4. Port changes to the canonical existing primitives. Preserve Base UI keyboard,
   focus, dismissal and rendering APIs. Update all affected callers atomically.
5. Run local lint, type-check, knip, build, contact tests, browser/axe/no-JS checks,
   and perf:budget. Compare 1440/390 light/dark against the live source and check
   768px, 320px and keyboard paths. Commit evidence and document deviations.

## Evidence

See docs/evidence/thorbis/ and RESULT.md for measured acceptance results. Do not
infer visual parity or accessibility from the token generator alone.
