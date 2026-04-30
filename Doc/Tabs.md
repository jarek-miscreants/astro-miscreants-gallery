# Tabs

**File:** `src/components/Tabs.astro`

## What it does

A feature-rich tabbed interface with optional autoplay, GSAP slide/fade transitions, URL deep-linking, prev/next controls, and automatic conversion to an accordion layout on mobile.

## Props

| Prop                  | Type      | Default | Description                                                 |
|-----------------------|-----------|---------|-------------------------------------------------------------|
| `id`                  | `string`  | —       | Unique ID for URL deep-linking (`?tab-id=...`)              |
| `autoplay`            | `number`  | `0`     | Auto-advance interval in seconds. `0` = off                 |
| `duration`            | `number`  | `0.3`   | Transition duration in seconds                              |
| `slideTabs`           | `boolean` | `false` | Use horizontal slide animation instead of fade (needs GSAP) |
| `convertAccordion`    | `boolean` | `false` | Convert to accordion layout below the breakpoint            |
| `accordionBreakpoint` | `number`  | `768`   | Viewport width in px where accordion kicks in               |
| `loopControls`        | `boolean` | `false` | Prev/next buttons wrap around instead of disabling          |
| `allowMultiple`       | `boolean` | `false` | Allow multiple accordion panels open at once                |
| `class`               | `string`  | —       | Additional classes on the wrapper                           |

## How it works

### HTML structure (required in your slot content)

```html
<div data-tab="button-list">
  <div data-tab="button" data-tab-item-id="overview">Tab 1</div>
  <div data-tab="button" data-tab-item-id="features">Tab 2</div>
</div>

<div data-tab="content-wrap">
  <div data-tab="panel-list">
    <div data-tab="panel">Panel 1 content</div>
    <div data-tab="panel">Panel 2 content</div>
  </div>
</div>
```

### Named slots

| Slot       | Purpose                            |
|------------|-------------------------------------|
| (default)  | Tab buttons, panel list, and content |
| `controls` | Optional prev/next navigation buttons |

For controls, use `data-tab="prev"` and `data-tab="next"` on `<button>` elements.

### Tab mode (desktop)

- Buttons get `role="tab"`, panels get `role="tabpanel"`.
- Button list gets `role="tablist"`.
- Roving tabindex on buttons, arrow keys move between tabs.
- Transitions use GSAP: fade by default, or horizontal slide when `slideTabs` is set.

### Accordion mode (mobile)

- When `convertAccordion` is enabled and the viewport is below the breakpoint, the DOM is restructured: each button is paired with its panel inside an accordion wrapper.
- ARIA switches from `aria-selected` (tabs) to `aria-expanded` (accordion).
- Height animation uses the CSS grid `0fr`/`1fr` technique.
- Switching back to desktop restores the original tab layout and state.

### Autoplay

- Uses a GSAP timeline that drives a `--tab-progress` CSS variable (for a progress bar).
- Pauses on hover, focus, out-of-viewport (IntersectionObserver), accordion mode, and `prefers-reduced-motion`.

### URL deep-linking

- If the URL contains `?tab-id=<component-id>-<item-id>`, that tab is activated on load and the component scrolls into view.
- After activation, the query param is cleaned from the URL.

## Usage

```astro
---
import Tabs from "../components/Tabs.astro";
---

<Tabs id="features" convertAccordion={true} autoplay={5} slideTabs={true}>
  <div data-tab="button-list" class="flex gap-2">
    <button data-tab="button" data-tab-item-id="overview" class="px-4 py-2">
      Overview
      <div data-tab="line" class="h-0.5 bg-blue-600 w-0"></div>
    </button>
    <button data-tab="button" data-tab-item-id="features" class="px-4 py-2">
      Features
      <div data-tab="line" class="h-0.5 bg-blue-600 w-0"></div>
    </button>
  </div>

  <div data-tab="content-wrap">
    <div data-tab="panel-list">
      <div data-tab="panel">
        <div data-tab="content">Overview content here</div>
      </div>
      <div data-tab="panel">
        <div data-tab="content">Features content here</div>
      </div>
    </div>
  </div>

  <div slot="controls">
    <button data-tab="prev">Previous</button>
    <button data-tab="next">Next</button>
  </div>
</Tabs>
```

### Optional data attributes inside buttons

| Attribute          | Purpose                                             |
|--------------------|------------------------------------------------------|
| `data-tab="line"`  | Progress bar element — width animates via `--tab-progress` |
| `data-tab="icon"`  | Chevron icon that rotates in accordion mode          |
| `data-tab="button-mask"` | Expandable content area inside a button (grid row animation) |

## Dependencies

- **GSAP** + **ScrollTrigger** — imported in the component's `<script>` block. Required for transitions and autoplay.

## Notes

- FOUC prevention: all panels except the first are hidden via CSS (`display: none`) before JS runs.
- The component supports multiple instances on the same page — each is independently initialized.
- `data-tab-item-id` on buttons is used for URL deep-linking. If omitted, falls back to the 1-based index.
