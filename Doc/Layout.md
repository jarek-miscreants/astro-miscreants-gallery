# Layout

**File:** `src/layouts/Layout.astro`

## What it does

The base HTML layout wrapper for all pages. Sets up the document shell (`<html>`, `<head>`, `<body>`), loads global styles and fonts, includes the navigation, and optionally injects Google Analytics via Partytown.

## Props

| Prop    | Type     | Default              | Description        |
|---------|----------|----------------------|--------------------|
| `title` | `string` | `"Astro Playground"` | Page `<title>` tag |

## How it works

### Head

- Imports the Archivo Variable font via `@fontsource-variable/archivo`.
- Imports `global.css` (all theme tokens, utilities, and base styles).
- Sets charset, viewport, favicon, and generator meta tags.

### Google Analytics (optional)

- Reads `PUBLIC_GTAG_ID` from environment variables.
- If set, loads the gtag script with `type="text/partytown"` — this offloads the analytics script to a web worker via `@astrojs/partytown`, keeping the main thread clean.

### Body

- Renders `<Nav />` at the top of every page.
- Includes a **skip-to-content** link (`<a href="#main">`) that is visually hidden but becomes visible on focus for keyboard users.
- Page content is injected via `<slot />`.

## Usage

```astro
---
import Layout from "../layouts/Layout.astro";
---

<Layout title="Features">
  <main id="main">
    <!-- page content -->
  </main>
</Layout>
```

## Notes

- The skip link targets `#main` — pages should include `id="main"` on their `<main>` element for this to work.
- The skip link is placed **after** `<Nav />` in the DOM, which means it appears after the nav in tab order. This is intentional — the nav's own skip logic handles initial focus.
- Google Analytics only loads when `PUBLIC_GTAG_ID` is set in `.env`. No tracking code runs otherwise.
