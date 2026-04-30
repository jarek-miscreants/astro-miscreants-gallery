# TestComponent

**File:** `src/components/TestComponent.astro`

## What it does

A minimal test/demo component that displays a greeting message. Used for learning and experimenting with Astro component patterns.

## Props

| Prop      | Type     | Default | Description                          |
|-----------|----------|---------|--------------------------------------|
| `message` | `string` | —       | Name or text shown in the greeting   |
| `class`   | `string` | `""`    | Additional classes on the outer div  |

## How it works

- Demonstrates the `class` prop pattern: accepts `class` in the interface, aliases it to `className` in destructuring (since `class` is a JS reserved word), and applies it via `class:list`.
- Renders "Hello, {message}!" using the `h4` fluid typography utility.

## Usage

```astro
---
import TestComponent from "../components/TestComponent.astro";
---

<TestComponent message="World" class="bg-white rounded-lg" />
```

## Notes

- This is a learning component — not intended for production use.
- Good reference for the `class` prop aliasing pattern used throughout the project.
