# Clickable

**File:** `src/components/Clickable.astro`

## What it does

Makes an entire card or container area clickable by stretching an invisible `<a>` link over the parent. This is the "stretched link" pattern — the user can click anywhere on the card to navigate, without wrapping the entire card in an `<a>` tag.

## Props

| Prop    | Type     | Required | Description                                      |
|---------|----------|----------|--------------------------------------------------|
| `href`  | `string` | Yes      | URL the card links to                            |
| `label` | `string` | Yes      | Accessible label for the link (screen readers)   |
| `class` | `string` | No       | Additional classes on the outer `<div>`          |

## How it works

- The outer `<div>` gets `position: relative` so the stretched link is contained within it.
- An `<a>` with `absolute inset-0 z-[1]` covers the full area of the parent.
- A `<span class="sr-only">` inside the link provides the accessible text.
- The link has `focus-visible` styles for keyboard users (outline with `rounded-[inherit]`).
- Child content is passed via `<slot />` and sits below the link in the DOM but visually appears normally.

## Usage

```astro
---
import Clickable from "../components/Clickable.astro";
---

<Clickable href="/blog/my-post" label="Read: My Post Title">
  <img src="/thumbnail.jpg" alt="" />
  <h3>My Post Title</h3>
  <p>A short description...</p>
</Clickable>
```

## Notes

- Any interactive elements inside the card (other buttons/links) need `position: relative; z-index: 2` (use the `card-action` utility from `global.css`) so they sit above the stretched link and remain independently clickable.
- The `label` prop is required for accessibility — it tells screen readers what the entire card links to.
