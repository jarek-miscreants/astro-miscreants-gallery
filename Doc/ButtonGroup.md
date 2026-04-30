# ButtonGroup

**File:** `src/components/ButtonGroup.astro`

## What it does

A simple layout wrapper that arranges child buttons (or any elements) in a horizontal row with consistent spacing.

## Props

None.

## How it works

- Uses `flex flex-wrap gap-3 mt-4` to lay out children in a row that wraps on smaller screens.
- Children are passed via the default `<slot />`.

## Usage

```astro
---
import ButtonGroup from "../components/ButtonGroup.astro";
import Button from "../components/Button.astro";
---

<ButtonGroup>
  <Button label="Learn More" href="#features" />
  <Button label="Get a Demo" variant="secondary" href="/demo" />
</ButtonGroup>
```

## Notes

- This is a pure layout component with no logic or scripts.
- The `mt-4` margin is baked in — it assumes the group sits below a heading or paragraph.
