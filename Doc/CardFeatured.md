# CardFeatured

**File:** `src/components/CardFeatured.astro`

## What it does

A content card with an optional eyebrow, title, description, optional media (image/video that bleeds to the card bottom), and optional button area. Colors and borders are driven by semantic theme tokens, so the card flips automatically in dark mode.

## Props

| Prop          | Type                                  | Default  | Description                                                   |
|---------------|---------------------------------------|----------|---------------------------------------------------------------|
| `title`       | `string`                              | —        | Card heading text (rendered only if provided)                 |
| `description` | `string`                              | —        | Body text below the title (rendered only if provided)         |
| `border`      | `"all" \| "y" \| "x" \| "none"`       | `"all"`  | Which borders to show, using `border-stroke`                  |
| `titleTag`    | `"h1" … "h6"`                         | `"h3"`   | Semantic heading level for the title                          |
| `titleClass`  | `string`                              | `"h3"`   | Class applied to the title element (controls visual size)     |
| `class`       | `string`                              | `""`     | Additional classes on the outer wrapper                       |

## Named slots

| Slot      | Purpose                                                                 |
|-----------|-------------------------------------------------------------------------|
| `eyebrow` | Small label above the title. Renders only when content is provided.    |
| `media`   | Media (image, video) that bleeds flush to the bottom edge of the card. |
| `button`  | Action area below description / above media. Renders only when provided. |

All three slots use `Astro.slots.has(...)` at build time, so nothing renders (and no empty wrapper is emitted) when a slot is unused.

## How it works

- The eyebrow slot is wrapped in a small `text-body-sm text-fg-muted` container for a default muted-label look. Pass richer content (a `<Badge />`, icon + text, etc.) and it takes over.
- When the `media` slot has content, bottom padding is removed (`pb-0`) so media sits flush with the card edge. Otherwise, `pb-8` keeps vertical spacing consistent.
- The `border` prop maps to `border`, `border-y`, `border-x`, or no border, always using the theme's `--color-stroke` token.
- Title is optional — if no `title` is passed, the heading element is not rendered at all.

## Usage

```astro
---
import CardFeatured from "../components/CardFeatured.astro";
import Button from "../components/Button.astro";
---

<!-- Card with eyebrow + media -->
<CardFeatured
  title="Design content structures your way."
  description="Full control with a streamlined, API-first experience."
  border="all"
>
  <span slot="eyebrow">Schema Builder</span>
  <img slot="media" src="/screenshot.png" alt="Schema builder interface" />
</CardFeatured>

<!-- Card with eyebrow + button, no media -->
<CardFeatured
  title="Build faster with our REST API."
  description="Simple, well-documented endpoints."
  border="y"
  titleTag="h2"
>
  <span slot="eyebrow">API</span>
  <Button slot="button" href="/docs">Read docs</Button>
</CardFeatured>

<!-- Plain card, no eyebrow -->
<CardFeatured
  title="Learn more about our approach."
  description="Straightforward, no surprises."
  border="none"
/>
```

## Notes

- The card itself is not a link — wrap it with `Clickable` if the whole card should be tappable.
- Because colors use semantic tokens, a card inside `[data-theme="dark"]` flips to dark-mode surface/border/text automatically.
