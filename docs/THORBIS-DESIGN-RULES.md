# Thorbis Design rules checklist for byronwade.com

byronwade.com uses the Thorbis Design system (https://design.thorbis.com, repo byronwade/thorbis-design). This file is the review checklist: every design change is checked against it. When this file and the live site disagree, design.thorbis.com wins; regenerate this file.

- Extracted: 2026-10-16 from design.thorbis.com (sitemap, 64 guideline pages: research topics, skills, focused studies, product chapters) plus rules.md, guidelines.md, and repo commit 5d8cd27 (content/design/DESIGN.md, constitution.md, PAGE_PATTERNS.md, COMPONENTS.md, content/skills/*/SKILL.md).
- Rule text is quoted from the site, shortened to the rule (the "Why" lines are omitted; follow the Source link for rationale).
- Product chapters (/product/chapters/*) cover physical hardware and are prose only; they're listed for completeness and marked N/A for this site except where a web analogue is obvious (product page layout, product photography for /shop).
- Component specs live at https://design.thorbis.com/components/<name> (accordion ... typography). Use those as the API and state reference for every components/ui primitive.

## How to use

1. For a page, pick the profile first. byronwade.com profiles: Showcase (/, /projects, /portfolio, /blog), Evidence (/resume, /projects/[slug], blog posts: no motion), Guided (/contact, /shop checkout). There's no Workbench surface.
2. Check every page at 375, 768, 1440, light and dark, reduced motion on and off.
3. Tick each applicable rule below or record a violation (page, rule, fix, evidence) in the PR.

## Core laws (rules.md, the constitution)

- [ ] Build in order: tokens → primitives → components → patterns → pages.
- [ ] Search before creating. Reuse the Thorbis-wrapped ShadCN primitive before adding a local control.
- [ ] Match the profile to the job: Evidence, Showcase, Workbench, or Guided.
- [ ] A field is a recessed well. A commit is ink. A chip is a pill. An icon-only control is a circle.
- [ ] Show loading, success, error, empty, disabled, offline, stale, partial, and conflict states truthfully.
- [ ] Keep async words stable and centered; morph the state mark and honor reduced motion.
- [ ] On mobile, use at least 16px input type, 44px touch targets, safe areas, and no disabled zoom.
- [ ] Preserve source credit, recovery paths, and safe useful work when dependencies fail.
- [ ] No gradients. No ornamental blur. Real borders follow rounded surfaces.
- [ ] A control keeps its meaning through every state (resting, focused, activated, pending, resolved, recovered); label and footprint stay stable.
- [ ] Immediate acknowledgment is not confirmed success (shop checkout: pending vs confirmed vs unknown).
- [ ] Frequent work stays immediate; allowed motion can be interrupted without snapping.
- [ ] Close the loop with evidence: each review records defect, owning rule, smallest fix, verification.

## Research chapters (rules)


### Linear is the base
Source: https://design.thorbis.com/research/topics/linear-base

- [ ] Linear grammar. Not Linear dress. Inverted L. Dark greys. Inter. One accent, used as a pointer. Fast local actions. A board that stays a board. We do not ship Linear purple, Linear’s wordmark, or a clone of their issue row. If someone mistakes a screenshot for Linear, we went too far. How we redesigned the Linear UI (opens in a new tab) .
- [ ] A page is a place. A modal is a transaction. Linear does not ban overlays. It bans an ambiguous surface. Search is a route. Create is a modal. Properties sit in a panel. Peek inspects without navigating. A right-side drawer is the middle that covers the work and confuses Back. We take the discipline. Jobs and invoices are routes. Collecting a payment is a modal. On a phone, a bottom sheet may hold the inspector. Desktop does not get a drawer instead of a page.
- [ ] A reset is a sweep. Karri(@karrisaarinen ) : software evolves weekly and the chrome unbalances. Don’t redesign one view at a time and leave the product disjointed. Do it quickly or you block everything else. A design reset (opens in a new tab) .
- [ ] The best design is opinionated. Karri again: you cannot build the optimal tool if it is endlessly customizable. There is a good way to dispatch a job. There is a good way to arrive. If a shop wants a different product, they should use a different product. Ten rules for craft (opens in a new tab) .
- [ ] The simplest way to raise quality is to reduce scope. Quality is not perfection. It is fewer things, done so they feel inevitable. A second theme, a second density, a second word for job: each one is a papercut we now have to keep sharp.
- [ ] Chrome stays neutral. In the 2024 reset they limited how much accent sits in the chrome so the product would feel timeless. Same law here. The rail stays grey. Electric blue is selected, focus, the one live thing. A blue sidebar is a costume.
- [ ] Take the idea. Refuse the dress. Robb Böhnke, on Linear’s iOS bar: they wanted Liquid Glass’s depth, not its refraction. Refraction makes a dense professional UI harder to read. We do the same. System chrome on a phone may use the platform material. Our sheet does not. A Linear spin on Liquid Glass (opens in a new tab) .

### Interactions
Source: https://design.thorbis.com/research/topics/interactions

- [ ] Keyboard works everywhere. All flows are keyboard-operable & follow the WAI-ARIA Authoring Patterns (opens in a new tab). In Thorbis this includes dispatch boards, schedule timelines, record sheets, and command surfaces, not just forms.
- [ ] Clear focus. Every focusable element shows a visible focus ring. Prefer :focus-visible over :focus to avoid distracting pointer users. Set :focus-within for grouped controls. Focus and selection are visually distinct.
- [ ] Manage focus. Use focus traps, move & return focus according to the WAI-ARIA Patterns (opens in a new tab). The kit we ship is the shadcn Dialog. Native <dialog> is fine underneath. On close, return focus to the trigger.
- [ ] Match visual & hit targets. If it looks clickable, it is clickable across its whole visual extent. Exception: if the visual target is under 24px, expand its hit target to at least 24px. Desktop prefers 40px. On mobile, the minimum size is 44px. Never let extended hit areas overlap. A checkbox and its label share one target. If part of a control looks live, it is live.
- [ ] Mobile input size. <input> font size is ≥ 16px on mobile to prevent iOS Safari auto-zoom. Never set maximum-scale=1 or user-scalable=no .
- [ ] Respect zoom. Never disable browser zoom. The page must work at 200% zoom and reflow at 320px width.
- [ ] Hydration-safe inputs. Inputs must not lose focus or value after hydration.
- [ ] Don’t block paste. Never disable paste in <input> or <textarea>. Dispatchers paste job numbers, phone numbers, and one-time codes.
- [ ] Loading buttons. Show a loading indicator & keep the original label. “Save” with a spinner, not a bare spinner.
- [ ] State icons morph. Any icon that changes state goes through Morphicons (opens in a new tab). Idle becomes the next glyph with a snappy spring. Still icons stay Phosphor Regular at 16. Do not cross-fade two SVGs.
- [ ] A loading icon turns. Busy morphs to a loader, then the loader spins. Honor prefers-reduced-motion : morph becomes a swap, the spin stops. The word stays. See Loading buttons and Nothing shifts .
- [ ] Minimum loading-state duration. If you show a spinner/skeleton, add a short show-delay (~150–300 ms) & a minimum visible time (~300–500 ms) to avoid flicker on fast responses.
- [ ] URL as state. Persist filters, tabs, pagination, expanded panels, and the open record sheet in the URL so share, refresh, and Back/Forward work. Anytime useState describes a destination, it belongs in the URL. If it is a place, a customer, a job, an estimate, an invoice, it has an address.
- [ ] Optimistic updates. Update the UI immediately when success is likely; reconcile on server response. On failure, show an error & roll back or provide Undo.
- [ ] Ellipsis for further input & loading states. Menu options that open a follow-up e.g., “Rename…” & loading states e.g., “Saving…”, “Dispatching…” end with an ellipsis character ( …, not ... ).
- [ ] Confirm destructive actions. Require confirmation or provide Undo with a safe window. Money, payroll, and customer-facing sends are never hover-only.
- [ ] Prevent double-tap zoom on controls. Set touch-action: manipulation on interactive elements.
- [ ] Tap highlight follows design. Set -webkit-tap-highlight-color to match the surface, not the default gray flash.
- [ ] Design forgiving interactions. Controls minimize finickiness with generous hit targets, clear affordances, & predictable interactions. A dispatcher in a rush should not miss.
- [ ] Tooltip timing. Delay the first tooltip in a group; subsequent peers have no delay. Tooltips never own essential information.
- [ ] Overscroll behavior. Set overscroll-behavior: contain on modals, drawers, and record sheets.
- [ ] Scroll positions persist. Back/Forward restores prior scroll. Forward navigation starts at the top.
- [ ] Autofocus for speed. On desktop screens with a single primary input, autofocus. Rarely autofocus on mobile because the keyboard opening can cause layout shift.
- [ ] No dead zones. Same law as Match visual & hit targets .
- [ ] Deep-link everything. Same law as URL as state .
- [ ] Clean drag interactions. Disable text selection & apply inert while an element is dragged so selection and hover don’t fire at the same time. Dragging always has a non-drag alternative.
- [ ] Links are links. Use <a> for navigation so Cmd/Ctrl+Click, middle-click, and “open in new tab” work. Never substitute a <button> or <div> for a destination. Buttons do actions; links go places.
- [ ] Announce async updates. Use a polite live region ( role="status" ) for toasts, result counts, and “Saved”. Reserve role="alert" for urgent errors not tied to a field.
- [ ] Locale-aware keyboard shortcuts. Internationalize shortcuts for non-QWERTY layouts. Show platform-specific symbols (⌘ vs Ctrl).
- [ ] Respond on the first frame. Rauno Freiberg(@raunofreiberg ) : truly fluid gestures are immediately responsive. Scale, press, and drag apply on pointer-down, not after a threshold animation plays out. If the user reverses, the surface follows. Don’t make them wait for an entrance to finish before they can swipe it back. Invisible Details of Interaction Design (opens in a new tab) .
- [ ] Reuse metaphors. Don’t invent gestures. Rauno: great interaction design rewards learning by reusing metaphors. A sheet is a layer, swipe it away. A peek is a card, it comes from the row. Pinch is precision. Don’t teach a third swipe direction because this view is “special.”
- [ ] Commit destructive swipes on release. Lightweight reveals (peek a sheet, show search) may fire during the swipe, once the surface reaches its logical position. Destructive or hard-to-undo actions. dismiss a job, archive an invoice, send, wait for the finger to lift. The operator can change their mind mid-gesture. Rauno, “Swipe Gestures.”
- [ ] Motion names the source. A record sheet grows from the row that opened it. An inspector slides from the edge it lives on. A popover scales from its trigger. If three music apps sat on one row, you’d launch from the icon, not the island, so the relationship is obvious. Rauno, “Spatial Consistency.”
- [ ] Context is an input. The mother of all inputs is no input. Command Center already knows the open job. A tech in the van sees field actions first. A pass or QR can raise brightness without asking. Don’t make the operator restate what the surface can see. Rauno, “Implicit Input.”
- [ ] Closer and bigger is faster. Fitts’s Law: time to hit a target is distance and size. Edges and corners are infinite, put frequent chrome there. A row action that lives next to the pointer beats one that lives in a distant toolbar. Radial menus are the pure case; we rarely need one. We do need the law. Rauno via Paul Fitts.
- [ ] Scroll stays on the pane you started. Wheel or trackpad momentum does not hop to the inspector, the sidebar, or a newly hovered list. Focus change cancels the previous scroll. A Magic Mouse gets this right; a hijacked second pane is a daily defect. Rauno, “Scrolling.”
- [ ] Reveal without reflow. Sidebars and inspectors slide with transform and a compensating negative margin so inner content does not skew. Paco Coursey(@pacocoursey ) documented the trick from Linear. macOS Windows (opens in a new tab). Don’t animate width to open a panel.

### Accessibility
Source: https://design.thorbis.com/research/topics/accessibility

- [ ] Measure contrast with APCA. Prefer APCA (opens in a new tab) (Andrew Somers,(@MyndexResearch ) over WCAG 2 for perceptual contrast. Body text targets |Lc| ≥ 75 (prefer 90). Labels and headlines ≥ 60. UI components ≥ 30. Disabled and placeholder text may sit at 30, never below 15.
- [ ] Fix contrast with lightness, not hue. In OKLCH, move L first and keep C and H. On a dark canvas (lightness below 0.25) body text wants lightness above 0.9. On a light canvas (lightness above 0.9) it wants lightness below 0.35. Mid-lightness surfaces cannot reach body contrast, change the surface.
- [ ] Never use a positive tabindex. tabindex="0" adds a custom control to the natural order. tabindex="-1" is for programmatic focus. A positive value hijacks the whole page, fix the DOM order instead.
- [ ] One Tab stop per composite widget. Tabs, menus, toolbars, and radio groups use a roving tabindex: the active item is 0, siblings are -1, arrows move both focus and the zero. Follow the APG pattern (opens in a new tab) for that widget.
- [ ] Skip past chrome. Same law as Headings & skip link. Sticky targets use Anchored headings .
- [ ] Hide visually, not from assistive tech. Use the 1px clip pattern ( sr-only ) for names that sighted users get from layout. Never display: none or a 0×0 box, some readers skip those.
- [ ] Announce with the smallest tool. If focus already moves there, stop. If it is tied to a field, use aria-describedby. If it is a toast, count, or “Saved”, use a polite role="status" that already exists in the DOM. Reserve role="alert" for urgent, unbound errors.
- [ ] Honor forced colors. In forced-colors: active, keep system colors. Never freeze an authored ring with forced-color-adjust: none unless the control stays perceivable.
- [ ] Toasts never steal focus. Announce them and leave the caret where the operator is working. Give a generous timeout or a dismiss. Never put the only path to an action inside an auto-dismissing toast.

### Complex systems fail in combinations
Source: https://design.thorbis.com/research/topics/systems-resilience

- [ ] Serious failure is combined. A local defect rarely explains the whole outcome. Trace the timing, stale state, third parties, operator conditions, and defenses that had to align. Name the proximate trigger, but do not stop there.
- [ ] Degraded is a product state. Partial outages, stale dependencies, delayed jobs, and lost connectivity are normal states of a complex operating system. Show freshness and partial completion. Preserve the safest useful workflow instead of a blank screen or false success.
- [ ] People create safety. Dispatchers, technicians, owners, and support staff keep the system inside tolerable bounds. Give them context, an interrupt, an override, an audit trail, and a recovery path. Opaque automation removes a defense.
- [ ] Every change creates a new failure path. A fix, migration, AI workflow, or integration can remove a frequent nuisance and introduce a rare severe failure. Review blast radius, reversibility, observability, rollout, and fallback before release.
- [ ] Safety belongs to the whole system. No validation, service, person, or team makes a workflow safe alone. Consequential flows need independent defenses across interface, authorization, tenant isolation, data, runtime, and operations.
- [ ] A 200 is not the outcome. Observe whether the invoice was paid, the customer was contacted, the job was dispatched, or the record reconciled. Transport success is evidence, not completion.
- [ ] Near misses and workarounds are data. Repeated manual correction, duplicate suppression, retry, or operator rescue is a proto-incident. Record it before several small faults line up.
- [ ] Do not ship a blame-shaped fix. “Human error” and a single root cause hide the system that produced the action. Incident reviews reconstruct what was known at the time, which defenses worked, and which small change reduces the broader class of harm without adding worse coupling.

### Mobile
Source: https://design.thorbis.com/research/topics/mobile

- [ ] Hover state stuck after tap. Wrap hover styles in @media (hover: hover) and (pointer: fine). Touch devices emulate hover on tap; without the query the state sticks. From Emil Kowalski(@emilkowalski ) .
- [ ] Gray/blue flash on tap. Kill -webkit-tap-highlight-color (or set it to the surface). The default flash is browser chrome, not our press state.
- [ ] Layout has the wrong height. Use 100dvh for the app shell. Use 100svh for a hero that must not jump when the browser chrome shows or hides. Never 100vh on a phone.
- [ ] Page zooms into the input. Same law as Mobile input size .
- [ ] Tap feels laggy. Give feedback on pointer-down, not pointer-up, and set touch-action: manipulation so the browser does not wait to see if the tap is a double-tap zoom.
- [ ] Pull-to-refresh hijacks scroll. Set overscroll-behavior: none on html, body in the workbench. Sheets and drawers still use overscroll-behavior: contain so they don’t chain to the page.
- [ ] Content stops at the notch. viewport-fit=cover plus env(safe-area-inset-*). The canvas may bleed into the inset; controls and type stay inside it.
- [ ] Long-press selects button text. Add user-select: none on buttons, tabs, and other controls. Selection is for copy, not for chrome.
- [ ] Carousel scrolls vertically. Set touch-action: pan-y on a horizontal gesture surface so the page can still scroll, and the swipe does not fight it.
- [ ] Status bar color doesn’t match. Same law as Browser UI matches your background .
- [ ] Right in Chrome, wrong on a phone. Test on real hardware. DevTools device mode does not reproduce tap-highlight, hover-stick, address-bar height, or the notch. Emil’s last line, and the only one that cannot be faked.
- [ ] Don’t cancel a drag the thumb is covering. Tiny sliders and carets disappear under a finger. Keep the gesture alive if the touch moves away while still down. When precision matters, a caret, a time scrub, show a loupe or enlarged key above the contact, and drop it once the finger no longer covers the target. Rauno, “Touch Content Visibility.”

### Platforms
Source: https://design.thorbis.com/research/topics/platforms

- [ ] Four products. One job. Dispatch, arrive, collect. The job does not change. The shell does. If you can screenshot one platform, slap a device frame on it, and call it another, you have not designed the second platform.
- [ ] Web is the workbench. Inverted L. Keyboard. URL as state. shadcn dressed in our tokens. This is the office, the books, the board. Emil’s mobile tricks on this page are for the browser on a phone, not for a native app. Native phones do not get a squeezed inverted L.
- [ ] iOS follows the HIG. Tab bar at the bottom. Navigation stack. Sheets from the bottom. Swipe-back is sacred. Dynamic Type. 44pt targets. Haptics on a commit, not on every tap. System tab bars may use Apple’s Liquid Glass. Our sheet does not. We do not invent glass. HIG (opens in a new tab) .
- [ ] Android is not a reskinned iPhone. Material 3 navigation. Predictive back. 48dp targets. Edge to edge. A navigation rail on a tablet, not an iPad sidebar copy. Snackbars do not steal focus. We do not adopt Material You wallpaper tint. Electric blue stays ours. m3.material.io (opens in a new tab) .
- [ ] Desktop follows the host OS. macOS keeps traffic lights and a native menu bar. Windows keeps the caption buttons and snap. Do not paint macOS lights on Windows. Do not paint a Windows title bar on a Mac. The inverted L is legal here. Hover is legal. Density is legal. macOS HIG (opens in a new tab) · Fluent 2 (opens in a new tab) .
- [ ] System chrome is not ours to restyle. Status bar, home indicator, caption buttons, IME, share sheet, date picker, biometric prompt. Use the platform. A fake iOS switch on Android is a costume.
- [ ] Thumb law or keyboard law. Not both as the primary. A phone is Arrive and Collect in two taps. A desktop is a dispatcher who never leaves the keyboard. Putting ⌘K in a tab bar, or a hamburger on a 27-inch board, is the wrong law.
- [ ] Do not share chrome across platforms. Shared tokens, type, status, and job language. Shared domain. Not a shared AppShell. A React Native screen that draws our web sidebar is a defect.
- [ ] Native type on native chrome. iOS chrome may use SF Pro. Android chrome may use the device type. The work (job titles, money, notes) can stay Inter. Do not ship Geist on a tab bar.
- [ ] Haptics are a phone commit. A light impact when Dispatch lands. Nothing on scroll. Nothing on every list row. Desktop has no haptic. Do not invent a shake on the web.

### Animations
Source: https://design.thorbis.com/research/topics/animations

- [ ] Start The job editor is closed. The Edit sample job button keeps its place.
- [ ] Result The editor is open with its title, fields and focus. Reduced motion changes the entrance, not the available work.
- [ ] Preference: CSS transitions, then Web Animations API, then JavaScript libraries e.g. motion (opens in a new tab) .
- [ ] Compositor-friendly. Prioritize GPU-accelerated properties ( transform, opacity ) & avoid properties that trigger reflow ( width, height, top, left ).
- [ ] Necessity check. Ask first: should this animate at all? Match motion to how often the user sees it. High-frequency actions (every keystroke, every row hover, ⌘K) are instant. Rauno and Emil independently: command menus used hundreds of times a day become cognitive burden, not delight. Novelty dies. Only animate when it clarifies cause & effect or adds deliberate, rare delight. animations.dev (opens in a new tab) · Frequency & Novelty (opens in a new tab). Emil Kowalski(@emilkowalski ), Rauno Freiberg(@raunofreiberg ) .
- [ ] Start The job editor is closed. A pointer activation can use the existing Dialog entrance recipe.
- [ ] Result The editor is ready to use. The recipe uses --motion-overlay; it does not delay the available actions.
- [ ] Easing fits the subject. Choose easing based on what changes. Prefer a custom ease-out ( cubic-bezier(0.23, 1, 0.32, 1) ) for entering surfaces. Never ease-in. it delays the first frame the user is watching.
- [ ] Interruptible. Animations are cancelable by user input. Prefer CSS transitions for interactive state; reserve keyframes for one-shot sequences. If a mistap opens a sheet, the reverse swipe must work on the first frame, not after the entrance finishes. Rauno’s iOS Settings critique. Jakub Krehel(@jakubkrehel ) : transitions retarget, keyframes do not. Details that make interfaces feel better (opens in a new tab) .
- [ ] Animate icons contextually. When an icon appears because of context, a search result, a status change, fade it. Opacity, a little scale, maybe blur. Not the whole toolbar. Jakub Krehel(@jakubkrehel ) .
- [ ] Split and stagger entering elements. A first Showcase entrance may arrive in pieces: title, then copy, then the shot. Follow the Motion recipe for stagger. First paint of a workbench stays still; opening another feed page does not grant a new motion budget. This sequencing lesson comes from Jakub Krehel(@jakubkrehel ) .
- [ ] Exit is quieter than enter. Leaving does not need the same attention as arriving. Opacity, or a slide fully off screen. Do not bounce a sheet out. Jakub Krehel(@jakubkrehel ) .
- [ ] Confirm the choice as it leaves. macOS context menus do not animate in. They fade out, and the selected item blinks the accent so you know the click landed. High-frequency menus in Thorbis do the same: instant open, a brief selected flash on close. Don’t scale the menu in. Rauno, “Frequency & Novelty.”
- [ ] Input-driven. Avoid autoplay; animate in response to actions. Nothing should refuse to stop.
- [ ] Correct transform origin. Anchor motion to where it physically starts. Popovers scale from their trigger, not the center of the screen.
- [ ] Never kiss the window. A popover, a menu, a sheet, a toast, they keep a gap from the edge of the viewport. At least 16px, plus the safe area. Touching the chrome of the window looks unfinished. If it would collide, slide it. Do not clip it flush. Same law for the left, the right, the top, the bottom.
- [ ] Never transition: all. Explicitly list only the properties you intend to animate. all animates layout properties and causes jank.
- [ ] Scale on press. Tactile confirmation uses scale(0.96). Never below 0.95. Skip it when the motion would be distracting.
- [ ] Cross-browser SVG transforms. Apply CSS transforms to <g> wrappers & set transform-box: fill-box; transform-origin: center; .
- [ ] will-change is a last resort. Only transform, opacity, filter — properties the GPU can composite. Never will-change: all. Add it when the first frame stutters. Take it off when the motion is done.
- [ ] Menus fade. They do not fly. Close a menu with a short fade. Do not translate it off screen. High-frequency menus open instant and confirm the choice as they leave. Sheets may slide from an edge; menus may not. Confirm the choice as it leaves. D-021 .

### Layout
Source: https://design.thorbis.com/research/topics/layout

- [ ] Align optically, not geometrically. When a button has text and an icon, give the icon a hair less padding so the lockup looks centered. Fix the SVG, not the layout, when a shape leans. Inline marks, @handles, swatches, code, sit on the same baseline as the sentence. Same size. Same color as the words. A quiet wash, not a button dropped into the line. Jakub Krehel(@jakubkrehel ) .
- [ ] Deliberate alignment. Every element aligns with something intentionally, a grid, baseline, edge, or optical center. No accidental positioning. Shared edges are how the eye scans.
- [ ] Group with space, not lines. Negative space first, background shapes second, separator lines last. The gap between groups is at least 2× the gap within a group.
- [ ] Balance contrast in lockups. When text & icons sit side by side, adjust weight, size, spacing, or color so they don’t clash. A 1.5px icon stroke sits with regular text; 2px sits with semibold.
- [ ] Work dominates chrome. Navigation supports orientation. The customer’s work, schedule, records, conversations, and money receive visual priority. The sidebar recedes; the work sheet leads.
- [ ] Chrome keeps one measure. Header, nav, and sign-off sit on the document measure, 65–75ch. Only the work may go wider: a mirror, a board, a feed. The location bar does not jump when the record does. Linear keeps the inverted L still while the sheet changes. Cap the measure .
- [ ] Density belongs to the work. Linear is dense where comparison matters, lists, boards, schedules. Steve Schoger(@steveschoger ) and Adam Wathan(@adamwathan ) : start with too much space on Showcase; remove it until the workbench fits one more useful row. You don’t have to fill the screen with chrome. You do have to fill it with the job. Refactoring UI (opens in a new tab) .
- [ ] Responsive coverage. Verify on mobile, laptop, & ultra-wide. Responsive design recomposes; it does not merely shrink desktop. For ultra-wide, zoom out to 50% to simulate.
- [ ] Respect safe areas. Account for notches & insets with safe-area variables (opens in a new tab). Content bleeds; controls float inside the margins.
- [ ] No excessive scrollbars. Only render useful scrollbars. Fix overflow instead of hiding it. Test with macOS “Show scroll bars: Always”.
- [ ] Let the browser size things. Prefer flex/grid/intrinsic layout over measuring in JS. Avoid layout thrash.
- [ ] Logical properties, not physical. Use margin-inline-start, padding-inline-end, text-align: start. Reserve left/right for genuinely physical geometry.
- [ ] Reserve the space. Images, maps, video, and avatars set aspect-ratio so nearby work does not jump while they load. A skeleton matches the hole. A missing ratio is layout shift, and layout shift on a dispatch board is a lost row. D-019. From the UI Skills playbook (opens in a new tab) .
- [ ] Peek the next item. A horizontal list that scrolls shows 16–32px of the next card. If the last visible item is flush, it reads as the end. Photos on a job, invoices in a strip, a day of stops: leave a sliver. D-019 .
- [ ] Fade a list that continues. Where a pane scrolls and the edge would look like a hard clip, fade it with mask-image. The fade is how you say there is more. Do not use a divider, a chevron, or a drop shadow as that signal.
- [ ] Overlay is a mix, not a blur. Collect payment, assign a tech, a menu: the board behind them is a solid mix, one step dimmer. Not backdrop-filter. Blur is expensive and it is costume. Frost on the site header is chrome, not an overlay. A popover grows from the control that opened it. A menu fades; it does not fly off the screen. D-021 .
- [ ] Two rimmed controls keep 12px. Field to commit is 12px. Two chips, a well and a mark, a pair of bordered buttons: 12px between them. Tighter reads as one control. Looser is a new group.
- [ ] A full-width commit stays in the sheet. Arrive, Save invoice, Collect: if they go full width they sit in the sheet’s pad, not flush to the phone edge. Edge-to-edge is the sheet, not the button.

### Content
Source: https://design.thorbis.com/research/topics/content

- [ ] Inline help first. Prefer inline explanations; use tooltips as a last resort. A dispatcher should not have to hover to know what a status means.
- [ ] Stable skeletons. Skeletons mirror final content exactly to avoid layout shift.
- [ ] Nothing shifts. A status change must not move anything else. Reserve the widest word. Fade the next one in on top. Never swap “Copy” for “Copied” if the slot was not sized for both. Counts, toasts, pills, copy, keep, download. A jumping control is a missed tap. This is a hard no.
- [ ] Accurate page titles. <title> reflects the current context, most specific first: Invoice 1042 · Acme HVAC · Thorbis .
- [ ] No dead ends. Every screen offers a next step or recovery path. Empty states say why it is empty and what to do next.
- [ ] All states designed. Empty, sparse, dense, loading, error, permission, offline, stale, optimistic, destructive, and success. A screen that only has the happy path is unfinished.
- [ ] Typographic quotes. Prefer curly quotes (“ ”) over straight quotes (" ") in prose. Keep straight quotes in code.
- [ ] A mark does not split. A handle, a pair of parentheses, a code token, a swatch. They wrap as one word, or they wrap at a space. Never a lonely ( on one line and ) on the next. Never no- then preference. If the lockup is too wide, the line breaks before it. This is the same law as nothing shifts, for type.
- [ ] Avoid widows/orphans. Tidy rag & line breaks. text-wrap: balance on headings; text-wrap: pretty on descriptions. Skip both on long-form body.
- [ ] Make text crispy. On macOS, default smoothing can look heavy. Set -webkit-font-smoothing: antialiased on the layout, once. Jakub Krehel(@jakubkrehel ) .
- [ ] Tabular numbers for comparisons. Use font-variant-numeric: tabular-nums for money, durations, quantities, invoices, and any value that updates.
- [ ] Redundant status cues. Don’t rely on color alone; include text labels. Status pills carry a word, not just a hue.
- [ ] Icons have labels. Convey the same meaning with text for non-sighted users. Icon-only buttons always have an accessible name.
- [ ] Don’t ship the schema. Visual layouts may omit visible labels, but accessible names still exist for assistive tech.
- [ ] Anchored headings. Set scroll-margin-top when linking to sections under sticky chrome.
- [ ] Resilient to user-generated content. Layouts handle short, average, & very long names. “Bob”, “Southern Comfort Heating & Air of North Georgia, LLC”, and a pasted VIN.
- [ ] Locale-aware formats. Format dates, times, numbers, delimiters, & currencies for the user’s locale. Prefer language settings over IP/GPS.
- [ ] Shield verbatim content from translation. Wrap brand names, product names, code tokens, & identifiers with translate="no" .
- [ ] Semantics before ARIA. Prefer native elements ( button, a, label, table ) before aria-*. No ARIA is better than bad ARIA.
- [ ] Headings & skip link. Hierarchical <h1>–<h6>, one visible <main>, and a “Skip to content” link when chrome precedes the work.
- [ ] Non-breaking spaces for glued terms. Keep units, shortcuts & names together: 10 MB, ⌘ + K, $299 / month .

### Forms
Source: https://design.thorbis.com/research/topics/forms

- [ ] Enter submits. When a text input is focused, Enter submits if it’s the only control. If there are many controls, apply to the last control.
- [ ] Textarea behavior. In <textarea>, ⌘/⌃+Enter submits; Enter inserts a new line.
- [ ] Labels everywhere. Every control has a <label> or is associated with one. A placeholder is never a label.
- [ ] Label activation. Clicking a <label> focuses the associated control. No dead zone between the text and the input.
- [ ] Submission rule. Keep submit enabled until the request starts; then disable it, show a spinner, keep the original label, & include an idempotency key.
- [ ] Don’t block typing. Even if a field only accepts numbers, allow any input & show validation after. Blocking keystrokes is confusing because the user gets no explanation.
- [ ] Don’t pre-disable submit. Allow submitting incomplete forms to surface validation. Focus the first invalid field.
- [ ] Error placement. Show errors next to their fields with aria-invalid and aria-describedby. Never a red border alone. The copy tells the user how to fix it.
- [ ] Error replaces help. Help sits under the field. When the field is invalid, the error takes that seat. One slot. Do not stack help and error. Do not toast a missing name. Shopify’s form cleanliness: the sentence under the well is the only commentary.
- [ ] Affixes live in the well. $, %, /hr, and units sit inside the field, as quiet prefixes or suffixes. They are not a second box. They are not a label. The value stays tabular.
- [ ] A cluster is space, not a card. Related fields share a heading and a gap. Do not wrap each input in its own sheet. Polaris groups by proximity. We already forbade a line between jobs; the same law applies to a name and a phone.
- [ ] Placeholders are examples. A placeholder shows the shape of the answer: Mike Reyes, 114 Oak, $186.00. It is never the label. “Enter name” is a missing label. Shopify’s cleanliness: the field already has a name above it.
- [ ] Mark optional, not required. Most fields on a job are required. Stars on every row is noise. Mark the rare skip with the word optional. Polaris does the same for merchants.
- [ ] A banner is a page problem. Offline, a failed save for the whole sheet, a permission that blocks the room: those are banners. A missing name stays under Name. Shopify’s banners are page-level. Field errors are not.
- [ ] Autocomplete & names. Set autocomplete & meaningful name values. Stay compatible with password managers and 2FA autofill.
- [ ] Spellcheck selectively. Disable for emails, codes, usernames, invoice numbers, and job IDs.
- [ ] Correct types & input modes. Use the right type & inputmode. Money uses inputmode="decimal" on type="text", not a spinner.
- [ ] Placeholders signal emptiness. End with an ellipsis, the character in Ellipsis. Set the value to an example: name@company.com, (706) 555-0142 .
- [ ] Unsaved changes. Warn before navigation when data could be lost. Never lose typed input to a re-render.
- [ ] Trim before validate. Autocomplete and text expansion add trailing spaces. Trim so a valid value is not rejected.

### Composition
Source: https://design.thorbis.com/research/topics/composition

- [ ] Don’t proliferate boolean props. isThread, isEditing, isInvoice each double the state space and hide impossible combinations. Build JobNoteComposer, DispatchThreadComposer, and EditInvoiceComposer instead. Share internals; never share one monolithic parent.
- [ ] Compound components over render props. Export Composer.Provider, Frame, Input, Footer, Submit. Each piece reads shared state from context. Callers compose exactly the chrome they need, no showAttachments flags, no renderFooter callbacks for static structure.
- [ ] Name the variant. <ThreadComposer jobId="…" /> documents itself. <Composer isThread channelId="…" showFormatting={false} /> does not. Each variant is explicit about its provider, its pieces, and its actions.
- [ ] Prefer children for structure. Use children to compose layout. Reach for a render prop only when the parent must pass data back, a list’s renderItem, not a composer’s header.
- [ ] Lift state into a provider. A Forward / Peek / Dialog action that lives outside the composer frame still needs submit and the draft. Put state in a provider. Visual nesting is not the seam, the provider boundary is.
- [ ] Context is a contract: state, actions, meta. Any provider that implements the same interface can drive the same UI. Local useState for an ephemeral forward. Synced store for a live job thread. The input does not know which.
- [ ] UI does not know how state is stored. The provider is the only module that imports Zustand, a server sync, or useState. Pieces consume the context interface. Swap the provider, keep the pieces.
- [ ] React 19: ref is a prop, use() is context. Do not wrap with forwardRef. Read context with use(), which may be called conditionally. Skip this if a surface is still on React 18.

### Performance
Source: https://design.thorbis.com/research/topics/performance

- [ ] Device/browser matrix. Test iOS Low Power Mode & macOS Safari. Field techs live on mid-range phones with bad reception.
- [ ] Measure reliably. Disable extensions that add overhead or change runtime behavior.
- [ ] Track re-renders. Minimize & make re-renders fast. Use React DevTools (opens in a new tab) or React Scan (opens in a new tab) .
- [ ] Throttle when profiling. Test with CPU & network throttling. A dispatch board that is fast on a Studio Display and janky in a truck is not done.
- [ ] Minimize layout work. Batch reads/writes; avoid unnecessary reflows/repaints.
- [ ] will-change is a last resort. Do not sprinkle will-change: transform on every card. Promote a layer only for a motion that is already janking, and drop it when the motion ends. Jakub Krehel’s Interfaces (opens in a new tab) issue on will-change .
- [ ] Network latency budgets. POST/PATCH/DELETE complete in under 500ms. Optimistic UI covers the rest.
- [ ] Keystroke cost. Prefer uncontrolled inputs; make controlled loops cheap. Command Center ranking must stay instant.
- [ ] Large lists. Virtualize large job, invoice, and activity lists. A 75-person shop’s ledger is not a toy dataset.
- [ ] Preload wisely. Preload only above-the-fold images; lazy-load the rest. Set explicit image dimensions to prevent CLS.
- [ ] Preload fonts. For critical text to avoid flash & layout shift. Subset to the code points you use.
- [ ] Don’t use the main thread for expensive work. Move long tasks, route matrices, large CSV parses, image work, to Web Workers.

### Design
Source: https://design.thorbis.com/research/topics/design

- [ ] Quiet chrome. Precise work. The product principle. Structure should be felt, not drawn. Regions stay liquid, see No borders on the page. The work leads, see Work dominates chrome .
- [ ] One accent, used with intention. Same law as Electric blue is the brand. The greys do the rest. Extras stay extras.
- [ ] A border is a use case, never a separator. Borders are specific. A field, a commit, a chip, a photo sitting on a matching canvas gets a 1px whisper rim so it does not melt. That is the only job a border has. Never a line between items. Never under a heading. Never around a panel. Never between rooms. If the eye already had a pause, a line makes the thing feel boxed. Tone, type, space, a short shadow. The page is one pour. Byron Wade(@Byronwade ) .
- [ ] A well or a lift. Never the same fill as the sheet. If a control shares its parent’s color, it disappears. A field is a well: one step darker, inset, and a 1px rim. A commit is a lift: ink fill, 10px corners, a 1px rim, a short Shopify bevel. Same-on-same is illegal. The rim is not a box around the page. It is how a glove finds the phone box.
- [ ] Short shadows, not hairlines. Depth is Shopify-short: a 1px inset highlight and a 1px drop, not a card stack. Linear-quiet: the sheet is barely lifted. Hard offset shadows are costume. Dark canvases still get a whisper of warm light from above, that is the bevel, not a ring. Polaris shadows (opens in a new tab), studied for elevation. We do not ship on Shopify.
- [ ] Three depths. No fourth. Rest is planar. A commit lifts: 1px inset light from above, 1px drop. A menu, popover, or sheet is an overlay with a real shadow. That is the whole ladder. Shopify Polaris names this bevel versus elevation. We keep the grammar, not the costume. Polaris shadows (opens in a new tab) .
- [ ] Hover is not a lift. Hover is a quieter fill, or a slightly stronger bevel on a commit that already lifts. It does not add a drop shadow. Press sinks. Overlay is the only float. A field that lifts on hover is a costume.
- [ ] Depth means you can press it. Shopify’s depth rule: elevation signals interactivity. A sheet stays planar. A field sinks. A commit, chip, or photo may lift. A menu floats. Do not lift a heading, a row of copy, or a quiet panel to make it “pop.” Polaris depth (opens in a new tab) .
- [ ] Disabled needs a reason. A grey Dispatch with no sentence is a locked door. Say why next to the control: “Assign a truck first.” Polaris: merchants stay in control. Shortcut-only disable is a defect.
- [ ] Destructive is a tone, not a second language. Same 10px commit. Danger color. The word names the consequence: Void invoice, not Delete. Not a red outline kit. Not a second radius. Confirm with the consequence stated.
- [ ] Rounded, not soft. Buttons are 10px. Panels are 14px. Icon-only controls are circles. Chips are pills. Corners are friendlier than a square and tighter than a squircle. If it looks melted, the radius is too big.
- [ ] Commits are ink. Chips are pills. A form commit is a small physical thing: filled with the type color, cream or dark grey on the inverse, 10px corners, a 1px rim, a 1px inset light, a 1px drop. Press sinks. Shopify fill, Linear quiet. Not a candy pill. Not a banner. Text in a document stays a link. Chips and filters stay pills. Icon-only stays a circle.
- [ ] Controls sit with the type. Chrome is 13px. Content around it is 14px. A pill is about 28px. A search field may be a hair taller and stays 14px type. If the button is louder than the sentence next to it, shrink the button.
- [ ] Photos get a rim, not a box. A dark shot on a dark canvas disappears. Give it a 1px inset of the type color at 9%, and a short lift. Pure black at 10% in light, pure white at 10% in dark. Never a tinted near-black; it reads as dirt. The rim flips if the theme flips. That is the edge of a print on the table, not a stroke around a card.
- [ ] Start Focus is on Edit sample job. Enter or Space activates the same visible action.
- [ ] Result Focus is inside the open editor immediately. Escape closes it and returns focus to its trigger.
- [ ] Nested radii. Child radius ≤ parent radius & concentric so curves align: outer = inner + padding. No arbitrary page-local radii. Pills and circles are the exception, not a third scale.
- [ ] Hue consistency. Neutrals are cool dark greys. Shift lightness, not fashion. One accent. No ice-blue chrome. No olive walls.
- [ ] Minimum contrast. Same law as Measure contrast with APCA. Interactions increase contrast. Hover, active, and focus are stronger than rest.
- [ ] Browser UI matches your background. Set <meta name="theme-color"> to the resolved canvas, and color-scheme: light dark. The OS chrome follows the theme they picked, or the system if they left it alone.
- [ ] Avoid gradient banding. Fading content to dark colors with CSS masks can band. Use a background image when it does.
- [ ] Image outlines. Same law as Photos get a rim .
- [ ] One SVG, recolored per state. Icons are Phosphor, regular, 16px. Use currentColor. Fill only marks the active state, a kept bookmark, a live heart. Never ship separate assets per hover or disabled. Never an icon without a name. phosphoricons.com (opens in a new tab) .
- [ ] Flip the theme when stuck. Rauno Freiberg(@raunofreiberg ) : if a surface looks wrong and you cannot say why, switch dark ↔ light and look again. Contrast, weight, and accidental hue all show up on the other canvas.
- [ ] Design the device you have. Rauno again: mobile-first as a religion is how desktop workbenches get thin. Spend energy where the job lives. Dispatch, books, and the schedule are desktop-first. The van is mobile-native. Do not shrink one into the other.

### Empathy, focus, impute
Source: https://design.thorbis.com/research/topics/impute

- [ ] Empathy. “We will truly understand their needs better than any other company.” Ours are specific: a dispatcher at 7 a.m., a technician in a crawlspace, an owner closing the books. If a surface does not serve one of those people, it is not Thorbis. Do not design for a generic “user.”
- [ ] Focus. “In order to do a good job of those things we decide to do we must eliminate all of the unimportant opportunities.” This is Karri’s reduce-scope rule, written in 1977. One view done exceptionally well beats a half-finished second one. Cut the extra module, the extra accent, the extra nav item.
- [ ] Impute. “People DO judge a book by its cover.” We may have the best dispatch board in the trades; if we present it slipshod, it will be taken as slipshod. If we present it with the same care we put in the workbench, we impute that care. This is why Showcase exists, and why the workbench stays quiet, not sloppy. Markkula, January 3, 1977.
- [ ] The cover and the book get the same care. Impute is not decoration on a weak product. The sheet in the ad is the sheet we ship. A cinematic void around a fake UI is a lie. A great board in a three-card marketing grid is a failure of impute. Both sides have to be true.

### Showcase
Source: https://design.thorbis.com/research/topics/showcase

- [ ] The product is the picture. Apple’s first rule of a product page: the object is larger than the headline. The first viewport is mostly the thing, a real Thorbis sheet, a real job, a real truck, isolated in a void. Type captions it. If you can remove the product shot and the page still “works,” the page failed. apple.com/macbook-pro (opens in a new tab) .
- [ ] A studio void, not a landing template. Dark canvas. One key light. A rim on the device so the sheet reads as an object. No gradient blob, no glass stack, no floating metric cards. Linear’s marketing uses the same void the workbench uses, the sheet is bright, the world is dim. linear.app (opens in a new tab) .
- [ ] One claim, one shot, per chapter. Scroll is a cut list, not a blog. Each viewport is a chapter: a short line and a product stage. Apple: “Fast runs in the family.” Then the machine. Framer: the canvas doing the work. Do not stack three benefits beside three icons.
- [ ] Scrollytelling, not scroll-jacking. The scroll position may change a sticky stage, a board filling in, a sheet sliding from a row, a van door opening. The browser still owns the scroll. Do not hijack the wheel, lock the page, or invent a second scrollbar. Apple’s pages react to scroll; they do not fight it. Under prefers-reduced-motion, the stage is a still. No pinned theater.
- [ ] Show the work happening. Framer’s marketing works because you see the canvas being used, not a posed screenshot of an empty file. Thorbis Showcase shows a working-day board: named jobs, a tech en route, a real total. Seed data is a defect here too. framer.com (opens in a new tab) .
- [ ] Put the Linear sheet in the void. The cinematic object is the workbench we already designed: inverted-L, dim sidebar, bright sheet. Photograph or stage that composition large. Do not invent a prettier fake UI for marketing. The Showcase page and the product must be the same software.
- [ ] Few words. Operator-plain. Apple barely needs copy because the object is the copy. One short claim. One sentence under it, maybe. Workbench voice lives in Be clear & concise and Sentence case .
- [ ] A film when it earns it. Apple’s “Watch the film” is a named, rare delight, not autoplay behind type. If we shoot, we shoot the job: dispatch at 7 a.m., a crawlspace, the books on Friday. No stock drone suburb. Mute by default. Captions on. Reduced motion gets the poster frame.
- [ ] Industrial-cinematic, not luxury-cinematic. We are not selling glass and gold. Lighting can be filmic; the subject stays a tool. Think a well-shot wrench, not a perfume ad. Kenya Hara’s emptiness plus Apple’s void plus a dirty truck in the frame is the mix. Do not chrome-plate the trades.
- [ ] A stage, not a card grid. Full-bleed or near-bleed product stage. Device or browser frame only if it clarifies scale. Sticky product + scrolling captions is the Framer/Apple pattern. A row of three equal cards is the template we refused in the workbench, it is also refused here.
- [ ] The delight budget lives here only. One authored cinematic moment per chapter, or none. Springs and parallax are Showcase tools. They are banned on a dispatch board. If a marketing motion leaks into Admin, that is a defect, not a brand extension.

### Quality
Source: https://design.thorbis.com/research/topics/quality

- [ ] Quality is the north star. Evaluate every decision by “does this improve quality?”, not “will this ship faster?” Speed is a byproduct of a small team that already knows the standard. Karri Saarinen(@karrisaarinen ), Why is quality so rare? (opens in a new tab) .
- [ ] The spec is the baseline, not the finish. Meeting the ticket is the start of craft. A job board that “works” and a job board a dispatcher will live in for eight hours are different products. Karri: “It’s easy to meet the spec. It’s harder to do the craft.”
- [ ] Quality is not perfection. Start rough. Iterate toward polished with real operators. Defects are countable; excellence is not. Don’t hold a surface hostage waiting for a mythical last pixel. Karri, rule 6.
- [ ] Reduce scope to raise quality. The simplest way to make something better is to do less of it, then do that part exceptionally well. A half-finished second view is worse than one view a dispatcher trusts. Karri, rule 8.
- [ ] The best design is opinionated. Design for the operator in front of you. Broad flexibility is how products become mediocre. Purpose-built software does the heavy lifting; flexible software makes every team invent a workflow. Linear Method: purpose-built. Karri, rule 7.
- [ ] No handoff. The person who shapes the surface stays on it through implementation. PM decides, designer visualizes, engineer builds, that assembly line is how quality dies. Connected teams, shared issues, engineers in the first design review. Karri, rule 3. Ryo Lu(@ryolu_ ) ships the same way at Cursor: the designer writes the interface.
- [ ] Small teams, judgment over committees. Three to five people with taste beat a large review. Hire people who already show craft. Give them a standard, then get out of the way. Karri, rules 2 and 9.
- [ ] Data is a crutch. A/B tests will not tell you the surface feels cheap. Talk to operators. Trust the sense of rightness. Metrics confirm; they do not invent taste. Karri, rule 10.
- [ ] Papercuts every week. Quality is not an individual sport, you cannot see the defects in a UI you built. Tuomas Artman(@artman ) made this a Wednesday habit at Linear: each engineer finds and fixes one papercut (inconsistent 150ms fade, a row that jumps a pixel, a menu that isn’t keyboardable). Thirty minutes. Like brushing your teeth. Quality Wednesdays (opens in a new tab) .
- [ ] Bugs close in seven days. A known defect that sits is a decision to ship lower quality. Linear’s zero-bugs policy: fix it within a week. We keep the same clock. Tuomas Artman(@artman ), Why we committed to a zero-bugs policy (opens in a new tab) .
- [ ] MVPs stay internal. Incomplete products are for us. Operators get a finished job, even if the job is small. Do not A/B a half-built dispatch board in the middle of the working day.
- [ ] Build for the operator. Linear Method: build for the creators. Keeping the individual productive beats generating perfect reports. In Thorbis the creator is the dispatcher, the tech, the owner, not the admin reading a quarterly dashboard.
- [ ] Say no to busywork. The tool works for the operator, not the other way around. Remove or automate work-around-work. Don’t invent terms: a project is a project, a job is a job. Principles & Practices (opens in a new tab) .
- [ ] Decide and move on. There isn’t always a best answer. Make the call, ship, watch an operator use it, correct. Momentum over deliberation. Linear Method: create momentum, don’t sprint.

### Shell
Source: https://design.thorbis.com/research/topics/shell

- [ ] The shell is an inverted L. Outer canvas → left sidebar + main region. Main region → location/history bar, view/toolbar bar, rounded work sheet. The browser variant can omit desktop-native controls without breaking the composition.
- [ ] View types share one hierarchy. List, board, schedule/timeline, map, canvas, inbox, reports, record workspace, and fullscreen editor all use the same chrome. The view changes; the user does not relearn the application.
- [ ] Density is a decision. Same law as Density belongs to the work. High on lists and ledgers. Moderate on records. Low on guided steps.
- [ ] Four surface profiles. Workbench (office, desktop, Admin, Money, Brain). Guided (field mobile, onboarding, portal, checkout). Evidence (reports, proposals, audit). Showcase (marketing, cinematic product stages, not a card grid). Shared tokens and primitives sit under all four.
- [ ] Pages fill patterns. They do not rebuild geometry. AppShell, LocationBar, ViewBar, ListPage, BoardPage, RecordWorkspace, SplitInspector, ScheduleTimeline, GuidedFlow, PortalFlow, ShowcasePage. Product pages occupy slots.
- [ ] One component system. The kit is shadcn. No app-local buttons, dialogs, forms, tables, menus, sidebars, themes, shadows, spacing, radii, icons, or motion systems. The kit is shadcn/ui (opens in a new tab). Copy the source in. Dress it. Search the registry before creating anything. Credit(@shadcn ) .
- [ ] One contextual ladder. Tooltip → Information Popover → Entity Peek → Split Inspector → Full Record. Compact panels never hold long forms or high-risk actions. Essential information remains reachable without hover.
- [ ] A page is a place. A modal is a transaction. Linear is not anti-modal. It is anti-ambiguous surface. A job, customer, invoice, estimate, or search is a route. Collect payment, assign a tech, add a note: a modal. Status and date: a popover. Invoice math and job properties: an inspector in the layout. Hold Space to peek. A desktop drawer is an escape hatch. Refuse it. On a phone, a bottom sheet may hold the inspector or one secondary action. ⌘K goes or does. Search as a route finds and compares. Never a transient surface for a durable workflow. Never a durable page for a momentary transaction. Thorbis × Linear pattern matrix. D-013. D-014 .

### Places
Source: https://design.thorbis.com/research/topics/places

- [ ] Why we like Linear’s model. Every surface earns its role. They do not park leftover UI in a convenient drawer because a page felt expensive. Search is a view so you can filter and compare. Create is a modal so you can finish and still see the board. Properties sit in a panel that is part of the layout. Peek inspects without navigating. Command is an action system, not a tiny search page. Their March 2026 refresh said it plainly: surface what is needed when it is needed, and keep the central task in focus. How we redesigned the Linear UI (opens in a new tab) .
- [ ] A page is a place. A durable destination. Back and forward work. The URL is shareable. Tabs, filters, sections, or modes are allowed. You can compare, investigate, and open related work. Job, customer, invoice, estimate, equipment, report, search. If it needs more than a brief interaction, it is a route.
- [ ] A modal is a transaction. One clear task. Save, Create, Confirm, or Cancel. You can still see the page behind it. You finish quickly. No navigation deeper than one level. Collect a payment. Assign a tech. Add a note. Invite. Confirm a void. Linear moved issue create off a page and into a modal for speed and context. They still let a long create go fullscreen. We do the same.
- [ ] A popover is a choice. One value or one contextual action. A small amount of temporary information. No substantial typing. No navigation. Status, priority, technician, date, tags, payment method.
- [ ] An inspector is context. Supporting information that should remain visible beside the primary work. It participates in the layout. It does not float over it. Job properties, invoice math, the customer while you schedule, activity history. Linear’s issue properties panel is the model. Ours is first-class because a shop is form-heavier than an issue tracker.
- [ ] Peek is inspection. Temporarily look at a record without navigating into it. Hold Space on a job. Split view for search results and inbox so you can walk the collection and keep your place. If the record is the day’s work, open it as a place.
- [ ] Command goes. Search finds. ⌘K is strongest when you roughly know what you want: one result, one action, then leave. The query is temporary. Search as a route is strongest when you do not know the title, you are crossing object types, you need filters and sort, you want to move through several results, or search itself becomes a workspace. Linear has treated search as a view since 2019. They did not replace quick search with the page. / may still filter this view. Different kinds of finding deserve different tools.
- [ ] Why a desktop drawer fails. It is not quite a page: no durable URL, no honest Back. It is not quite a modal: people keep clicking the thing behind it. It covers the content they were comparing. It becomes a nest of tabs and nested drawers. Escape is a guess. Linear forces a stronger decision. If the content needs navigation, history, or several next actions, it is a page. If it is secondary metadata, it is a panel in the layout.
- [ ] Where Thorbis is a tiny bit different. We are more form-heavy. Payments, customers, equipment, scheduling. A dispatcher often changes one record while reading another. So the inspector is resizable and stays. On a phone, a bottom sheet may hold that inspector or one secondary action — the van has different hands and gestures. We still refuse a desktop drawer used as a job page. We still let a long create expand from a modal into a place. The principle we copied is not “avoid modals and sheets.” It is: never a transient surface for a durable workflow, and never a durable page for a momentary transaction.

### Commands
Source: https://design.thorbis.com/research/topics/commands

- [ ] Skills are referenced, not installed from a registry. Thorbis skills are ten SKILL.md files on this site. Each is its own document. They are not on skills.sh (opens in a new tab). npx skills add will not resolve them. Name the skill to an agent, or download the file into .agents/skills/<name>.md. The names: product, ui, linear, native, cinematic, motion, color, type, composition, tracking. The bundle is SKILLS.md .
- [ ] Command Center is global. Opens with ⌘ K / Ctrl K. Recent, favorite, contextual, and suggested commands are useful before typing. Groups: Go to, Views, Records, Create, Actions, Recent, Help.
- [ ] One Command Registry. The same definition powers the Command Center, buttons, dropdowns, context menus, shortcut help, mobile action launcher, and tests. An action may appear in several surfaces; it exists once.
- [ ] A visible path is required. No critical action is shortcut-only, right-click-only, hover-only, or long-press-only. Keyboard, pointer, and touch all complete the job.
- [ ] Global baseline keys. ⌘/Ctrl K Command Center. / search. ⌘/Ctrl F find in view. ? shortcut help. Escape closes the top layer.
- [ ] Dense surface keys. Arrows or J / K move focus. X toggles selection. Enter opens. Space peeks. Nothing fires while the user is typing.
- [ ] Explainable math. A metric popover consumes a canonical calculation: meaning, formula, units, source, as-of timestamp, and confidence. The UI explains authoritative math; it does not recalculate it in a page-local component.

### Field
Source: https://design.thorbis.com/research/topics/field

- [ ] Operators over admins. Same law as Build for the operator. Throughput beats decoration. A quarterly report does not win the working day.
- [ ] Real data, not demos. Specimens use actual field names, status values, and API names. We don’t mock workflows that don’t exist in production. Gold-standard screens are customers, jobs, estimates, invoices, and the schedule.
- [ ] Interruption is the default. Guided and field surfaces optimize for imperfect attention: one clear job, comfortable targets, explicit progress, resilient recovery. A tech can lock the phone mid-step and return.
- [ ] Offline is a state, not an error. The field app is offline-first. Signatures, photos, and materials capture locally and sync on reconnect. The UI says what is pending, not that the user failed.
- [ ] Money is sacred. Invoices, payments, payroll, and Safe to Spend are exact. Tabular numbers, consistent decimals, explainable formulas, and a confirmation on anything that moves cash.
- [ ] Names from the trade. Job, stop, tech, truck, estimate, invoice, dispatch, not ticket, card, assignee, or deployment. Introduce as few unique terms as possible, and keep them stable.
- [ ] Two taps in the working day. The test for any primary field or dispatch action: can it be completed in two taps during a morning rush? If not, the pattern is wrong.

### Writing
Source: https://design.thorbis.com/research/topics/writing

- [ ] Active voice. Instead of “The invoice will be sent,” say “Send the invoice.”
- [ ] Sentence case in the product. Headings and buttons in the workbench use sentence case. Marketing pages may use Title Case. Store copy in natural case; control presentation with CSS.
- [ ] Be clear & concise. Use as few words as possible. Prefer & over and in compact UI.
- [ ] Action-oriented language. Instead of “You will need to add a technician,” say “Add a technician.”
- [ ] Write in second person. Avoid first person. The product talks to the operator, not about itself.
- [ ] Use numerals for counts. Instead of “eight open jobs” say “8 open jobs.”
- [ ] Consistent currency formatting. Same decimals in one view, 0 or 2, never mixed. Numbers use tabular lining. Separate a number from its unit with a non-breaking space.
- [ ] Default to positive language. Frame messages in a problem-solving way, even for errors. Instead of “Your payment failed,” say “We couldn’t run the card, try again or use a different method.”
- [ ] Error messages guide the exit. Don’t just state what went wrong, tell the user how to fix it. The copy and the button should educate and give a clear action.
- [ ] Avoid ambiguity. Instead of the button label “Continue” say “Save invoice” or “Dispatch job.”
- [ ] No marketing in the workbench. Avoid filler, vague praise, and internal implementation language inside operational workflows. Tickets and empty states are for scanning, not reading.

### Color
Source: https://design.thorbis.com/research/topics/color

- [ ] Cream on the dark greys. Canvas is near-black, canvas oklch(14.5% 0 none). Panels are panel oklch(20.5% 0 none). Type is an off-white with a little cream, type oklch(96.8% 0.009 84.6). Body is body oklch(94.1% 0.013 255.5). The grey is cool, like a work shirt, not a pure chip. Not stone. Not olive walls.
- [ ] Electric blue is the brand. accent oklch(55.8% 0.188 264.4) is Thorbis. Identity, focus, the one accent. It can mark a selected row or a focus ring. It is not every heading. It is not a wash on a quiet panel. Greys still carry the interface.
- [ ] Olive and forest are extras. Soft warm olive olive oklch(47.9% 0.05 115.3) and forest forest oklch(38% 0.052 147.2) are sitting in the kit because I like them. A quiet badge, a bit of fun. They are not success. They are not “on-site.” Do not build a status system out of them. They do belong on a 16px place mark. Quiet. After the word, not before.
- [ ] Pumpkin and burnt are extras too. Burnt pumpkin pumpkin oklch(59.4% 0.152 47.5) and burnt red burnt oklch(49.6% 0.143 34) are the same idea. Subtle, or just fun. The sponsor heart can be burnt. A warning does not have to be pumpkin. Do not invent a second brand with them.
- [ ] Perceptual tokens. Author color in OKLCH. Lightness is the first lever for contrast. Chroma and hue stay stable across a ramp. Ship the token as oklch(), not hex. On a swatch, the fill is the color. The type is off-white or off-black, whichever reads. One hue, many lightnesses.
- [ ] Greys work. Color is a guest. Most of the product is dark grey and a little cream. Brand blue is the guest that matters. Status is locked: success is shadcn green success oklch(62.7% 0.17 149.2), error is shadcn red error oklch(62.6% 0.193 23), info is shadcn blue info oklch(62.3% 0.188 259.8), warning is Shopify amber warning oklch(82.7% 0.171 80.5). Loading is cream busy oklch(96.8% 0.009 84.6) and it pulses. Olive is not success. Burnt is not error. They mark a copy, a keep, a failed save. They do not paint the board.
- [ ] System first. Light if we can’t tell. Default is System. If the OS will not say, we fall back to Light. Dark is always a choice, so is Light, so is System. All three stay visible. Do not mechanically invert a palette. Retune chroma and recheck every pair. One hatch on the root. No flash of the wrong morning.
- [ ] Theme generation is semantic. Reduce theme inputs to base, accent, and contrast. Derive surfaces, text, and controls. Electric blue is an input, not the color of the chrome.
- [ ] One brand, not six meanings. Electric blue is the brand. If it is also every heading, it stops being the brand. Give the second use a grey.
- [ ] Lightness, chroma, hue. We work in OKLCH. Lightness is whether you can read it. Chroma is how loud. Hue is which color. Fix a failing pair on lightness. Saturating it is a costume. Cream sits around hue 85. Accent around 264. Canvas has no hue. Full law: color theory .
- [ ] Warm cream on a cool void. Type is warm. The void is achromatic. Body grey is cool. Accent is cool blue and points. Do not warm the canvas to match the cream. Do not cool the type to match the blue. Light is a retune of lightness, not an invert.
- [ ] Quieter than 60 / 30 / 10. Canvas is the field. The sheet is the work. Accent is a pointer, not ten percent of the screen. A wash, a blue rail, a rainbow of node types: fail. Status hues are reserved words, not a triad. Showcase uses the same palette. No teal-and-orange grade.
- [ ] Chrome likes soft color. Place marks, menu icons, command glyphs may carry olive olive oklch(47.9% 0.05 115.3), forest forest oklch(38% 0.052 147.2), pumpkin pumpkin oklch(59.4% 0.152 47.5), burnt burnt oklch(49.6% 0.143 34), or accent mixed with marker until it sits with those. Phosphor Regular, 16px at rest. Fill when this is the place. The word stays cream or body. Only the mark is tinted. Selected fills the mark and lifts the word, not a blue wash. Directional marks (back, next, send) flip in RTL. Nudge a play triangle or a chevron in a circle when geometry lies. D-020. Do not grey every icon to look serious. Do not candy them. You notice the hue after you read the word. If the icon shouts first, drop chroma.
- [ ] Outline at rest. Fill when this is the place. Still icons stay Phosphor. Regular is the default. Fill marks the current place on a dock, a tab, a rail. Do not fill every glyph to make them “bold.” Morphicons only when the mark itself is the state (idle → loader → check). One SVG, currentColor, states from CSS. D-020 .
- [ ] Prefer a preference. When the work varies person to person, let them change it. Theme, density, this list, saved views, default place, pinned places. Persist it. The default must still be complete. They may not rewrite the inverted L, the tokens, or the words. No hex picker. No display options on Arrive. A shared invoice does not wear their Light theme as the document. D-015 .
- [ ] Prefer a mark. Buttons do not wear a label unless the action would be guessed wrong without it. Search, theme, command, close, back, overflow: a 16px Phosphor mark in a circle. A commit keeps a word when it is destructive, when two commits sit together, when the mark is not a household verb, or when it is the one action on a Guided view. Save invoice. Cancel job. A value chip stays a word. Every icon-only control has an accessible name, and a title on a mouse. Mystery meat is a defect. D-016 .

### Picture
Source: https://design.thorbis.com/research/topics/picture

- [ ] One focus. The sheet is figure. Chrome is ground. Size, then position, then weight. Color last. If two things shout, neither is read. A board is not a poster. A reel is not a board.
- [ ] The inverted L is the composition. Sidebar, location, view, sheet. Do not break it with a second header, a hero, or a card grid. Tight inside a group. Generous between groups. F-pattern on a list. Street first. How a screen is composed .
- [ ] Video uses the rule of thirds. Showcase and product film only. One object, named. Subject on an intersection. Horizon on a third. Lead room in the direction of the face or the move. A little headroom. Match the line across a cut so the object does not jump. Caption in the empty third, never larger than the product. Center is legal when the object is the poster — name it. 16:9 and 9:16. Safe area is the middle 80%. A dispatch board does not get a thirds overlay. Frame .
- [ ] One idea per scene. Showcase discloses one level at a time. A viewport has one idea, one subject, one headline. Isolation is the hierarchy: scale, space, contrast, position, type, photography. Not six benefits in a card grid. Intent sets the mode. Homepage is a router of storefront windows. A family page explores. A product page is a film. Pricing is a store: dense, money, start. A workbench is none of these. D-022. Chapters .
- [ ] Desire, then proof, then price. Reveal in order: what it is, why it matters, how it looks and feels, how it performs in the shop, evidence, configuration and start. Do not dump the spec in the hero. Do not hide the commercial model behind a film. Apple can lean on recognition. A contractor evaluating software cannot. Emotion first. Proof second. Purchase last, and findable.
- [ ] Scroll is a timeline. The visitor owns it. On a Film page, a sequence may move with the wheel, pause, and reverse. The browser still owns the scroll. Do not pin the page and fake a reel. Motion must explain a join, a before/after, a config, a dimension. One subject. One or two properties. Headings that drift and cards that float are costume. Reduced-motion stills of the same crop always exist. The film is never the only explanation.
- [ ] Establish, then crop. The whole object first. Extreme crop second. A camera, an edge, a material landscape is new only after they have seen the board, the phone, or the truck. Recompose on a phone; do not shrink the desktop hero. Copy is HTML in a third, not painted into the picture. The product supplies color in the shot. The chrome stays grey.
- [ ] Mostly product. Some proof. A little cinema. About 60–70% calm product, 20–30% evidence, 10–15% cinema. One or two sequences on a homepage. Breadth is a structured grid, not another film. Every cinematic beat shows how Thorbis connects, simplifies, or accelerates the shop. Do not add movement so the site resembles Apple.

### Typography
Source: https://design.thorbis.com/research/topics/typography

- [ ] Inter Variable for UI. Body and interface: Inter Variable, Rasmus Andersson(@rsms ). Designed for computer screens, not print. Headings may use Inter’s display/optical-size axis. Mono is Geist, from the Vercel design team. Paco Coursey(@pacocoursey ), reserved for IDs, commands, code, and timestamps.
- [ ] Weight and color do more than size. Use the Type scale : at 14px, a value may use 500 and a sentence uses 400. Color roles separate the rest: fg for emphasis, body for reading, marker for short metadata. Do not dim a sentence into metadata. If you squint and cannot tell the roles apart, the hierarchy is too weak.
- [ ] A small named scale. Deviate from it as little as possible. Equivalent peers share size, weight, line-height, and numeric treatment. Thin weights are display-only, never below 18px.
- [ ] Line-height by role. Follow the Type scale’s line heights : a page title uses 1.25 and reading text uses 1.5. Use unitless values. If a heading needs three or more lines, shorten it or use a reading role with at least 1.4 line height; do not squeeze the lines to fit.
- [ ] Cap the measure. Long-form text follows the Type measure, 65–75ch. Operational tables, boards, and schedules may use the full work surface.
- [ ] Centered type is ceremony. A hero, a symmetrical product, a universal claim may sit center. Specs, comparisons, chapters, and proof sit start. Do not center a paragraph of performance numbers. Do not center body on a workbench.
- [ ] Font smoothing on the root. Apply antialiased once so macOS does not render type heavier than intended.
- [ ] Wrap with intent. text-wrap: balance on headings, pretty on descriptions. Skip both on long-form. Use an en dash for ranges (2010–2020) and a non-breaking space so 10 MB never splits.

### Tracking
Source: https://design.thorbis.com/research/topics/tracking

- [ ] North Star first. This document, the Design Constitution, and PROJECT_PROFILE.md are the constitution. Linear structure is derived from them 1:1, do not invent milestones that are not in the plan.
- [ ] Detect before setup. If a Linear project already exists, enumerate it and ask before writing. Never bootstrap over a live workflow. Default to extending what is there.
- [ ] Every issue has a milestone. An issue with no milestone is mis-filed. Name milestones as outcomes (“Launch readiness”), not activities (“Do launch stuff”).
- [ ] Search before create. Always. A duplicate issue is the fastest way to lose trust in the board.
- [ ] Tickets are for scanning. Titles: plain words, ≤8 words. Descriptions: ≤3 sentences or ≤5 bullets. Comments: ≤3 lines. No marketing voice.
- [ ] Lifecycle discipline. Backlog → In Progress the moment work starts → Done only once shipped and verified. Never skip to Done. Never leave active work in Backlog. Close the loop before the session ends.
- [ ] Dates need a signal. A milestone with a made-up date is worse than one with none. Fake precision breeds alarm fatigue.

### Agents
Source: https://design.thorbis.com/research/topics/agents

- [ ] Record the brief. For every substantial UI task: user and job, surface profile, named pattern, primary object and action, states and viewports, registry candidates, reuse/configure/extend decision, accessibility and performance risks, verification plan.
- [ ] Search the registry first. If a primitive, component, or pattern already exists, use it. A hand-rolled button beside the canonical Button is a defect.
- [ ] No raw values. Product code does not introduce raw colors, arbitrary typography, radii, shadows, z-indexes, or motion values. Tokens own those decisions.
- [ ] Completion is not a screenshot. A change is done when ownership is correct, states are realistic, keyboard and focus work, light/dark/system hold, contrast passes, reduced motion is honored, the specimen renders, and Linear has evidence.
- [ ] When requirements compete. Protect them in this order: correct meaning → accessibility and safety → existing architecture → the user’s primary job → token consistency → responsive quality → performance → polish.

### Modules
Source: https://design.thorbis.com/research/topics/modules

- [ ] Depth is leverage at the interface. A module is deep when callers exercise a lot of behavior per fact they have to learn. It is shallow when the interface is nearly as complex as the body. Reduce methods, simplify parameters, hide more inside.
- [ ] Apply the deletion test. Imagine deleting the module. If complexity vanishes, it was a pass-through. If the same complexity reappears across N callers, it was earning its keep.
- [ ] The interface is the test surface. Callers and tests cross the same seam. Tests assert observable outcomes, not internal state. If a test has to change when the implementation changes, it is testing past the interface.
- [ ] One adapter is hypothetical. Two make a seam. Do not introduce a port unless at least two adapters are justified, typically production and a test stand-in. A single-adapter seam is just indirection.
- [ ] Keep internal seams internal. A deep module may be composed of small, swappable parts used by its own tests. Do not expose those parts through the external interface just because tests touch them.
- [ ] Accept dependencies. Don’t construct them. Inject the payment adapter, the SMS port, the clock. Construction belongs at the composition root. A module that news up Stripe inside submit cannot be tested through its interface.
- [ ] Replace tests. Don’t layer them. When shallow modules merge, delete the old unit tests. Write new ones at the deepened interface. Tests that survive only by knowing the old shape are waste.
- [ ] Use the vocabulary on purpose. Say module, interface, seam, adapter, depth, leverage, locality. Do not substitute component, service, API, or boundary, those words already mean other things here.

### Do and don’t
Source: https://design.thorbis.com/research/topics/craft

- [ ] Do less, but better. Dieter Rams: good design is useful, honest, thorough, unobtrusive, and as little design as possible. Don’t decorate a weak job. If removing the element does not remove meaning, remove the element.
- [ ] Do be honest about capability. Rams again: a product should not appear more innovative, powerful, or valuable than it is. Don’t fake certainty, inflate a metric, or skin a spinner as a completed action.
- [ ] Do pay design debt in sweeps. Karri Saarinen(@karrisaarinen ) : software evolves weekly, and the chrome unbalances. Don’t redesign one view at a time and leave the product disjointed. A reset is how the whole surface stays one product. A design reset (opens in a new tab) .
- [ ] Do let chrome recede. Same law as Work dominates chrome. Saarinen, Yann-Edern Gillet, Andreas Eldh: content holds the strongest contrast. Don’t paint the navigation in brand blue.
- [ ] Do align until it disappears. Gillet: spend the time lining up labels, icons, and buttons on the tiny surface of a sidebar. Users will not name it. They will feel it. Don’t “fix” misalignment with extra padding on one item.
- [ ] Do treat the spec as the floor. Same law as The spec is the baseline. Karri Saarinen(@karrisaarinen ) : it’s easy to meet the spec. Don’t ship the ticket and call it done.
- [ ] Do fix one papercut a week. Same law as Papercuts every week. Tuomas Artman(@artman ) : quality is not an individual sport.
- [ ] Do ship the interface. Same law as No handoff. Ryo Lu(@ryolu_ ) : designers write the product.
- [ ] Do obsess over the last ten percent. Rauno Freiberg(@raunofreiberg ) : interaction quality is the product. Focus restoration, the first frame of a press, the caret after submit. Don’t ship the first layout that fits and call it done. Design Engineering at Vercel (opens in a new tab) .
- [ ] Do reuse the metaphor the operator already has. Rauno: a sheet is a layer, a peek is a card, pinch is precision. Don’t invent a third swipe because this view is special. Invisible Details of Interaction Design (opens in a new tab) .
- [ ] Don’t fidget the workbench. Fidgetability is a happy accident on an AirPods case. A dispatch board used eight hours a day is not a pencil to click. If it is high frequency, it is instant, not playful.
- [ ] Do prefer the platform. Paco Coursey(@pacocoursey ) : a native dialog, a real link, a real checkbox. Don’t reimplement the browser for aesthetic control, cmdk, next-themes, and the craft around them all start from this.
- [ ] Do animate only to explain. Emil Kowalski(@emilkowalski ) : you don’t need animations. Keyboard-driven and high-frequency actions are instant. Don’t animate a row highlight, a keystroke, or ⌘K. You Don’t Need Animations (opens in a new tab) .
- [ ] Do own the component source. shadcn(@shadcn ) : copy the primitive in, normalize it once, then reuse the owner. Tokens are the authority, not the library. Don’t theme an opaque package into the brand and hope the states survive.
- [ ] Do defer to content. Jony Ive and the Apple HIG (opens in a new tab) : controls are guests. Clarity, deference, depth. Don’t compete with the user’s work. Don’t invent a gesture the platform already owns.
- [ ] Do make the conceptual model visible. Don Norman: affordance, feedback, mapping, constraints. The user should not need a tour to know what will happen. Don’t hide system state and expect them to guess. The Design of Everyday Things (opens in a new tab) .
- [ ] Do maximize data-ink. Edward Tufte: above all else show the data. Prefer position and length on a common scale. Don’t 3D a bar, don’t chartjunk, don’t encode a quantity as a rainbow. The Visual Display of Quantitative Information (opens in a new tab) .
- [ ] Do align to a grid. Josef Müller-Brockmann: a systematic grid is freedom, not constraint. Equivalent peers share an edge. Don’t place by eye and call it organic.
- [ ] Do use few typefaces. Massimo Vignelli: intellectual elegance. A disciplined scale beats a font collection. Don’t add a display face because the headline felt boring. Change the words or the weight.
- [ ] Do treat the web as typography first. Oliver Reichenstein, Information Architects: web design is 95% typography. Size, measure, leading, wrapping. Don’t start with color and cards. Web Design is 95% Typography (opens in a new tab) .
- [ ] Do set a readable measure. Matthew Butterick: a decent size, a finite line, a line-height that can be read. Don’t set 12px gray body on an infinite column and call it quiet. Practical Typography (opens in a new tab) .
- [ ] Do pick one typographic voice. Erik Spiekermann: type is a voice. Keep it consistent. Don’t shout with weight, whisper with size, then shout again two sections later.
- [ ] Do keep system status visible. Jakob Nielsen: visibility of system status, user control, error prevention, recognition over recall. Don’t leave a dispatcher wondering whether the invoice saved. 10 Usability Heuristics (opens in a new tab) .
- [ ] Do design the device you have. Rauno Freiberg(@raunofreiberg ) : mobile-first as a religion thins desktop workbenches. Luke Wroblewski is right that a phone is not a shrunken laptop, and the inverse is also true. The workbench is desktop-first. The van is mobile-native. Don’t pour either into the other.
- [ ] Do raise contrast between levels. Steve Schoger(@steveschoger ) : hierarchy is contrast between levels, not just text against the canvas. Align, then space, then color. Don’t fix a flat page by turning the accent up.
- [ ] Do compose from a scale. Adam Wathan(@adamwathan ) : encode the spacing and type scale, then compose. Don’t invent 13px of padding because 12 felt close.
- [ ] Do think in systems, not pages. Brad Frost: shared language, atomic pieces, a pattern that can travel. Don’t one-off a button because this screen is “special.” Atomic Design (opens in a new tab) .
- [ ] Do put decisions in tokens. Dan Mall, Jina Anne, Kaelig Deloumeau-Prigent(@kaelig ) : pages consume names, not hex. Don’t hardcode a color in a feature component and call it a theme.
- [ ] Do design for the person doing the job. Frank Chimero: people ignore design that ignores people. Don’t design the portfolio first. What Screens Want (opens in a new tab) .
- [ ] Do try to be good, not original. Paul Rand. Don’t invent a new mark, a new dialog, or a new table when a clear one exists. Originality that costs the user a relearn is vanity.
- [ ] Do subtract the obvious. John Maeda, Laws of Simplicity: add only the meaningful. Don’t add “just one more” control to a toolbar that already does the job.
- [ ] Do leave emptiness the work can occupy. Kenya Hara: emptiness is not unfinished. Don’t fill every gap because a blank region made you nervous.
- [ ] Do make the next action the obvious one. Naoto Fukasawa: design without thought. The primary action should not need a legend. Don’t require a tooltip to explain a button that saves the invoice.
- [ ] Do treat icons as metaphor. Susan Kare: pixel-honest, recognizable at small size, a metaphor the user already has. Don’t ship a decorative glyph that only makes sense after a tooltip.
- [ ] Do treat taste as a decision record. Julie Zhuo: taste is the history of choices you can defend. Don’t argue from “I like it” without the user job. The Making of a Manager (opens in a new tab) .
- [ ] Do measure whether the job completed. Jared Spool: usability is whether the person finished. Don’t confuse visual polish with a completed dispatch.
- [ ] Do let content size the layout. Jen Simmons: intrinsic layout. Grid and flex before JavaScript measurement. Don’t force every page through a 12-column leftover.
- [ ] Do art-direct pages that have something to say. Andy Clarke: a page with a subject deserves an organizing move of its own. Don’t pour every marketing surface into the same three-card grid.
- [ ] Do design for the operator, not the demo. Contractor workflows over generic dashboards. Don’t design against seed data. A dispatch board that only works with “Acme Inc.” is unfinished.
- [ ] Do put AI where it reduces work. Michael Truell(@mntruell ) and Cursor: a conversation is fine for a simple request. Don’t make chat the only way to edit structured state. Open the workspace the job actually needs.
- [ ] Do optimize for progress, not attention. OpenAI on ChatGPT: help the person take the next useful step. Don’t maximize time-on-surface inside an operational product. Optimizing ChatGPT (opens in a new tab) .
- [ ] Do hide complexity behind a small interface. John Ousterhout(@JohnOusterhout ) : depth is leverage. Don’t expose every knob because you built them. A Philosophy of Software Design (opens in a new tab) .
- [ ] Do lift with a short shadow, not a border. Same law as No borders on the page and Short shadows. A commit still needs a well or a lift .

### Built on
Source: https://design.thorbis.com/research/topics/built-on

- [ ] Linear. The product grammar and the source of truth for project work. Inverted-L chrome, command palette, density, and the Method. linear.app (opens in a new tab) · Method (opens in a new tab) ·(@linear )
- [ ] TanStack. The application is TanStack Start. File routes, type-safe search, Query for server state, Table for ledgers. We do not invent a second data or routing layer. tanstack.com (opens in a new tab) · Start (opens in a new tab) · Router (opens in a new tab) · Query (opens in a new tab) · Table (opens in a new tab) ·(@tan_stack )
- [ ] Cloudflare. How we ship. Workers, Pages, DNS, and the edge, not Vercel. cloudflare.com (opens in a new tab) · Docs (opens in a new tab) ·(@Cloudflare )
- [ ] React. The UI runtime. React 19. ref is a prop, use() is context. Compound components, not boolean flags. react.dev (opens in a new tab) ·(@reactjs )
- [ ] shadcn/ui. The component kit. We copy the source in: Button, Badge, Card, Input, and the rest. Then we dress it. Pills, not squares. No panel borders. A whisper of depth. The look is ours. The starting point is his. ui.shadcn.com (opens in a new tab) ·(@shadcn )
- [ ] Base UI. Unstyled accessible primitives underneath, when a pattern needs them. Dialogs, menus, tabs. We own the styles. base-ui.com (opens in a new tab) ·(@base_ui )
- [ ] Tailwind CSS. Utility classes over page-local CSS. Tokens live in @theme. Spacing and type come from a scale. tailwindcss.com (opens in a new tab) ·(@tailwindcss )
- [ ] Vite. The bundler and the dev server. TanStack Start sits on Vite. vite.dev (opens in a new tab) ·(@vite_js )
- [ ] Cursor. How we write software with agents. AI appears where it reduces work. Generated UI is audited, not trusted by default. cursor.com (opens in a new tab) ·(@cursor_ai )
- [ ] Motion, cmdk, Sonner, Vaul. Motion for springs and layout when CSS is not enough. motion.dev (opens in a new tab). Command menus are Paco’s cmdk (opens in a new tab). Toasts are Sonner (opens in a new tab). Drawers are Vaul (opens in a new tab) .

### Sources
Source: https://design.thorbis.com/research/topics/sources

- [ ] Linear. How they draw. The base. A design reset (opens in a new tab) · How we redesigned the Linear UI (opens in a new tab) · A Linear spin on Liquid Glass (opens in a new tab) · Karri’s ten rules (opens in a new tab). Karri Saarinen(@karrisaarinen ), Jori Lallo(@jorilallo ), Emil Kowalski(@emilkowalski ). Grammar, not dress.
- [ ] Vercel Web Interface Guidelines. Interaction, animation, form, performance, and design rules follow vercel.com/design/guidelines (opens in a new tab) and the open-source list (opens in a new tab). We studied that document. We do not ship on Vercel, see Cloudflare in Built on. The craft around the guidelines is the Vercel design-engineering bench: Rauno Freiberg(@raunofreiberg ), Paco Coursey(@pacocoursey ), shadcn(@shadcn ), and Emil Kowalski(@emilkowalski ) .
- [ ] Emil Kowalski. Mobile-native. The Mobile section is Emil’s checklist, posted 11 August 2026 (opens in a new tab). Motion rules follow the same author: emilkowal.ski (opens in a new tab), animations.dev (opens in a new tab), the animation skills (opens in a new tab) (/find-animation-opportunities, /animate, /review), Sonner, and Vaul. Emil Kowalski(@emilkowalski ). Formerly Vercel design; now Linear.
- [ ] Apple Human Interface Guidelines. Tab bars, navigation stacks, sheets, Dynamic Type, haptics, safe areas. We study the HIG (opens in a new tab). We do not ship Apple trade dress, and we do not pour Liquid Glass onto the job sheet. System chrome on iOS may use the platform material. Ours does not.
- [ ] Material 3. Navigation bars, predictive back, 48dp targets, edge to edge, rails on tablet. m3.material.io (opens in a new tab). We do not adopt Material You wallpaper color. Electric blue is Thorbis, not the tech’s lock screen.
- [ ] Fluent 2, and the Mac. Windows caption buttons, snap, density. macOS traffic lights, menu bar, and window chrome. Fluent 2 (opens in a new tab) · macOS HIG (opens in a new tab). Desktop follows the host. We do not paint one OS onto the other.
- [ ] Jakub Krehel. Interfaces. Small details that compound: wrapping, concentric radii, crispy type, tabular numbers, interruptible motion, stagger on enter, a quieter exit, optical alignment, shadows instead of boxes, a 10% outline on images. Public essay Details that make interfaces feel better (opens in a new tab). Magazine interfaces.dev (opens in a new tab). Jakub Krehel(@jakubkrehel ). The skill is jakubkrehel/make-interfaces-feel-better (opens in a new tab). We studied it. We did not copy the magazine.
- [ ] UI Skills playbook. A public list of craft: aspect-ratio, peek the next item, fade a scroller, concentric radii, tabular nums, 44px targets, outline then fill, overlay as a mix, menus that fade. We took what we did not already have. We did not take springs on a workbench, blur on a label, or ease-in on an exit. Playbook ui-skills.com/playbook (opens in a new tab). Skills we already studied: Jakub Krehel(@jakubkrehel ), Emil Kowalski(@emilkowalski ) .
- [ ] Apple.com. Sequencing. Observed 22 August 2026: homepage, Store, iPhone 17 Pro, MacBook Pro, Apple typography, motion, and reduced-motion guidance. The lesson is not sparse hardware pages. It is four modes (router, explore, film, store), one idea per scene, controlled disclosure, scroll as a timeline the visitor owns, establish then crop, motion optional. We take the sequence. We do not take SF Pro, a sterile catalog, or cinema on a board. apple.com (opens in a new tab) · Typography (opens in a new tab) · Motion (opens in a new tab) · Accessibility (opens in a new tab). Skill: Chapters .
- [ ] Linear product grammar. Shell, density, keyboard, and peek behavior follow Linear’s publicly documented redesign. How we redesigned the Linear UI (opens in a new tab) and Behind the latest design refresh (opens in a new tab). Karri Saarinen(@karrisaarinen ), Jori Lallo(@jorilallo ), Tuomas Artman(@artman ). Company:(@linear ) .
- [ ] The Linear Method. Quality as north star, spec as baseline, no handoff, small teams, opinionated design, reduce scope, data as a crutch. Karri Saarinen(@karrisaarinen ), linear.app/method (opens in a new tab), 10 rules (opens in a new tab), Why is quality so rare? (opens in a new tab). Papercut culture and the seven-day bug clock. Tuomas Artman(@artman ), Quality Wednesdays (opens in a new tab), zero-bugs policy (opens in a new tab) .
- [ ] Mike Markkula, 1977. Empathy, focus, impute. The Apple Marketing Philosophy, January 3, 1977. We adopted the three words, not Apple trade dress. Artifact: stevejobsarchive.com (opens in a new tab) .
- [ ] Cinematic Showcase. Marketing only. Apple product pages, object larger than type, studio void, scroll chapters, “Watch the film.” Framer, the canvas is the demo. Linear’s homepage, the real app in a dark void. We combine them: the Linear sheet is the cinematic object. Apple (opens in a new tab) · Framer (opens in a new tab)(@framer ) · linear.app (opens in a new tab). Skill: thorbis-cinematic .
- [ ] Dark greys. Our status colors. Neutrals are Linear’s dark greys and black, a cool mix, not a flat chip. Type is cream. Electric blue is the brand. Status is shadcn’s green, red, and info. Warning is Shopify’s amber. Olive, forest, pumpkin, burnt sit in the kit because I like Tacoma paint. They are extras.
- [ ] Shopify, for depth only. Short shadows, button bevels, pill chips. We studied Polaris elevation, we do not ship on Shopify. Shadow tokens (opens in a new tab) .
- [ ] Cursor. AI appears where it reduces work. Agents obey the same constitution as humans. Generated UI is audited, not trusted by default. Designers ship, they do not hand mocks over a wall. Ryo Lu(@ryolu_ ), Michael Truell(@mntruell ), Aman Sanger(@amanrsanger ). Product:(@cursor_ai ) .
- [ ] Rauno Freiberg. Interaction. Immediate response, interruptible overlays, metaphors over invented gestures, destructive swipes commit on release, motion names the source, context as input, Fitts’s edges, scroll stays on the pane, what’s under the finger, frequency & novelty (⌘K never animates). Essay: Invisible Details of Interaction Design (opens in a new tab) · Devouring Details (opens in a new tab). Rauno Freiberg(@raunofreiberg ), Vercel; previously Arc / The Browser Company. Acknowledgments in the essay: Paco, Emil.
- [ ] Paco Coursey. Craft. Prefer the platform. Command menus via cmdk (opens in a new tab). Sidebar reveal without reflow. paco.me/craft (opens in a new tab). Paco Coursey(@pacocoursey ), Linear webmaster; formerly Vercel design system.
- [ ] Rasmus Andersson. Inter. Inter is a typeface crafted for computer screens. We use the variable file and the optical-size axis, not a static cut. Rasmus Andersson(@rsms ), rsms.me/inter (opens in a new tab) .
- [ ] Thorbis Design Constitution. Electric blue, surface profiles, command law, and field-specific rules are owned by the Thorbis v2 Design System project and the Precision Workbench SDK.
- [ ] Vercel composition patterns. Compound components, lifted providers, and the state / actions / meta context contract follow Vercel’s React composition guidance. The kit we actually ship is shadcn(@shadcn ), dressed in our tokens. Base UI(@base_ui ) when a primitive is missing.
- [ ] Deep modules. Interface-as-test-surface, seam discipline, and the deletion test keep agent-authored code local. Depth is leverage, not line count. John Ousterhout(@JohnOusterhout ), A Philosophy of Software Design (opens in a new tab) .
- [ ] APCA contrast. Perceptual contrast thresholds come from Andrew Somers / Myndex(@MyndexResearch ) and apcacontrast.com (opens in a new tab). We prefer APCA over WCAG 2 for body text on the dark canvas.
- [ ] Dieter Rams. Less but better, honesty, and as little design as possible. The ten principles remain the shortest design constitution we know.
- [ ] Don Norman. Affordances, feedback, mapping, and a visible conceptual model. The Design of Everyday Things (opens in a new tab) .
- [ ] Edward Tufte. Data-ink, chartjunk, and common-scale comparison. The Visual Display of Quantitative Information (opens in a new tab) .
- [ ] Typography bench. Oliver Reichenstein / iA, Matthew Butterick’s Practical Typography (opens in a new tab), Erik Spiekermann, Massimo Vignelli, and Josef Müller-Brockmann’s grid.
- [ ] Jakob Nielsen. The 10 usability heuristics (opens in a new tab) and the larger NN/g research bench.
- [ ] Apple Human Interface Guidelines. Clarity, deference, depth, and reduced motion. Jony Ive’s product grammar, not Apple trade dress. HIG (opens in a new tab) .
- [ ] Systems writers. Brad Frost’s Atomic Design (opens in a new tab), Dan Mall and Jina Anne on tokens, Steve Schoger(@steveschoger ) and Adam Wathan(@adamwathan ) on refinement, Luke Wroblewski on mobile first, Jen Simmons on intrinsic layout.
- [ ] Craft and taste. Paul Rand, John Maeda, Kenya Hara, Naoto Fukasawa, Susan Kare, Frank Chimero, Julie Zhuo, Jared Spool, Andy Clarke. Named in Do and don’t so the debt stays visible.
- [ ] byronwade/Design. The Precision Workbench constitution, Linear reference matrix, and agent protocol live in the public Design SDK and are adopted verbatim by Thorbis-TanStack.

## Skills


### Product
Source: https://design.thorbis.com/skills/product

- [ ] The product feel. Quiet chrome. Precise work. Easy to look at. Easy to understand.
- [ ] When a new occupant is allowed, and when you must stop and name a gap.
- [ ] Who is holding it, and what just interrupted them? Dispatcher at 7 a.m. Tech in a crawlspace. Owner closing the books.
- [ ] Which profile? Workbench, Guided, Evidence, or Showcase. One. Do not mix.
- [ ] What is the one action on this view? Dispatch. Arrive. Save invoice. Add a step. Everything else is quieter.
- [ ] Is this a place, a transaction, or context? Route, modal, popover, inspector, peek, or inline. Not a desktop drawer. D-013. D-014 .
- [ ] Which room already exists? List, Board, Record, Schedule, Inbox, Search, Settings, Guided, Evidence, Canvas. Fill that room. The occupant table is below.
- [ ] What already exists in the kit? Search the registry. D-007. Native control, then the kit, then last a new primitive. D-006 .
- [ ] One grey family. Canvas, chrome, sheet, well. No extra grey you invented.
- [ ] One accent. Electric blue. It points. It does not paint.
- [ ] A fill is one mix. No gradient. No solid colored border on the leading or trailing edge of a row. D-018 .
- [ ] Media holds its hole. A list that continues shows it. D-019 .
- [ ] Outline at rest. Fill when this is the place. D-020 .
- [ ] Type does the hierarchy. 32 / 16 / 14 / 13 / 12. No costume font. No kicker.
- [ ] Regions meet by tone. No 1px line around a room.
- [ ] Depth is a whisper. Rest, sink, lift, overlay. Nothing else.
- [ ] You know where you are from the location bar.
- [ ] You know what the work is from the sheet. Street first. 114 Oak, then the leak.
- [ ] You know the one action without hunting. It is a commit. Ink.
- [ ] Status is a word. Open. En route. On site. Not a green blob.
- [ ] Empty names the one action. No steps yet. Add a step.
- [ ] Errors name the problem and the exit. Not “Oops.”
- [ ] Words are ours. Job, stop, tech, truck. Not ticket, agent, resource.
- [ ] A floating toolbar that hides the location bar
- [ ] A new color language “because this tool is spatial”
- [ ] Brand, focus, the live thing: accent. One blue.
- [ ] Status: success, danger, info, warning. Words first.
- [ ] Olive, forest, pumpkin, burnt: extras. Fun. Not a job. Not a node type system.
- [ ] Light is a retune, not an invert. The same grammar. Color .
- [ ] React Flow, Mapbox, or FullCalendar wearing their factory clothes
- [ ] Neon edges, glow handles, a rainbow of node types
- [ ] A floating HUD that covers the location bar
- [ ] Mini-map chrome that shouts louder than the graph
- [ ] Hex, text-white, or a raw shadow in product code
- [ ] Mixing Workbench density with Showcase theater on one view
- [ ] A hex picker, a theme store, or a Guided flow with display options
- [ ] A default that is broken until they open Settings
- [ ] A gradient, mesh, or fade, unless the brief named that wash
- [ ] A solid colored border on the leading or trailing edge of a row, a node, or a card
- [ ] Person, profile, one action, and surface are named
- [ ] The room is named. The occupant fills the 90% shell
- [ ] No second header, no second sidebar, no extra chrome row
- [ ] Tokens only. One accent. Regions have no borders
- [ ] Nodes / cards / rows use panel, well, type, marker. Selected is accent
- [ ] Trade words. Street first. Status is a word
- [ ] J K, ⌘K, Escape, Space. A visible path for the one action
- [ ] 390px: inspector is a bottom sheet. No squeezed desktop
- [ ] A preference exists where people differ, or you named why not. D-015
- [ ] A dispatcher would believe this was always here
- [ ] The plane is the sheet, sitting on the canvas. Nodes are small sheets.
- [ ] Location names the graph: After-hours leak or Brain .
- [ ] View bar slices: Map / List, or All / Leaks / HVAC .
- [ ] Inspector is the selected node. Properties, not a second canvas.
- [ ] Create is a commit or a C modal. Not a costume stencil well that covers the location bar.
- [ ] List is still legal. A canvas that cannot become a list is a trap for a dispatcher on a phone.
- [ ] Person. Dispatcher, tech, or owner. Device. What interrupted them.
- [ ] Profile. Workbench, Guided, Evidence, or Showcase. One.
- [ ] Surface. Route, modal, popover, inspector, peek, or inline. D-013. Not a desktop drawer. D-014 .
- [ ] Room. List, Board, Record, Schedule, Inbox, Search, Settings, Guided, Evidence, Canvas.
- [ ] Search. Token, primitive, occupant, component. D-007. If CanvasWorkspace exists, fill it.
- [ ] Gap. If nothing fits, name it and stop. D-012. Do not invent a shell so the ticket can close.
- [ ] Join. The new thing occupies the sheet. Chrome stays. Inspector stays available.
- [ ] Dress. Panel, well, type, marker, one accent. Strip any library theme.
- [ ] Words. Ours. Street first. Sentence case. The button is the verb.
- [ ] Keys. ⌘K / J K Enter Space Esc C. Visible path. D-008 .
- [ ] States. Empty, loading, error, disabled, permission, destructive. D-009 .
- [ ] Narrow. 390px. Inspector is a bottom sheet. 44px if it stands alone.
- [ ] Both themes. Light is a retune. The choice persists.
- [ ] Audit. The checklist on Product. Two failures: do not ship.
- [ ] Fill panel. On the plane ( bg ) it lifts by tone, not a drop-shadow stack.
- [ ] Title 14 / 500 fg. Dispatch to on-call. Not Node 4. Not N-1842 .
- [ ] Caption 12 / 500 marker. After 5pm · Mike .
- [ ] Status is a word on the node, same words as the rest of the app.
- [ ] Selected: accent. Focus: accent ring. Hover: slightly brighter panel. Three different things.
- [ ] Nested inputs on the node are wells. They do not appear until the inspector, unless the edit is inline and tiny.
- [ ] Radius 14 on the node. Inner controls: inner = outer − padding. UI .
- [ ] Our tokens on every node, edge, handle, and control
- [ ] Empty: the plane is still the sheet. Centered, not a hero. No steps yet. Commit: Add a step .
- [ ] Loading: the last graph shape, waiting. Not a spinner in a void.
- [ ] Error: Could not save this step. Check the name. Under the field if the field is the problem. A banner if the page is offline.
- [ ] Permission: You cannot edit this workflow. Do not show the hidden nodes.
- [ ] The plane is the sheet. Pan and zoom with fingers.
- [ ] Inspector is a bottom sheet when a node is selected.
- [ ] Add a step is a 44px commit, reachable by the thumb.
- [ ] List view is the default if the graph is unusable at 390px. Map is still offered. Do not ship a squeezed desktop editor.
- [ ] Mini-map larger than a postage stamp, or styled like a game HUD
- [ ] auto layout that fights the dispatcher’s placement without a way to turn it off
- [ ] Light theme that inverts the graph into a different language
- [ ] You need a second header to make the tool make sense
- [ ] You need a desktop drawer because a route felt like too much work

### Resilience
Source: https://design.thorbis.com/skills/resilience

- [ ] Name the intended business outcome and credible customer harm.
- [ ] Map the services, stores, queues, vendors, people, and timing assumptions involved.
- [ ] Trace at least three realistic failure paths:
- [ ] Classify consequence, reversibility, coupling, uncertainty, and blast radius.
- [ ] Define safe degraded behavior and the operator recovery path.
- [ ] Enforce authorization and tenant isolation at every trusted boundary.
- [ ] Make retries idempotent or detect duplicates explicitly.
- [ ] Bound retries and timeouts. Prevent retry storms and infinite hidden work.
- [ ] Expose pending, stale, conflicted, partial, and failed states honestly.
- [ ] Preserve an audit trail for consequential state changes.
- [ ] Put irreversible or high-impact actions behind preview, confirmation, or policy.
- [ ] Make automation observable, interruptible, and recoverable by a person.
- [ ] Scope rollout with flags or migration stages when blast radius warrants it.
- [ ] Do not add more coupling than the defense removes.
- [ ] Every agent has a persistent non-human identity and is visibly marked as an AI agent wherever it invokes, authors, suggests, acts, waits, or appears in evidence.
- [ ] Never give an agent a human identity treatment or present machine work as though it came from a person.
- [ ] Keep the accountable person or role visible when work is delegated. An agent may act; it is not the accountable human.
- [ ] Distinguish suggestion, pending approval, executing, completed, partial, failed, and committed product state.
- [ ] Consequential actions expose scope, external effects, reversibility, approval, audit, interrupt, and recovery paths.
- [ ] duplicate, delayed, and out-of-order delivery;
- [ ] rollback, reconciliation, and manual recovery.
- [ ] Decision: proceed, proceed with conditions, or redesign.
- [ ] System boundary: actors and components included.
- [ ] Failure paths: trigger, contributing conditions, defenses, impact, detection, containment, recovery.
- [ ] Human factors: available information, workload, incentives, overrides, and adaptations.
- [ ] Required changes: ordered by risk reduction.
- [ ] Verification: tests, telemetry, rollout, and rollback evidence.
- [ ] Residual risk: what remains accepted and why.

### Ecosystem
Source: https://design.thorbis.com/skills/ecosystem

- [ ] Customer: identity, name, state, contextual metadata.
- [ ] Property: photo/map, address, property markers.
- [ ] Job: trade/state, customer, location, schedule.
- [ ] Invoice: amount, payment state, customer, due date.
- [ ] Equipment: image, model, age, operational state.
- [ ] Technician: identity, availability, current assignment.
- [ ] no behavioral discontinuity across devices
- [ ] Promotional density inside operational work
- [ ] Fake achievements, points, badges, or streaks
- [ ] Carousels as the default operational collection
- [ ] Blank database views when a useful curated entry point is obvious
- [ ] A separate View button on every navigable object
- [ ] Desktop layouts merely shrunk onto phones
- [ ] First read answers location, priority, action, and state
- [ ] Second-read detail is available without competing with the first read
- [ ] Large collections have useful entry points and a complete explorer
- [ ] Entity silhouettes are stable and recognizable
- [ ] Electric blue is used as signal, not paint
- [ ] Relationships are contextual rather than dumped into global navigation
- [ ] Deep records retain identity, state, action, and local orientation
- [ ] Device-specific UI preserves the same underlying work state
- [ ] Spatial information is directly manipulable when inspection matters
- [ ] Bad/missing user content cannot break the layout
- [ ] Accessibility modes are part of component acceptance

### UI
Source: https://design.thorbis.com/skills/ui

- [ ] Cloudflare forms : form kind, labels, field width, errors beside the field, and commit names.
- [ ] Shopify Polaris : collections, filters, saved views, bulk actions, multi-edit, record structure, and save state.
- [ ] Vercel + Geist : choosing a primitive by role, semantic tokens, empty and loading states.
- [ ] Who is holding the device, and what just interrupted them? Dispatcher at 7 a.m. Tech in a crawlspace. Owner closing the books.
- [ ] Which profile? Workbench, Guided, Evidence, or Showcase. One. Do not mix.
- [ ] What already exists? Native control, then the kit, then last a new primitive. D-004. D-007 .
- [ ] What is the one action on this view? Dispatch. Arrive. Save invoice. Everything else is quieter.
- [ ] Tokens own color, type, space, radius, shadow, motion. No hex in JSX. No text-white. D-003 .
- [ ] Primitives are the kit. Copy shadcn in, dress with tokens. Base UI when a primitive is missing. We own the styles.
- [ ] Components are stable combinations: SearchField, DataTable, EmptyState, CommandMenu.
- [ ] Patterns are List, Record, Settings, Evidence, Guided, Board, Inbox, Search, Canvas.
- [ ] Pages put trade data in a pattern. A durable job is a route. A collect-payment is a modal. Linear baseline owns that call.
- [ ] The sheet is brighter than chrome. They meet by tone. Regions have no borders as separators.
- [ ] A rounded figure that must be found has a 1px rim that follows the radius. Overflow clips content, not the stroke. Never an inset box-shadow as the outer edge of an overflowing box. Canvas-on-canvas without that rim is a defect. D-017 .
- [ ] A field is a well: one step darker than its parent, inset, 1px rim.
- [ ] A commit is ink: type-color fill, inverse type, 10px radius, 1px rim.
- [ ] Same fill as the parent is illegal. If you cannot see the control, change the fill, not the stroke.
- [ ] Chips are pills. Icon-only is a circle. Sheets are 14px.
- [ ] Photos get a 1px rim that follows the radius, plus the same short lift.
- [ ] Nested radii stay concentric: inner = outer − padding .
- [ ] Depth is a whisper: 1px drop. The rim is a border. Not a card stack.
- [ ] Menu and place marks may carry a quiet extra (olive, forest, pumpkin, burnt, mixed accent). The word stays type-color. Color .
- [ ] A fill is one mix. Never a gradient, mesh, or fade unless the brief names that wash. Never a solid colored border on the leading or trailing edge. Live is a word, a mark, or accent on the thing. D-018 .
- [ ] Chrome is icon-only: search, theme, command, close, back, overflow. Accessible name. Title on a mouse. Regular at rest. Fill when this is the place. Directional marks flip in RTL. D-020 .
- [ ] A commit keeps a word when it is destructive, when two commits sit together, when the mark is not a household verb, or when it is the one Guided action. Save invoice. Cancel job. Arrive .
- [ ] A value chip stays a word. Leak is not an icon.
- [ ] Labels persist. Placeholders are emptiness ( Mike Reyes ), not the label ( Enter name ).
- [ ] Help sits under the field. An error takes its place. Not a toast.
- [ ] Loading morphs the mark and turns. If a word is there, the word stays. Do not swap Save for a spinner. Dispatching twice creates two trucks.
- [ ] Hover is color only. No wash behind a nav word. Gate it: (hover: hover) and (pointer: fine) .
- [ ] Focus is visible and is not selection. Accent ring. Keyboard works everywhere.
- [ ] Two rimmed controls keep 12px. Field to commit is 12px. A name field kissing Dispatch reads as one mashed control in the van.
- [ ] Overlay is a mix, not a blur. A popover grows from its trigger. A menu fades. D-021 .
- [ ] A full-width commit sits in the sheet’s pad, not flush to the viewport.
- [ ] Media has an aspect-ratio. A horizontal list shows 16–32px of the next item. Fade a list that continues. D-019 .
- [ ] For media delivery order, follow `DESIGN.md` D-024 .
- [ ] Destructive money is a modal. Voiding an invoice is money. Do not confirm “Mark arrived.”
- [ ] Workbench: the selected row, the record title, the field they are in.
- [ ] Street first in the row. Time is a column. Status is a word on the end.
- [ ] The primary action sits with the work, not in a dashboard of equal buttons.
- [ ] More space above a heading than below it. The heading belongs to what follows.
- [ ] Body contrast APCA |Lc| ≥ 75. Fix with lightness, not hue. Color .
- [ ] Chrome is 13. Content is 14. Measure 65–75ch. Headings balance. Body pretty .
- [ ] Hover gated. 100dvh. viewport-fit=cover. Tap highlight off.
- [ ] Inputs on a phone are 16px or larger. Never user-scalable=no .
- [ ] States exist: hover, disabled, loading, error, empty, permission, destructive. D-009 .
- [ ] Desktop 40. Touch 44. Destructive money is a modal.
- [ ] Light and dark are both first-class. Theme still sticks.
- [ ] An inset box-shadow as the outer edge of a clipped radius
- [ ] Hex, text-white, or a raw shadow in product code
- [ ] A word on a button a mark would have made obvious
- [ ] A gradient, mesh, or fade across a surface, unless the brief named that wash
- [ ] A solid colored border on the leading or trailing edge of a row, a card, a quote, a callout, or a sheet
- [ ] Layout shift from a photo without an aspect-ratio
- [ ] Filling negative space because it looked empty

### Motion
Source: https://design.thorbis.com/skills/motion

- [ ] Animating something that should not move.
- [ ] How often does this happen? A hundred times a day does not animate.
- [ ] Who is holding it? Keyboard is instant. A thumb may drive a sheet. A visitor on Film may own a sequence.
- [ ] What is the purpose? Feedback, space, state, or continuity. If you cannot name it, do not build it.
- [ ] Which token? --motion-fast, --motion-overlay, --ease-out. No private curve.
- [ ] transform and opacity only. clip-path allowed. height only for accordions. Jank on the board loses the 7 a.m. window.
- [ ] Never scale(0). Start at 0.95 plus fade, or do not scale. A bounce looks like a game, not a job.
- [ ] --ease-out: cubic-bezier(0.23, 1, 0.32, 1). Never ease-in on UI. A sheet that eases in late feels broken. First frame already moving.
- [ ] Press 80–120ms. Hover 100–120ms. Dialog and sheet 160–200ms. Ordinary web UI transitions take at most 200ms. Popovers and menus use the event recipes below. A slow drawer on a job they open 80 times a day is stolen time.
- [ ] Exit the way it entered. Exit quieter than enter. Interrupt with transitions, not keyframes. They will tap another job before the first inspector finishes. The next one has to win.
- [ ] Overlay is a mix, not a blur. A popover grows from the control that opened it. A menu fades; it does not fly off the screen. D-021 .
- [ ] Reduced motion: keep opacity, drop movement.
- [ ] Hover motion gated to (hover: hover) and (pointer: fine) .
- [ ] will-change only on transform or opacity, and only if the first frame stutters. Take it off when the motion ends. Never will-change: all .
- [ ] Animating width on the sidebar. Use transform plus negative margin.
- [ ] Token curve and duration. No private easing
- [ ] transform and opacity only (or a named accordion)
- [ ] Overlay is a mix. Popover grows from its trigger. Menu fades. D-021
- [ ] If Showcase: the motion explains a join. D-022

### Composition
Source: https://design.thorbis.com/skills/composition

- [ ] Export pieces, not configurations. The caller omits what it does not need.
- [ ] A variant is a name ( JobNoteComposer ), not a flag ( variant="job" ).
- [ ] Context holds state, actions, meta. Do not leak setters. Expose save, not setDirty .
- [ ] Lift state so a toolbar Save and a dirty-dot can see it. Do not sync two useState s.
- [ ] React 19: refs are props. No forwardRef .
- [ ] Feature logic stays out of a shared primitive. A primitive does not know what a job is. Do not put feature copy in it.
- [ ] Search the registry before you add a piece. D-007. AG-001 .
- [ ] A compound does not paint AppShell. Chrome is the page’s. The compound is the work on the sheet. D-002 .
- [ ] Use generators and primitives that already exist. Fill behavior. Do not invent structure. AG-003 .
- [ ] One button. One field. One dialog. Variants are semantic ( destructive, ghost ), not isInvoice .
- [ ] Do not import a second component kit. Do not hand-roll a menu or a tabs list.
- [ ] JobNoteComposer, note on a job. Footer is Save. Notify is omitted.
- [ ] DispatchThreadComposer, thread. Notify is a piece. Submit is Dispatch.
- [ ] InvoiceCommentComposer, comment on an evidence page. No notify. No dispatch.
- [ ] Density is a view on the view bar, not a flag. D-015. Preserve the shared Linear baseline.
- [ ] Totals are InvoiceLineTable, a named compound, because the math is the job.
- [ ] Sticky header is the pattern’s, not a boolean the page passes in.
- [ ] Filter lives in the view bar, not inside the table.
- [ ] variant: "job" | "thread" that branches in every child
- [ ] A second kit imported beside the one we own
- [ ] A compound that paints its own page chrome
- [ ] A boolean to hide a slot the caller could have omitted
- [ ] Hand-building a dialog that the kit already has. D-004
- [ ] A new primitive on a feature ticket. D-006
- [ ] Kit dialog, menu, tabs reused. D-004. AG-003
- [ ] Context exposes verbs and facts, not setters
- [ ] New variant has a semantic reason and an owner. D-005
- [ ] Primitive still does not know what a job is

### Tracking
Source: https://design.thorbis.com/skills/tracking

- [ ] Every issue has a milestone. If it is not on one, it is not planned.
- [ ] Titles are outcomes ( Focus ring matches accent ), not chores ( Fix CSS ).
- [ ] One outcome per issue. Description is the brief. Acceptance is a list the next person can check against Rules and the skill you followed.
- [ ] Papercuts are real. File them. Do not batch “we’ll polish later.”
- [ ] A due date without a milestone is decoration. Prefer the milestone. Use a date only when the outside world constrains us (launch, payroll, install).
- [ ] Name the person the work is for. Dispatcher, tech, or owner. Name the profile. Workbench, Guided, Evidence, or Showcase.
- [ ] Record the owning skill and required context selected under that policy.
- [ ] What you opened (desktop, 390px, both themes)
- [ ] What you pressed (keyboard path, ⌘K, the commit)
- [ ] What you refused (a second shell, a gradient, a solid colored side rail, a word on a mark)
- [ ] Which skill owned the decision and what additional context was required
- [ ] A screenshot or a clip when the change is visual
- [ ] Search Linear for “nav hover” and “Jobs wash.” Search the registry for the nav primitive.
- [ ] Reuse the issue if it exists. If not, file: Nav word hover is color only. Milestone: this week’s papercuts. Person: dispatcher. Profile: Workbench. Skill: UI.
- [ ] Acceptance: no wash behind the word; hover gated to a real mouse; both themes; 390px unchanged.
- [ ] Build against UI. Do not open Color to invent a grey.
- [ ] Evidence: desktop hover, a phone (no hover), light and dark, a screenshot of Jobs.
- [ ] Write the decision first. Room: Canvas. Occupant: CanvasWorkspace. Surface: route. Skill: Product. AG-006. Product .
- [ ] Split before you call it done. AG-011. Issues, not a saga:
- [ ] Workflow is a Canvas occupant of AppShell
- [ ] Each issue names Product, or UI, or Composition. Not all three.
- [ ] Evidence on each. Screenshot baselines on the gold screen. D-011 .
- [ ] How you checked it (desktop, 390px, keyboard, both themes, console)
- [ ] Batching papercuts into a polish epic that never ships
- [ ] Linear searched. Issue reused or filed. AG-001
- [ ] Gold screen has a baseline if the change is visual. D-011

### Color
Source: https://design.thorbis.com/skills/color

- [ ] Name the token. If you cannot, you are sneaking a value.
- [ ] Name the job: surface, type, pointer, status, or guest.
- [ ] APCA on this theme, then the other theme.
- [ ] If it is Showcase, watch it in motion. A still that works can fail when the object moves onto a hotter field.
- [ ] Persist the choice ( localStorage ). Do not reset it on navigation or a view transition.
- [ ] Paint data-theme and data-resolved on the root before first paint.
- [ ] Theme control is an icon. Sun, moon, desktop. Not a segmented “Light Dark System” pill.
- [ ] Theme is the color preference they get. Not a hue picker. Not a second brand. D-015 .
- [ ] A customer portal and an invoice do not wear one person’s theme.
- [ ] Cream type ( hue 84.6 ) is warm. Paper, ink, the sheet in light.
- [ ] Body grey ( hue 259.8 ) is cool. Sentences sit off the cream so they recede.
- [ ] Accent ( hue 264.4 ) is cool blue. It points. It does not warm the room.
- [ ] Canvas and panel are achromatic. No hue. The void is not blue.
- [ ] Cream on void reads brighter than cream on panel. Titles sit on the sheet.
- [ ] Accent on void shouts. Accent on panel points. Use the second.
- [ ] Danger on a red-tinted panel disappears. Keep the panel grey.
- [ ] Body grey on cream (light theme) is a different pair than body grey on void. Check both.
- [ ] The void is bg. One light on the object. A rim so the sheet reads as a thing.
- [ ] The product in the shot is the product we ship. Cream type, grey sheet, one blue pointer.
- [ ] Do not grade the reel toward teal-and-orange. Do not add a marketing purple.
- [ ] Skin, a truck, a shop: keep them honest. Do not cast a blue wash over a crawlspace.
- [ ] Cuts stay in the same world. Do not jump from a cream void to a black void between chapters.
- [ ] Reduced motion stills use the same crop and the same palette.
- [ ] Candy icons. An all-grey menu as a virtue
- [ ] A gradient, mesh, aurora, or fade, unless the brief names that exact wash
- [ ] A solid colored border on the leading or trailing edge of a row, a card, a quote, a callout, or a sheet
- [ ] Complementary orange “to balance the blue”
- [ ] Token named. No hex in product code. D-003
- [ ] APCA |Lc| holds on this theme and the other
- [ ] Accent is a pointer, not 10% of the screen
- [ ] Fill is one mix. No solid colored side rail. D-018
- [ ] Marks: outline at rest, fill when current. D-020

### Type
Source: https://design.thorbis.com/skills/type

- [ ] Who is reading, and from where? Dispatcher at 7 a.m. Tech in a crawlspace. Owner on the books.
- [ ] Is this chrome or content? Chrome is 13. Content is 14. Do not mix them to “fit.”
- [ ] Is the control a mark, or does it need a word? Search, theme, close, command: no word. Save invoice, Cancel job, Arrive : a word. D-016 .
- [ ] Is the number the job? Money, hours, the shop's printed number: Geist Mono, tabular. A street is Inter.
- [ ] Inter Variable with opsz. ss01 and cv11. The UI face. Calm at 13. Calm at 32.
- [ ] Geist Mono for code, the shop's printed number, money, shortcuts. Tabular. The books depend on it.
- [ ] Numerals for counts: 3 jobs, not three jobs .
- [ ] Shop currency. Same precision in a column.
- [ ] Non-breaking space between a number and its unit.
- [ ] A column of money stays tabular and right-sitting. Do not wrap a dollar in the middle of the amount.
- [ ] JOB-1842 is a caption. The title is 114 Oak. Street first.
- [ ] Show the number the shop already prints on the work order ( JOB-1842 ). Never show an internal id ( work_order_id, a UUID, a database key). The dispatcher reads that number back from the paper. An internal id looks like a different job.
- [ ] Non-breaking space between a number and its unit ( $186.00, 1.5 hr ).
- [ ] Typographic quotes and apostrophes. Ellipsis is …. Straight ticks look like a dump from the old software.
- [ ] A thin nbsp only when balance still leaves a widow. A lonely “due” on the next line of an invoice looks careless.
- [ ] A job street may ellipsis. Chrome labels fade the overflow ( mask-image ) instead of a hard clip when the word is the only cue.
- [ ] Keep the mark together. A hanging parenthesis after a name is how a quote looks cheap.
- [ ] Sentence case. Second person. Active voice.
- [ ] Prefer a mark. When a control has a word, it names the action. Save invoice. Cancel job. Not Continue. Not Submit. Search, theme, close, command: no word. D-016 .
- [ ] Errors name the problem and the exit. Could not save the invoice. Check the card and try again.
- [ ] Empty names the one action. No open jobs. Create a job.
- [ ] 7 a.m., not 7am. Ellipsis is …. Typographic quotes.
- [ ] Job, stop, tech, truck. Street first: 114 Oak, then the leak.
- [ ] Status is a word: Open. En route. On site. Not a green blob.
- [ ] No marketing on a board. No kickers. No all-caps labels.
- [ ] Title Case is allowed on Showcase headlines only.
- [ ] Labels persist. Placeholders are emptiness ( Mike Reyes ), not the label ( Enter name ).
- [ ] Help sits under the field. An error takes its place. Not a toast.
- [ ] Assign… means a picker is coming. Assign means it already happened. Techs trust the difference.
- [ ] A placeholder that is the label ( Enter name )
- [ ] An internal id on a screen the shop reads ( work_order_id, a UUID)
- [ ] A word on a button a mark would have made obvious
- [ ] Inter on the UI. Geist Mono on the shop's number and money
- [ ] The number on screen is the one printed on the work order
- [ ] Chrome 13. Content 14. One 32 on the page
- [ ] Measure 65–75ch. Headings balance. Body pretty
- [ ] Marks where the action is obvious. Words where it is not. D-016

### Cinematic
Source: https://design.thorbis.com/skills/cinematic

- [ ] Name the object before you draw. The board. The phone in the van. The invoice. The truck.
- [ ] Name the mode: router, explore, film, or store. D-022 .
- [ ] Is the UI in the shot the UI we ship? Real jobs, real streets, real times. Not Acme. Not a dribbble board.
- [ ] Two actions of different intent, or one. Explore Thorbis. See how it works. Start dispatch. Not two commits of equal weight.
- [ ] Dark void for performance, materials, the board at night, the product as a thing. Light void when the message is everyday, thin, friendly, the invoice on a counter.
- [ ] The background follows the story. Do not alternate dark and light for decoration.
- [ ] The product supplies the color. Interface stays grey. Screen content, a finish, a photo may carry hue. Blue remains a pointer, not a wash. D-018 .
- [ ] Rotate evidence: the object, the UI, the inside, a person in the shop, a number. Do not shoot the same laptop from six angles.
- [ ] Same palette as the workbench. No teal-and-orange grade. No second blue. Color .
- [ ] 60–70% calm product: real UI, short copy, restrained motion.
- [ ] 20–30% evidence: workflows, time, money, shops, modules.
- [ ] 10–15% cinema: one or two sequences, a reveal, a spatial join.
- [ ] Promise. One statement. One supporting sentence. The product is the object. Two actions of different intent.
- [ ] Join. One controlled sequence: call, customer, property, stop, tech, estimate, invoice, payment assembling into one timeline. Scroll explains the architecture.
- [ ] From the shop to the row. Full workspace, then dispatch, customer, job, invoice. The camera says every detail belongs to one system.
- [ ] Chapters. Isolated. One real product view and one operational outcome each. Answer. Dispatch. Context in the van. Work into money. The board as a whole.
- [ ] Breadth. A structured grid of modules. CRM, schedule, comms, field, money, inventory, sites, reports. Not another cinematic pass.
- [ ] Evidence. Time saved, response, admin work, revenue captured, a shop, migration.
- [ ] Price. Starting commitment, what’s in, usage, seats, implementation, support, data. Easier to find than Apple hides it.
- [ ] The product is larger than the type. Headline is a caption under the object, not a billboard over it.
- [ ] Dark void. Same canvas as the workbench. One light. A rim so the sheet reads as a thing.
- [ ] Scroll is a cut list. The browser owns the wheel.
- [ ] One entrance per chapter. Reduced motion is stills of the same crop.
- [ ] Few words. Operator-plain. One action at the end, or two of different intent. Start dispatch, not Get started .
- [ ] Title Case is allowed on Showcase headlines only. Body stays sentence case.
- [ ] Delight lives here only. Do not export this motion into Admin.
- [ ] One idea per scene. Intent sets the mode. D-022 .
- [ ] Disclose in order. Do not dump the spec in Open.
- [ ] Every cinematic beat explains a join, a simplification, or speed. Motion that only resembles Apple: refuse.
- [ ] Mode named: router, explore, film, or store. D-022
- [ ] Object sits on a third, or center is named
- [ ] Lead room in the direction of face or move
- [ ] Object is real Thorbis or a real trade scene
- [ ] One primary action, or two of different intent
- [ ] No gradient unless the brief named it. No solid colored side rail. D-018
- [ ] Jumping the object from left third to right third on a cut
- [ ] A gradient, mesh, or aurora behind the product, unless the brief named that wash
- [ ] A solid colored side rail on a frame or a card
- [ ] One layout for homepage, product, and pricing

### Native
Source: https://design.thorbis.com/skills/native

- N/A for web (prose chapter with no rule list; read the source page if this area applies).


### Cloudflare forms
Source: https://design.thorbis.com/skills/ui/references/cloudflare-forms

- [ ] Choose the form mode: simple, configuration, dense inline, or guided.
- [ ] Use a visible label. Placeholder is format/example only.
- [ ] Use native semantics before custom JS validation. Correct input types, labels, required state, and browser behavior remain the foundation.
- [ ] Size the field to the data rather than making every input full-width.
- [ ] Use a consequence-naming commit action: Save customer, not Submit .
- [ ] Protect unsaved work according to the existing Thorbis dirty-state rules.
- [ ] Use the density and touch contract owned by UI and Components. Native apps follow Native under D-025; this web reference does not set native control sizes.
- [ ] A short code field and a long address field need different widths.
- [ ] A textarea reserves room for the expected answer and grows without hiding its label or recovery action.
- [ ] Keep label, field, and help together; give separate groups more space. The operator should see which instruction belongs to which field.
- [ ] Keep durable configuration readable. A wide workbench is not a reason to stretch every field across it.
- [ ] Loading, focus, validation, and save feedback preserve the control's footprint.
- [ ] Thorbis radius, field surface, electric-blue focus, and existing type scale.
- [ ] Use semantic focus and selection tokens; action prominence follows DESIGN.md D-023.
- [ ] No Cloudflare orange, font, chrome, exact radii, or card styling.
- [ ] Error is local: danger rim + copy; do not wash the whole section red.
- [ ] every input is 100% width regardless of data,
- [ ] a technical choice requires leaving the workflow to understand it,
- [ ] a long durable workflow is squeezed into a modal,
- [ ] mobile simply shrinks a 32px desktop form,
- [ ] another product's colors or chrome are copied.

### Shopify Polaris
Source: https://design.thorbis.com/skills/ui/references/shopify-polaris

- [ ] Collection state belongs with the collection: search, filters, saved views, sort, columns.
- [ ] Tabs slice the current collection. They are not global navigation.
- [ ] X selects a row. Selection summons a visible bulk bar. Do not show bulk clutter before selection.
- [ ] Row identity is a real link. Do not add View to every row.
- [ ] Repeated same-field edits across many records may promote into a dedicated grid workspace.
- [ ] Dirty state is persistent and explicit. Save / Discard remains visible until resolved.
- [ ] Large forms use progressive disclosure and a durable route rather than a giant modal.
- [ ] Main content defines the resource; the inspector supports it with status, metadata and context.
- [ ] Workbench width follows data density. Focused forms keep a readable measure.
- [ ] One likely action stays visible, verb-led and concrete. Secondary actions stay quieter. Rare or destructive actions may use overflow, but critical actions must have a visible discoverable path.
- [ ] Saved views and column choices are operator preferences. Defaults remain canonical.
- [ ] Timelines record meaningful evidence, not decorative activity.
- [ ] Shopify green, light Admin palette, exact radii, cards, shadows or typography.
- [ ] Spreadsheet editing when the task is really a single durable record.
- [ ] Keep Save and Discard persistently reachable.
- [ ] Save names what it commits when ambiguity exists.
- [ ] Error stays with the field or save surface; do not pretend a failed save succeeded.
- [ ] Successful save clears dirty state without moving the operator unless the workflow requires it.
- [ ] the same fields are being compared/changed across records;
- [ ] row/column structure improves speed and accuracy;
- [ ] validation can be represented per cell or per row;

### Vercel + Geist
Source: https://design.thorbis.com/skills/ui/references/vercel-geist

- [ ] descriptive identity + 1–2 actions -> Entity row
- [ ] static key/value facts -> Description list
- [ ] one default + close variants -> Split Button
- [ ] associated desktop context -> Thorbis Inspector, not an ad-hoc drawer
- [ ] ⌘K : global go/do; useful zero-query state with recent/relevant items
- [ ] Badge is static metadata, not a disguised button.
- [ ] Tabs are sibling views sharing scope and URL state. Back and a shared link preserve the selected view.
- [ ] Gauge is only for a meaningful fixed ratio.
- [ ] Geist Sans as a Thorbis identity replacement
- [ ] Title Case throughout the Thorbis product
- [ ] visible construction grids on dispatch/CRM/finance
- [ ] desktop drawers replacing routes or inspectors
- [ ] component choice based only on visual resemblance
- [ ] Accessibility behavior is owned by the primitive

## Focused studies


### Research consensus
Source: https://design.thorbis.com/research/studies/consensus

- [ ] Clarity before decoration. Place, state, hierarchy, and next action must be understandable before visual flourish is added.
- [ ] Progressive disclosure. Keep complexity available, but do not make second- and third-read detail compete with the first read.
- [ ] Consistency creates speed. Stable shell geometry, object silhouettes, metadata order, controls, and interaction roles become muscle memory.
- [ ] Context beats global clutter. Related information belongs near the work that needs it. The global shell stays small and predictable.
- [ ] Behavior belongs to the system. Accessibility, loading geometry, focus, keyboard behavior, semantics, errors, and responsive behavior belong in primitives and patterns instead of page-local patches.
- [ ] Actions predict outcomes. Concrete verbs, visible commit state, and consequence-aware language beat vague enterprise labels.
- [ ] State is durable. Work must survive navigation, loading, refresh, partial failure, non-color presentation, and device changes when the workflow warrants continuity.
- [ ] Density is structured, not compressed. Alignment, grouping, repetition, hierarchy, and whitespace make dense information fast to scan.
- [ ] Motion explains change. Motion preserves orientation or communicates causality. It does not compete with operational work.
- [ ] Brand restraint increases signal. Accent, imagery, elevation, and special treatment become more useful when they are scarce.
- [ ] Curation and search solve different problems. Useful subsets reduce hunting; the complete explorer remains available for precision.
- [ ] The design system is governance. Tokens, primitives, patterns, ownership, documentation, and verification prevent drift better than screenshots do.
- [ ] Orientation is a contract. Deep records keep identity, state, primary action, and local navigation understandable as depth grows.
- [ ] Interruption recovery is part of UX. Drafts, selection, filters, upload progress, and partially completed work recover predictably when the workflow warrants it.
- [ ] Undo when safe; confirm when consequential. Low-risk reversible actions prefer immediate execution plus undo. Financial, permission, irreversible, and destructive actions require explicit consequence-aware confirmation.
- [ ] Defaults carry the product. Personalization may improve efficiency, but the default view must be complete and useful without configuration.
- [ ] Bulk work is a mode. Multi-select exposes contextual actions and consequences instead of permanently adding controls to every row.
- [ ] Content has a failure budget. Long names, missing media, malformed files, partial data, permissions, and slow networks are ordinary inputs the component must absorb.
- [ ] Every collection needs a finding strategy. Define curation, local filtering, full search, saved views, and command access deliberately instead of duplicating search boxes.

### Linear deep study
Source: https://design.thorbis.com/research/studies/linear

- [ ] Attention must be earned. Linear deliberately dims navigation and supporting iconography so the work surface wins. Thorbis chrome recedes after orientation; the current job, customer, invoice, schedule, or report owns the strongest contrast.
- [ ] Structure should be felt before it is drawn. Alignment, tone, spacing, grouping, and stable geometry carry hierarchy before separators. A border must communicate a real boundary, not compensate for weak composition.
- [ ] Remove noise before information. Linear preserves rich density while reducing visual competition. Thorbis should not hide useful operational context merely to look minimal.
- [ ] Same action, same neighborhood. Headers, view controls, and repeated actions remain predictable across workflows. Jobs, Money, Customers, Inventory, and Sites may specialize their work without inventing new chrome.
- [ ] Dashboards are decisions, not galleries. A canonical dashboard declares audience, decision, cadence, owner, and freshness. Metrics include enough comparison or expected-range context to change that decision, not just decorate a home screen.
- [ ] AI inhabits the product. Suggestions and agent work use Thorbis primitives and relationships instead of a separate AI costume. Machine suggestion stays distinguishable from committed state.
- [ ] Agent identity and state are explicit. The Resilience skill owns the contract: an agent is visibly non-human, never presented as a person, acknowledges invocation immediately, exposes lifecycle state compactly, and leaves the accountable person or role clear.
- [ ] Automation earns autonomy. Move by category from observe → suggest → approve → automate. Money, destructive work, permissions, customer communication, and public actions keep stronger control.
- [ ] Constraints move downward. If a rule can live in a primitive, schema, generator, tool, lint rule, or verification check, do not leave it as prose an agent must remember.
- [ ] Design tooling is infrastructure. Linear's internal token and feature-comparison tools make refinement cheap. Thorbis should make themes, density, component states, tokens, and before/after comparisons inspectable in the real product.
- [ ] Paper cuts count. Premium quality is cumulative. Repeated small friction is a design defect even when each instance looks too minor for a feature project.

### Xbox ecosystem
Source: https://design.thorbis.com/research/studies/xbox

- [ ] Curate first. Search second. Game Pass does not begin as one undifferentiated catalog. It creates useful entry points such as recently added, popular, coming soon, and platform or plan collections, then exposes the complete searchable catalog. Thorbis should do the same with operational subsets: Needs attention, Today, Unassigned, Awaiting approval, Ready to invoice, Low stock. A useful collection is not a smaller database table.
- [ ] Recognition before reading. Xbox collections are scannable because repeated objects have stable silhouettes even when their artwork changes. Thorbis entities need the same grammar. Customer, property, job, invoice, equipment, and technician should be recognizable by structure before the operator reads every label.
- [ ] Design the second read. Xbox hardware designers describe a simple first read with deliberate detail revealed on closer inspection. Thorbis applies that to information: first read answers where am I, what matters, what state is this, and what needs action; second read reveals relationships, timestamps, metadata, and secondary actions; intentional interaction reveals audit history and advanced detail. Density stays available without becoming the first impression.
- [ ] State survives without color. Consequential state is communicated with words, shape, iconography, and position before color reinforces it. Open, En route, On site, Needs approval, Paid, and Overdue must remain understandable in monochrome, forced colors, and reduced visual conditions.
- [ ] Change the interface for the device; preserve the state of the work. Xbox treats cross-device continuity as part of the product, not merely responsive CSS. Thorbis desktop, field mobile, portal, and embedded surfaces may present different controls, but the job, customer, approval, photo, payment, and progress remain one shared state.
- [ ] Direct manipulation beats spectacle. When spatial information matters, Xbox lets the person manipulate it. Thorbis property models, infrastructure graphs, maps, LiDAR captures, equipment layouts, and workflow canvases should pan, zoom, rotate, select, isolate, and filter instead of forcing the operator through a passive animation.
- [ ] The frame survives bad content. Xbox has to place unpredictable artwork inside a coherent system. Thorbis must survive customer logos, dark photos, portrait photos, long filenames, missing media, documents, and arbitrary uploads without losing its geometry. Aspect ratio, crop, fallback, loading, contrast protection, and missing states belong to the component.
- [ ] Brand color rewards attention. Electric blue points to identity, focus, selection, and the live thing. It does not paint the application. Scarcity makes the accent feel more deliberate and more premium.
- [ ] Accessibility is component architecture. Xbox Accessibility Guidelines treat input, context, contrast, readable text, and alternative interaction as design inputs. Thorbis components are incomplete until keyboard, pointer, touch where relevant, visible focus, screen-reader meaning, zoom, contrast, text expansion, forced colors, and reduced motion work.

### Vercel and Geist
Source: https://design.thorbis.com/research/studies/vercel-geist

- [ ] Role before shape. Table is comparison. Entity is identity plus one or two actions. Description is key/value facts. Select is a short fixed list; Combobox is searchable. Menu is local; Command Menu is global.
- [ ] Rules become infrastructure. A rule should not stay prose when a primitive can enforce the accessible name, focus return, keyboard behavior, live state, hit target, or reduced-motion behavior.
- [ ] Tokens name jobs. Geist's color scale maps ranges to backgrounds, borders, contrast surfaces, and text. Thorbis keeps its own OKLCH palette but adopts the role-first token discipline.
- [ ] Type is a role bundle. Heading, label, copy, action, and mono/tabular styles carry size, leading, tracking, weight, and numeric behavior together. We keep Inter for UI and Geist Mono where code-like alignment helps.
- [ ] Empty has a cause. First-run, no-results, cleared, permission, plan, error, and offline/degraded states need different copy and a specific next or recovery action.
- [ ] Loading is the final geometry. Skeletons mirror the row, avatar, field, media, and columns they replace. Nothing jumps when data arrives.
- [ ] Keep Thorbis's boundaries. Do not switch to Geist Sans, Vercel's palette, product-wide Title Case, visible guide grids on workbench pages, badge-heavy status, or desktop drawers replacing routes and inspectors.

### Shopify Polaris
Source: https://design.thorbis.com/research/studies/shopify-polaris

- [ ] Collections are workspaces. Search, filters, saved views, sort, columns, selection, bulk actions, and the path into a durable record belong to the collection itself.
- [ ] Tabs slice; navigation moves. All, Open, Draft, Archived, and custom views are states of one place. The sidebar/location bar still owns application navigation.
- [ ] Selection changes the action model. Normal browsing stays quiet. Selecting rows summons a visible bulk-action bar instead of leaving bulk vocabulary on screen all the time.
- [ ] Multi-edit can be its own tool. When several records need the same fields compared or changed, a purpose-built grid can beat repeated modals. It must still have explicit validation and commit/discard state.
- [ ] Dirty is a state. Unsaved changes stay visibly unresolved until Save or Discard. Navigation cannot silently destroy work. Autosave is not a substitute for deciding what save means.
- [ ] Main defines; inspector supports. Polaris's resource-detail grammar reinforces our RecordWorkspace: principal work in the sheet, status/metadata/relationships beside it, never an equal card for every fact.
- [ ] Large forms are places. Progressive disclosure first; durable multi-section editing belongs on a route, not inside a giant modal.
- [ ] Keep Thorbis's boundaries. No Shopify green, exact Admin cards, badge soup, global tabs, generic activity feeds, or softer consumer styling. Linear remains the core shell and interaction language.

### Cloudflare forms
Source: https://design.thorbis.com/research/studies/cloudflare-forms

- [ ] Labels stay visible. Placeholder text can show format or examples, never the field name.
- [ ] Size follows the data. Addresses and titles get room; ZIP codes, dates, quantities, IDs, and money remain compact.
- [ ] Help lives beside the decision. Short technical explanations belong in the form rather than forcing a trip to documentation.
- [ ] Configuration has sequence. Name the thing, define the condition, define the result, then commit or save draft.
- [ ] Desktop stays dense. Workbench controls remain 32px; Guided and mobile forms move to 40–44px targets.
- [ ] Security stays quiet. Protection should be invisible during normal use and interrupt only when necessary.

### Web typography
Source: https://design.thorbis.com/research/studies/typography

- [ ] 01 Role precedes family choice. UI text, long-form reading, display, and monospaced data have different constraints. Comparisons become meaningful when each family is evaluated inside one named role.
- [ ] 02 Web rights are separate from desktop rights. Web adoption requires confirmed embedding, traffic or seat limits, applications, redistribution, derivatives, and fallbacks. System availability does not prove web rights.
- [ ] 03 WOFF2 and subsetting reduce payload. Subsetting to real language coverage and removing unused weights reduces transfer. A variable font can replace several styles, while one static cut may still be smaller for a one-style role.
- [ ] 04 Preload helps only critical above-fold text. Preconnect can help an unavoidable font origin, and self-hosting can help when the license and cache strategy allow it. Preloading below-the-fold fonts adds work without protecting first render.
- [ ] 05 Font swap and fallback metrics are one problem. font-display choices work with fallback matching. size-adjust plus ascent, descent, and line-gap overrides reduce reflow when the web font arrives.
- [ ] 06 User reading settings expose fragile layouts. Robust layouts survive browser zoom, user styles, narrow widths, 1.5× line height, 2× paragraph spacing, .12em letter spacing, and .16em word spacing without clipping.
- [ ] 07 Hostile strings reveal false confidence. Pairs such as 0/O, 1/l/I, and rn/m—plus punctuation, currency, fractions, long names, diacritics, non-Latin scripts, and tabular numbers—expose weaknesses at real interface sizes.

## Product chapters (hardware)


### Form language
Source: https://design.thorbis.com/product/chapters/form-language

- N/A for web (prose chapter with no rule list; read the source page if this area applies).


### Materials and finish
Source: https://design.thorbis.com/product/chapters/materials-and-finish

- N/A for web (prose chapter with no rule list; read the source page if this area applies).


### Color
Source: https://design.thorbis.com/product/chapters/color

- N/A for web (prose chapter with no rule list; read the source page if this area applies).


### Typography on products
Source: https://design.thorbis.com/product/chapters/typography-on-products

- N/A for web (prose chapter with no rule list; read the source page if this area applies).


### Lighting and status
Source: https://design.thorbis.com/product/chapters/lighting-and-status

- N/A for web (prose chapter with no rule list; read the source page if this area applies).


### Logo and badge placement
Source: https://design.thorbis.com/product/chapters/logo-and-badge

- N/A for web (prose chapter with no rule list; read the source page if this area applies).


### Packaging and unboxing
Source: https://design.thorbis.com/product/chapters/packaging-and-unboxing

- N/A for web (prose chapter with no rule list; read the source page if this area applies).


### Ergonomics and sizing
Source: https://design.thorbis.com/product/chapters/ergonomics-and-sizing

- N/A for web (prose chapter with no rule list; read the source page if this area applies).


### Modularity and accessories
Source: https://design.thorbis.com/product/chapters/modularity-and-accessories

- N/A for web (prose chapter with no rule list; read the source page if this area applies).


### Product photography and renders
Source: https://design.thorbis.com/product/chapters/product-photography

- N/A for web (prose chapter with no rule list; read the source page if this area applies).


### Product page layout
Source: https://design.thorbis.com/product/chapters/product-page-layout

- N/A for web (prose chapter with no rule list; read the source page if this area applies).


### Naming
Source: https://design.thorbis.com/product/chapters/naming

- N/A for web (prose chapter with no rule list; read the source page if this area applies).


### Do's and don'ts
Source: https://design.thorbis.com/product/chapters/dos-and-donts

- N/A for web (prose chapter with no rule list; read the source page if this area applies).
