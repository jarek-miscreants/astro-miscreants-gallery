# CardIcon

**File:** `src/components/CardIcon.astro`

## What it does

A simple card with an icon, eyebrow text, heading, and content slot. Used for stats, feature highlights, or icon-driven lists.

## Props

| Prop      | Type     | Default | Description                               |
|-----------|----------|---------|-------------------------------------------|
| `eyebrow` | `string` | —       | Small label text (e.g. category or stat)  |
| `header`  | `string` | —       | Card heading (renders as `<h3>` with `h5` size) |
| `class`   | `string` | `""`    | Additional classes on the outer div       |

## Named slots

| Slot      | Purpose                                    |
|-----------|--------------------------------------------|
| `icon`    | Icon displayed at the top of the card      |
| `content` | Body content below the heading             |

## How it works

- Simple vertical stack layout with `flex-col`.
- Has left/right borders using `border-stroke` (designed to sit in a grid where cards share borders).
- Fixed padding: `px-6 py-8`.

## Usage

```astro
---
import CardIcon from "../components/CardIcon.astro";
---

<div class="grid grid-cols-4">
  <CardIcon eyebrow="98.3% uptime" header="Proven reliability across sources with proactive monitoring">
    <svg slot="icon" class="w-8 h-8 text-blue-600">...</svg>
    <p slot="content" class="text-sm text-gray-500">Additional details here.</p>
  </CardIcon>
</div>
```

## Notes

- The card has `border-x` by default — when placed in a grid, adjacent cards share their borders for a clean look.
- Unlike `CardFeatured`, this card doesn't have a media slot or configurable borders.
