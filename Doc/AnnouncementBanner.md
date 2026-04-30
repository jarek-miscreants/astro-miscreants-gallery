# AnnouncementBanner

**File:** `src/components/AnnouncementBanner.astro`
**Collection:** `src/content/announcements/*.md` (schema in `src/content.config.ts`)
**Consumer:** `src/layouts/Layout.astro`

## What it does

A top-of-page banner for site-wide announcements. Optionally links somewhere, can be dismissed, hides on scroll-down and reappears on scroll-up. Content and scheduling live in a markdown-based content collection, so editors can publish, queue, or expire banners by editing files — no code changes.

## Props

| Prop          | Type      | Default | Description                                             |
|---------------|-----------|---------|---------------------------------------------------------|
| `href`        | `string`  | —       | If provided, the banner becomes a clickable link        |
| `dismissible` | `boolean` | `true`  | Show a close button                                     |
| `class`       | `string`  | —       | Additional classes (typically background + text color)  |

Content is passed via the default slot.

## Component behaviour

- Uses a dynamic tag: `<a>` when `href` is set, `<div>` otherwise.
- When `href` is set, a trailing arrow icon is appended.
- When `dismissible` is true, a close button is absolutely positioned on the right.

### Scroll behavior (client-side script)

- On page load, the banner's natural height is measured and set explicitly to enable CSS height transitions.
- **Scroll down** (delta > 5px): banner collapses to `height: 0`.
- **Scroll up** (delta < -5px): banner expands back to its natural height.
- **Dismiss**: sets `height: 0`, stores `"announcement-dismissed"` in `sessionStorage`, then sets `display: none` after the transition ends.
- After dismissal, focus moves to the first focusable element in `[data-nav-bar]`.

### Accessibility

- `role="status"` and `aria-label="Site announcement"` on the wrapper.
- Close button has `aria-label="Dismiss announcement"`.
- Arrow icon has `aria-hidden="true"`.

## Data source: the `announcements` content collection

Banners are **not** hardcoded in the layout. They're markdown files in `src/content/announcements/`. Layout reads the collection at build time, picks the currently-active entry, and renders it. Remove all files → no banner renders.

### Schema (`src/content.config.ts`)

```ts
const announcements = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/announcements" }),
  schema: z.object({
    href: z.string().optional(),
    dismissible: z.boolean().default(true),
    startsAt: z.coerce.date().optional(),
    endsAt: z.coerce.date().optional(),
    enabled: z.boolean().default(true),
    priority: z.number().default(0),
  }),
});
```

### Frontmatter fields

| Field         | Type      | Default | Purpose                                                                   |
|---------------|-----------|---------|---------------------------------------------------------------------------|
| `href`        | `string?` | —       | Makes the banner a link                                                   |
| `dismissible` | `boolean` | `true`  | Passed through to the component's dismiss button                          |
| `startsAt`    | `Date?`   | —       | Banner is hidden before this date (UTC, ISO format)                       |
| `endsAt`      | `Date?`   | —       | Banner auto-expires after this date                                       |
| `enabled`     | `boolean` | `true`  | Manual on/off switch — useful to stage content without deleting           |
| `priority`    | `number`  | `0`     | Tie-breaker when multiple entries are active; highest wins                |

### Body

The markdown body is the banner text. Inline markdown is supported (`**bold**`, `[links](/)`, etc.) — it compiles to HTML via Astro's `render()`.

### Selection logic (in Layout.astro)

1. Load all entries via `getCollection("announcements")`.
2. Keep only entries where `enabled === true`.
3. Keep only entries whose `startsAt` is in the past (or missing).
4. Keep only entries whose `endsAt` is in the future (or missing).
5. Sort by `priority` descending, then by `startsAt` descending (most recent wins).
6. Take the first.
7. If nothing remains, no banner is rendered at all.

## Usage patterns

### Publish a banner now

Create `src/content/announcements/my-banner.md`:

```md
---
href: "/launch"
dismissible: true
enabled: true
---

**Launching today:** our new dashboard
```

Commit and deploy. Banner appears immediately.

### Schedule a banner for later

```md
---
href: "/series-a"
startsAt: "2026-05-01"
endsAt: "2026-05-15"
enabled: true
---

**New:** Announcing our Series A
```

Hidden before May 1, 2026. Auto-expires after May 15.

### Temporarily hide a banner without deleting

```md
---
enabled: false
---

Content stays here, untouched, for when you want it back.
```

### Multiple candidates: prioritize one

When two banners are both currently in-window, `priority` decides the winner:

```md
---
priority: 10
---

This wins.
```

## Build-time gotcha

Filtering uses `new Date()` evaluated **at build time**, not in the browser. If `endsAt` passes and the site hasn't rebuilt, the banner is still shown until the next deploy.

Common mitigations:
- **Scheduled rebuilds** — Netlify, Vercel, and Cloudflare Pages all support cron-triggered deploys. A nightly rebuild is usually enough for banner accuracy.
- **Client-side expiry check** — add a small script that hides the banner if `endsAt < now`. The data is already in the DOM at build time; JS just re-validates it.

For most marketing sites, nightly rebuilds are fine. Consider the client-side check if you publish time-sensitive banners (e.g., "sale ends at midnight").

## Notes

- Dismissal uses `sessionStorage`, so it resets when the browser session ends (not persistent across sessions).
- The banner is designed to be rendered into `Nav.astro`'s `announcement` slot, which positions it inside the grid layout.
- The height transition is CSS-driven (`transition: height 0.3s ease`).
- The component itself knows nothing about collections — it just receives slot content and props. That keeps it reusable if you ever want to drive it from a different data source (JSON, CMS, env var, etc.).
