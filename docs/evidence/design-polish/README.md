# Design polish evidence

## Brief and decision

Implementation mode. Readers are prospective clients/employers assessing the
work, peers reading articles, recruiters reading/printing the record, and people
starting a conversation. Keep the existing organizing moves in DESIGN.md §7.1:
claim/proof, ranked projects, chronology, live repositories, printable record,
and one focused contact task. Search finds across those destinations; legal
pages remain readable documents and 404 offers recovery.

Reuse SiteShell, PageHeader, Section, IndexList, EmptyState, Markdown,
Button, Input, Textarea and the existing Thorbis tokens. Extend their owners
where current consumers have drifted. Rows use native list items after their
separator-only wrapper is removed. No new composition, runtime dependency,
font, palette, content deletion, shop work, navigation rewrite, breadcrumb fix,
or performance-harness change is part of this pass.

The dependency cone is these shared owners and their route consumers. Compare
spacing-based grouping with the existing separator-based grouping; use spacing
because the checklist explicitly rejects separators around rows and regions.
Keep real media rims and input/control boundaries where they identify objects.

## Capture protocol

Run `npm run build`, then `node scripts/capture-design-polish.mjs before` or
`node scripts/capture-design-polish.mjs after`. The runner reuses
production-session.mjs: hidden owned server, free loopback port, cleanup in
finally. Chrome uses a separate headless profile per viewport. Cases are serial.
Screenshots are full-page at 375/768/1440 × light/dark, with reduced motion.
matrix.json records status, overflow, headings, clipped labels, input sizes,
small targets and uncaught errors. Small inline prose links are listed as
measurements, not silently excluded from the evidence.
The after runner rejects main-content standalone targets below 44px; only native inline
anchors within prose/list text use the documented inline-text exception.
It also fails on any uncaught page error or route that never leaves loading.
There is no exemption: main #98 fixed the 404 hydration mismatch (FINDINGS.md R01).

There is no `/about` route. `/` and `/resume` contain that material. The 14
baseline destinations include the 12 requested present routes plus populated
and empty search states, for 84 screenshots. The after matrix adds the longer
`/projects/byronwade-ui` and `/blog/design-systems-that-earn-their-keep`, for
96 screenshots. The shared baseline project is `/projects/thorbis-design`;
the article is `/blog/building-thorbis`.

After captures wait for stable document bounds and assert that the PNG includes
the document and footer. This avoids capturing bounds before header hydration
finishes. The after runner also records axe WCAG A/AA findings per case, using
Lighthouse's bundled axe-core through `scripts/axe-audit.mjs` (4.14.0 at the time
of writing; reports before October 22, 2026 used 4.10.3 from a CDN). Incomplete
axe checks remain visible and require human judgment; an axe evaluation error or
a page with no passing rule stops the run.

## Surface and state decisions

| Surface | Profile | Dominant object and organizing move |
| --- | --- | --- |
| Home | Showcase | Claim followed by selected proof and a conversation action |
| Projects / detail | Showcase / Evidence | Ranked work; a case study with working preview and outcomes |
| Blog / post | Showcase / Evidence | Chronology; a readable article with related writing |
| Resume | Evidence | A printable record with supporting links |
| Portfolio | Showcase | A repository catalogue with refresh and bounded recovery |
| Contact | Guided | One form and a persistent outcome |
| Search | Guided | Query followed by grouped results or a clear empty result |
| Privacy / terms | Evidence | A restrained reading column |
| Not-found | Guided | Identity and immediate recovery |

Responsive composition keeps full titles and moves supporting metadata below
identity on narrow rows. Main-content standalone actions and form controls are at least
44px; prose links keep natural line boxes. Keyboard focus uses existing rings
and outlines. Native controls retain touch and keyboard behavior. Themes reuse
the existing body, field, secondary and border roles.
Navigation remains owned by the shared header. R05 records its historical
compact targets; the current header's rendered tests require 44px targets.
The legacy verifier's desktop minimum is 24px, so its pass alone does not
establish the current header contract.

The October 22, 2026 verifier on main `bf18367` stopped at `portfolio-partial`:
the page had moved to server rendering, but its browser interception still targeted
`/api/portfolio`. The same failure was reproduced on `0672125` (36 live rows,
expected one). Even the preceding snapshots were uncontrolled live data. Those
historical captures do not establish empty, error or populated fixture coverage.

The repaired `verify-design-polish-states.mjs after` uses
`tests/fixtures/portfolio-browser.mjs`, shared with the rendered retry regression.
Only the owned Next child receives the GitHub transport preload, a fresh Data Cache
namespace and a synthetic cache-refresh secret. No provider authorization is
forwarded to the loopback fixture. State changes expire the canonical GitHub tag
through the real local cache-refresh endpoint; successful cache reuse and retries
after uncached failures remain part of the assertions. Browser requests for the
retired `/api/portfolio` transport fail the run.

The portfolio state contract now follows the server-rendered page:

| Previous intent | Current evidence |
| --- | --- |
| Empty | A successful empty provider response shows “No repositories yet”, with zero rows |
| Error | A provider 503 shows unavailable feedback, Try again and Open GitHub, with zero rows |
| Populated | Keyboard retry after timeout renders exactly the synthetic repository and its description/language |
| Partial / unrelated-provider failure | Retired: this page fetches repositories alone; aggregate Dribbble/Figma/stats warnings are unreachable |
| Failed refresh retaining rows | An unexpired successful cache still renders its row; after explicit expiry, a failed full-page refresh shows recovery |
| Degraded empty refresh retaining rows | Retired: there is no client-side aggregate response or retained-results state |
| Loading | A held server request proves navigation is pending; there is no portfolio loading UI to screenshot |
| Timeout | The genuine five-second provider bound reaches unavailable feedback; no timer is overridden |
| Retry | Keyboard activation of Try again fetches recovered data without expiring a cached failure |

The current matrix records seven portfolio captures, three contact captures
(invalid, pending, failed), five preview captures (loading, loaded, keyboard
resize, native modal fullscreen, error), and two inline-contact captures
(open and copied) in each of six width/theme combinations. Four additional
tablet/desktop captures exercise the mobile preview preset; two desktop captures
exercise case-study contents keyboard focus and header clearance: 108 screenshots
and axe evaluations total. Six server-pending probes and six numeric reading-progress
probes are recorded separately. Fullscreen must match `dialog[open]:modal` and
Escape must return focus. Invalid-field focus uses the system outline; inline-copy
confirmation preserves its accessible name and footprint. Clipboard delivery is
stubbed; no contact address is written to the OS clipboard.

Preview fixtures reuse an existing local JPEG with a distinct URL per capture
size, matching the real API's image identity contract. They test the frame and
controls; they do not certify a live provider capture.
Failed contact requests are intercepted before delivery; drafts remain intact.
Fullscreen Escape returns focus. Any uncaught page error fails the run.
The historical baseline runner recorded eight states per combination, including
the six timeout failures fixed by the original design-polish pass.
Two additional desktop captures exercise table-of-contents keyboard activation,
focus clearance, visible focus, URL hash and reduced-motion navigation.
Four tablet/desktop captures select the mobile preview preset and verify that
the address stays readable while every preset remains reachable.
Six numeric reading-progress probes cover a document that fits the viewport,
scrolling after resize, finite ARIA values and immediate feedback without a tween.

The motion gate rejects decorative motion for frequent reading, hovering and
resizing. Frame size follows input immediately. Existing color transitions and
progress glyphs communicate state without changing labels. Global reduced-motion
tokens supply the snapped path. No animation library or new motion scale is
introduced; the existing verifier provides a separate header-popover interruption check.
The current header has no entrance animation. Its verifier records the actual
panel durations and interruption/focus behavior rather than overriding the
retired capsule's motion token or claiming slow-motion evidence.

## Checklist applicability

docs/THORBIS-DESIGN-RULES.md is the supplied rule inventory. Repeated laws are
evaluated once by their owner and propagated to each consumer. Negative examples
in unchecked list items mean "must be absent", not "must be implemented".

Applicable: hierarchy, alignment, type roles/measure, space-based grouping,
neutral surfaces, one accent, real media boundaries, state truth, stable labels,
recovery, mobile input/target geometry, visible focus, theme persistence,
semantic controls, reduced motion, content resilience, local performance limits,
and ownership/reuse. Evidence includes all three widths in both themes.

Not applicable: dispatch/job vocabulary, financial transactions, tenant/permission
models, offline field capture, native app chrome/haptics, graphs/maps/boards,
bulk selection/editing, editable record dirty bars, physical-product chapters,
commercial product-film sequencing, and Linear project administration. This
personal site has no such workflows. The shop is explicitly excluded.

Existing adopted-port differences remain governed by DESIGN.md and
docs/THORBIS-DESIGN-PORT.md: Next.js/Vercel instead of Thorbis's TanStack/Cloudflare
infrastructure; Phosphor duotone defaults; the resume signature identity asset;
light default; the existing anchored-popover header. Morphicons would add a runtime
dependency and a motion rewrite, so stable words and the current Phosphor/CSS
state feedback remain. These are documented adaptations, not claims of literal
upstream identity.

## Verification boundaries

No live contact message is sent. Form validation and failure/pending states can
be exercised locally. Chrome viewport emulation does not verify real iOS Safari,
Low Power Mode, hardware touch, OS scrollbars or screen-reader announcements.
APCA must be reported separately from the existing WCAG/axe checks; neither a
screenshot nor a WCAG ratio establishes an APCA result. No performance
improvement is claimed without a before/after measurement.

Findings and final gate results are recorded alongside this evidence and in the
PR. RESULT.md is a local, uncommitted handoff.

For a fresh verification without replacing this historical evidence, set
`DESIGN_EVIDENCE_DIR` to an absolute output folder before running
`capture-design-polish.mjs after` and `verify-design-polish-states.mjs after`.
Both retain the phase and states subfolders. `THORBIS_EVIDENCE_DIR` similarly
redirects `verify-thorbis-browser.mjs` and `perf-budget.mjs` output. Scheduler
jobs use their own C: job folder for these generated files.
