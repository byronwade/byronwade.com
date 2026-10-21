---
title: "byronwade/ui: The Design System Behind Everything"
url: "https://ui.byronwade.com"
category: "Product"
flagship: false
featured: false
status: "Archived"
tagline: "one design language, every project"
order: 3
date: 2026-06-02
excerpt: "My personal design system: a shared component library and interaction chrome for my projects. Its signature is the Morph Panel, a single capsule that fluidly morphs between a compact pill and a full panel instead of popping a disconnected menu over the page. It ran this site's chrome until October 2026."
problem: "Shipping this many products on my own only works if they all share one hardened foundation. Otherwise every UI change turns into a rewrite."
outcome: "One design language meant to carry across products: Morph Panels, semantic tokens, and accessible primitives built once and reused."
metrics:
  - label: Signature
    value: "Morph Panel"
  - label: Tokens
    value: "Semantic"
  - label: Used on
    value: "This site, until Oct 2026"
---

# byronwade/ui: One Design Language, Every Project

**byronwade/ui** is my personal design system: the component library, the design tokens, and the interaction chrome I built for my projects. I made it to be the layer underneath GoodMarks, SignalRoute, Thorbis, and this portfolio: one consistent visual language and one set of hardened primitives, so every product I ship feels like it came from the same studio.

It is not a public framework chasing stars. It is the opposite. A sharp, opinionated toolkit tuned to exactly how I build, and it gets refined on real products instead of designed in the abstract.

---

## The Morph Panel

The system's signature is the **Morph Panel**: a single shared capsule that *morphs in place* between a compact pill and a full panel, instead of popping a separate menu over the page.

Most UI menus are a sleight of hand. There is a trigger here and a floating panel that appears somewhere else, and the two look unrelated. The Morph Panel refuses to do that. The collapsed pill and the expanded panel are the *same element*. When you open it, width, height, and corner radius animate together along a single eased curve while the contents cross-fade, so the control literally grows into its larger self and shrinks back down when dismissed. The slot it lives in reserves the collapsed footprint so nothing on the page jumps on first paint, and the whole choreography collapses gracefully to an instant swap under `prefers-reduced-motion`.

Until October 2026, the chrome on this site was built from it:

- **The launcher** (top-left): the byronwade identity pill morphed into the cross-product switcher.
- **The dock** (the floating toolbar): the same `--dock` capsule morphed between its compact pill and each active panel.
- **The breadcrumb**: the same material, the same motion.

Three different surfaces, one shared capsule material and one shared motion language. That consistency is the entire point of a design system, and the Morph Panel is the clearest expression of it.

This site now runs on a port of [Thorbis Design](/projects/thorbis-design) instead: a fixed header whose menu opens as a panel below it, built on Base UI. A few pieces of byronwade/ui are still here. The pill styles, the semantic token names like `--brand` and `--dock` (now pointing at Thorbis colors), and the circular wipe when you switch between light and dark all came from it.

---

## How It's Built

byronwade/ui sits on the same React stack the rest of my work uses. **Next.js**, **React**, **Tailwind**, and **Radix** primitives for accessible behavior. But the real backbone is **semantic design tokens**. Surfaces are driven by intent-named tokens like `--dock`, `--brand`, and `--dock-active` rather than raw colors, so one brand decision, like the gold accent this site used to carry, reaches every product without a find-and-replace.

The components are **server-components-first**, dropping to client only where interaction demands it, and accessibility is foundational rather than retrofitted: real `dialog` semantics, managed focus, full keyboard support, visible focus rings, and proper hit targets are baked into the primitives. Motion is treated as a material. Eased, purposeful, and reduced-motion aware, not decoration sprinkled on at the end.

---

## Why It Exists

Maintaining a half-dozen products alone is only sustainable if they share a foundation. byronwade/ui was built to be that foundation: build a pattern once, harden it against real use, and reuse it everywhere. When I improve the morph timing or tighten the focus behavior in one place, every project that uses it inherits the change.

The [ui.byronwade.com](https://ui.byronwade.com) address now hosts my design-contract work, design systems that install as MCP, rather than a gallery of these components.
