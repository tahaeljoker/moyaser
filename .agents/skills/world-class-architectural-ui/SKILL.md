---
name: world-class-architectural-ui
description: UI/UX layout, typography, palette, and anti-clutter architectural design standards for Muyassar Real Estate.
---

# World-Class Architectural UI Standards

## 1. Layout, Spacing & Rhythm
- Section Rhythm: Apply generous vertical breathing room: `py-20 md:py-28`.
- Component Grids: Use disciplined gap scales (`gap-6 lg:gap-8`) for property cards, unit matrices, and specifications.
- Reading Widths: Constrain Arabic editorial content, blurbs, and project narratives to `max-w-2xl` to ensure optimal typographic readability in RTL.
- Tabular Numbers: Apply `tabular-nums` class to every dynamic or formatted numeral:
  - Unit prices (e.g., formatted SAR currency).
  - Land and built areas (e.g., 280 م²).
  - Unit codes (e.g., A-01, B-04) and license identifiers.

## 2. Calm Editorial Palette
- Primary Canvas: Crisp white (`#FFFFFF`) paired with warm architectural stone surfaces (`#F8F7F4` and `#F8FAFC`).
- Contrast & Accents:
  - Deep emerald (`#0F382C` or `#134E3E`) and deep charcoal (`#1E293B` / `#0F172A`) for typography and high-priority actions.
  - Subtle borders: Hairline boundaries using `border-slate-200/80` or `border-stone-200/60`.
- Visual Hierarchy: Reserve colored fills for primary status badges or call-to-action buttons. Backgrounds must remain serene, understated, and architectural.

## 3. Anti-AI-Slop & Asset Fidelity Rules
- Prohibit Decorative Watermarks: Never position overlapping watermarks, oversized background typography, or faint low-contrast emblems behind readable text.
- No Gimmicks:
  - Prohibit neon glows, heavy multi-layered drop shadows, and gaudy gradient borders.
  - Prohibit bouncy cartoonish hover transformations and excessive micro-animations.
- Asset Integrity:
  - Utilize real extracted WebP brochure assets and real architectural photography.
  - Optimize all imagery for responsive delivery with proper aspect ratios (`aspect-[16/10]`, `aspect-[4/3]`, `aspect-square`).
  - Serve all brand marks and icons strictly via local SVGs (Lucide / Heroicons). Zero emojis across all interface surfaces.
