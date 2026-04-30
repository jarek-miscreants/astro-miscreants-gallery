# AccordionFAQ (preset)

**File:** `src/components/AccordionFAQ.astro`
**Primitive:** [`Accordion`](./Accordion.md)

## What it does

A typed, mapped preset over the `Accordion` primitive. Takes a list of `{ question, answer }` objects and renders a styled FAQ-style disclosure list with sensible defaults: native `<button>` triggers, chevron that rotates on open, muted answer text, bottom borders between items. All behavior and accessibility come from the primitive — this component only adds the markup and default styling.

Use this when you have straightforward question/answer content (e.g., an FAQ content collection). For rich content inside items — embedded buttons, videos, images, custom per-item styling — use the primitive directly.

## Props

| Prop                | Type                                          | Default | Description                                                 |
|---------------------|-----------------------------------------------|---------|-------------------------------------------------------------|
| `items`             | `{ question: string; answer: string }[]`      | —       | The list of question/answer pairs to render                |
| `closePrevious`     | `boolean`                                     | `true`  | Close other items when one opens (single-open mode)        |
| `openByDefault`     | `number`                                      | —       | 1-based index of the item to open on page load             |
| `class`             | `string`                                      | —       | Additional classes on the wrapper                          |

Does **not** forward `closeOnSecondClick` — defaults to `true` from the primitive, which is almost always what you want for FAQs.

## What it renders

For each item:

```html
<div data-accordion="item" class="border-b border-stroke">
  <button type="button" data-accordion="button" class="...">
    <span>{question}</span>
    <Icon data-accordion="icon" name="lucide:chevron-down" />
  </button>
  <div data-accordion="content">
    <div class="pb-5 text-body-lg text-fg-muted">{answer}</div>
  </div>
</div>
```

- Triggers are **native `<button>` elements** — correct focus, activation, and screen-reader semantics out of the box.
- Chevron is `lucide:chevron-down` via `astro-icon`, rotates 180° on open (inherited from the primitive's CSS).
- Answer text uses the semantic `text-fg-muted` token so it flips in dark mode automatically.
- `prefers-reduced-motion` is respected via the primitive's CSS — no extra wiring needed.

## Usage

### From inline data

```astro
---
import AccordionFAQ from "../components/AccordionFAQ.astro";

const faqItems = [
  { question: "What is Astro?", answer: "A web framework for content-driven websites." },
  { question: "How does it compare to Next.js?", answer: "Astro ships less JavaScript by default." },
];
---

<AccordionFAQ items={faqItems} />
```

### From the `faq` content collection

```astro
---
import { getCollection } from "astro:content";
import AccordionFAQ from "../components/AccordionFAQ.astro";

const faqs = (await getCollection("faq"))
  .filter((faq) => faq.data.page === "homepage")
  .sort((a, b) => a.data.order - b.data.order);

const items = faqs.map((faq) => ({
  question: faq.data.question,
  answer: faq.body ?? "",
}));
---

<AccordionFAQ items={items} openByDefault={1} />
```

## When to use the primitive instead

Reach for [`Accordion`](./Accordion.md) when:

- Each item's body contains rich content (buttons, videos, embedded code, lists with custom styles)
- You need per-item styling differences (different background per item, custom icons)
- The trigger is more than plain text + chevron (icon + text + badge, for example)
- You want a different default typography scale for questions/answers

`AccordionFAQ` is intentionally opinionated — when you need to override its rendering, you're better off writing the primitive's markup yourself than fighting the preset.

## Notes

- Answer text is rendered as plain text. If you need markdown in answers (bold, links), render the markdown body yourself before passing it in — e.g., via `<Fragment set:html={compiledMarkdownHtml} />` inside the primitive instead of this preset.
- `AccordionFAQ` adds `border-b border-stroke` to each item and `flex flex-col` to the wrapper. Override via the `class` prop if you want different separators.
