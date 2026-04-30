# Modal

**File:** `src/components/Modal.astro`

## What it does

An accessible dialog built on the native `<dialog>` element + `.showModal()`. Top-layer rendering, inert background, focus trap, Esc-to-close, and `::backdrop` overlay all come from the platform. The component layers on data-attribute wiring (Pattern 1: triggers declare their target by id), focus restoration, body scroll lock, click-overlay-to-close, custom open/close events, and entry/exit animation via `@starting-style`.

## Wiring (Pattern 1)

Buttons declare their target modal by id. Multiple triggers can open the same modal — that's the common case (CTA in hero + duplicate in footer + variant in a pricing table all opening the same signup modal).

```astro
<button data-modal-open="signup">Sign up</button>
<button data-modal-open="signup">Get started</button>
<a href="#signup" data-modal-open="signup">Or here</a>

<Modal id="signup">…</Modal>
```

A single global click handler (initialized once per page) reads the attribute, looks up the modal by id, and calls `.showModal()` on it.

## Props

| Prop                | Type                          | Default     | Description                                                          |
|---------------------|-------------------------------|-------------|----------------------------------------------------------------------|
| `id`                | `string`                      | (required)  | The DOM id triggers point at via `data-modal-open`                   |
| `ariaLabel`         | `string`                      | —           | Accessible name when no `title` slot is provided                     |
| `size`              | `"sm" \| "md" \| "lg" \| "xl"` | `"md"`      | Caps the dialog's max-width (sm 24rem → xl 42rem)                     |
| `dismissOnOverlay`  | `boolean`                     | `true`      | Click outside the dialog box closes it                                |
| `closable`          | `boolean`                     | `true`      | Render the X close button in the header                              |
| `class`             | `string`                      | `""`        | Extra classes on the `<dialog>` element                              |

## Slots

| Slot          | Purpose                                                                                                                |
|---------------|------------------------------------------------------------------------------------------------------------------------|
| `title`       | Heading. Auto-wired to `aria-labelledby` so screen readers announce it. Skip and use `ariaLabel` for unlabeled dialogs |
| `description` | Optional sub-heading paragraph. Auto-wired to `aria-describedby`                                                       |
| (default)     | Body content                                                                                                           |
| `footer`      | Optional action row at the bottom. Use `<Fragment slot="footer">` to drop in multiple buttons without an extra wrapper |

## Trigger / close attributes

The component looks for these attributes via a single document-level click handler:

| Attribute                  | Where it goes                          | What it does                                              |
|----------------------------|----------------------------------------|-----------------------------------------------------------|
| `data-modal-open="<id>"`   | Any button or link, anywhere           | Opens the modal with that id                              |
| `data-modal-close`         | Any element **inside** the modal       | Closes the enclosing dialog                               |
| `data-modal-close="<id>"`  | Any element outside, on a different modal | Closes that specific dialog                            |
| `data-modal-autofocus`     | A child element of the modal           | Focused on open (overrides the default first-focusable)   |

## Usage

### Basic dialog

```astro
---
import Modal from "../components/Modal.astro";
import Button from "../components/Button.astro";
---

<Button label="Open signup" data-modal-open="signup" />

<Modal id="signup" size="md">
  <h2 slot="title">Create your account</h2>
  <p slot="description">Spin up a project in under five minutes.</p>

  <form onsubmit="event.preventDefault(); this.closest('dialog').close();">
    <label class="flex flex-col gap-1 text-sm">
      <span class="text-fg-muted">Email</span>
      <input type="email" required data-modal-autofocus class="border border-stroke bg-canvas px-3 py-2" />
    </label>
  </form>

  <Fragment slot="footer">
    <Button label="Cancel" variant="secondary" data-modal-close />
    <Button label="Create account" />
  </Fragment>
</Modal>
```

### Confirm-style dialog (no body content)

```astro
<Button label="Delete" variant="secondary" data-modal-open="confirm-delete" />

<Modal id="confirm-delete" size="sm">
  <h2 slot="title">Delete project?</h2>
  <p slot="description">This action can't be undone.</p>

  <Fragment slot="footer">
    <Button label="Cancel" variant="secondary" data-modal-close />
    <Button label="Delete" data-modal-close />
  </Fragment>
</Modal>
```

### Multiple triggers, same modal

```astro
<Button label="Sign up" data-modal-open="signup" />            {/* hero */}
<Button label="Get started" data-modal-open="signup" />        {/* pricing tier */}
<a href="#signup" data-modal-open="signup">Sign up here</a>    {/* footer */}

<Modal id="signup">…</Modal>
```

The `<a href="#signup">` doubles as a graceful fallback — if JS hasn't loaded, the link just navigates to the anchor instead of opening the dialog.

### Reacting to open/close from JS

```html
<script>
  const dialog = document.getElementById("signup");
  dialog.addEventListener("modal:open", () => {
    // analytics, lazy-load a chart, fetch dynamic copy, etc.
  });
  dialog.addEventListener("modal:close", () => {
    // submit pending form, reset state, etc.
  });
</script>
```

The component dispatches a custom `modal:open` event right after `.showModal()` and `modal:close` right after `.close()`, both on the dialog element.

### Programmatic open

Since the modal is a real `<dialog>`, you can call the native API directly:

```ts
document.getElementById("signup").showModal();
```

The custom event still fires and focus is still tracked, because the global handler hooks the native `close` event for state cleanup.

## A11y

- Built on native `<dialog>` — keyboard, focus trap, Esc-to-close, and inert background all come from the platform.
- `aria-labelledby` wired to the `title` slot's auto-generated id when present; falls back to `aria-label` when not.
- `aria-describedby` wired to the `description` slot when present.
- **Focus moves into the modal on open** — first focusable by default, or the element with `data-modal-autofocus` if one exists. Useful when a specific input should be focused (signup email, confirmation code, search query).
- **Focus restored to the original trigger on close** — the global handler captures `document.activeElement` before `.showModal()` and refocuses it on `close`. Works for any close path: X button, Esc, overlay click, programmatic `.close()`.
- **Body scroll lock** — `<dialog>.showModal()` makes the background inert but doesn't prevent scrolling. The component sets `html.modal-open { overflow: hidden }` while open. `scrollbar-gutter: stable` on `<html>` reserves the gutter so opening/closing the modal doesn't shift page layout.
- **Reduced motion** — entry/exit animation disabled when `prefers-reduced-motion: reduce`.

## Mechanism

### Native `<dialog>` + `.showModal()`

`.showModal()` (vs `.show()`) is what makes everything work:
- Renders in the [top layer](https://developer.mozilla.org/en-US/docs/Glossary/Top_layer), so z-index doesn't matter — modals always sit above page content.
- Adds `inert` to everything else on the page automatically; only the dialog's children can be focused/clicked while it's open.
- Activates the `::backdrop` pseudo-element for the dimmed overlay.
- Esc closes by default.

### Entry / exit animation

The animation is pure CSS — no JS choreography. Three pieces:

1. **`transition` with `allow-discrete`** on `display` and `overlay` properties. Discrete properties (like `display: none` ↔ `display: block`) normally can't be transitioned; `allow-discrete` lets them animate through their transition duration before swapping.

2. **`@starting-style`** declares the "from" state for the entry animation. The dialog and its `::backdrop` start with `opacity: 0` / `transform: translateY(8px)` / `background: transparent`, and animate to the open state.

3. **`:not([open])` selector** for the exit animation — when `open` is removed, the dialog transitions back to the closed state before `display: none` kicks in.

```css
dialog.modal {
  transition:
    opacity 180ms ease,
    transform 180ms ease,
    overlay 180ms ease allow-discrete,
    display 180ms ease allow-discrete;
}
dialog.modal[open] {
  opacity: 1;
  transform: translateY(0);
}
@starting-style {
  dialog.modal[open] {
    opacity: 0;
    transform: translateY(8px);
  }
}
dialog.modal:not([open]) {
  opacity: 0;
  transform: translateY(8px);
}
```

### Single global click handler

All modals on the page share one document-level click handler, gated by `window.__modalInit` so it initializes only once even if the component renders multiple times. The handler covers:

- Opening (`closest('[data-modal-open]')`).
- Closing (`closest('[data-modal-close]')` — bare value closes nearest enclosing dialog; explicit id closes that one).
- Overlay click (when `e.target === <dialog>`, the user clicked the backdrop, not a child).

Plus a capture-phase `close` event listener on `document` for state cleanup (focus restoration, removing `html.modal-open`).

### Why a `data-*` attribute API and not slots-with-trigger

See `Plan.md` and the in-conversation notes — the short version: triggers and modals are often far apart in the DOM (CTA in nav, modal at body bottom for top-layer behavior). Wrapping a modal around its trigger forces co-location and makes "multiple triggers, same modal" awkward. The id-based pattern matches `aria-controls` and the new HTML `popovertarget` — same shape readers already know.

## Tokens

- Dialog body: `border border-stroke`, `bg-canvas`, `shadow-popover`.
- Header layout: `px-6 pt-6 pb-4` with the title in `h4` and description in `text-sm text-fg-muted`.
- Close button: `h-8 w-8`, `text-fg-muted` → `hover:bg-panel-muted hover:text-fg`, focus ring on `--color-focus`.
- Footer: `border-t border-stroke px-6 py-4`, right-aligned actions.
- Backdrop: `color-mix(in oklab, var(--color-fg) 50%, transparent)` — theme-aware (light fg in dark mode produces an inverted overlay automatically).
- Body lock: `html.modal-open { overflow: hidden }`, with `scrollbar-gutter: stable` on `html` to prevent layout shift.

## Gotchas

1. **Modal placement.** The component works regardless of where you put it in the page — it renders in the top layer. But for clarity, place modals near the bottom of your route file, after the main content. That keeps source order matching visual stacking and avoids any future stacking-context surprises.
2. **Nested forms.** `<dialog>` allows `<form method="dialog">`, where any submit closes the dialog. The starter component doesn't use that — you put your own `<form>` inside the body slot. Don't wrap the modal's content in another form yourself; nested forms are invalid HTML.
3. **`data-modal-open` on `<a>` tags.** When the trigger is an `<a href="#x">`, the click handler calls `e.preventDefault()` so the URL doesn't change. The link still works as a no-JS fallback (browser navigates to `#x` if the script hasn't loaded yet).
4. **Multiple modals open simultaneously.** Native `<dialog>.showModal()` supports stacking, but managing focus restoration across nested modals is tricky and not handled here — the `returnFocusEl` is a single variable, so opening modal B while modal A is open and then closing them in any order may not restore focus correctly. If you genuinely need stacked modals, you'd track a stack instead.
5. **Browser support.** `<dialog>` + `.showModal()`: Chrome 37+, Firefox 98+, Safari 15.4+. `@starting-style` + `transition-behavior: allow-discrete`: Chrome 117+, Safari 17.5+, Firefox 129+. On older browsers without `@starting-style`, the modal still opens and closes correctly — it just appears/disappears instantly without the animation.
6. **`data-modal-autofocus` and form fields.** Autofocus on a `<input>` works as expected. If your modal has a button as the first focusable and you want a specific input to take focus instead, mark that input with `data-modal-autofocus`. Without the override, the close-X button takes focus by default (which can feel weird on a signup form).
