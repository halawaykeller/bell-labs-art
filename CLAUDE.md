I'm building a project called recreating the visual aesthetic of HAL 9000's interface displays from 2001: A Space Odyssey, but using real engineering source material as input.

I have 10 reference images in ./inputs/ — figures from a Bell System Technical Journal paper on capacitance bridge measurement methods (Colpitts substitution bridge, potentiometer method, null-impedance bridge, Maxwell discharge method, plus accompanying equations and a vector diagram). They're scanned bitmap images of mid-century engineering diagrams: hand-drawn circuit schematics with script-italic node labels, zigzag resistors, capacitor symbols, ground symbols, galvanometers, and inline mathematical notation.

I want to convert each one into an animated SVG-and-HTML rendering in the HAL aesthetic. Build this as a static site with one page per figure plus an index.

## Aesthetic constraints (non-negotiable)

- Background is fully transparent. Every SVG and HTML page must have a transparent background — no fills, no body color, nothing. I will composite onto backgrounds myself later.
- Foreground stroke and fill: off-white #f0eef2 only. No second color. Ever.
- For preview/development purposes, the index.html and per-figure HTML pages can render against a neutral mid-gray (#444) so the white strokes are visible while working — but the SVG files themselves must be transparent and the white must be a literal stroke/fill color on the SVG elements, not inherited from any background context. The SVGs should look correct when dropped onto any color background.
- Strokes are 1px or thinner. Use 0.5px where it reads well. NEVER use thick strokes — these are technical drawings, not illustrations.
- Typography: monospace only. Use IBM Plex Mono via Google Fonts. The script-italic node labels in the originals (𝓐, 𝓑, 𝓒, 𝓓) should be rendered as plain monospace caps in the new version — A, B, C, D. We are not preserving the calligraphy; we are translating to the supervisory-display register.
  - Top-left or top-right: a fake document reference (e.g. "BSTJ V08 N3 / FIG 02 / 1929")
  - Bottom-right: 4-5 lines of fake telemetry that's plausibly related to the diagram (e.g. for a bridge circuit: "BAL.NULL .00021 / R1/R2 .8472 / FREQ 1KHZ / Q .043 / FUNCTION REF")
- The figure label/caption from the original (e.g. "Fig. 2—Colpitts Substitution Bridge Method for Direct Capacity") should be reformatted as terse uppercase mono: "FIG.02  COLPITTS SUB.BRIDGE / DIR.CAP"
- Use a square SVG canvas (e.g. 1600x1600 viewBox) for each figure to match the proportions of the HAL reference images. The actual diagram occupies maybe 30-40% of that canvas; the rest is negative space.
- No anti-aliasing softness on the technical strokes. Use shape-rendering="crispEdges" or "geometricPrecision" as appropriate on the SVG. Test both on a sample resistor and pick whichever reads cleaner at the target size.

## Structural translation rules

For each input image, identify the diagram's logical components and redraw them as clean SVG primitives:

- Resistor zigzags: redraw as evenly-spaced angular zigzags, 6 peaks per resistor, 1px stroke. Don't try to mimic the hand-drawn wobble of the original — straighten it.
- Capacitors: two parallel lines, 1px stroke, with a small gap. Variable capacitors get an arrow through them.
- Inductors: 4 even loops, 1px stroke, drawn as connected semicircles.
- Galvanometers (the circles with a dot or arrow): clean circle with a small arrow inside.
- Ground symbols: three descending parallel horizontal lines.
- Switches: a line breaking from a contact at an angle.
- Wires: straight lines, axis-aligned where possible. 1px stroke. Use right-angle corners, not curves.
- Node markers (A, B, C, D, 1, 2, 3): 12px-radius circles with the letter centered inside, monospace.
- Equations (images 4, 8, 9): typeset in monospace as plain text or with subscripts done via tspan/sub. Don't try to perfectly mimic the math typesetting — use ASCII-friendly equivalents and let the monospace do the work. e.g. "C12 = (R'/R'') C'" instead of trying to recreate the typeset form. Determinants/matrices use vertical bars and aligned columns.
- Vector diagrams (image 10): clean arrows from a central origin, 1px stroke, with monospace labels at the arrow tips.

## Animation

Each figure should have a "drafting on" animation that runs once on page load:

- Wires draw themselves using stroke-dasharray + stroke-dashoffset transitions, 600-900ms, in approximate order of how a draftsman would draw them (longer trunk lines first, then branches).
- Components (resistors, capacitors, etc.) fade in in place once their connecting wires have drawn, with a 50-100ms stagger.
- Node circles fade in last.
- Labels and equations type on with a brief monospace cursor, 30-50ms per character.
- Telemetry numbers in the corner tick up from zero to their final values over 400ms.
- Total animation budget: roughly 2.5 seconds from page load to fully-drawn figure.

Use GSAP for orchestration. Use the DrawSVGPlugin where it helps — but if it's not available in the free tier, fall back to manual stroke-dashoffset animation. Don't use CSS animations for the drafting; the orchestration needs to be timeline-based.

After the drafting animation finishes, add subtle ambient motion:
- The telemetry numbers occasionally flicker to a new value.
- One galvanometer needle (if present) sweeps gently between two positions on a 4-second loop.
- A faint scan line very slowly traverses the canvas top-to-bottom on a 30-second loop, at maybe 4% opacity.

These should be quiet — not the focus.

## Export

Each figure should be exportable as a standalone .svg file with the animation either:
(a) baked in as SMIL animation, OR
(b) stripped out, leaving the final static composition.

Provide a build script (export.js or similar) that produces both: ./dist/animated/fig-NN.svg with SMIL, and ./dist/static/fig-NN.svg as the final state. Static SVGs are the priority — make sure those look right first. Animated SMIL is a nice-to-have.

## File layout

- index.html — grid of thumbnails linking to each figure (preview only — uses #444 background for visibility)
- figures/fig-01.html through fig-10.html — one per input image (preview only — uses #444 background for visibility)
- shared/style.css — typography, color tokens, page layout. Body background #444 for preview only.
- shared/animate.js — GSAP timeline factory shared across figures
- shared/components.js — reusable SVG component generators (resistor, capacitor, inductor, galvanometer, ground, node, wire) so each figure file is mostly composition, not primitives
- dist/static/ — final transparent SVG exports (the actual deliverables)
- dist/animated/ — final transparent animated SVG exports

The HTML preview pages and the SVG deliverables are different artifacts. The SVGs are what I'm shipping. The HTML pages are scaffolding for development.

## Process

1. Start by examining all 10 input images in ./inputs/ and write a brief plan in PLAN.md describing your interpretation of each one — what components it contains, how you'll lay them out, where on the canvas the figure sits (which quadrant), what the metadata text will say. Show me this plan before writing code.
2. Build shared/style.css and shared/components.js first. Get the primitives looking right. Render a test page with one of each primitive (resistor, capacitor, inductor, galvanometer, ground, node, wire, switch) on a transparent SVG over the #444 preview background and confirm with me before continuing.
3. Build figure 01 end-to-end (Colpitts Substitution Bridge — image 1). Iterate on it until the aesthetic lands. Export the static SVG and verify it composites correctly onto multiple background colors (test against #3d2f4a, #2e3863, and pure black). We'll review before continuing.
4. Once figure 01 is approved, proceed through the rest using the same patterns.

Don't try to make these look like the originals. Translate them into the new visual language. The originals are warm, hand-drawn, organic. The output should be cold, precise, supervisory. The information content is preserved; the register is transposed.

Reference: I have 6 HAL display recreations in ./inputs/hal-refs/ that establish the target aesthetic. Look at those before starting.

