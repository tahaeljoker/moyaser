---
name: cinematic-editorial-motion
description: Easing curves, entrance animations, media transitions, and performance guidelines for Muyassar Real Estate motion design.
---

# Cinematic Editorial Motion Standards

## 1. Curated Easing & Timing Curves
- Standard Curve: All transitions and animations must use the editorial cubic-bezier:
  `cubic-bezier(0.22, 1, 0.36, 1)`
- Interactive Controls (Buttons, Toggles, Dropdowns, Tabs):
  - Duration: `200ms` to `300ms`.
  - Micro-states: Subdued color and hairline border shifts. Avoid spring physics or overshoot.
- Entrances & Transitions (Modals, Drawers, Cards, Section Headers):
  - Duration: `600ms` to `800ms`.
  - Use staggered reveals with increments of `80ms` to `120ms` for grouped cards.

## 2. Hero & Media Motion
- Ambient Hero Motion:
  - Slow continuous Ken Burns effect: subtle scale transition from `scale(1)` to `scale(1.06)` over `20s`.
  - Timing: Alternate direction with smooth ease-in-out curve to evoke quiet architectural prestige.
- Card & Media Hover:
  - Restrained image zoom on card hover: maximum `scale-[1.03]` over `500ms` using the standard cubic-bezier curve.
  - Overflow must remain cleanly clipped with `overflow-hidden` and rounded corners matching design tokens.

## 3. Scroll Reveals, Performance & Accessibility
- Scroll Triggers:
  - Implement reveals via lightweight `IntersectionObserver`.
  - Trigger configuration: `once: true`, `rootMargin: '0px 0px -50px 0px'`.
  - Motion: Gentle `16px` vertical lift (`translate-y-4` to `translate-y-0`) combined with linear opacity fade (`opacity-0` to `opacity-100`).
- Smooth Numeric Counters:
  - Animate numbers (prices, areas, unit tallies) smoothly over `1000ms` to `1200ms` once when scrolled into view.
- GPU-Accelerated Properties Only:
  - Animate ONLY `transform` and `opacity`.
  - Never animate layout properties: `height`, `width`, `margin`, `padding`, `top`, or `left`.
- Accessibility Requirement:
  - Strictly respect user accessibility settings via `@media (prefers-reduced-motion: reduce)`.
  - Disable Ken Burns loops, smooth lifts, and auto-counters when reduced motion is requested, rendering components immediately in their settled state.
