# bell-labs-art

14 figures from a 1932 Bell System Technical Journal paper on capacitance bridge measurement, redrawn as transparent SVGs in a single monospace off-white style. Output is both interactive HTML previews and standalone `.svg` files in `dist/static/`.

Shared mostly for the build approach. A few patterns are reusable if you need to generate a batch of technical diagrams as code.

## Run it

```
npm run serve      # python3 -m http.server 5173
node export.js     # rebuild dist/static and the preview pages
```

Open `http://localhost:5173/index.html` for the figure index, or any `figures/fig-NN.static.html`.

## Patterns worth stealing

- **Pure-string SVG primitives, no DOM.** `shared/components.js` (~675 lines) exports generators like `resistor`, `capacitor`, `inductor`, `galvanometer`, `ground`, `wire`, `node`. Each returns an SVG markup string. No JSDOM, no `document`, no React. Browser preview pages and Node export scripts import the same module.
- **One render path for preview and export.** `figures/fig-NN.static.html` and `dist/static/fig-NN.svg` come from the same `svg(...)` calls in the same module. The preview embeds the export verbatim, so they can't drift.
- **Primitives test sheet first.** `figures/primitives.html` shows every primitive in every variant. Visual debugging happens there once. New primitives go on the sheet before they're used in a figure.
- **Pilot one, then scale.** Figure 02 was built and export-verified first. Its composition helpers (`alongArm`, `plainArm`, `junction`, `nodeAnchor`) moved into `components.js` and got reused by the other 13.
- **Spec / plan split.** `CLAUDE.md` is the stable project spec (aesthetic constraints, primitive rules, file layout). `PLAN.md` is per-figure interpretation (components, layout, telemetry strings). Splitting them kept the spec from churning during the build.

## Build pipeline

`node export.js` runs, in order:

1. `scripts/render-all.js` — per figure, writes `dist/static/fig-NN.svg` (full composition) and `dist/static/fig-NN-diagram.svg` (tight viewBox), plus a `figures/fig-NN.static.html` preview against three backgrounds.
2. `scripts/render-primitives.js` — regenerates the primitives test sheet.
3. `scripts/render-index.js` — generates `index.html`, the thumbnail grid.
4. `scripts/render-landing.js` — generates `landing.html`.

No bundler. ESM modules are imported directly by Node and by `<script type="module">` in the browser.

## Layout

```
shared/components.js        SVG primitive generators (browser + Node)
shared/style.css            preview-page styles; SVGs themselves are styleless

figures/primitives.html     primitive test sheet
figures/fig-NN.js           composition function for figure NN
figures/fig-NN.static.html  preview embedding the rendered SVG

scripts/render-*.js         render-all, render-primitives, render-index, render-landing
export.js                   top-level driver

dist/static/                committed SVG outputs
inputs/                     source scans + visual reference targets
PLAN.md                     per-figure interpretation
CLAUDE.md                   project spec
```

## Source material

Figures are from a 1932 BSTJ paper on capacitance bridge measurement. The doc references in the composition corners (e.g. `BSTJ V11 N1 / FIG 02 / 1932`) are plausible but authored. They fit the visual style and are not archivally accurate.
