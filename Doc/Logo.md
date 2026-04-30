# Logo

**File:** `src/components/Logo.astro`

## What it does

Renders the "Miscreants" SVG wordmark. Uses `currentColor` for all paths so the logo color is controlled by the parent's `text-*` class.

## Props

| Prop    | Type     | Default | Description                          |
|---------|----------|---------|--------------------------------------|
| `class` | `string` | `""`    | Classes applied to the `<svg>` element |

## How it works

- The SVG has `width="100%"` and a fixed `viewBox="0 0 370 57"`, so it scales to fill its container width while maintaining aspect ratio.
- All 13 paths use `fill="currentColor"` — set the color via Tailwind text utilities on the parent or the `class` prop.
- `aria-label="Miscreants"` and `role="img"` make it accessible as an image.

## Usage

```astro
---
import Logo from "../components/Logo.astro";
---

<!-- Sized via class -->
<Logo class="h-5 w-auto" />

<!-- Inherits parent color -->
<div class="text-white">
  <Logo class="h-8 w-auto" />
</div>
```

## Notes

- Use `h-*` + `w-auto` to control size (since `width="100%"` will fill the parent otherwise).
- The SVG includes the registered trademark circle as part of the paths.
