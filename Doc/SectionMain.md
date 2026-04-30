# SectionMain

**File:** `src/components/SectionMain.astro`

## What it does

A page section wrapper that provides the site's standard layout grid — a centered content column flanked by decorative pattern gutters with grid borders.

## Props

| Prop             | Type                                        | Default     | Description                                    |
|------------------|---------------------------------------------|-------------|------------------------------------------------|
| `id`             | `string`                                    | —           | HTML `id` for anchor linking                   |
| `padding`        | `"none" \| "xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"`  | Vertical padding preset                        |
| `contentPadding` | `"none" \| "default"`                       | `"default"` | Horizontal padding inside the content column   |
| `contentClass`   | `string`                                    | `""`        | Additional classes on the content column        |
| `borderTop`      | `boolean`                                   | `false`     | Add a top border to the section                |

## How it works

### Grid structure

Uses `section-grid-outside` — a 5-column CSS grid:

```
[gutter-left] [pattern-left] [content (90rem max)] [pattern-right] [gutter-right]
```

- **Column 2 & 4** (pattern columns): Get `section-pattern` (diagonal stripes) and `border-x` for vertical grid lines. Marked `aria-hidden="true"`.
- **Column 3** (content): Receives the vertical padding and holds the `<slot />`.

### Padding map

The `padding` prop maps to utilities defined in `global.css`:

| Value  | Utility               | Result   |
|--------|-----------------------|----------|
| `none` | (none)                | No padding |
| `xs`   | `section-padding-xs`  | `py-12`  |
| `sm`   | `section-padding-sm`  | `py-16`  |
| `md`   | `section-padding`     | `py-24`  |
| `lg`   | `section-padding-lg`  | `py-32`  |
| `xl`   | `section-padding-xl`  | `py-48`  |

These presets now resolve to the same value at every breakpoint — no `md:`-prefix increase. Use `paddingTop` / `paddingBottom` if you need asymmetric vertical rhythm.

## Usage

```astro
---
import SectionMain from "../components/SectionMain.astro";
---

<!-- Standard section -->
<SectionMain>
  <h2 class="h2">Features</h2>
  <p>Content goes here</p>
</SectionMain>

<!-- Tight section with top border, no content padding -->
<SectionMain padding="xs" contentPadding="none" borderTop={true}>
  <div class="grid grid-cols-3">...</div>
</SectionMain>

<!-- Section with anchor link target -->
<SectionMain id="pricing" padding="lg">
  <h2 class="h2">Pricing</h2>
</SectionMain>
```

## Notes

- This is the primary building block for page layout. Most sections on the page should be wrapped in this component.
- The pattern gutters are purely decorative — they create the "blueprint" aesthetic with diagonal stripes and vertical borders.
- `contentClass` lets you add things like `items-center` to the flex column without overriding the base layout classes.
