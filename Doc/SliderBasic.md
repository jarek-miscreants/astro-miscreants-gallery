# SliderBasic

**File:** `src/components/SliderBasic.astro`
**Sibling:** [`SliderBasicMap`](./SliderBasicMap.md) — convenience wrapper that maps an array of items into default `CardFeatured` slides.

## What it does

A horizontal carousel that uses **native CSS scroll-snap** for the actual scrolling — touch swipe, trackpad inertia, and momentum are all handled by the browser. JavaScript is only used for the prev/next buttons, pagination dots, keyboard nav, optional mouse drag, and ARIA bookkeeping. No Swiper, no Embla, no extra dependency.

## Why scroll-snap and not Swiper

| Concern                  | Swiper                          | SliderBasic (scroll-snap)          |
|--------------------------|---------------------------------|------------------------------------|
| Bundle cost              | ~30kb min+gz                    | 0 deps; ~1.5kb of inline script    |
| Touch / trackpad inertia | JS-simulated                    | Native, hardware-accelerated       |
| Lazy-load images         | Manual hooks                    | Just works — slides are real DOM   |
| Virtual slides           | ✅ (good for 1000+ slides)      | ❌                                 |
| Free-mode physics        | ✅                              | ❌                                 |
| Parallax / 3D effects    | ✅                              | ❌                                 |

Use Swiper if you need virtual slides, free-mode physics, or 3D effects. For everything else, scroll-snap is lighter, faster, and more accessible.

## Props

| Prop              | Type                                     | Default     | Description                                                |
|-------------------|------------------------------------------|-------------|------------------------------------------------------------|
| `id`              | `string`                                 | —           | Optional ID on the root                                    |
| `ariaLabel`       | `string`                                 | `"Slider"`  | Used in `aria-label`s and the live region                  |
| `mobile`          | `1 \| 2 \| 3 \| 4 \| 5 \| 6`             | `1`         | Slides visible on the base breakpoint (always applies)     |
| `mobileLandscape` | `1 \| 2 \| 3 \| 4 \| 5 \| 6`             | —           | Slides visible at `sm` (640px+)                            |
| `tablet`          | `1 \| 2 \| 3 \| 4 \| 5 \| 6`             | —           | Slides visible at `md` (768px+)                            |
| `desktop`         | `1 \| 2 \| 3 \| 4 \| 5 \| 6`             | —           | Slides visible at `lg` (1024px+)                           |
| `gap`             | `"none" \| "sm" \| "md" \| "lg"`         | `"md"`      | Space between slides (0, 0.5rem, 1rem, 1.5rem)             |
| `showArrows`      | `boolean`                                | `true`      | Render prev/next buttons below the track                   |
| `showDots`        | `boolean`                                | `true`      | Render pagination dots below the track                     |
| `draggable`       | `boolean`                                | `true`      | Enable mouse click-and-drag on desktop (touch is always on) |
| `class`           | `string`                                 | `""`        | Extra classes on the root                                  |

The breakpoint API mirrors [`Grid`](./Grid.md): `mobile` / `mobileLandscape` / `tablet` / `desktop`.

## Usage

### Manual children

Each direct child of `SliderBasic` becomes a slide automatically — no wrapper element required.

```astro
---
import SliderBasic from "../components/SliderBasic.astro";
import CardFeatured from "../components/CardFeatured.astro";
import { Icon } from "astro-icon/components";
---

<SliderBasic mobile={1} mobileLandscape={2} tablet={2} desktop={3} gap="md" ariaLabel="Featured cards">
  <CardFeatured title="Slide one" description="…" class="bg-canvas">
    <span slot="eyebrow">Performance</span>
  </CardFeatured>
  <CardFeatured title="Slide two" description="…" class="bg-canvas">
    <span slot="eyebrow">Accessibility</span>
  </CardFeatured>
  <CardFeatured title="Slide three" description="…" class="bg-canvas" />
</SliderBasic>
```

### Mapped from data

For collection-driven sliders, see [`SliderBasicMap`](./SliderBasicMap.md), which forwards every prop here and adds `items={[]}` plus default-card rendering.

## Equal heights

The track sets `align-items: stretch`, so every slide matches the tallest one's height — but only if you **don't** add `h-full` to the slide root. `height: 100%` on a flex item with an indefinite parent height resolves to `auto` and overrides the stretch.

```astro
<!-- ✅ Equal heights — let flex stretch do the work -->
<CardFeatured class="bg-canvas" ... />

<!-- ❌ h-full breaks the stretch on indefinite parents -->
<CardFeatured class="bg-canvas h-full" ... />
```

To align content **inside** a card (e.g. push a button to the bottom), use `flex flex-col` on the card body and `mt-auto` on the pinned element.

## Mouse drag (desktop)

Enabled by default via `draggable={true}`. The handler:

1. On `pointerdown` (mouse only), records `scrollLeft` and adds `is-dragging` to the track.
2. The `is-dragging` class disables `scroll-snap-type` mid-drag and switches the cursor to `grabbing`.
3. On `pointermove`, writes `scrollLeft = startScroll - dx` directly — no JS animation needed.
4. On `pointerup` (or cancel/leave), removes the class. Snap re-engages and the browser settles to the nearest slide using its native easing.
5. A capture-phase `click` handler suppresses link/button activation if the gesture moved more than 4px (so users don't accidentally navigate when they drag past a card link).

Touch devices keep using native scroll regardless of `draggable` — the early-out checks `e.pointerType !== "mouse"`.

Disable per instance:

```astro
<SliderBasic draggable={false} ... />
```

## Keyboard

Focus the track (it's `tabindex="0"`), then:

- `←` / `→`: previous / next slide
- `Home`: first slide
- `End`: last slide

Keyboard events scroll the same way the buttons do — no separate code path.

## A11y

- Root: `role="region"`, `aria-roledescription="carousel"`, `aria-label`.
- Each slide gets `role="group"`, `aria-roledescription="slide"`, `aria-label="N of total"`.
- Pagination dots are `role="tablist"` with `role="tab"` children carrying `aria-selected`.
- A visually hidden live region (`aria-live="polite"`) announces the current slide as the user scrolls.
- The track is keyboard-focusable with a visible focus ring.
- Respects `prefers-reduced-motion: reduce` — `scroll-behavior` falls back to `auto`.

## Mechanism

### Slide widths via CSS variables

Per-view counts are written as CSS vars (`--per-view`, `--per-view-sm`, `--per-view-md`, `--per-view-lg`) on the root. A single `calc()` in the global stylesheet derives slide width from the active var:

```css
[data-slider-track] > * {
  flex: 0 0 calc(
    (100% - (var(--per-view) - 1) * var(--slider-gap, 1rem)) / var(--per-view)
  );
}
```

This means N slides + (N-1) gaps fit exactly in the viewport at any breakpoint, with no class-name explosion.

### Why `<style is:global>`

The track's child selector (`[data-slider-track] > *`) needs to match elements rendered by other components (e.g. `CardFeatured`). Astro's default scoped CSS would only match elements with the same scope hash as the slider, so children from other components would be skipped. `is:global` bypasses scoping — the selectors are tight enough (`[data-slider-track]`) that this isn't a leak risk.

### Active slide tracking

A scroll listener computes which slide's left edge is closest to the track's left edge, then updates dot state, prev/next disabled state, and the live region — all rAF-throttled so fast swipes don't thrash.

## Gotchas

1. **Don't put `h-full` on slides.** It breaks flex `align-items: stretch`. See [Equal heights](#equal-heights).
2. **The track must be `position: relative`** for `slide.offsetLeft` math to be reliable. Already wired into the component — don't remove it if you ever rework the markup.
3. **`is:global` styles are global.** All selectors are namespaced under `[data-slider]` / `[data-slider-track]`, but be aware: tweaking these in one project affects every slider on the page.
