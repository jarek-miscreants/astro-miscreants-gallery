# Plan

Working notes on direction and future moves for this starter. Not a contract — just things to do or consider when the right moment arrives.

## Distribution: GitHub Template Repository

**Status:** Not yet enabled. Defer until first time we start a second project from this codebase.

### What it is

GitHub's "Template repository" feature. One toggle in `Settings → General → Template repository`. Once enabled, the repo's main page gets a green **Use this template** button. Clicking it creates a brand-new repo for the consumer with:

- The current file tree, copied verbatim.
- A fresh git history (single initial commit) — no inherited commits, branches, or tags.
- A "generated from <template>" marker in the GitHub UI for traceability.
- No upstream link — the new repo is independent. No PRs, pulls, or merges flow back to or from the template.

Mechanically: this is "copy the starter as it is and adjust" — but with one click instead of five, and a clean history instead of an inherited one.

### What it does NOT solve

- **No upgrade path.** Bug fixes in the template don't propagate to projects already spawned from it. Same limitation as a manual copy.
- **No partial selection.** The consumer gets everything — every component, every doc, every config file. There's no "just give me the slider."
- **No version pinning.** Whoever clicks the button gets `main` at that moment. If `main` is mid-refactor, that's what they get.
- **No back-port automation.** If a downstream project fixes a bug worth keeping, we'd manually copy the fix back to the template.

These are intrinsic to the model. If they become real problems, we've outgrown the template approach and should look at the registry path (see below).

### When this is the right tool

- Personal/agency starter where we control all consumer projects.
- We just want the next project's first ten minutes to be smoother.
- We want CI workflows, lint configs, prettier configs, `Doc/` folder, etc. to carry forward without manual setup.

### When it's the wrong tool

- Distributing components individually → registry instead.
- Updates need to propagate across consumers → real npm package instead.
- Consumer wants only a subset → templates are all-or-nothing.

### Cost

Roughly zero. One toggle.

The only ongoing discipline: **whatever's on `main` is what new projects start with.** So `main` needs to stay template-quality. Branch experiments; don't park half-done refactors on `main`.

### How to enable (when ready)

1. Get `main` into a state we'd be happy starting a new project from.
2. Repo → Settings → General → tick **"Template repository"** at the top of the page.
3. Done.

### How a new project would use it

1. Click **Use this template → Create a new repository** on the GitHub page.
2. Name it for the new project.
3. Clone, `npm install`, edit demo content, ship.

New project carries: components, docs, configs, the `Doc/` folder. Strip out what's not needed (delete demo sections in `index.astro`, swap `Footer` defaults, etc.).

### Mental model

The template is **the best current snapshot of "how to start a new Astro project here."** Not a contract, not an API, not a versioned artifact — just a known-good starting point that gets slightly better each time it's updated. Over time it accumulates the rough edges already filed off, the small conveniences worth having from the start, the components reached for repeatedly.

## Component showcase site (in-repo)

**Status:** Not built yet. Planning only.

### Goal

Move every component demo out of `index.astro` and into a dedicated showcase area inside this same Astro project. `index.astro` becomes a clean marketing-style landing page; the showcase becomes the place to browse what's in the starter — like a mini docs site or a component "blog list," not Storybook, not a separate package.

### Desired UX

- `/` — clean landing page. Hero, maybe a single "what this is" section, a CTA pointing to the showcase. No demo sections.
- `/components` — index page. List of every component with a card per entry: name, one-line description, category tag, thumbnail or status badge. Grouped or filterable by category (primitive / block / pattern / layout).
- `/components/[slug]` — individual component page. Title, description, live preview, code snippet, props table, a11y notes, link to source file. Mirrors the structure of the existing `Doc/*.md` files.

### Data source: lean on Astro content collections

The `Doc/*.md` folder is already doing 80% of the work. Don't duplicate it — promote it to a content collection.

- Move `Doc/*.md` → `src/content/components/*.mdx` (rename to MDX so live previews are possible).
- Define the collection in `src/content.config.ts` alongside the existing `faq` and `announcements` collections.
- Frontmatter shape (proposed):

```yaml
---
title: SliderBasic
description: Horizontal carousel using native CSS scroll-snap.
category: pattern    # primitive | block | pattern | layout | form
order: 30            # within category
sourceFile: src/components/SliderBasic.astro
status: stable       # stable | adaptable | per-project — matches the registry-readiness mental model
related: [SliderBasicMap, CardFeatured]
---
```

- The body of the MDX file is exactly what's in `Doc/*.md` today (props tables, mechanism, gotchas) — but with one addition: an `<Preview>` block at the top that renders the live component.

### MDX is the right tool here

Plain `.md` can't import and render Astro components inline. MDX can. That unlocks:

```mdx
import SliderBasic from "@components/SliderBasic.astro";
import CardFeatured from "@components/CardFeatured.astro";
import Preview from "@components/_docs/Preview.astro";

<Preview>
  <SliderBasic mobile={1} tablet={2} desktop={3}>
    <CardFeatured title="Slide one" description="…" />
    <CardFeatured title="Slide two" description="…" />
  </SliderBasic>
</Preview>
```

Without MDX we'd be stuck with iframes or screenshot images — much worse UX, much more maintenance.

### Page templates needed

1. **`src/pages/components/index.astro`** — reads the full collection, groups by `category`, renders a card grid. One existing component (`CardFeatured`) is already most of what each card needs.
2. **`src/pages/components/[...slug].astro`** — dynamic route that renders one MDX entry. Layout: header (title, description, category badge), live preview area, props table, body content (mechanism, a11y, gotchas), footer (related components, link to source).
3. **`src/components/_docs/Preview.astro`** (new) — reusable wrapper for live previews. Border, label, optional "Preview / Code" tab toggle (lean on the existing `Tabs` component). Underscore prefix keeps it out of the public component list.
4. **`src/components/_docs/PropsTable.astro`** (new) — renders prop tables consistently, possibly from frontmatter data so it's not just freeform markdown.

### Navigation

- Add a "Components" link to the primary nav (or treat it as the only meaningful navigation if `/` is going minimal).
- On `/components/[slug]`, add a sidebar listing all components grouped by category. The active page highlights itself. The existing `NavMorph` mega-menu pattern could be reused for category groupings.
- Search comes later. Pagefind is the obvious fit (zero-config, build-time, ~70KB), but defer until there are 30+ components.

### Index page after the move

Strip everything below `<SectionMain id="hero">`. Keep:
- The hero.
- The clients/logos section.
- Maybe one feature card section as a "what's inside" teaser.
- A CTA section at the bottom: "Browse all components →"

Everything else (Tabs, Accordion, Slider demos, FlowSteps, Combobox, FAQ) moves to the showcase. `index.astro` shrinks from ~300 lines to ~60.

### Phasing

**Phase 1 — Move docs to a collection (no MDX yet, no live previews).**
- Migrate `Doc/*.md` → `src/content/components/*.md` with frontmatter.
- Build `/components` index and `/components/[slug]` pages rendering the markdown.
- Strip `index.astro` to its clean shape.
- Outcome: docs are now navigable as a site, not a folder. Live previews still missing.

**Phase 2 — Add MDX + live previews.**
- Convert `.md` → `.mdx`, add `import` statements, wrap each component in `<Preview>`.
- Build the `Preview` and `PropsTable` components.
- Outcome: pages now look like a real component showcase. ~70% of the value of Storybook for ~5% of the setup.

**Phase 3 — Polish.**
- Sidebar with category grouping on slug pages.
- Pagefind search if the count justifies it.
- Light/dark toggle inside the preview frame (uses existing `data-theme` setup).
- "View source" link — could fetch the actual file content and render in a code block.

### Tradeoffs vs. alternatives

| Option | Pros | Cons |
|---|---|---|
| **In-repo MDX showcase** (this plan) | Zero extra deps. Lives next to the components. Builds with the starter. Consumer of the template gets the showcase too. | Adds routes to a marketing-style starter. Build time grows. |
| **Storybook** | Industry standard. Per-component stories. Addons (a11y, viewport, controls). | Heavy install. Different mental model from Astro. Long-term maintenance. Doesn't render real Astro components — re-mounts in a sandbox. |
| **Separate docs site** (e.g. Starlight subdir) | Clean separation between marketing site and component docs. Starlight is purpose-built for this. | Two builds. Components have to be importable across boundaries. Loses the "one repo, one build" simplicity. |

Verdict: in-repo MDX wins for this stage. Reconsider Storybook only if interactive prop controls become essential, which is rarely true for design-system-style components.

### Interaction with the template-repo plan

When this starter becomes a GitHub template, **the showcase ships to consumer projects too.** That's a feature: a new project starts with a complete in-repo reference for every component, not just source files. Consumers strip showcase pages they don't need (or keep them as their internal team's reference). The `_docs/` underscore-prefixed components and the `src/content/components/` collection survive the copy.

The only friction: consumer projects with their own marketing pages will want `/components` to either stay public (acts as their own design-system documentation), become auth-gated, or get deleted entirely. Worth a one-line note in the template's README.

### Open questions to resolve when building

- Does the showcase live at `/components` or `/dev/components` or `/showcase`? (Probably `/components` — short, clear, fine if it ships in template projects.)
- Auto-generate prop tables from TypeScript interfaces, or write them by hand? (Hand for v1; auto-gen via `astro-args` or similar later if maintenance burden grows.)
- Does the live preview support multiple variants per component (like Storybook stories), or just one canonical example? (One canonical for v1; multiple later if needed.)
- Should `index.astro` still demo *anything*? (Maybe the hero + one block, with everything else moved.)

## Component roadmap

Brainstorm of components that recur across multi-build Astro work, grouped by frequency-of-need. Existing components (Tabs, Accordion, Modal, Dropdown, Media, Cards, Nav, Footer, FlowSteps, FilterBar, ComboboxGrouped, Slider, LogoMarquee, HubspotForm, Breadcrumbs, AnimatedTags, ButtonGroup, Button, Logo, LogoMenu, ShinyButton, Icon, HeroCanvas, FeatureScrollSpy, Grid, SectionMain, Layout, Clickable) are not re-listed.

### Almost certainly needed on every project

- **Toast / Notifier** — single primitive any code can call (`window.toast("Saved")`) to show a transient message. Built on `<output>` + `aria-live` patterns. Solves the "I added a form, now what about feedback?" gap.
- **Tooltip** — popover-API based (same foundation as Dropdown). Hover + focus to open, Escape to close, anchored to trigger.
- **Form** — thin `<Form>` wrapper around `<form>`. Progressive enhancement (works without JS), client-side validation messages with `aria-describedby`, submission state (`data-form-status="submitting|success|error"`), honeypot, success/error region.
- **Field** — labeled input row with built-in error message slot, `aria-describedby` wiring, optional helper text. Wraps `<input>`, `<textarea>`, `<select>` uniformly.
- **CodeBlock** — wraps `<Code />` from `astro:components` with copy-to-clipboard, language label, optional line highlighting, optional line numbers.
- **CopyButton** — tiny but extracted. Shares "copied!" feedback with toast pattern.
- **Drawer** — Modal's sibling. Slide-in from edge (left/right/bottom), same a11y posture as Modal but used for nav/filters on mobile, side panels on desktop.
- **Pagination** — page-N-of-M with prev/next + numeric pages, keyboard-navigable, ARIA `role="navigation"` + `aria-label`, with "show more" alternative form.

### Frequently needed on content sites

- **Card (generic)** — base card with header/media/body/footer slots. Specialized `CardFeatured` and `CardIcon` already exist.
- **CTA / Banner** — full-width promo strip, dismissible variant. Different from `AnnouncementBanner` (which is the top strip).
- **Stat** — number + label + delta arrow, with `tabular-nums` and optional sparkline.
- **PriceTable** — pricing tier card grid.
- **ComparisonTable** — feature × tier matrix with sticky header row, mobile collapse.
- **Testimonial** — quote + author + role + photo + optional logo.
- **TestimonialMarquee / Wall** — `LogoMarquee`-style pattern with text cards.
- **Avatar** — image + initials fallback + optional online indicator + size variants.
- **Badge / Tag** — status chip with color variants from semantic tokens.
- **VideoEmbed** — YouTube/Vimeo with click-to-load thumbnail (no third-party JS until activated). Different from `Media` (self-hosted MP4).
- **Carousel / SliderTouch** — touch-aware, snap-scroll, peek-next-card carousel. `SliderBasic` exists already.
- **Newsletter** — input + button, success/error states, integration-agnostic.
- **CookieBanner** — GDPR-aware consent strip, persisted in localStorage.
- **ScrollProgress** — top-of-page reading progress bar.
- **TableOfContents** — auto-generated from headings, with active-section highlight on scroll.

### Marketing / landing-page specific

- **HeroSplit** — left text / right media split layout. Sibling to `HeroCanvas`.
- **FeatureGrid** — N×M grid of icon + title + description.
- **LogoCloud** — static counterpart to `LogoMarquee`.
- **TimelineVertical** — `FlowSteps` may already cover this; check.
- **CaseStudyCard** — testimonial + result stats + customer logo bundle.
- **CTA (bottom-of-page)** — distinct from a generic banner: full-bleed, single headline, primary action.

### Data-heavy / app surfaces (only if needed)

- **DataTable** — sortable columns, sticky header, row selection. Big lift; only build if actually needed.
- **EmptyState** — illustration + heading + description + action.
- **CommandPalette** — `Cmd+K` overlay with fuzzy search. Skip unless docs.
- **DateRangePicker** — extremely client-specific, expensive to build well, native `<input type="date">` covers 80%. Skip in starter.

### Layout / composition primitives

- **Stack / Cluster / Grid** — composition utilities. Tailwind covers via classes; component form is optional.
- **Reveal** — IntersectionObserver fade/slide-in on scroll. Wraps any element, opt-out via `prefers-reduced-motion`.
- **Marquee** — generalize `LogoMarquee` to accept any children.
- **Section** — wraps the existing `section-gutter`/`section-padding`/`theme` utilities.
- **ThemeToggle** — flips `data-theme` on `<html>` between light/dark/brand. Persists in localStorage.

### Highest-ROI subset

1. **Toast + Form + Field** — form-feedback trio. Touches every client.
2. **Tooltip** — same Popover-API foundation as Dropdown; cheap to add now.
3. **CodeBlock + CopyButton** — instant doc-site polish.
4. **Drawer** — completes the overlay set (Modal + Drawer + Dropdown + Tooltip).
5. **Pagination + EmptyState** — list-page pair.

### What to skip in the starter

- DataTable, CommandPalette, DateRangePicker — too client-specific, easy to over-engineer, low reuse.
- Stack/Cluster/Grid as components — Tailwind utilities are sufficient.
- Project-specific GSAP timelines — those belong in the project, not the starter.

### Current iteration

User-selected highest-ROI pass: **Tooltip, CodeBlock, TableOfContents, Form/Field, Tag, Pagination.**

## Long-term: shadcn-style component registry

**Status:** Not yet relevant. Revisit only after running 4–5 projects off the template and noticing that "copy the whole starter" is too coarse.

The natural next step beyond a template repo. Components become individually addressable via a CLI (`npx <our-cli> add slider-basic`) that copies just the requested component plus its dependencies. shadcn invented this model precisely because traditional npm libraries trade per-project flexibility for centralized maintenance — a tradeoff that's bad for design-system components.

### Why this fits Astro

- `.astro` files don't publish cleanly as ES modules to npm. Pre-compiling them loses Astro's island optimization, scoped CSS, and zero-JS-by-default story.
- Components rely on Tailwind v4 token CSS vars (`--color-fg`, `--color-canvas`, etc.) that need to exist in the consumer project. A registry can install both source files and the token foundation; an npm package would require the consumer to wire it up.
- Per-project tweaks remain free — once copied, the file is owned by the new project. No semver pressure.

### What we'd build

Three layers:

1. **Token foundation init.** A `init` command that writes `src/styles/global.css` with the token block, sets up `tsconfig.json` paths, registers `astro-icon` in `astro.config.mjs`. This is the prerequisite that makes everything else work.
2. **Component registry.** Each component becomes a JSON manifest pointing at its file plus dependencies. shadcn's [registry format](https://ui.shadcn.com/docs/registry) now supports any framework — we'd reuse it rather than invent one.
3. **Distribution.** A static JSON file hosted on GitHub Pages, Cloudflare Pages, or similar. ~$0/year.

### Habits to keep building toward this (zero cost today)

These cost nothing now and unlock the registry path with no rework:

- Token-only styling (already 100% on this).
- Self-contained components — minimal imports, no hidden globals.
- One file per component, no barrel re-exports.
- Per-component docs in `Doc/` (already doing this).
- Inline scripts scoped per component via `[data-component]` attributes (already doing this).
- Props with defaults — registry version would swap demo defaults for placeholders, but the prop *shape* doesn't change.

### Things to avoid (would force rework later)

- Project-wide globals beyond the token CSS.
- Tightly coupled compositions (component X only works inside Layout Y).
- Implicit Tailwind config dependencies (`text-brand` defined only in `tailwind.config`).
- Magic values from `astro.config.mjs`.
- Heavy dependencies for tiny features (`gsap` for `Tabs` is fine — one heavy dep for one feature-rich component; avoid pulling in big libs for small wins).

### Ordering

1. **Now → 6 months:** Build sites with the starter via copy. Refine components based on real use. No distribution work.
2. **First time we start a second project:** Toggle the template repo flag. Done.
3. **When we have 4–5 projects and notice we only want some components in a new project:** Build the tiny CLI + registry JSON. Probably a weekend of work.
4. **If a component genuinely stabilizes across projects** (we stop editing it after copying): consider promoting from "registry copy" to "real npm dependency." For most design-system components this never happens — and that's fine.
