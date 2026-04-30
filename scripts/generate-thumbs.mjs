// Generate per-component thumbnails by screenshotting the first <Preview>
// block on each component detail page.
//
// Setup:
//   npm install --save-dev playwright
//   npx playwright install chromium
//
// Usage (with `npm run dev` already running in another shell):
//   node scripts/generate-thumbs.mjs
//   node scripts/generate-thumbs.mjs --port=4340
//   node scripts/generate-thumbs.mjs --only=glow-card,grainient
//   node scripts/generate-thumbs.mjs --skip-existing
//
// Output lands in `public/thumbs/<component-id>.png`. The gallery's index
// page picks them up by convention — no frontmatter changes needed.

import { chromium } from "playwright";
import { mkdir, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

// --- args ----------------------------------------------------------------
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);
const port = String(args.port || "4321");
const only = args.only ? String(args.only).split(",").map((s) => s.trim()) : null;
const skipExisting = !!args["skip-existing"];

// --- collect component ids straight from the MDX directory --------------
const contentDir = join(projectRoot, "src", "content", "components");
const ids = (await readdir(contentDir))
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => f.replace(/\.mdx$/, ""))
  .sort();

const targets = only ? ids.filter((id) => only.includes(id)) : ids;
if (targets.length === 0) {
  console.error("No matching components found.");
  process.exit(1);
}

const outDir = join(projectRoot, "public", "thumbs");
await mkdir(outDir, { recursive: true });

const baseUrl = `http://localhost:${port}`;
console.log(`Targeting ${baseUrl} — ${targets.length} component(s).`);

// --- screenshot each preview --------------------------------------------
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 2,
  colorScheme: "dark",
});
const page = await ctx.newPage();

let ok = 0;
let skipped = 0;
let missing = 0;

for (const id of targets) {
  const outPath = join(outDir, `${id}.png`);
  if (skipExisting && existsSync(outPath)) {
    console.log(`· ${id} (skip — exists)`);
    skipped++;
    continue;
  }

  const url = `${baseUrl}/components/${id}/`;
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
  } catch (e) {
    console.warn(`✗ ${id} (navigation failed: ${e.message})`);
    missing++;
    continue;
  }

  // First Preview block's inner content area. Falls back to the figure if
  // for some reason the inner div selector misses.
  const preview =
    (await page.$("[data-doc-preview] > div:not(figcaption)")) ||
    (await page.$("[data-doc-preview]"));
  if (!preview) {
    console.warn(`✗ ${id} (no <Preview> block on the page)`);
    missing++;
    continue;
  }

  // Give animations / fonts / WebGL a beat to settle before capturing.
  await page.waitForTimeout(400);
  await preview.screenshot({ path: outPath });
  console.log(`✓ ${id}`);
  ok++;
}

await browser.close();

console.log(
  `\nDone — ${ok} written, ${skipped} skipped, ${missing} without preview.`,
);
