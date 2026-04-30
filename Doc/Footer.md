# Footer

**File:** `src/components/Footer.astro`

## What it does

A site footer with a brand column (logo + tagline + social icons), three configurable link columns, and a bottom bar containing copyright text and legal links. Modeled on shadcnblocks **footer7**, restyled with the starter's design tokens. Aligns with the page grid via the same `section-grid-outside` pattern that `SectionMain` uses, so the footer's edge patterns line up perfectly with every section above it.

## Props

| Prop          | Type                          | Default                                                          | Description                                                  |
|---------------|-------------------------------|------------------------------------------------------------------|--------------------------------------------------------------|
| `tagline`     | `string`                      | "Components and blocks for building modern websites with…"      | Body text under the logo                                     |
| `copyright`   | `string`                      | `© ${current year} Miscreants. All rights reserved.`            | Text in the bottom bar                                       |
| `columns`     | `LinkColumn[]`                | `[{ heading: "Product", … }, { heading: "Company", … }, …]`      | Three (or any number of) link columns                        |
| `legal`       | `LinkItem[]`                  | `[{ label: "Terms" }, { label: "Privacy" }, { label: "Cookies" }]` | Inline legal links in the bottom bar                       |
| `socials`     | `SocialItem[]`                | GitHub, Twitter, LinkedIn, YouTube                               | Social icon row in the brand column                          |

### Type shapes

```ts
type LinkItem = { label: string; href: string };
type LinkColumn = { heading: string; items: LinkItem[] };
type SocialItem = { label: string; href: string; icon: string };  // icon = lucide name
```

`socials.icon` accepts any [Lucide](https://lucide.dev) icon name (e.g. `"lucide:github"`, `"lucide:twitter"`, `"lucide:linkedin"`).

## Usage

```astro
---
import Layout from "../layouts/Layout.astro";
import Footer from "../components/Footer.astro";
---

<Layout>
  <main>{/* page content */}</main>
  <Footer />
</Layout>
```

### Custom content

```astro
<Footer
  tagline="The fastest way to ship content sites."
  copyright="© 2026 Acme Inc."
  columns={[
    {
      heading: "Product",
      items: [
        { label: "Pricing", href: "/pricing" },
        { label: "Docs", href: "/docs" },
      ],
    },
    {
      heading: "Company",
      items: [
        { label: "About", href: "/about" },
        { label: "Careers", href: "/careers" },
      ],
    },
  ]}
  legal={[
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
  ]}
  socials={[
    { label: "GitHub", href: "https://github.com/acme", icon: "lucide:github" },
  ]}
/>
```

## Layout

- **Top region**, on `md+`: 12-column grid. Brand column spans 5, link columns span 7 (then internally split into 3 sub-columns).
- **Top region**, mobile: brand column on top, link columns below as a 2-column grid (3 columns from `sm` upward).
- **Bottom bar**: stacks on mobile, splits into `space-between` row on `md+`. Separated from the top region by `border-t border-stroke`.

## A11y

- Wrapped in `<footer aria-labelledby="footer-heading">` with a screen-reader-only `<h2>`.
- Each link column is its own `<nav aria-label="{heading}">`.
- Social row is a `<ul aria-label="Social media">`; each link carries its own `aria-label`.
- Bottom bar legal links are a `<ul aria-label="Legal">`.
- All interactive elements use the project's focus-ring tokens (`focus-visible:ring-focus`, `focus-visible:ring-offset-canvas`).

## Tokens

- Logo + tagline use `text-fg` / `text-fg-muted`.
- Column headings use `text-fg-subtle` (uppercase, tracked).
- Link hover: `text-fg-muted` → `text-fg`.
- Borders: `border-stroke`; social icon tiles use the same bordered `h-9 w-9 grid` pattern as the nav hamburger.
- The component uses `section-grid-outside` to ensure side `section-pattern` columns render at the page edges, matching every other section.
