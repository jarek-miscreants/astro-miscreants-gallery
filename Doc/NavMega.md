# NavMega

**File:** `src/components/NavMega.astro`

## What it does

An alternative mega navigation component with a more polished desktop dropdown (morphing container height) and a mobile drill-down pattern (slide-in sub-panels with a back button).

## Props

None — navigation panels and links are hardcoded in the component's frontmatter.

## How it works

### Data structure

```ts
interface NavPanel {
  name: string;
  columns: { heading?: string; links: NavLink[] }[];
}
```

Panels are defined in the `panels` array. Top-level plain links go in `topLinks`.

### Desktop behavior

- Dropdown triggers use hover-intent (`HOVER_ENTER: 120ms`, `HOVER_LEAVE: 150ms`).
- A shared `data-dropdown-container` morphs its `height` smoothly between panels using CSS `transition: height 0.35s`.
- Panel measurement happens by briefly toggling `data-state="active"` with `visibility: hidden` to get the natural height without a flash.
- Content inside panels uses staggered fade-in via CSS `transition-delay` driven by a `--stagger-i` variable set per element.
- A semi-transparent backdrop (`bg-black/20 backdrop-blur-sm`) appears behind the dropdown.

### Mobile behavior (below 991px)

- Hamburger opens a full-screen nav list with staggered item animations.
- Tapping a panel trigger slides in that panel from the right (`translateX(8%) -> 0`).
- A back button in the top bar slides the panel back out.
- The logo fades out when a sub-panel is active; the back button fades in.
- Body scroll is locked when the mobile menu is open.

### Keyboard navigation

- Enter/Space toggles dropdowns; ArrowDown opens and focuses the first link.
- ArrowUp/ArrowDown navigates between links inside a panel.
- ArrowUp from the first link returns focus to the toggle button.
- Escape closes the dropdown (desktop) or navigates back/closes the menu (mobile).

### Dynamic top offset

- The nav list, dropdown wrapper, and backdrop all sync their `top` position to `navBar.getBoundingClientRect().bottom`, accounting for the announcement banner height.
- A `ResizeObserver` on the banner keeps the offset accurate when the banner collapses.

### Announcement banner script

- Included inline at the bottom of this component.
- Hides on scroll-down, shows on scroll-up, dismissible with sessionStorage persistence.

## Usage

```astro
---
import NavMega from "../components/NavMega.astro";
---

<NavMega />
```

To modify navigation, edit the `panels` and `topLinks` arrays in the frontmatter.

## Sub-components used

- `Logo` — SVG wordmark
- `Button` — (imported but CTA is hardcoded as an `<a>` in this version)

## Notes

- Uses `is:inline` scripts (not module scripts) because it manipulates DOM immediately and doesn't need Astro's script bundling.
- The `MOBILE_BREAKPOINT` is `991px` (matching Tailwind's `lg:` breakpoint).
- All animations respect `prefers-reduced-motion: reduce` — transitions are disabled entirely.
- This component is self-contained with its own styles and scripts, unlike `Nav.astro` which delegates some behavior to sub-components.
