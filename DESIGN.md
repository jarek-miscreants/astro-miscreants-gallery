---
version: alpha
name: Miscreants Starter
description: Functional-monochrome Astro 6 + Tailwind v4 starter with semantic tokens, data-theme dark mode, and fluid container-query typography.
colors:
  canvas: "#f3f3f3"
  panel: "#f9f9f9"
  panel-muted: "#ebebeb"
  fg: "#0a0a0a"
  fg-muted: "#525252"
  fg-subtle: "#8a8a8a"
  fg-on-intent: "#ffffff"
  intent: "#0a0a0a"
  intent-hover: "#1a1a1a"
  stroke: "#d7d7d7"
  stroke-strong: "#bdbdbd"
  focus: "#0a0a0a"
  error: "#dc2626"
  success: "#16a34a"
  neutral-50: "#f9f9f9"
  neutral-200: "#f3f3f3"
  neutral-400: "#ebebeb"
  neutral-600: "#e5e5e5"
  neutral-800: "#dddddd"
  neutral-950: "#d7d7d7"
typography:
  h1:
    fontFamily: Archivo Variable
    fontSize: 5.25rem
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: -0.045em
  h2:
    fontFamily: Archivo Variable
    fontSize: 3.5rem
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: -0.03em
  h3:
    fontFamily: Archivo Variable
    fontSize: 2.25rem
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: -0.02em
  h4:
    fontFamily: Archivo Variable
    fontSize: 1.75rem
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: -0.01em
  h5:
    fontFamily: Archivo Variable
    fontSize: 1.375rem
    fontWeight: 400
    lineHeight: 1.3
  h6:
    fontFamily: Archivo Variable
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.4
  body-xl:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: 400
    lineHeight: 1.55
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.55
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Inter
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 1.5
  body-xsm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1.5
  mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.5
rounded:
  none: 0px
  sm: 0.25rem
  md: 0.5rem
  lg: 0.75rem
  card: 0.875rem
  xl: 1rem
  pill: 9999px
spacing:
  unit: 4px
  gutter-sm: 1rem
  gutter-md: 3rem
  gutter-lg: 6rem
  section-xs: 3rem
  section-sm: 4rem
  section-md: 6rem
  section-lg: 8rem
  section-xl: 12rem
  container-max: 90rem
components:
  button-primary:
    backgroundColor: "{colors.intent}"
    textColor: "{colors.fg-on-intent}"
    typography: "{typography.body-sm}"
    height: 40px
    padding: 0 1rem
  button-primary-hover:
    backgroundColor: "{colors.intent-hover}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.fg}"
    typography: "{typography.body-sm}"
    height: 40px
    padding: 0 1rem
  button-secondary-hover:
    backgroundColor: "{colors.panel-muted}"
  button-tertiary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.fg}"
    typography: "{typography.body-sm}"
    height: 40px
    padding: 0 1rem
  button-tertiary-hover:
    backgroundColor: "{colors.panel-muted}"
  card-panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.fg}"
    rounded: "{rounded.card}"
    padding: 1.5rem
  card-panel-muted:
    backgroundColor: "{colors.panel-muted}"
    rounded: "{rounded.card}"
    padding: 1.5rem
  nav-pill:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.fg}"
    rounded: "{rounded.pill}"
    height: 48px
    padding: 0 1rem
  input-field:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.fg}"
    rounded: "{rounded.md}"
    height: 40px
    padding: 0 0.75rem
---

## Brand & Style

Functional monochrome. A near-black ink on warm off-white (`canvas`) with no chromatic accent — the brand personality is precise, editorial, and engineering-forward. Color is reserved for error and success signalling; every other surface speaks through contrast, type, and spatial rhythm.

The UI favours flat surfaces separated by tonal layering rather than shadows, sharp hairline strokes, and generous whitespace. Motion is restrained: micro-interactions use 150–300 ms linear or ease-out timing and every animated element respects `prefers-reduced-motion`. The starter is designed to be read quickly on product pages, marketing sites, and documentation — not to be decorative.

## Colors

A semantic role system sits on top of a neutral scale. Components should read from roles (`bg-canvas`, `text-fg`, `border-stroke`), never the raw scale — dark mode is a per-scope override of the role variables, so semantic-keyed components flip themes automatically.

- **Canvas (`#f3f3f3` light / `#0a0a0a` dark):** the whole-page background.
- **Panel (`#f9f9f9` light / `#141414` dark):** cards, popovers, and elevated surfaces — one tone lighter than canvas.
- **Panel-muted (`#ebebeb` light / `#1f1f1f` dark):** subtle surfaces and hover states for interactive panel elements.
- **Foreground (`#0a0a0a` light / `#f5f5f5` dark):** default body text. `fg-muted` drops to secondary copy, `fg-subtle` to placeholders and disabled.
- **Intent (`#0a0a0a` light / `#f5f5f5` dark):** the single action colour. In a monochrome system `intent` intentionally equals `fg` — primary actions read as high-contrast rectangles, not as brand-coloured buttons. Pair with `fg-on-intent` (inverse) for label text.
- **Stroke (`#d7d7d7` light / `#2a2a2a` dark):** default hairline borders; `stroke-strong` for emphasized dividers.
- **Status:** `error` (red 600) and `success` (green 600) are the only hue accents permitted, used strictly for state messaging.

**Dark mode** is toggled by `[data-theme="dark"]` on any ancestor. Nested `[data-theme="light"]` forces a light island back inside a dark parent. There is no `prefers-color-scheme` fallback by design — the theme is whichever the site sets.

## Typography

Three families, strictly allocated:

- **Archivo Variable** — every heading level (`h1`–`h6`). Weight 400 with tight negative tracking at display sizes (`-0.045em` at h1) tightens up to near-neutral (`0em`) by h5. Line-height compresses from 0.95 at h1 to 1.4 at h6 so dense headings stay legible.
- **Inter** — body copy at every size (`body-xl` → `body-xsm`). Neutral geometric sans; chosen for long-form readability against headings with stronger personality.
- **JetBrains Mono** — technical data only: code, keyboard shortcuts, timestamps, metric values.

**Fluid scale.** Typography sizes listed in the front matter are the **maximum (desktop) values** at a 90 rem container. At runtime each heading and body size is a `clamp()` interpolating between a minimum (20 rem container) and the listed maximum, driven by `cqi` (container-query inline-size). Drop `container-type: inline-size` (or the `cq` utility) onto any wrapper to re-anchor the scale to that wrapper instead of the document body — cards, sidebars, and modals shrink their type automatically.

## Layout & Spacing

A centred 90 rem max-width grid (`container-max`) with horizontal gutters living on the `<section>` — not the container — so the gutter can vary per section while the content column remains clean. A four-pixel base unit governs all spacing; semantic handles (`section-xs` → `section-xl`) encode the vertical rhythm between page regions so layouts compose at the section level, not the element level.

- **Rhythm:** 4 px base; most component internal spacing lands on 4 / 8 / 12 / 16 / 24 px.
- **Section rhythm:** vertical-only. Horizontal breathing room is handled by a separate `section-gutter` utility (`px-4 md:px-12 lg:px-24`).
- **Decorative gutter:** diagonal repeating-linear-gradient stripes appear in the gutter columns of specific sections via a `section-pattern` utility. The stripe colour (`--pattern-stripe`) flips per theme so the pattern stays visible in both.

## Elevation & Depth

Depth is **tonal**, not shadowed. A panel sits above canvas because its background is one tone lighter (light mode) or darker (dark mode), not because a drop shadow separates them. Three hierarchy levels:

- **Level 0 — Canvas:** page background.
- **Level 1 — Panel:** default card surface; one tone offset from canvas.
- **Level 2 — Floating (popover, header on scroll):** panel surface with a layered shadow (`--shadow-popover`) combining a tight 1 px contact shadow, a mid-range 24 px diffusion, and a 48 px ambient blur. Shadow opacity increases in dark mode (contact rises from 4 % to 40 %) to remain visible against a dark canvas.

Hairline borders (`1px solid var(--color-stroke)`) carry separation where tonal layering alone is insufficient — e.g. between a panel and its inset controls.

## Shapes

**This build does not use rounded corners.** Every surface — cards, popovers, inputs, buttons, tags, code blocks, tooltips, pagination items — is a sharp rectangle (`border-radius: 0`). Pills, the bespoke `card` radius, and any `rounded-*` Tailwind utility are off the table for this project. The reasoning is editorial: corner softening reads as decorative warmth, and this brand is engineering-forward and precise — sharp rectangles match the typography's tight tracking and the monochrome palette's directness.

If a component definition or a doc preview uses `rounded-md`, `rounded-card`, `rounded-pill`, or sets `border-radius` in a `<style>` block, it should be removed before merge. The token values defined in `global.css` (`--radius-card`, `--radius-pill`) remain in the design system as historical defaults but are not consumed.

Decorative corner accents — 6 × 6 px L-shaped hairlines anchored to `[data-accent="tl|tr|bl|br"]` — mark high-priority sections (hero boundaries, featured cards). They inherit colour from `--accent-line`, which has its own light/dark override.

## Components

- **Button** — three variants: `primary` (filled intent, inverse label), `secondary` (transparent with stroke border), `tertiary` (transparent, no border). All share a 40 px height, 16 px horizontal padding, body-sm label, and a focus-visible ring (`ring-focus` with `ring-offset-canvas`) that remains visible in both themes. Primary includes a sliding arrow affordance that cross-fades in/out over 300 ms and degrades to a static icon under `prefers-reduced-motion`.
- **Card (featured / panel)** — card radius, 24 px internal padding, optional `data-accent` corner markers. Use `card-panel` for default elevation and `card-panel-muted` for inline / sidebar contexts where the card should recede.
- **Nav (pill)** — a horizontally-centred pill-rounded panel with layered popover shadow. Morphs between a compact state and an expanded mega-menu via `NavMorph`; transitions must respect reduced-motion.
- **Input field** — 40 px height, 12 px horizontal padding, panel surface with stroke border. Error state swaps the border to `error`; helper / error messaging sits below in `body-xsm`.
- **Accordion, Tabs, FilterBar, LogoMarquee, FlowSteps** — implemented against the same token set; keyboard interactions follow WAI-ARIA Authoring Practices (Enter/Space to activate, Escape to dismiss, Arrow keys for lists and tab rows). `FlowSteps` is a stepped "how it works" layout with a vertical-carousel panel on desktop that flattens to a stacked walkthrough on mobile.

## Do's and Don'ts

- **Do** reference semantic colour roles (`bg-canvas`, `text-fg`, `border-stroke`) in component styles. Dark mode then "just works" through the cascade.
- **Don't** hard-code neutrals (`bg-neutral-50`, `text-black`) in components. The raw scale exists for one-off decorative use — reaching for it inside a reusable component breaks themeability.
- **Do** author typography at the scale name (`text-h2`, `text-body-lg`). Let the fluid clamp do the work.
- **Don't** set fixed `font-size` in utility classes — it bypasses the container-query scaling and produces inconsistent rhythm between a card-scoped context and a page-scoped context.
- **Do** include `focus-visible:ring-2 ring-focus ring-offset-canvas` on every interactive atom. The focus colour is theme-aware by construction.
- **Don't** ship a component without the accessibility pattern from `CLAUDE.md`: semantic element first, `aria-label` on unlabelled controls, `aria-expanded` / `aria-controls` on toggles, keyboard handlers, `motion-reduce:` fallbacks.
- **Do** use `intent` for exactly one primary action per screen. In a monochrome palette a second filled-black button reads as a duplicate, not a hierarchy.
- **Don't** introduce a new hue without a semantic reason. `error` and `success` are the only permitted accent hues; everything else belongs to the neutral family.
- **Do** re-anchor fluid type by dropping `container-type: inline-size` on a wrapper when a component renders inside a narrow column.
- **Don't** rely on `prefers-color-scheme` for dark mode — the site's theme is explicit via `data-theme`, and mixing the two mechanisms leads to FOUC.
