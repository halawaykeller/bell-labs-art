# bell-labs-art

A small static-SVG project: 14 figures from a 1932 Bell System Technical Journal paper on capacitance bridge measurement, redrawn as transparent SVGs in a single monospace off-white style. Renders both as interactive HTML previews and as standalone `.svg` files committed to `dist/static/`.

The repo is shared mostly for the build approach. A few patterns here are reusable for anyone who needs to produce a batch of structured technical diagrams as code.

## Patterns worth stealing

**Pure-string SVG primitives, no DOM.** `shared/components.js` is a single ~675-line module that exports primitive generators (`resistor`, `capacitor`, `inductor`, `galvanometer`, `ground`, `wire`, `node`, etc.) — each one returns an SVG markup string. No JSDOM, no `document`, no React. The same module is imported unmodified by browser preview pages and by Node export scripts. One source of truth for what a "resistor" looks like.

**Single render path for preview and export.** The static HTML preview pages (`figures/fig-NN.static.html`) and the exported `dist/static/fig-NN.svg` files are produced from the exact same `svg(...)` calls in the same per-figure module. The preview is not a separate codepath that drifts from the export — it embeds the export verbatim. If the SVG looks right in the browser, the file on disk is the same SVG.

**Primitives test sheet first.** Before any figure was built, `figures/primitives.html` was assembled as a flat grid of every primitive in every variant (different lengths, peak counts, orientations). All visual debugging happens there once, not 14 times across 14 figures. New primitives go on the sheet before they're used in compositions.

**Pilot one, then scale.** Figure 02 was built end-to-end first, including export verification on multiple background colors, before the remaining 13 were attempted. The composition idioms (how to express a wire path, how to anchor a label, how a galvanometer connects to two nodes) were shaken out on the pilot, then reused as functions (`alongArm`, `plainArm`, `junction`, `nodeAnchor`) imported by the rest.

**Spec / plan separation.** `CLAUDE.md` describes what the project is forever — aesthetic constraints, primitive rules, file layout. `PLAN.md` describes per-artifact interpretation — which components are in which figure, layout choices, telemetry strings. Keeping these in two files meant the spec didn't churn as the figures got built.

## Build pipeline

```
node export.js
```

runs in order:

1. `scripts/render-all.js` — for each figure, imports `figures/fig-NN.js`, calls its composition function, writes `dist/static/fig-NN.svg` (full composition) and `dist/static/fig-NN-diagram.svg` (tight-viewBox diagram only), and writes a `figures/fig-NN.static.html` preview page that embeds the just-rendered SVGs against three different backgrounds for compositing verification.
2. `scripts/render-primitives.js` — regenerates the primitives test sheet.
3. `scripts/render-index.js` — generates `index.html`, a thumbnail grid linking to each figure.
4. `scripts/render-landing.js` — generates `landing.html`.

There's no bundler. ESM modules are imported directly by Node and by `<script type="module">` in the browser.

## How it was built

The repo was built in iterative pairing with Claude Code. The order was:

1. Examine the 14 source images, write `PLAN.md` describing each one (components, topology, where it sits on the canvas, what its caption and telemetry should say). Review and adjust the plan before any code.
2. Write `shared/components.js` and `shared/style.css`. Build `figures/primitives.html` as a primitive test sheet. Iterate on stroke weight, line caps, joins, and proportions until the primitives read correctly against a `#444` preview background and against intended composite backgrounds (`#3d2f4a`, `#2e3863`, `#000`).
3. Build figure 02 end-to-end as a pilot. Add composition helpers (`alongArm`, `plainArm`, `junction`, `nodeAnchor`) to `components.js` as the figure exposes a need for them. Verify the static SVG composites cleanly onto the test backgrounds.
4. Build the remaining 13 figures using the same patterns. Each new figure occasionally surfaced one new primitive (a galvanometer variant, a switch, a vector arrow); those went onto the primitives sheet before being used.
5. Wire `export.js` to run the full render pipeline in one command.

What worked: making the primitives library and a single pilot figure good before scaling. What slowed things down: building primitives without a downstream caller — it was easy to make one that looked fine on the test sheet but didn't compose well in a real figure. The pilot caught several of those.

## Layout

```
shared/components.js     SVG primitive generators (pure-string, browser + Node)
shared/style.css         preview-page styles only; SVGs themselves are styleless

figures/primitives.html  primitive test sheet
figures/fig-NN.js        composition function for figure NN
figures/fig-NN.static.html  preview embedding the rendered SVG against test backgrounds

scripts/render-all.js    walks all figures, writes dist/static/*.svg + previews
scripts/render-primitives.js, render-index.js, render-landing.js
export.js                top-level driver

dist/static/             committed SVG outputs

inputs/                  source scans from the BSTJ paper + visual reference targets
PLAN.md                  per-figure interpretation
CLAUDE.md                evergreen project spec
```

## Run it

```
npm run serve            # python3 -m http.server 5173
node export.js           # rebuild everything in dist/static and the preview pages
```

Open `http://localhost:5173/index.html` for the figure index, or any individual `figures/fig-NN.static.html`.

## Source material

Figures are from a 1932 BSTJ paper on capacitance bridge measurement. The doc references in the corners of the compositions (e.g. `BSTJ V11 N1 / FIG 02 / 1932`) are plausible but authored — they fit the visual register and are not archivally accurate.
