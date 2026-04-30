# Grid

**File:** `src/components/Grid.astro`

## What it does

A thin wrapper around CSS grid that exposes breakpoint counts as semantic prop names instead of Tailwind's raw `sm:` / `md:` / `lg:` prefixes. The breakpoint API matches `SliderBasic` — `mobile / mobileLandscape / tablet / desktop` — so the same mental model works whether you're laying out a static grid or a horizontal scroller.

## Props

| Prop              | Type                  | Default     | Description                                                       |
|-------------------|-----------------------|-------------|-------------------------------------------------------------------|
| `mobile`          | `1 \| 2 … \| 12`       | `1`         | Columns at the base breakpoint (always applies)                  |
| `mobileLandscape` | `1 \| 2 … \| 12`       | —           | Columns at the `sm` breakpoint (640px+). Skip to inherit          |
| `tablet`          | `1 \| 2 … \| 12`       | —           | Columns at the `md` breakpoint (768px+)                           |
| `desktop`         | `1 \| 2 … \| 12`       | —           | Columns at the `lg` breakpoint (1024px+)                          |
| `gap`             | `string`              | `"gap-6"`   | Tailwind gap utility — `gap-2`, `gap-4`, `gap-x-6`, `gap-px`      |
| `class`           | `string`              | `""`        | Extra classes on the grid container                               |

## Usage

```astro
---
import Grid from "@components/Grid.astro";
import CardFeatured from "@components/CardFeatured.astro";
---

<!-- 3-column on desktop, 2 on tablet, 1 on mobile -->
<Grid mobile={1} tablet={2} desktop={3} gap="gap-4">
  <CardFeatured title="One" />
  <CardFeatured title="Two" />
  <CardFeatured title="Three" />
</Grid>

<!-- With alignment overrides -->
<Grid mobile={1} tablet={3} class="items-center justify-items-stretch py-8">
  …
</Grid>
```

## Why use this instead of writing `<div class="grid grid-cols-...">`

- **Named breakpoints read better.** `<Grid tablet={2} desktop={3}>` describes intent. `md:grid-cols-2 lg:grid-cols-3` is the same shape but you have to mentally translate `md:` → "tablet" each time.
- **Shared vocabulary.** `Grid` and `SliderBasic` use identical breakpoint names — `mobile / mobileLandscape / tablet / desktop`. Sticking to that across the project keeps the mental model uniform.

For exotic layouts (auto-fit, named grid areas, span tricks), drop down to raw `grid` utilities. The component is for the common case of "N equal columns at each breakpoint."

## Mechanism

The prop values map to Tailwind utility names via lookup tables:

```ts
const base: Record<Cols, string> = { 1: "grid-cols-1", 2: "grid-cols-2", … };
const md:   Record<Cols, string> = { 1: "md:grid-cols-1", 2: "md:grid-cols-2", … };
```

Assembled via `class:list` so falsy props (skipped breakpoints) drop out automatically. The lookup tables are required — Tailwind's content scanner only generates utilities it sees literally, so building class names dynamically with template strings (`` `md:grid-cols-${n}` ``) would emit nothing.

## Gotchas

1. **Breakpoint inheritance is `sm < md < lg`, not "skip and interpolate."** If you set `mobile={1}` and `desktop={3}` but skip `tablet`, the tablet view inherits from the previous defined breakpoint. CSS doesn't interpolate column counts.
2. **Max 12 columns.** The tables go up to 12 because that's where Tailwind's `grid-cols-*` defaults stop. Extend the tables in `Grid.astro` if you need more.
3. **`gap` is a string, not an enum.** Intentional — accepts any Tailwind gap utility — but no autocomplete, and a typo silently produces no gap.
4. **Don't override structural props via `class`.** `<Grid gap="gap-12" class="gap-2" />` — Tailwind specificity is flat, last-emitted wins, hard to reason about. Use the typed `gap` prop for what the component already exposes.
