# HubspotForm

**File:** `src/components/HubspotForm.astro`

## What it does

Embeds a HubSpot form by loading the HubSpot Forms SDK and initializing it with the given portal and form IDs.

## Props

| Prop       | Type     | Default                                  | Description                       |
|------------|----------|------------------------------------------|-----------------------------------|
| `region`   | `string` | `"na1"`                                  | HubSpot data center region        |
| `portalId` | `string` | `"40120329"`                             | HubSpot portal (account) ID      |
| `formId`   | `string` | `"34f97be6-a435-4a54-a676-371efe148e70"` | Specific form ID to embed         |

## How it works

1. Renders an empty `<div id="hubspot-form-container">` as the mount target.
2. Loads the HubSpot Forms embed script (`//js.hsforms.net/forms/embed/v2.js`) via `is:inline`.
3. Calls `hbspt.forms.create()` with the provided props, targeting the container div.
4. Uses `define:vars` to pass Astro props into the inline script.

## Usage

```astro
---
import HubspotForm from "../components/HubspotForm.astro";
---

<!-- Default form -->
<HubspotForm />

<!-- Custom form -->
<HubspotForm
  region="eu1"
  portalId="12345678"
  formId="abcdef12-3456-7890-abcd-ef1234567890"
/>
```

## Notes

- The scripts use `is:inline` so they execute immediately (not deferred/bundled by Astro).
- The HubSpot SDK is loaded from an external CDN — this adds a third-party dependency and network request.
- Default prop values are specific to a particular HubSpot account. Update them for your own forms.
- No loading state or error handling — if the SDK fails to load, the container stays empty.
