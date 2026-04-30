# FlowSteps

**File:** `src/components/FlowSteps.astro`

## What it does

A "how it works" section where a clickable step list on the left drives a **vertical-carousel panel** on the right. Clicking a step slides the panel column so the selected panel is in view. On mobile it collapses to a flat stack of step-header → panel pairs, so the same content reads as a linear walkthrough without any JS.

The component accepts a `steps` array for the titles/descriptions and a **named slot per panel** (`panel-0`, `panel-1`, …) for the rich content that lives in the right column.

## Props

| Prop           | Type       | Default | Description                                              |
|----------------|------------|---------|----------------------------------------------------------|
| `title`        | `string`   | —       | Heading shown above the step list                        |
| `description`  | `string`   | —       | Lead paragraph under the heading                         |
| `steps`        | `Step[]`   | *req.*  | Array of `{ title, description }` — one per step         |
| `panelHeight`  | `number`   | `560`   | Minimum height of the panel area in px (desktop)         |
| `duration`     | `number`   | `800`   | Transition duration in ms for slide + description reveal |
| `class`        | `string`   | —       | Additional classes on the wrapper                        |

```ts
interface Step {
  title: string;
  description: string;
}
```

## How it works

### The vertical carousel

All panels occupy the **same CSS grid cell** (`[grid-template-areas:'stack']` with every child placed into `stack`), so they sit on top of each other. Each panel sets its own index as a CSS custom property (`--flow-i`) and the root sets `--flow-active` to the selected index. The transform is:

```css
transform: translateY(calc((var(--flow-i) - var(--flow-active)) * 100%));
```

With `overflow: hidden` on the container, only the panel whose `--flow-i` equals `--flow-active` is visible — the others sit just above or below the viewport. Changing `--flow-active` animates the whole column in one motion. The transition is CSS-only; JS just flips the custom property.

### Step description reveal

The expanded description under the active step uses the **CSS grid `0fr` / `1fr`** technique (same as `Accordion.astro`) so height animates without JS measurement. It works inside a `<button>` because the animated element is a `<span>` with `display: grid`.

### Mobile layout

Below `md` the component renders a **separate DOM tree** (the stepped carousel is hidden, and a flat stack of `step-header → panel` pairs is shown). No JS runs against the mobile tree — the panels are always visible, in order. This keeps the component readable with zero interactivity required.

### Named slots via `Astro.slots.render`

Astro requires static slot names, so the component renders each `panel-N` slot to HTML in the frontmatter and injects it with `<Fragment set:html={…} />`. The caller's API is still `<Fragment slot="panel-0">…</Fragment>`. Panel content is duplicated between desktop and mobile renders — keep panels visual and side-effect-free (no form inputs that would collide on IDs, no iframes that would double-load).

### ARIA & accessibility

- The step list is a `role="tablist"` with `aria-orientation="vertical"`; each step is a native `<button role="tab">`.
- Each panel is a `role="tabpanel"` with `tabindex="0"` so screen reader users can enter the panel content.
- `aria-selected` + `aria-controls` (tab) and `aria-labelledby` + `aria-hidden` (panel) are wired on every state change.
- Roving `tabindex` — only the active tab has `tabindex="0"`, others are `-1`.
- Keyboard: ArrowUp/Down and ArrowLeft/Right cycle steps (wrapping); Home/End jump to first/last.
- **Reduced motion** — the panel slide, step padding, pill fill, and description reveal transitions are all disabled under `prefers-reduced-motion: reduce`.

### Script initialization

- `data-script-initialized` guards against double-initialization across Astro view transitions.
- Each instance uses a random UID in its ARIA IDs (`flow-<uid>-tab-N` / `flow-<uid>-panel-N`), so multiple FlowSteps can coexist on the same page.

## Usage

```astro
---
import FlowSteps from "../components/FlowSteps.astro";
import SectionMain from "../components/SectionMain.astro";
---

<SectionMain id="how-it-works" padding="none" contentPadding="none" borderTop>
  <FlowSteps
    title="How it works."
    description="Issue mobile wallet credentials with a simple API integration."
    steps={[
      {
        title: "Issue credentials from your portal",
        description: "Control the look and feel of credential issuance directly in your portal.",
      },
      {
        title: "Craft a template to issue passes via API",
        description: "Display your brand in wallet. Issue credentials via API, delivered over SMS.",
      },
      {
        title: "Users install your custom crafted credential",
        description: "Users receive a text with a link to install the pass on their phone.",
      },
    ]}
  >
    <Fragment slot="panel-0">
      <!-- Anything — a mocked UI card, image, SVG, whatever. -->
      <div class="w-full max-w-sm p-6 rounded-2xl bg-canvas shadow-popover">
        <div class="font-semibold text-sm">Add credential</div>
        <!-- … -->
      </div>
    </Fragment>

    <Fragment slot="panel-1">
      <pre class="w-full max-w-sm p-5 rounded-2xl bg-fg text-panel font-mono text-xs leading-5">
curl https://api.example.com/v1/credentials \
  --request POST \
  --data '{"template_id": "..."}'</pre>
    </Fragment>

    <Fragment slot="panel-2">
      <img src="/assets/phone-preview.png" alt="Install preview on phone" />
    </Fragment>
  </FlowSteps>
</SectionMain>
```

### Tuning the panel height

`panelHeight` sets the minimum height of the panel area on desktop (it's the `min-height` of the grid container — if a panel's content is taller, the whole column grows). Mobile panels use `85%` of this value as their minimum height.

```astro
<FlowSteps panelHeight={720} steps={…}>
  <!-- …tall panels… -->
</FlowSteps>
```

### Tuning transition duration

Default is `800ms`. It drives the panel slide, the step padding expansion, the number-pill fill, and the description reveal — so all four transitions stay in sync.

```astro
<FlowSteps duration={500} steps={…}>
  <!-- …snappier feel… -->
</FlowSteps>
```

## Notes

- **Best placed inside `SectionMain padding="none" contentPadding="none"`.** FlowSteps already handles its own 2-column grid, internal padding, and top/bottom borders — wrapping it in `SectionMain`'s gutter grid will either clip it or over-indent it.
- Panels should feel like **posters, not live UI** — they're duplicated (desktop tree + mobile tree) and the desktop versions that aren't active are still in the DOM translated off-screen. Avoid heavy iframes, autoplay video, or forms with shared IDs.
- The number pill uses `bg-intent` / `text-fg-on-intent` when a step is active, so it inherits the theme correctly in both light and dark mode.
- Multiple FlowSteps instances on the same page are safe — each picks up its own random UID for ARIA relationships.
- Long step descriptions are fine: the grid-rows technique measures the real content height, so nothing clips. The button itself grows with the description.
