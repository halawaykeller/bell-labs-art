# bell-labs-art

A static site that translates 14 figures from a 1932 Bell System Technical Journal paper on capacitance bridge measurement (Colpitts substitution bridge, potentiometer method, null-impedance bridge, Maxwell discharge method, plus accompanying equations and a vector diagram) into the HAL 9000 supervisory-display aesthetic.

Source images live in `./inputs/` — scanned bitmaps of mid-century engineering diagrams: hand-drawn circuit schematics with script-italic node labels, zigzag resistors, capacitor symbols, ground symbols, galvanometers, and inline mathematical notation. HAL reference frames live in `./inputs/hal-refs/` and establish the target visual register.

The deliverable is a **transparent SVG per figure**. The animated HTML preview pages are scaffolding for development, not the artifact. See `PLAN.md` for per-figure interpretations (components, layout, telemetry strings).

## Aesthetic constraints (non-negotiable)

- Background is fully transparent. Every SVG and HTML page must have a transparent background — no fills, no body color, nothing. Compositing onto a background is done downstream.
- Foreground stroke and fill: off-white `#f0eef2` only. No second color. Ever.
- For preview/development purposes, `index.html` and per-figure HTML pages render against a neutral mid-gray (`#444`) so the white strokes are visible while working — but the SVG files themselves must be transparent and the white must be a literal stroke/fill color on the SVG elements, not inherited from any background context. The SVGs should look correct when dropped onto any color background.
- Strokes are 1px or thinner. Use 0.5px where it reads well. Never use thick strokes — these are technical drawings, not illustrations.
- Typography: monospace only. Use IBM Plex Mono via Google Fonts. The script-italic node labels in the originals (𝓐, 𝓑, 𝓒, 𝓓) are rendered as plain monospace caps — A, B, C, D. The calligraphy is not preserved; the register is transposed.
  - Top-left or top-right: a fake document reference (e.g. `BSTJ V08 N3 / FIG 02 / 1929`)
  - Bottom-right: 4–5 lines of fake telemetry that's plausibly related to the diagram (e.g. for a bridge circuit: `BAL.NULL .00021 / R1/R2 .8472 / FREQ 1KHZ / Q .043 / FUNCTION REF`)
- The figure label/caption from the original (e.g. "Fig. 2—Colpitts Substitution Bridge Method for Direct Capacity") is reformatted as terse uppercase mono: `FIG.02  COLPITTS SUB.BRIDGE / DIR.CAP`.
- Each figure's full-page composition uses a 1600×1600 viewBox to match the proportions of the HAL reference images. The actual diagram occupies maybe 30–40% of that canvas; the rest is negative space.
- The diagram itself is the deliverable. It is wrapped in `<g id="diagram">` with its own tight internal bounds and exports separately as `fig-NN-diagram.svg`. Sizing it to the 1600 canvas is a layout decision, not a constraint on the diagram. Canvas placement (which quadrant, how much breathing room) is tunable per figure.
- No anti-aliasing softness on the technical strokes. Use `shape-rendering="crispEdges"` or `"geometricPrecision"` as appropriate; pick whichever reads cleaner at the target size.

## Structural translation rules

For each input image, identify the diagram's logical components and redraw them as clean SVG primitives:

- **Resistor zigzags**: redraw as evenly-spaced angular zigzags, 6 peaks per resistor, 1px stroke. Don't mimic the hand-drawn wobble of the original — straighten it.
- **Capacitors**: two parallel lines, 1px stroke, with a small gap. Variable capacitors get an arrow through them.
- **Inductors**: 4 even loops, 1px stroke, drawn as connected semicircles.
- **Galvanometers** (the circles with a dot or arrow): clean circle with a small arrow inside.
- **Ground symbols**: three descending parallel horizontal lines.
- **Switches**: a line breaking from a contact at an angle.
- **Wires**: straight lines, axis-aligned where possible. 1px stroke. Right-angle corners, not curves.
- **Node markers** (A, B, C, D, 1, 2, 3): 12px-radius circles with the letter centered inside, monospace.
- **Equations** (figs 07–09, 12): typeset in monospace as plain text or with subscripts via `tspan`. Don't try to perfectly mimic the math typesetting — use ASCII-friendly equivalents and let the monospace do the work, e.g. `C12 = (R'/R'') C'` instead of trying to recreate the typeset form. Determinants and matrices use vertical bars and aligned columns.
- **Vector diagrams** (fig 10): clean arrows from a central origin, 1px stroke, with monospace labels at the arrow tips.

Reusable primitive generators live in `shared/components.js` so each figure file is mostly composition, not primitives.

## Animation

Each figure has a "drafting on" animation that runs once on page load:

- Wires draw themselves using `stroke-dasharray` + `stroke-dashoffset` transitions, 600–900ms, in approximate order of how a draftsman would draw them (longer trunk lines first, then branches).
- Components (resistors, capacitors, etc.) fade in in place once their connecting wires have drawn, with a 50–100ms stagger.
- Node circles fade in last.
- Labels and equations type on with a brief monospace cursor, 30–50ms per character.
- Telemetry numbers in the corner tick up from zero to their final values over 400ms.
- Total animation budget: roughly 2.5 seconds from page load to fully-drawn figure.

GSAP orchestrates the timeline. `DrawSVGPlugin` is used where it helps; manual `stroke-dashoffset` animation is the fallback when the plugin is unavailable. CSS animations are not used for drafting — the orchestration needs to be timeline-based.

After the drafting animation finishes, subtle ambient motion runs in the background:

- Telemetry numbers occasionally flicker to a new value.
- One galvanometer needle (if present) sweeps gently between two positions on a 4-second loop.
- A faint scan line very slowly traverses the canvas top-to-bottom on a 30-second loop, at ~4% opacity.

These should be quiet — not the focus.

## Export

Each figure exports as a standalone `.svg` file with the animation either:

(a) baked in as SMIL animation — `dist/animated/fig-NN.svg`, or
(b) stripped out, leaving the final static composition — `dist/static/fig-NN.svg`.

Static SVGs are the priority. Animated SMIL is a nice-to-have. Each figure also exports a tight-viewBox diagram-only version (`dist/static/fig-NN-diagram.svg`) for use outside this project.

## File layout

```
inputs/                source screenshots + hal-refs/ aesthetic targets
shared/
  style.css            typography + color tokens; body #444 for preview only
  components.js        SVG primitive generators
figures/
  primitives.html      primitive test sheet
  fig-NN.html          per-figure animated preview
  fig-NN.static.html   static preview used to render the SVG export
  fig-NN.js            GSAP timeline + composition
scripts/               render + preview helpers
dist/
  static/              transparent static SVG exports (deliverable)
  animated/            transparent animated SVG exports
PLAN.md                per-figure interpretations
```

The HTML preview pages and the SVG deliverables are different artifacts. The SVGs are what ships. The HTML pages are scaffolding.

## Design intent

Don't try to make these look like the originals. Translate them into the new visual language. The originals are warm, hand-drawn, organic. The output is cold, precise, supervisory. The information content is preserved; the register is transposed.
