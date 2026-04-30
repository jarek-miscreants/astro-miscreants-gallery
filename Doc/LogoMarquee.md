# LogoMarquee

**File:** `src/components/LogoMarquee.astro`

## What it does

An infinitely scrolling horizontal marquee of logos (or any content). Includes a "Trusted by" label centered above the marquee.

## Props

| Prop    | Type     | Default | Description                             |
|---------|----------|---------|-----------------------------------------|
| `class` | `string` | `""`    | Additional classes on the overflow container |

## How it works

- The outer container has `overflow-hidden` to clip content at the edges.
- Inside, a flex container uses the `animate-marquee` utility (defined in `global.css`) which runs a `translateX(0)` to `translateX(-50%)` animation over 30 seconds.
- The `<slot />` is rendered **twice** — this creates a seamless loop. When the first set scrolls out of view, the duplicate set has already taken its place.
- A "Trusted by leading data companies" label is absolutely positioned above the marquee.

## Usage

```astro
---
import LogoMarquee from "../components/LogoMarquee.astro";
import Logo from "../components/Logo.astro";
---

<LogoMarquee class="border-t border-stroke py-6">
  <img src="/logos/company-1.svg" alt="Company 1" class="h-6 w-auto" />
  <img src="/logos/company-2.svg" alt="Company 2" class="h-6 w-auto" />
  <img src="/logos/company-3.svg" alt="Company 3" class="h-6 w-auto" />
  <!-- Add enough logos to fill the width -->
</LogoMarquee>
```

## Notes

- You need enough child elements to fill the container width, otherwise the gap between the two sets will be visible.
- The slot is duplicated in the HTML, so each child element will appear in the DOM twice.
- The animation is pure CSS (no JS). Speed is controlled by the `marquee` keyframes in `global.css` (currently 30s).
- The "Trusted by" label has a `bg-canvas` background to punch through any border it overlaps — it assumes the page background matches `--color-canvas`.
