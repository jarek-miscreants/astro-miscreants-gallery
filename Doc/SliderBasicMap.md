# SliderBasicMap

**File:** `src/components/SliderBasicMap.astro`
**Sibling:** [`SliderBasic`](./SliderBasic.md) — the underlying carousel.

## What it does

A thin convenience wrapper around `SliderBasic` that maps an array of items into default `CardFeatured` slides. Use it when you have data — typically from a content collection — and don't need bespoke per-slide markup. All `SliderBasic` props pass through unchanged via a rest spread.

If you need different children per slide, drop into `SliderBasic` directly. If you need a different card component, see [Adapting for a different card](#adapting-for-a-different-card) below.

## Props

All [`SliderBasic` props](./SliderBasic.md#props) — `mobile`, `mobileLandscape`, `tablet`, `desktop`, `gap`, `showArrows`, `showDots`, `draggable`, `ariaLabel`, `id`, `class` — plus:

| Prop         | Type           | Default        | Description                                                          |
|--------------|----------------|----------------|----------------------------------------------------------------------|
| `items`      | `SlideItem[]`  | (required)     | Array of slide data — see shape below                                |
| `cardClass`  | `string`       | `"bg-canvas"`  | Class applied to every mapped `CardFeatured`                         |
| `titleClass` | `string`       | `CardFeatured` default (`"h3"`) | Forwarded to every card; per-item override wins  |
| `titleTag`   | `"h1" … "h6"`  | `CardFeatured` default (`"h3"`) | Forwarded to every card; per-item override wins  |

### `SlideItem` shape

```ts
type SlideItem = {
  title?: string;
  description?: string;
  eyebrow?: string;
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  // Optional per-item overrides — useful when one slide needs a different
  // heading size from the rest.
  titleClass?: string;
  titleTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};
```

## Usage

### From an array

```astro
---
import SliderBasicMap from "../components/SliderBasicMap.astro";
---

<SliderBasicMap
  mobile={1}
  mobileLandscape={2}
  tablet={2}
  desktop={3}
  gap="md"
  ariaLabel="Resources"
  titleClass="h4"
  titleTag="h4"
  items={[
    { eyebrow: "Guide", title: "Getting started", description: "Spin up a project in under five minutes." },
    { eyebrow: "Reference", title: "Component API", description: "Props, slots, and data attributes for every component." },
    { eyebrow: "Tutorial", title: "Build a landing page", description: "Walk through composing sections from the starter kit." },
  ]}
/>
```

### From a content collection

```astro
---
import { getCollection } from "astro:content";
import SliderBasicMap from "../components/SliderBasicMap.astro";

const posts = await getCollection("posts");
const items = posts.map((p) => ({
  title: p.data.title,
  description: p.data.excerpt,
  eyebrow: p.data.category,
  imageSrc: p.data.cover?.src,
  imageAlt: p.data.title,
}));
---

<SliderBasicMap items={items} mobile={1} tablet={2} desktop={3} />
```

### Mixing manual and mapped slides

`SliderBasicMap` exposes a pass-through `<slot />` after the mapped items. Anything you put inside renders alongside the auto-generated cards.

```astro
<SliderBasicMap items={items}>
  <CardFeatured title="Featured" description="Hand-tuned slide" class="bg-panel" />
</SliderBasicMap>
```

## Equal heights

Inherits `SliderBasic`'s flex `align-items: stretch`. The default `cardClass` deliberately omits `h-full` — adding it back would break the stretch. See [`SliderBasic` → Equal heights](./SliderBasic.md#equal-heights) for the full explanation.

## Adapting for a different card

When you need a `SliderBasicMap`-style API but with a different card component, copy this file and follow the same structure. The recipe:

1. **Copy** `SliderBasicMap.astro` → e.g. `SliderTeamMap.astro`.
2. **Swap the import** — replace `CardFeatured` with the card you want.
3. **Redefine `SlideItem`** to match the new card's API (e.g. `name`, `role`, `photo`).
4. **Update the `items.map(...)` block** so each prop/slot maps to the new card's API.
5. **Keep the `<SliderBasic {...sliderProps}>` wrapper, the rest spread, and the pass-through `<slot />`** — they handle layout, breakpoints, dots, arrows, and drag for free.

```astro
---
import SliderBasic from "./SliderBasic.astro";
import CardTeam from "./CardTeam.astro";

type SlideItem = { name: string; role: string; photo: string };
// …same Props shape, but typed against the new card

const { items, cardClass = "bg-canvas", ...sliderProps } = Astro.props;
---

<SliderBasic {...sliderProps}>
  {items.map((item) => (
    <CardTeam name={item.name} role={item.role} class={cardClass}>
      <img slot="photo" src={item.photo} alt={item.name} />
    </CardTeam>
  ))}
  <slot />
</SliderBasic>
```

For 4+ variants, consider a generic `Card` component prop instead of copying. Astro doesn't make component-as-prop quite as ergonomic as React, so for 2–3 variants the copy approach is usually cleaner and stays grep-able.
