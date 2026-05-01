# bell-labs-art

HAL 9000 supervisory-display aesthetic, applied to figures from a 1932 Bell System Technical Journal paper on capacitance bridge measurement.

The source material is 14 scanned figures: hand-drawn mid-century circuit schematics — Colpitts substitution bridge, potentiometer method, null-impedance bridge, Maxwell discharge method — plus accompanying equations and a vector diagram. Each is translated into a clean, transparent SVG in monospace off-white at 1px stroke: cold, precise, supervisory. The information content is preserved; the register is transposed.

The diagram inside each composition is the actual deliverable. It ships at a tight viewBox so it can be dropped onto any background at any size. The 1600×1600 page composition (with its doc reference, caption, and corner telemetry) is one valid arrangement, not a constraint on the diagram itself.

## Layout

```
inputs/                source screenshots from the BSTJ paper + hal-refs/ aesthetic targets
shared/
  style.css            typography + color tokens (preview pages render against #444)
  components.js        SVG primitive generators: resistor, capacitor, inductor,
                       galvanometer, ground, switch, wire, node
figures/
  primitives.html      primitive test sheet (preview)
  fig-NN.html          per-figure animated preview pages
  fig-NN.static.html   static composition pages used to render the SVG exports
  fig-NN.js            GSAP timeline + composition for figure NN
scripts/               render + preview helpers
dist/
  static/              transparent static SVG exports (the deliverable)
  animated/            transparent animated SVG exports (SMIL)
PLAN.md                per-figure interpretation: components, layout, telemetry
CLAUDE.md              evergreen project spec — aesthetic + structural rules
```

## Aesthetic, in one paragraph

Transparent background. Foreground is `#f0eef2` only — no second color. 1px strokes (0.5px where it reads well), no thick lines. IBM Plex Mono throughout. Each figure sits on a 1600×1600 canvas with a fake doc reference (e.g. `BSTJ V11 N1 / FIG 02 / 1932`), a terse uppercase caption, and 4–5 lines of plausible telemetry. The original script-italic node labels become plain mono caps. See `CLAUDE.md` for the full spec.

## Preview

```
npm run serve     # python3 -m http.server 5173
```

Open `http://localhost:5173/figures/primitives.html` for the primitive sheet, or `figures/fig-NN.html` for an individual figure. Preview pages render against a neutral `#444` background so the white strokes are visible during development — the SVGs themselves are fully transparent.

## Status

- [x] Shared primitives (`shared/components.js`)
- [x] fig-02 — Colpitts Substitution Bridge (pilot)
- [ ] fig-01, 03–14 — in progress per `PLAN.md`
- [ ] `dist/` exports

## Source

Figures are from a 1932 BSTJ paper on capacitance bridge measurement. The doc references in the corners (`BSTJ V11 N1`, etc.) are *plausible* — they are authored to fit the visual register, not archivally accurate.
