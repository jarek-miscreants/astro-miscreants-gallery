# ComboboxGrouped

**File:** `src/components/ComboboxGrouped.astro`

## What it does

A searchable dropdown with grouped options. Includes live filtering, full keyboard navigation, group headings that hide automatically when their items are filtered out, an empty state, and form integration via a hidden input.

## Props

| Prop                | Type        | Default                            | Description                                                       |
|---------------------|-------------|------------------------------------|-------------------------------------------------------------------|
| `id`                | `string`    | random `combobox-xxxxx`            | ID on the root and prefix for option IDs                          |
| `name`              | `string`    | —                                  | If provided, emits a hidden `<input>` for `<form>` submission     |
| `groups`            | `Group[]`   | (required)                         | Grouped options — see shape below                                 |
| `value`             | `string`    | —                                  | Initial selected value (must match an `item.value` in `groups`)   |
| `placeholder`       | `string`    | `"Select an option…"`              | Trigger text when nothing is selected                             |
| `searchPlaceholder` | `string`    | `"Search…"`                        | Placeholder for the search input                                  |
| `emptyText`         | `string`    | `"No results found."`              | Message shown when the filter hides every option                  |
| `ariaLabel`         | `string`    | `"Select an option"`               | Accessible name on the trigger and listbox                        |
| `class`             | `string`    | `""`                               | Extra classes on the root                                         |

### Type shapes

```ts
type Item = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};
type Group = {
  heading: string;
  items: Item[];
};
```

## Usage

```astro
---
import ComboboxGrouped from "../components/ComboboxGrouped.astro";
---

<form method="post" action="/submit">
  <ComboboxGrouped
    name="framework"
    placeholder="Select a framework…"
    ariaLabel="Choose a framework"
    groups={[
      {
        heading: "Frameworks",
        items: [
          { value: "astro", label: "Astro", description: "Content-focused, ships zero JS by default" },
          { value: "nextjs", label: "Next.js", description: "React framework with SSR + static" },
          { value: "nuxt", label: "Nuxt", description: "Vue framework with SSR + static" },
        ],
      },
      {
        heading: "Bundlers",
        items: [
          { value: "vite", label: "Vite", description: "ESM-native dev server" },
          { value: "rollup", label: "Rollup", description: "Library-friendly bundler", disabled: true },
        ],
      },
    ]}
  />

  <button type="submit">Continue</button>
</form>
```

### Pre-selected value

```astro
<ComboboxGrouped value="astro" groups={…} />
```

The trigger text and check icon are pre-rendered server-side, so the right option appears even before JS hydrates.

### Reacting to changes from JS

The component dispatches a custom event `combobox:change` on the root whenever a selection is made:

```html
<script>
  document.querySelector("#my-combobox")?.addEventListener("combobox:change", (e) => {
    const { value, label } = e.detail;
    console.log("Selected:", value, label);
  });
</script>
```

The hidden `<input name="…">` value is updated on the same change, so server-side form handling needs no JS at all.

## Behavior

- **Open / close.** Trigger click toggles the panel. ArrowDown / Enter / Space on the trigger opens it. Click outside closes. Esc closes and returns focus to the trigger.
- **Filter.** Typing in the search input filters items live by combined `label + description` text. Group headings hide when all their items are filtered out. The empty state replaces the list when nothing matches.
- **Keyboard nav.** While the panel is open, focus stays on the search input. ArrowUp/Down moves the highlight (skipping disabled items), Home/End jump to first/last visible, Enter selects, Tab closes naturally.
- **Selection.** Clicking an option (or pressing Enter on the highlighted one) writes its value into the hidden input, updates the trigger label, marks the option `aria-selected="true"`, shows its check icon, dispatches `combobox:change`, closes the panel, and returns focus to the trigger.
- **Disabled items.** Items with `disabled: true` are visually muted, not selectable by mouse or keyboard, and skipped by ArrowUp/Down.
- **Mouse hover.** Moving the mouse over an option moves the keyboard highlight too, so the visual state always matches the active descendant.

## A11y

- Trigger: `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls={listboxId}`.
- Search input: `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded="true"`, `aria-controls={listboxId}`, `aria-activedescendant={highlightedOptionId}`.
- List: `role="listbox"`, `aria-label`.
- Options: `role="option"`, `aria-selected`, `aria-disabled`. Each option has a stable ID that the search input can reference via `aria-activedescendant`, so screen readers announce the highlighted option without DOM focus moving away from the input.
- Group wrappers and headings use `role="presentation"` so they don't appear as items in the AT navigation flow.
- All interactive elements use the project's focus-ring tokens (`focus-visible:ring-focus`, `focus-visible:ring-offset-canvas`).

## Tokens

- Trigger uses `bg-canvas`, `border-stroke` / `hover:border-stroke-strong`, `text-fg`.
- Panel uses `bg-panel` with `shadow-popover` and a `border-stroke` outline.
- Group headings use `text-fg-subtle` (uppercase, tracked) — same treatment as the nav mega menu.
- Hover / active option backgrounds use `bg-panel-muted`.
- Selected check icon uses `text-intent` and only renders for the selected option.
- Disabled options use `aria-disabled` styling: `cursor-not-allowed` + `opacity-50`.

## Form integration

Pass `name="myField"` and the component emits a hidden `<input>` whose value is kept in sync with the selection. That means the combobox works inside a normal `<form>` with no extra plumbing — server-side handlers receive `myField=astro` (or whatever was selected). If `name` is omitted, no hidden input is emitted; consumers can still read the value via the `combobox:change` event or the `data-combobox-value` attribute.

## Gotchas

1. **Multiple instances on a page.** Each combobox auto-generates a unique ID via `Math.random()`, so two on the same page won't collide. If you pass an explicit `id`, make it unique per page yourself.
2. **`value` must match an `item.value`.** If you pass a `value` that doesn't exist in `groups`, the trigger falls back to the placeholder.
3. **Filter matches both label and description.** Watch out for typos in descriptions surfacing matches you didn't intend. To filter on label only, swap the `text` line in the script's `filter` function.
4. **The panel uses `position: absolute; left: 0; right: 0; top: 100%`.** It sits below the trigger and matches its width. If the panel would clip at the bottom of the viewport, you'll need to add a flip-up adjustment yourself — not built in to keep the component minimal.

## Full example with layout

Example implementation with a layout:

```astro
<SectionMain id="combobox" padding="sm" borderTop>
  <Grid mobile={1} mobileLandscape={2} tablet={2} desktop={2} gap="sm">
    <div class="flex flex-col gap-4 mb-6">
      <h2 class="h3">Combobox — grouped</h2>
      <p class="mt-2 text-fg-muted">Searchable dropdown with grouped options, full keyboard nav, and form support.</p>
    </div>

    <div class="max-w-sm">
      <ComboboxGrouped
        name="framework"
        placeholder="Select a framework…"
        ariaLabel="Choose a framework"
        groups={[
          {
            heading: "Frameworks",
            items: [
              { value: "astro", label: "Astro", description: "Content-focused, ships zero JS by default" },
              { value: "nextjs", label: "Next.js", description: "React framework with SSR + static" },
              { value: "nuxt", label: "Nuxt", description: "Vue framework with SSR + static" },
              { value: "sveltekit", label: "SvelteKit", description: "Svelte's official meta-framework" },
            ],
          },
          {
            heading: "Styling",
            items: [
              { value: "tailwind", label: "Tailwind CSS", description: "Utility-first CSS framework" },
              { value: "vanilla-extract", label: "vanilla-extract", description: "Type-safe CSS-in-TS" },
              { value: "css-modules", label: "CSS Modules", description: "Scoped class names" },
            ],
          },
          {
            heading: "Bundlers",
            items: [
              { value: "vite", label: "Vite", description: "ESM-native dev server" },
              { value: "esbuild", label: "esbuild", description: "Go-based, very fast" },
              { value: "rollup", label: "Rollup", description: "Library-friendly bundler", disabled: true },
            ],
          },
        ]}
      />
    </div>
  </Grid>
</SectionMain>
```
