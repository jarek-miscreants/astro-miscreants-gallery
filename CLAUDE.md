# CLAUDE.md

## Project

Astro playground for learning and building components with Astro 6+ and Tailwind CSS v4.

## Component development rules

### Accessibility is not optional

Every new component must include accessibility from the start, not as an afterthought:

- **ARIA roles**: use semantic HTML elements first (`<nav>`, `<button>`, `<dialog>`, `<header>`). Add explicit `role` attributes only when no semantic element fits (e.g. `role="status"` on a notification banner, `role="tabpanel"` on a tab content area).
- **ARIA labels**: every interactive element without visible text needs `aria-label`. Every landmark region (`role="banner"`, `role="navigation"`, etc.) needs `aria-label` or `aria-labelledby` to distinguish it from other landmarks.
- **ARIA state**: toggleable elements need `aria-expanded`. Triggers that control another element need `aria-controls` pointing to the target's `id`. Checkable items need `aria-checked`. Selected items need `aria-selected`.
- **Decorative SVGs**: add `aria-hidden="true"` to icons that are purely visual (the parent element's text or `aria-label` already communicates meaning).
- **Focus management**: when an element is removed/hidden (dismiss, close, delete), move focus to the next logical element — don't let it drop to `<body>`.
- **Keyboard navigation**: all interactive components must work with keyboard. At minimum: Enter/Space to activate, Escape to close/dismiss, Arrow keys for lists/tabs/menus.
- **Reduced motion**: wrap animations in `@media (prefers-reduced-motion: reduce)` to disable or simplify them for users who opt out.

### Tailwind v4 patterns

- Design tokens live in `@theme` blocks in `src/styles/global.css`.
- Component-scoped `<style>` blocks can't see `@theme` tokens via `@apply` — use raw `var(--color-*)` or add `@reference "../styles/global.css"` at the top.
- Use `@utility` for multi-property recipes. Single-property tokens belong in `@theme`.
