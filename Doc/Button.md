# Button

**File:** `src/components/Button.astro`

## What it does

A call-to-action element that renders as either `<a>` (when `href` is set) or `<button>` (otherwise). Offers three marketing-oriented variants and a single size, with an optional animated arrow that slides on hover. Colors, borders, and focus ring are driven entirely by semantic theme tokens, so the button flips automatically in dark mode.

## Props

| Prop             | Type                                       | Default         | Description                                                                 |
|------------------|--------------------------------------------|-----------------|-----------------------------------------------------------------------------|
| `label`          | `string`                                   | `"Learn More"`  | Fallback text when no default slot content is provided                      |
| `variant`        | `"primary" \| "secondary" \| "tertiary"`   | `"primary"`     | Visual prominence — solid / outlined / text-only                            |
| `href`           | `string`                                   | —               | If set (and not disabled), renders as `<a>`                                 |
| `type`           | `"button" \| "submit" \| "reset"`          | `"button"`      | Applied only when rendering as `<button>`                                   |
| `target`         | `string`                                   | —               | Anchor target. When `"_blank"`, `rel="noopener noreferrer"` is auto-added   |
| `rel`            | `string`                                   | —               | Explicit rel override                                                       |
| `disabled`       | `boolean`                                  | `false`         | Disables interaction; drops `href` on anchors and sets `aria-disabled`      |
| `withArrow`      | `boolean`                                  | `true`          | Render the sliding arrow icon                                               |
| `arrowDirection` | `"right" \| "left"`                        | `"right"`       | Arrow direction; `"left"` is useful for back / prev buttons                 |
| `class`          | `string`                                   | —               | Additional classes merged onto the rendered element                         |

Content is passed via the default slot; if the slot is empty, `label` is rendered instead.

## How it works

### Polymorphism

```astro
const Tag = href && !disabled ? "a" : "button";
```

A disabled link becomes a `<button disabled>` rather than a dead anchor — this prevents navigation while keeping it focusable and announceable. Each attribute (`href`, `type`, `target`, `rel`, `disabled`) is applied only to the tag that actually accepts it.

### Variants

Variants map to semantic theme tokens defined in `src/styles/global.css`:

| Variant     | Background                 | Text                      | Border                   | Intended use              |
|-------------|----------------------------|---------------------------|--------------------------|---------------------------|
| `primary`   | `bg-intent`               | `text-fg-on-intent` | —                        | Main CTA                  |
| `secondary` | `bg-transparent` (+ panel-muted on hover) | `text-fg`    | `border-stroke`          | Supporting CTA            |
| `tertiary`  | `bg-transparent` (+ panel-muted on hover) | `text-fg`    | —                        | Inline / de-emphasized    |

Because every color resolves to a CSS variable, the same button flips when an ancestor is marked `[data-theme="dark"]`.

### Size

One size (`h-10 px-4 text-sm`), intentionally. Marketing sites rarely benefit from a size scale — most pages want visual consistency across every CTA. If a specific moment (e.g., a hero) genuinely needs a larger button, override via the `class` prop: `<Button class="h-12 px-6 text-base">…</Button>`. If that override shows up in three places, add a `size="lg"` prop at that point — not before.

### Arrow animation

- Two copies of the arrow icon (`lucide:arrow-right` or `lucide:arrow-left`) are stacked in a `w-4 h-4 overflow-hidden` container.
- On `group-hover`, one slides out, the other slides in from the opposite side — creating a continuous loop.
- `motion-reduce` variants disable the transition and hide the duplicate, so users with `prefers-reduced-motion: reduce` see a static arrow that never animates.
- The icon wrapper has `aria-hidden="true"` because the icon is purely decorative — the button label carries the accessible name.

### `target="_blank"` safety

When the caller passes `target="_blank"` without an explicit `rel`, the component injects `rel="noopener noreferrer"` automatically. This prevents the common tab-nabbing / performance issue of opening external links without isolation. An explicit `rel` prop always wins.

### Disabled handling

- `<button disabled>` uses native `disabled`.
- `<a>` drops its `href` and receives `aria-disabled="true"` — it remains in tab order but does not navigate.
- Tailwind's `disabled:` and `aria-disabled:` variants apply `pointer-events-none opacity-50` to both.

### Focus ring

`focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas` uses `--color-focus` (which flips per theme) and offsets against `--color-canvas` so the ring stays visible on any section background.

## Usage

```astro
---
import Button from "../components/Button.astro";
---

<!-- Primary CTA with arrow (defaults) -->
<Button>Get started</Button>

<!-- Link button, opens externally with auto-injected rel -->
<Button href="https://github.com/foo/bar" target="_blank">View source</Button>

<!-- Secondary outlined -->
<Button variant="secondary" href="/docs">Read the docs</Button>

<!-- Tertiary text-only back button -->
<Button variant="tertiary" arrowDirection="left">Back</Button>

<!-- Form submit, arrow hidden -->
<Button type="submit" withArrow={false}>Submit</Button>

<!-- Disabled -->
<Button disabled>Not available yet</Button>

<!-- Legacy label prop still works -->
<Button label="Learn more" />
```

## Notes

- The icon system is `astro-icon` with `@iconify-json/lucide`. Swapping to a different icon set means changing the two `<Icon name="..." />` calls.
- The `class` prop is merged last via `class:list`, so callers can override spacing, width, or any non-color utility without touching the component. Color-related overrides are better done through the variant / token system.
- If you need a fourth variant, add it to both the `variant` prop union and the `variants` map — no CSS edits required, as the map uses existing theme tokens.
- For buttons sitting on a dark section (e.g., inside `[data-theme="dark"]`), the ring offset automatically uses the section's dark `--color-canvas`, so the ring stays visible without any variant-specific tweaks.
