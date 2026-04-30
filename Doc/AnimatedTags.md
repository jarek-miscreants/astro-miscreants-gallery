# AnimatedTags

**File:** `src/components/AnimatedTags.astro`

## What it does

A radio group of icon-only "tag" pills where the selected one expands with a bouncy spring animation to show its label, and the others collapse back to icon-only. Modeled on a React + Framer Motion source but rebuilt in Astro with **zero JavaScript** — it relies on native `<input type="radio">` for state, `:has(input:checked)` for styling, and the `grid-template-columns: 0fr → 1fr` trick for the width animation.

## Why no JS

| Concern              | React + Framer Motion       | Native + CSS                                                |
|----------------------|-----------------------------|-------------------------------------------------------------|
| Selection state      | `useState`                  | `<input type="radio">`                                      |
| Keyboard nav         | Manual key handlers         | Free — arrow keys move between radios in the same group     |
| Form integration     | Custom serialization        | Submits as a normal radio under the configured `name`        |
| Layout animation     | Framer Motion `layout` prop | `grid-template-columns: 0fr → 1fr` + spring `linear()` curve |
| Bundle cost          | ~70kb min+gz (Motion + React) | 0 deps; ~50 lines of CSS                                  |

## Props

| Prop        | Type      | Default                       | Description                                                       |
|-------------|-----------|-------------------------------|-------------------------------------------------------------------|
| `items`     | `Item[]`  | (required)                    | Array of `{ value, label, icon? }` — one per radio                |
| `name`      | `string`  | random `tags-xxxxx`           | Form field name. Must be unique per group on the page             |
| `value`     | `string`  | first item's value            | Initial selected value                                            |
| `ariaLabel` | `string`  | `"Select an option"`          | Accessible name for the `<div role="radiogroup">` wrapper         |
| `class`     | `string`  | `""`                          | Extra classes on the root                                         |

`Item` shape:

```ts
type Item = {
  value: string;
  label: string;
  icon?: string;       // optional lucide name (e.g. "lucide:rabbit")
};
```

## Usage

```astro
---
import AnimatedTags from "@components/AnimatedTags.astro";
---

<AnimatedTags
  name="style"
  value="random"
  ariaLabel="Choose a style"
  items={[
    { value: "cartoon",    label: "Cartoon",    icon: "lucide:rabbit" },
    { value: "pixel",      label: "Pixel",      icon: "lucide:layout-grid" },
    { value: "watercolor", label: "Watercolor", icon: "lucide:brush" },
    { value: "random",     label: "Random",     icon: "lucide:sparkles" },
  ]}
/>
```

Drop inside a `<form>` and submit — the selected `value` posts under `name="style"` like any radio group.

## Mechanism

### Selection via native radios + `:has()`

Every item is wrapped in a `<label>` containing a visually-hidden `<input type="radio">` (with `sr-only`) and the visible pill. Sharing a `name` makes them an exclusive group, so:

- Native arrow-key navigation works (Up/Down or Left/Right move selection).
- Tab focus lands on the group; Space selects.
- The label's `:has(input:checked)` selector flips the pill's color, background, expanded label, and `margin-inline-start` simultaneously.

### Width animation via `grid-template-columns`

The label text wrapper is a 1-column grid. Animating `grid-template-columns` between `minmax(0, 0fr)` and `minmax(0, 1fr)` interpolates between "no track" and "auto-sized track" — the standard CSS trick for animating to intrinsic width without measuring.

`minmax(0, …)` is required so the track can actually collapse below min-content. Without it, `white-space: nowrap` text would force the track open even at 0fr.

### The bouncy spring

A long `linear()` easing function with values that overshoot 1.0 — matching the `visualDuration: 0.3, bounce: 0.3` from the Framer Motion source. `cubic-bezier()` can't express this curve because it can't go above 1.0.

```css
--spring: linear(
  0 0%, 0.2178 4.71%, 0.4571 9.49%, 0.6794 14.66%, 0.8675 20.27%,
  1.0185 26.39%, 1.1313 33.18%, 1.2069 40.78%, 1.2402 48.71%,
  1.2375 53.31%, 1.2148 57.51%, 1.0885 70.65%, 1.0245 79.14%,
  0.9854 87.7%, 0.9758 92.6%, 0.9778 97.06%, 1 100%
);
```

The color/background transitions use a separate plain `ease` so they don't bounce alongside the layout shift.

### No flex `gap`

The pill is `display: flex` with `padding-inline: 1rem` but no flex `gap`. Flex gap reserves space between items even when one has 0 width, which leaked an 8px phantom margin next to the icon on inactive pills. Instead, the gap is implemented as `margin-inline-start` on the label, animated in lockstep with `grid-template-columns` — so it appears only when the text does.

## A11y

- Wrapper: `role="radiogroup"` with `aria-label`.
- Each input is real `<input type="radio">` — keyboard nav, focus, and form behavior all native.
- Inputs are visually hidden (`sr-only`) but still focusable; the visible pill receives the focus ring via `:has(input:focus-visible)`.
- Icons are `aria-hidden="true"`; the label text is the accessible name.
- `prefers-reduced-motion: reduce` disables the transitions; the visual state still flips correctly, just instantly.

## Tokens

- Inactive tag: `text-fg-subtle` on `bg-panel-muted`.
- Hover (inactive): `text-fg`.
- Active tag: `text-canvas` on `bg-intent`.
- Focus ring: `outline: 2px solid var(--color-focus)`, offset by 2px.

## Gotchas

1. **`name` must be unique per group on the same page.** Two `AnimatedTags` instances with the same `name` would treat their inputs as a single radio group. The default randomly-generated name avoids this.
2. **`:has()` browser support.** Chrome 105+, Safari 15.4+, Firefox 121+. Without it, the active-state styling won't apply — pills will all look inactive. Acceptable graceful degradation for most production sites; if you need older support, you'd need a JS shim.
3. **Long labels.** The pill expands to its label's intrinsic width plus padding. Very long labels can force the row to wrap or push siblings off-screen. Cap label length or constrain the parent's flex behavior.
4. **`gap-3` on the wrapper.** Items are spaced via flex `gap` on the root `.animated-tags` element (between pills, not within). Tweak via the `class` prop if you want tighter or looser spacing.
