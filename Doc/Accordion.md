# Accordion (primitive)

**File:** `src/components/Accordion.astro`
**Preset:** see [`AccordionFAQ`](./AccordionFAQ.md) for the common question/answer use case.

## What it does

A low-level disclosure primitive. The component provides behavior only — state management, ARIA wiring, keyboard navigation, height animation — and the caller provides the markup for each item via a data-attribute contract. Use this when you need full control over how items look (rich content, icons, buttons, videos inside the answer, custom typography). For simple FAQ lists, use `AccordionFAQ` instead.

## Props

| Prop                | Type      | Default | Description                                           |
|---------------------|-----------|---------|-------------------------------------------------------|
| `closePrevious`     | `boolean` | `true`  | Close other items when one opens (single-open mode)   |
| `closeOnSecondClick`| `boolean` | `true`  | Allow closing an open item by clicking it again       |
| `openByDefault`     | `number`  | —       | 1-based index of the item to open on page load        |
| `class`             | `string`  | —       | Additional classes on the wrapper                     |

## Markup contract

The component expects this structure in its slot content:

```html
<div data-accordion="item">
  <button type="button" data-accordion="button">
    Trigger text
    <svg data-accordion="icon"></svg>    <!-- optional -->
  </button>
  <div data-accordion="content">
    <div>Hidden content here</div>       <!-- single wrapper -->
  </div>
</div>
```

### Why `<button>` and not `<div>`

`[data-accordion="button"]` **should be a native `<button>` element**. Native buttons are focusable and activatable by default, receive the correct accessible name from their visible text, and fire click on Enter and Space without extra wiring. The script applies ARIA attributes and a roving tabindex on whatever element you provide, but it does not re-implement platform focus semantics — a `<div>` with `role="button"` works, but is fragile and fails silently for users on platforms or with assistive tech that rely on native semantics.

### Content wrapper requirement

The content div must have **exactly one direct child wrapper**. The grid-row animation sets `min-height: 0` on `[data-accordion="content"] > *` so it can collapse to zero; if you put two siblings directly inside, margins can collapse oddly mid-animation. Always wrap your content in one `<div>`.

## How it works

### Animation

- Uses a **CSS grid trick** for height animation: `grid-template-rows` transitions from `minmax(0, 0fr)` to `minmax(0, 1fr)`.
- No JS height calculations — the browser measures.
- An optional `[data-accordion="icon"]` element rotates 180° when active.
- Respects `prefers-reduced-motion: reduce` — both height and icon transitions are disabled.

### ARIA & accessibility

- Each button receives `role="button"`, `aria-expanded`, `aria-controls`, and a generated `id`.
- Each content region receives `role="region"` and `aria-labelledby` pointing at its button.
- Keyboard: ArrowUp/Down moves focus between buttons, Home/End jump to first/last, Enter/Space toggles.
- Roving `tabindex` — only the focused button has `tabindex="0"`, others are `-1`.

### Script initialization

- `data-script-initialized` guards against double-initialization across Astro view transitions.

## Usage

```astro
---
import Accordion from "../components/Accordion.astro";
---

<Accordion closePrevious={true} openByDefault={1}>
  <div data-accordion="item">
    <button type="button" data-accordion="button" class="flex justify-between w-full py-4">
      <span>What is Astro?</span>
      <svg data-accordion="icon" class="w-4 h-4">...</svg>
    </button>
    <div data-accordion="content">
      <div class="pb-4 text-fg-muted">A web framework for content-driven websites.</div>
    </div>
  </div>

  <div data-accordion="item">
    <button type="button" data-accordion="button" class="flex justify-between w-full py-4">
      <span>How does it compare to Next.js?</span>
      <svg data-accordion="icon" class="w-4 h-4">...</svg>
    </button>
    <div data-accordion="content">
      <div class="pb-4 text-fg-muted">Astro ships less JavaScript by default. Next.js is better for app-like UIs.</div>
    </div>
  </div>
</Accordion>
```

## Notes

- **Nested accordions** are not supported — the component queries all descendant `[data-accordion="item"]` elements, so an inner accordion's items leak into the outer's keyboard handler. Avoid.
- Styles use `is:global` because the data-attribute selectors need to reach into slot content.
- For a typed, mapped API over FAQ-style data, use [`AccordionFAQ`](./AccordionFAQ.md).
