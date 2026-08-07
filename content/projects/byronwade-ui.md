---
title: "byronwade/ui: The Design System Behind Everything"
url: "https://ui.byronwade.com"
category: "Product"
flagship: true
featured: true
status: "In development"
tagline: "one design language, every project"
order: 3
date: 2026-06-02
excerpt: "My personal design system. The shared component library and chrome I build most of my projects on. Its signature is the Morph Panel: a single capsule that fluidly morphs between a compact pill and a full panel instead of popping a disconnected menu over the page."
problem: "Shipping this many products on my own only works if they all share one hardened foundation. Otherwise every UI change turns into a rewrite."
outcome: "One design language across products: Morph Panels, semantic tokens, and accessible primitives reused everywhere I build."
metrics:
  - label: Signature
    value: "Morph Panel"
  - label: Tokens
    value: "Semantic"
  - label: Used on
    value: "This site"
---

# byronwade/ui: One Design Language, Every Project

**byronwade/ui** is my personal design system. It is the component library, the design tokens, and the interaction chrome that most of my projects are built on. It's the layer underneath GoodMarks, SignalRoute, Thorbis, and this very portfolio: one consistent visual language and one set of battle-tested primitives, so every product I ship feels like it came from the same studio.

It is not a public framework chasing stars. It is the opposite. A sharp, opinionated toolkit tuned to exactly how I build, and it gets refined on real products instead of designed in the abstract.

---

## The Morph Panel

The system's signature is the **Morph Panel**: a single shared capsule that *morphs in place* between a compact pill and a full panel, instead of popping a separate menu over the page.

Most UI menus are a sleight of hand. There is a trigger here and a floating panel that appears somewhere else, and the two look unrelated. The Morph Panel refuses to do that. The collapsed pill and the expanded panel are the *same element*. When you open it, width, height, and corner radius animate together along a single eased curve while the contents cross-fade, so the control literally grows into its larger self and shrinks back down when dismissed. The slot it lives in reserves the collapsed footprint so nothing on the page jumps on first paint, and the whole choreography collapses gracefully to an instant swap under `prefers-reduced-motion`.

You're looking at it right now. The chrome on this site is built from it:

- **The launcher** (top-left): the byronwade identity pill morphs into the cross-product switcher.
- **The dock** (the floating toolbar): the same `--dock` capsule morphs between its compact pill and each active panel.
- **The breadcrumb**: the same material, the same motion.

Three different surfaces, one shared capsule material and one shared motion language. That consistency is the entire point of a design system, and the Morph Panel is the clearest expression of it.

---

## How It's Built

byronwade/ui sits on the same React stack the rest of my work uses. **Next.js**, **React**, **Tailwind**, and **Radix** primitives for accessible behavior. But the real backbone is **semantic design tokens**. Surfaces are driven by intent-named tokens like `--dock`, `--brand`, and `--dock-active` rather than raw colors, so one brand decision like the gold accent that runs through everything reaches every product without a find-and-replace.

The components are **server-components-first**, dropping to client only where interaction demands it, and accessibility is foundational rather than retrofitted: real `dialog` semantics, managed focus, full keyboard support, visible focus rings, and proper hit targets are baked into the primitives. Motion is treated as a material. Eased, purposeful, and reduced-motion aware, not decoration sprinkled on at the end.

---

## Why It Exists

Maintaining a half-dozen products alone is only sustainable if they share a foundation. byronwade/ui is that foundation: build a pattern once, harden it against real use, and reuse it everywhere. When I improve the morph timing or tighten the focus behavior in one place, every project inherits it.

It is in continuous development and every product I ship feeds something back into it. See it living in the wild across this site, or explore the system itself at [ui.byronwade.com](https://ui.byronwade.com).
