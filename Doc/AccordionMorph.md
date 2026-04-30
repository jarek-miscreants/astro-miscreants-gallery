# AccordionMorph

**File:** `src/components/AccordionMorph.astro`
**Sibling:** [`Accordion`](./Accordion.md), [`AccordionFAQ`](./AccordionFAQ.md) — flatter, click-to-expand variants without the morph animation.

## What it does

An accordion built on native `<details>` / `<summary>` elements with a "morph" animation: the open row gets full border-radius, neighbors peel away with a bouncy spring, and the panel content fades + translates + un-blurs in. Mutually-exclusive open behavior comes from the platform itself — modern browsers treat `<details>` elements that share the same `name` attribute as a single exclusive group.

Use this when you have an FAQ-style list where one item should be open at a time and you want a polished open/close animation.

## Why native `<details>`

| Concern                | Custom `<button>` accordion | Native `<details>`               |
|------------------------|-----------------------------|----------------------------------|
| Keyboard / focus / SR  | Re-implemented in JS        | Free from the platform           |
| Exclusive open         | JS state machine            | `name="..."` shared across items |
| Initial-open SSR       | Manual `aria-expanded`      | `<details open>` works pre-JS    |
| Height animation       | grid-rows trick or JS       | `::details-content` + interpolate-size |
| Bundle cost            | ~150 lines                  | ~30 lines                        |

## Props

| Prop            | Type           | Default                       | Description                                                                  |
|-----------------|----------------|-------------------------------|------------------------------------------------------------------------------|
| `items`         | `Item[]`       | (required)                    | Array of `{ title, description, icon? }`                                     |
| `name`          | `string`       | random `morph-xxxxx`           | Exclusive group name. All items in the same instance share it                |
| `allowMultiple` | `boolean`      | `false`                       | When `true`, drops the `name` so multiple rows can be open at once           |
| `openIndex`     | `number`       | —                             | Index of the row that should be open initially (0-based)                      |
| `ariaLabel`     | `string`       | —                             | If set, wraps the component in `role="region"` with this label               |
| `class`         | `string`       | `""`                          | Extra classes on the root (`.morphing-disclosure`)                           |

### `Item` shape

```ts
type Item = {
  title: string;
  description: string;
  icon?: string;        // optional lucide name (e.g. "lucide:wrench")
};
```

## Usage

```astro
---
import AccordionMorph from "../components/AccordionMorph.astro";
---

<AccordionMorph
  ariaLabel="Frequently asked questions"
  openIndex={0}
  items={[
    { icon: "lucide:wrench",   title: "What is design engineering?", description: "Where design intuition meets code execution — enabling you to see UI problems and build solutions from the ground up." },
    { icon: "lucide:puzzle",   title: "What is the craft of UI?",    description: "A course about building things well — mastering the web platform so you're not limited by tools or libraries." },
    { icon: "lucide:globe",    title: "Why focus on the web platform?", description: "Because when you work with the web — not fight it — you unlock performance, accessibility, and durability that last." },
    { icon: "lucide:sparkles", title: "Why does craft matter?",      description: "Because it's more than making something work — it's making something feel right: inclusive, resilient, and scalable." },
    { icon: "lucide:users",    title: "Who is this for?",            description: "Designers who code, developers who design — anyone ready to stop chasing snippets and become the person who can build anything." },
  ]}
/>
```

### Allowing multiple open

```astro
<AccordionMorph allowMultiple items={[...]} />
```

When `allowMultiple` is `true`, the component omits the `name` attribute on each `<details>`, so the browser doesn't enforce exclusive open. Each row toggles independently.

### Width

The component is `width: 100%` and fills its parent. Wrap it for a sensible reading width:

```astro
<div class="max-w-md">
  <AccordionMorph items={[...]} />
</div>

<!-- or pass width directly via the class prop -->
<AccordionMorph class="max-w-2xl mx-auto" items={[...]} />
```

`max-w-md` (28rem) is a comfortable FAQ default. `max-w-prose` (~65ch) reads well for body-style content.

## Mechanism

### 1. Exclusive open via `name`

Modern browsers (Chrome 120+, Safari 17.4+, Firefox 124+) implement the [exclusive accordion](https://html.spec.whatwg.org/multipage/interactive-elements.html#dom-details-name) behavior: when multiple `<details>` elements share a `name` attribute, opening one automatically closes the others. The component generates a unique random `name` per instance so multiple `AccordionMorph`s on the same page don't interfere.

### 2. Height animation via `::details-content`

CSS animates `height: 0` → `auto` directly on the `::details-content` pseudo-element using `interpolate-size: allow-keywords`. This gives a true natural-height open/close transition — no JS measurement needed on the happy path.

```css
.morphing-disclosure details::details-content {
  height: 0;
  transition-property: content-visibility, height;
  transition-behavior: allow-discrete;
  transition-duration: var(--bounce-duration);
  transition-timing-function: var(--bounce);
}
.morphing-disclosure details, .morphing-disclosure details::details-content {
  interpolate-size: allow-keywords;
}
@supports (interpolate-size: allow-keywords) {
  .morphing-disclosure details[open]::details-content { height: auto; }
}
```

For older browsers (Safari ≤17, Firefox ≤140), a small inline script measures each row's content height once on load and stashes it as `--content-height`. The CSS rule falls back to that value when `interpolate-size` isn't supported.

### 3. The bouncy spring

The height transition uses a long `linear()` easing function that overshoots 1.0, giving a spring-like settle:

```css
--bounce: linear(
  0 0%, 0.5571 7.53%, 0.8252 11.98%, 0.9337 14.38%, 1.0166 16.8%,
  1.0765 19.31%, 1.1146 21.97%, 1.1263 23.47%, 1.1325 25.06%,
  1.133 26.76%, 1.128 28.62%, 1.1094 31.9%, 1.0484 39.77%,
  1.0218 43.85%, 1.0011 48.42%, 0.9895 53.23%, 0.9861 59.8%,
  1 81.27% 100%
);
```

Don't replace with `cubic-bezier()` — the overshoot above 1.0 isn't expressible there. The other transitions (border-radius, margins, content fade) use a separate non-overshooting `--ease` curve so they don't bounce.

### 4. The "morph" effect

Three things happen when a row opens:

- **Open row** gets `border-radius: var(--radius)` on all four corners + a `margin-block: var(--translate-margin)` breathing gap.
- **Neighbors** of the open row get their adjacent corners rounded too — so the gap looks like the box "released" them.
- **Cascading translate** moves rows above the open one up by `-var(--translate-margin)` and rows below down by `+var(--translate-margin)`. Combined with the open row's own margin, this creates the gap visually rather than just appearing.

```css
/* Above-the-open siblings pull up */
.morphing-disclosure details:has(~ details[open]) {
  translate: 0 calc(var(--translate-margin) * -1);
}
/* Below-the-open siblings push down */
.morphing-disclosure details[open] ~ details {
  translate: 0 var(--translate-margin);
}
```

### 5. Border-top trick

Default border pattern: each row has `border-block-end` only; its top edge is "drawn" by the previous sibling's bottom border. This collapses adjacent borders without doubling.

When the breathing margin opens, two rows lose their top edge: the open row itself and the row immediately after it. Both get an explicit `border-block-start` to restore the missing line:

```css
.morphing-disclosure details[open] {
  border-block-start: 1px solid var(--color-stroke);
}
.morphing-disclosure details[open] + details {
  border-block-start: 1px solid var(--color-stroke);
}
```

## Tunables

The component exposes a handful of CSS custom properties on the root. Override them via the `class` prop or wrap the component in a parent that sets them.

| Variable                  | Default     | Effect                                                |
|---------------------------|-------------|-------------------------------------------------------|
| `--duration`              | `0.26s`     | Border-radius, margins, content-fade transition time  |
| `--bounce-duration`       | `1s`        | Height transition time (uses the bouncy curve)        |
| `--content-blur`          | `4px`       | Blur applied to closed-state content                  |
| `--content-translate-y`   | `0.5rem`    | Y offset applied to closed-state content              |
| `--content-opacity`       | `0.4`       | Opacity applied to closed-state content               |
| `--translate-margin`      | `0.75rem`   | Breathing gap above/below the open row                 |
| `--radius`                | `0.5rem`    | Corner radius on the open row + first/last rows       |

## A11y

- Uses native `<details>` / `<summary>` — keyboard, focus, and screen-reader semantics are free from the platform.
- The trailing `lucide:plus` icon rotates 45° to become an `×` when open. Marked `aria-hidden="true"` since it's decorative.
- Item icons (when provided) are `aria-hidden="true"` — labels are read directly.
- When `ariaLabel` is set, the wrapper becomes `role="region"` with that label, giving screen readers a navigable landmark.
- Respects `prefers-reduced-motion: reduce` — all transitions disabled, content rendered in its final state.

## Tokens

- Row background: `var(--color-canvas)`. Hover: `var(--color-panel-muted)`.
- Border: `var(--color-stroke)` (1px), matching every other component in the starter.
- Title text: `var(--color-fg)`. Description and icons: `var(--color-fg-muted)`.
- Focus ring: `var(--color-focus)` via `outline` (inset by 2px so it doesn't clip across the rounded corners).

## Gotchas

1. **`interpolate-size` is recent.** Chrome 129+ and Edge 129+ support it natively. Older Safari and Firefox use the JS height-measurement fallback — heights are measured once on page load. If you swap content dynamically, re-trigger the measurement or update `--content-height` manually.
2. **`name` attribute uniqueness.** The component generates a random `name` per instance, but two server-rendered instances on the same page could theoretically collide — `Math.random()` runs at build time, but the chance is tiny. Pass `name="..."` explicitly if you have many instances and want determinism.
3. **`allowMultiple` drops the exclusive behavior entirely.** There's no middle ground (e.g. "max 2 open at once") — that's a custom JS state machine. The native primitive is one-of-many or all-of-many.
4. **Long content + the bounce.** The bouncy spring overshoots ~13% past target before settling. With very long content the visual "snap" can feel heavy. Tune `--bounce-duration` down (e.g. 0.6s) if your panels are tall.
