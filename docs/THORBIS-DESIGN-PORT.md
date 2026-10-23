# Thorbis Design port

byronwade.com adopts [Thorbis Design](https://design.thorbis.com), sourced from
[byronwade/thorbis-design](https://github.com/byronwade/thorbis-design) at
`46b6654d02fda9d8fde737395185c3141df52cd2` (October 16, 2026 inspection).
The reference checkout `D:/Dev/thorbis-design` is read-only.

The header recipes were re-inspected at `5d8cd27` for the mobile-first rebuild.
That header-only port includes the source narrow-container reflow and light
selected-surface/rim overrides. Other component and font pins stay as recorded below.

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
| app/globals.css font block; public/fonts/UcCo*, UcC53*, or3n*, inter-latin-core, inter-italic-latin-core, geist-mono-latin-core; app/layout.tsx | src/styles.css Inter/Geist Mono @font-face blocks; public/fonts (Inter/Geist Mono subsets and OFL licenses); src/stylex/tokens.stylex.ts | Exact source files/faces and licenses copied; Latin core subsets of upright Inter and Geist Mono (see docs/PERFORMANCE.md), full Latin faces kept as fallbacks; only upright Inter preloaded; Mono deferred; existing signature face retained only for resume |
| components/ui/button.tsx | src/components/ui/button.tsx; button-dimensions.stylex.ts | Neutral commit, compact/comfortable/touch sizes, source radii and shadows; a hookless native adapter draws a `<button>` or clones a link target, so destinations keep link semantics. The later checklist pass removes the unused electric-blue variant. |
| components/ui/link.tsx; .link-underline | src/components/site/site-shell.stylex.ts link/focusRing | Next link adapter, visible outline, text-decoration and inherited color |
| components/layout/sheet.tsx | src/components/guidelines/specimen-styles.stylex.ts frame/sheet/note | Panel tone, source large radius and panel elevation around real work, 12px marker caption, edge-to-edge below 40rem. Replaces the card primitive, which no surface needed once panels stopped wrapping counts and sections |
| components/ui/badge.tsx; status-pill.tsx | src/components/ui/badge.tsx; status-pill.tsx | Neutral on-panel badge and source pill shape; existing Base UI render and semantic variants |
| components/ui/input.tsx; textarea.tsx | src/components/ui/input.tsx; textarea.tsx | Sunk field material/elevation, source radius, mobile 16px text, visible focus, existing Base UI/native APIs |
| components/layout/nav-dock.tsx; site-header.tsx | src/components/site/site-header.tsx; site-shell.stylex.ts headerBase/navLink/menu/menuLink | Fixed 52px row, 42rem measure, 8px top/16px mobile side insets, 13px nav and 12px descriptions, active pill/dot, 44px targets; Base UI modal focus and dismissal |
| conditional-layout.tsx; dock-toolbar.tsx; dock-toolbar-client.tsx | src/components/site/shell.tsx; site-header.tsx tools; site-shell.stylex.ts chrome | Reserved chrome space, bare search/theme buttons, anchored search; existing breadcrumb component retained outside the compact row |
| components/layout/page.tsx; common/index-list.tsx | src/components/rules/page.tsx; site-shell.stylex.ts section | Source 32px title/20px section roles; stable-contrast evidence rows, shared focus |
| components/home/home-hero.tsx, home-projects.tsx, home-blog.tsx | src/components/rules/page.tsx; guidelines specimen sheet; site-shell.stylex.ts | Site-specific claim/proof composition using source roles; the current product is a specimen sheet of its scope, not a card |
| components/layout/footer.tsx | src/components/site/site-footer.tsx; site-shell.stylex.ts footer | Brand/author and navigation regions, source type/tone, textual social links, source attribution; existing obfuscated email |

Tailwind default color/opacity transitions resolve to the source fast duration
and easing, rather than its independent framework defaults.

Every row is pinned to the full commit above. An unlisted source is not authority
for introducing a new visual choice.

## Intentional site adaptations

- The October 19 polish pass applies docs/THORBIS-DESIGN-RULES.md to the
  existing port without changing its token/font pin. Lists and persistent
  regions group by space and tone; media and fields keep their real rims.
  Reading titles use the 32px role, with comfortable leading for long object
  titles. The homepage commit uses neutral ink; its unused blue Button variant
  is removed. Secondary buttons use the existing on-panel fill. Native selects
  share the input material and focus recipe; unlike the source they set
  `appearance: none` with a Phosphor caret, because WebKit otherwise paints the
  select as a light system button instead of the field well. Preview controls reuse Button,
  keep 44px geometry, and change dimensions immediately; loading/fullscreen
  surfaces use neutral fills. No motion library or parallel token set is added.
- Button draws native elements instead of wrapping Base UI's Button. A plain
  `<button>` (or an `<a href>`/`<Link>` passed as `render`) already provides
  keyboard, focus, form and disabled behavior; the Base UI layer added only
  `type="button"` and role handling, at about 4 KB gzip per route. Without
  hooks, server-rendered Buttons ship no client code. See docs/PERFORMANCE.md.

- Public portfolio Showcase, Evidence and Guided surfaces; no trades Workbench.
- Existing URLs, Markdown/front-matter, API contracts and contact flow preserved.
- The light theme stays the default; next-themes owns persistence and dark mode.
- No page-entry/scroll fade. Content is server-rendered and immediately visible.
- `lib/icons.tsx` remains the public Phosphor facade. Its individual glyph wrappers
  in `lib/icons/` preserve duotone/brand-fill defaults, overrides and display names
  while allowing route-specific code splitting. A single wrapper module had pulled
  preview glyphs into home's shared initial chunk.
- Header and toolbar owners render static identity and SVGs on the server and pass
  nodes into `nav-dock.tsx` / `dock-toolbar-client.tsx`. The product-switcher,
  nested utility capsules and width/height morph were removed. GitHub and X remain
  in the mobile panel and footer. Search retains the shared index and matcher.
- The header uses the source fixed chrome and reserves space before hydration.
  All targets stay at least 44px, including desktop (source desktop defaults to 40px).
  The source stable scrollbar gutter prevents chrome movement when a modal locks
  scrolling. Header-scoped selected fill and panel rim preserve source light
  overrides without changing other surfaces: `--header-on-panel` and
  `--header-shadow-panel` in globals.css; retain these when syncing the token port.
  Base UI owns focus containment, Escape, outside press and focus return. A scoped
  CSS lock covers its intentional touch-scroll exception for inset popovers.
- `header-popover.tsx` retains native server-rendered triggers and loads the shared
  Base UI overlay only on the first open. The trigger stays operable and reports
  busy while that code arrives, then the loaded overlay retains focus ownership
  for subsequent opens. `header-search-panel.tsx` also defers the search field,
  matching and query state. The header reserves its clearance with the same
  container query used by its narrow reflow, including 200% text.
- Categories use neutral marker labels instead of a competing taxonomy palette.
- Source default-button hover text is adapted to preserve contrasting text rather
  than copying an upstream same-tone foreground/background defect.
- Text Button sizes use a 44px minimum height instead of the source's fixed height
  and nowrap label, and never grow wider than their container. At default text the
  geometry is unchanged; at 200% text a long label wraps and the button grows taller
  instead of scrolling a 320px page sideways. Icon buttons keep the fixed 44px square.
- Canvas-computed contrast exposed small status text at 4.09:1 (warning) and
  4.42:1 (success) on tinted badges. Apply the source badge warning foreground
  recipe (76% status / 24% foreground) to both and compose StatusPill from Badge.
  The dark blue action uses the source canvas for its label to meet AA; source
  token values remain unchanged. Input/textarea rims use the source marker role
  for 3:1 field-boundary contrast; invalid fields retain solid source danger
  borders in dark mode. These are explicit accessibility adaptations.
- The footer uses source-style text links. Its obsolete animated GitHub preview
  and the unused Framer/hover-card paths were removed. Closed contact code loads
  on first intentional open and remains mounted to preserve drafts. Shared/home
  navigation starts route requests on navigation instead of speculative prefetch.
- The unused global query-state provider is removed. Toasts load with contact
  forms, retaining feedback after an inline close; breadcrumb popover code loads
  only on routes with a breadcrumb. These move dependencies to their consumers.
- Inter uses the pinned font bytes and source face descriptors. The generated
  next/font manifest was empty in the local Windows webpack build, delaying
  Inter until CSS discovery. An explicit `preload()` of the source font removes
  that dependency without an experimental CSS flag. All font faces share the
  same CSS owner, avoiding an extra blocking font stylesheet. A rendered contract
  checks preload.
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
   Inter/Mono files and licenses into this app.
3. Review generated changes. Update headers and this map with the script pin
   together. Keep aliases as the only bridge; do not leave old/new palettes or displaced font assets.
4. Port changes to the canonical existing primitives. Preserve Base UI keyboard,
   focus, dismissal and rendering APIs. Button stays a native element: port its
   recipe and API, not a Base UI layer (see Intentional site adaptations).
   Update all affected callers atomically.
5. Run local lint, type-check, knip, build, contact tests, browser/axe/no-JS checks,
   and perf:budget. Compare 1440/390 light/dark against the live source and check
   768px, 320px and keyboard paths. Commit evidence and document deviations.

## Evidence

See docs/evidence/thorbis/ and its [PR #56 result](evidence/thorbis/PR-56-RESULT.md)
for the original acceptance record. The later polish evidence lives in
[docs/evidence/design-polish/](evidence/design-polish/README.md). Root RESULT.md
is a local task handoff. Do not infer visual parity or accessibility from the
token generator alone.
