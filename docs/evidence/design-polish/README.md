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

There is no `/about` route. `/` and `/resume` contain that material. The 14
baseline destinations include the 12 requested present routes plus populated
and empty search states, for 84 screenshots. The after matrix adds the longer
`/projects/byronwade-ui` and `/blog/design-systems-that-earn-their-keep`, for
96 screenshots. The shared baseline project is `/projects/thorbis-design`;
the article is `/blog/building-thorbis`.

After captures wait for stable document bounds and assert that the PNG includes
the document and footer. This avoids capturing bounds before header hydration
finishes. The after runner also records axe 4.10.3 WCAG A/AA findings per case;
incomplete axe checks remain visible and require human judgment.

## Surface and state decisions

| Surface | Profile | Dominant object and organizing move |
| --- | --- | --- |
| Home | Showcase | Claim followed by selected proof and a conversation action |
| Projects / detail | Evidence | Ranked work; a case study with working preview and outcomes |
| Blog / post | Evidence | Chronology; a readable article with related writing |
| Resume | Evidence | A printable record with supporting links |
| Portfolio | Evidence | A repository catalogue with refresh and bounded recovery |
| Contact | Guided | One form and a persistent outcome |
| Search | Guided | Query followed by grouped results or a clear empty result |
| Privacy / terms | Evidence | A restrained reading column |
| Not-found | Guided | Identity and immediate recovery |

Responsive composition keeps full titles and moves supporting metadata below
identity on narrow rows. Main-content standalone actions and form controls are at least
44px; prose links keep natural line boxes. Keyboard focus uses existing rings
and outlines. Native controls retain touch and keyboard behavior. Themes reuse
the existing body, field, secondary and border roles.
The unchanged shared shell retains compact tablet/desktop targets (R05);
navigation is reserved for the separate lane. The legacy verifier's desktop
minimum is 24px, so its pass must not be read as a 44px shell-target pass.

`verify-design-polish-states.mjs after` exercises 18 controlled states at all
six width/theme combinations: portfolio empty, error, populated, partial, failed refresh,
degraded empty refresh, loading and timeout; contact invalid, pending and failed; preview loading,
loaded, keyboard resize, fullscreen and error; and the open homepage contact
form and copy confirmation with a distinct, 44px control and stable label/width.
Clipboard delivery is stubbed; no contact address is written to the OS clipboard.
Fixtures stay in the browser.
Preview fixtures reuse an existing local JPEG with a distinct URL per capture
size, matching the real API's image identity contract. They test the frame and
controls; they do not certify a live provider capture.
Failed contact requests are intercepted before delivery; drafts remain intact.
Fullscreen Escape returns focus. The baseline runner recorded eight states per
combination, including the six timeout failures fixed by this pass.
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
introduced; the existing verifier provides the separate capsule slow-motion check.

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
light default; the existing capsule shell. Morphicons would add a runtime
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
