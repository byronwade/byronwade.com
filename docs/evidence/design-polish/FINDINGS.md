# Checklist findings

Baseline: merge commit `6229524`, production build, before/ screenshots and
matrix.json. Each screenshot has a route, viewport and theme in its filename.
This is a checklist review of the supplied inventory, with applicability and
port exceptions defined in README.md. Unverified conditions are not passes.

| ID | Owning checklist rules | Baseline finding | Smallest responsible change |
| --- | --- | --- | --- |
| F01 | Layout: group with space; Design: a border is a use case | IndexList adds a top rule and every IndexRow a bottom rule across home, projects, writing, portfolio, search and resume. Several page sections and the footer repeat separators. | Remove decorative separators at their owners; retain spacing, real media rims and field boundaries. Delete the unused topRule option atomically. |
| F02 | Typography: small named scale, line-height by role, cap the measure | Post, project and 404 titles use 30/36px instead of the adopted 32px role. Long post titles use tight leading. Markdown margins compound with the parent gap. Prose and ledes use the metadata color. | Use existing heading/copy/body roles; balance headings; reduce compounded heading margins; preserve readable prose measure. Keep the documented resume signature exception. |
| F03 | Content: resilient names; no truncated labels | Related-post titles ellipsize at 375px. Repository titles and project taglines can clip. Metadata competes with titles on narrow rows. | Allow names and supporting text to wrap; recompose metadata below identity where needed. |
| F04 | Core/mobile: 44px touch; UI: one button, rimmed controls keep 12px | Project Visit/Source are 28px; preview fullscreen is 26px, external visit 20px, Retry 26px, Open site 24px. Share buttons are 34px. Portfolio Refresh is 28px. | Configure existing Button sizes, use the canonical primitive for preview actions, enlarge share hit geometry, use 12px gaps between rimmed controls. |
| F05 | UI: a field is a well; focus visible; same fill as parent is illegal | Contact topic select uses a transparent surface unlike the adjacent sunk input/textarea in both themes. Inline contact has a separate version of the mismatch. | Apply the existing bg-field, border, shadow and focus recipe to both native selects. No new select abstraction is needed. |
| F06 | Content: no dead ends; UI: empty names cause/action | EmptyState is a dashed panel containing a second bordered icon tile. The 404 recovery sits below a large viewport-height spacer. | Remove ornamental frames; keep cause and recovery. Bring 404 identity/actions into the first content block using PageHeader. |
| F07 | Core: label/footprint stable; Content: nothing shifts | Portfolio changes Refresh to Refreshing and Try again to Retrying; sharing swaps Copy Link for Copied. | Keep visible action words stable and use the existing glyph/status channel for progress and confirmation. |
| F08 | Core: truthful states and recovery; Content: all states designed | All six controlled baseline cases stayed loading beyond the 8s timeout. The same aborted flag suppressed timeout and unmount updates. | Separate mounted lifecycle from request cancellation, finish timeout into recovery, and retain existing rows on failed refresh. |
| F09 | Core: no gradients; Motion: necessity, duration, compositor properties | Preview loading has a gradient wash; frame changes animate width/height at 300ms. Repository external arrows translate on hover. | Use a single neutral loading fill; make frame changes immediate; keep hover feedback to token-based color. Reduced motion remains global. |
| F10 | Core: one accent; Design: commits are ink, short depth | Homepage action uses the blue variant and a broad accent shadow. | Configure the existing neutral commit and remove the now-unused blue Button variant. Tokens remain pinned. |
| F11 | Forms: placeholders are examples and signal emptiness | Contact name placeholders repeat the label, message placeholders give instructions, and search lacks the ellipsis used by its shell equivalent. | Use example answers in both contact forms and the ellipsis character on search. Keep persistent labels. |
| F12 | UI: standalone targets, no colored edge; Motion: reduced motion | The longer project exposes 27.25px table-of-contents targets and a colored leading rule. Its click handler requests smooth scrolling even under reduced motion. | Configure the existing ProjectToc with 44px links, a quiet selected fill and canonical focus ring. Honor reduced motion and native modified-click link behavior. |
| F13 | UI: control fill differs from parent | Share/copy pills retain a transparent fill while outlined Buttons use the secondary surface. | Extend the existing pill class with the same secondary fill; keep its pill geometry, canonical focus and stable label. |
| F14 | Accessibility: valid progress value; Motion: frequent feedback stays immediate | The longer article at 768px dark reports aria-valuenow="NaN". The unchanged reading bar divides by a zero scroll range and tweens every scroll update. | Guard the zero range, observe document/viewport resize, and remove the tween. Browser probes cover a fitting document, scroll and the absence of a transition. |
| F15 | Accessibility: native control semantics | Styled Visit site, Source and preview destination anchors inherit Base UI's button role. | Extend the existing Button render adapter to preserve link semantics when the rendered element has a destination; explicit caller roles still win. The route matrix rejects destination anchors with a button role. |
| F16 | Layout: responsive arrangement; Content: resilient names | At 1440px with the mobile preview preset, the address shrinks to 1px and the toolbar grows to 292.75px. | Use the existing frame as a CSS query container and wrap device presets onto their own row when it is narrow. Keep all controls available and verify the selected mobile preset at tablet and desktop widths in both themes. |
| R01 | Hydration-safe content | All six baseline and after 404 cases report React error 418. After matrix.json confirms the prerendered breadcrumb says "Not Found" while the hydrated breadcrumb says "Design Polish Missing Page". `breadcrumb-trail-view.tsx:19` feeds usePathname into resolveTrail. | Reserved for the separate breadcrumb/a11y lane by the brief. No breadcrumb/global navigation source changes here. Both server and client labels and the warning are retained in the evidence. |
| R02 | Accessibility / Color: APCA | This pass has no APCA measurement. WCAG/axe results do not establish the checklist's Lc thresholds. | Keep the pinned palette and report this as unverified; contrast-token changes belong with the separate accessibility lane. |
| R03 | Mobile / Platforms: real hardware | Desktop Chrome emulation cannot prove Safari, notch, tap-highlight, Low Power Mode or screen-reader behavior. | Report as unverified; no physical-device session is available in this lane. |
| R04 | Interactions: state morph and loading timing | The adopted port swaps Phosphor glyphs and uses immediate progress feedback; it does not add Morphicons or enforce a new minimum spinner duration. | Preserve the no-new-runtime-dependency constraint and immediate input response. Stable words/footprints and reduced motion are verified; literal upstream motion identity and fast-response flicker remain unverified. |
| R05 | Core/mobile: 44px targets; keyboard return | The shared header keeps 40px Search/GitHub/X/theme/support icons at 768/1440; its desktop search-panel input is 36px tall. The first legacy verifier run also read an empty focus target immediately after interrupted launcher Escape; the unchanged rerun passed. | Navigation is explicitly reserved for the other lane. Retain these measured compact-shell exceptions and intermittent focus finding for its owner. The legacy verifier requires only 24px on desktop; its pass does not establish the requested 44px contract there. Main-content standalone controls are checked at 44px in every matrix case. |

The requested route matrix does not cover provider-backed Figma/repository detail
routes. Their unavailable upstream content cannot establish a visual pass. The
shop is explicitly excluded. Static Markdown empty-content fallbacks are read
but not forced by deleting content. These are scope/verification limits rather
than successful checks.

## Baseline observations

All 84 baseline cases have no document overflow. Six 404 cases have the
hydration warning above. The controlled baseline has 48 state screenshots and
six confirmed timeout failures. Default portfolio evidence uses the real local
API; the states subdirectory explicitly uses controlled browser fixtures.

## Route scoring

Qualitative scores use DESIGN.md §16's twelve 0–2 categories, not an automated
accessibility certification. Baseline scores with touch/state failures do not
pass regardless of total. Final visual scores use the 96-case matrix and
114 controlled states. Most routes lose one point for unforced/static or live
service states and one for hardware/APCA verification limits. Portfolio's
controlled states cover the extra state point. Not-found loses another trust
point for R01. These scores do not turn the reported exceptions into passes.

| Route | Baseline /24 | Findings | Final /24 |
| --- | --- | --- | --- |
| `/` | 19 | F01–F05, F07, F10, F11, F13 | 22 |
| `/projects` | 19 | F01–F03 | 22 |
| `/projects/thorbis-design` | 15 | F01–F04, F09, F15, F16 | 22 |
| `/projects/byronwade-ui` | — | Extended route: F02–F04, F09, F12, F15, F16 | 22 |
| `/blog` | 19 | F01–F03 | 22 |
| `/blog/building-thorbis` | 17 | F01–F04, F07, F13, F14 | 22 |
| `/blog/design-systems-that-earn-their-keep` | — | Extended route: F02–F04, F07, F13, F14 | 22 |
| `/resume` | 20 | F01, F04, F15; signature exception | 22 |
| `/portfolio` | 14 | F01–F04, F06–F09, F15 | 23 |
| `/contact` | 19 | F02, F05, F07, F11 | 22 |
| `/search`, results and no-results | 20 | F01, F02, F11 | 22 |
| `/privacy` | 19 | F02 | 22 |
| `/terms` | 19 | F02 | 22 |
| not-found | 16 | F01, F02, F04, F06, R01 | 21 |

Inline links inside article/legal/resume prose are measured in matrix.json.
They retain natural line boxes rather than adding 44px rows within sentences;
this preserves reading and uses the WCAG inline-text target exception. Standalone
actions must meet the mobile target contract. Header/breadcrumb navigation is
reserved for the separate a11y/performance lane and is not rewritten here.
R05 applies to the shared shell on every route; it is not hidden by the route
scores or by the legacy verifier's less strict desktop target minimum.
