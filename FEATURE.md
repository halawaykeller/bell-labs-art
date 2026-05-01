# FEATURE.md — Procedural figure generation

## Context

The current landing page picks one of the 14 hand-built figures at random. The next level up is **procedural generation**: every "Reroll" produces a *new* figure that has never existed before, but feels like it could have come straight out of a 1932 BSTJ paper rendered in HAL's display register. The 14 fixed figures stay as the canonical reference set; the generator is an additional surface that draws from the same primitives and produces compositions that respect the same rules.

This is not "random spaghetti" — it's constrained random sampling within the design language already established. The bar is: a generated figure should be indistinguishable from a hand-authored one in terms of visual quality, composition discipline, and aesthetic register.

## Goal

`landing.html` becomes a one-shot reroll for genuinely new compositions. Optionally, generated figures can be exported to disk for review or downstream use.

## Approach

A small set of **category generators**, each producing a complete figure of a particular type. The reroll button picks a category (weighted by aesthetic value, not uniformly), then asks that generator for a fresh composition seeded from the current random state.

Each generator emits the same module shape every fixed `fig-NN.js` already does:

```js
{ buildSVG, buildDiagramSVG, DIAGRAM_BOUNDS }
```

so the existing render pipeline, composite tests, and diagram-only export work for generated figures with no special-casing.

### Categories (in priority order)

1. **Circuit** — bridge topologies, Y-networks, ladder networks, transformer-coupled stages.
2. **Equation** — single-line, fraction, determinant, multi-line polynomial.
3. **Vector diagram** — radial phasors with labels.
4. **Waveform** — damped/undamped oscillation on a grid.

Phase 1 ships only Circuit. Phase 2 adds the other three.

### Seedable randomness

The generator takes an integer seed. The same seed always produces the same figure. This means:
- Reproducibility — a "favorite" figure can be recovered by URL: `landing.html?seed=4729`.
- Debuggability — when something looks wrong, the seed is in the markup.
- Caching — a generated figure can be persisted by seed without name collisions.

Use a tiny PRNG (e.g. `mulberry32`) seeded from a 32-bit integer. No external dep.

## Per-category specifications

### 1. Circuit generator

**Skeleton**: every circuit sits inside a chassis enclosure (fig-02 set the convention) with one source on a chassis edge, one detector somewhere internally, and a topology between them.

**Topology dice** (weighted):
- Bridge diamond (40%): 4 nodes A–D, components on 2–4 arms, detector across one diagonal, source feeds the other.
- Wheatstone-with-tap (15%): 4 nodes with a center-tap on one arm (like fig-04's R/2 + Y).
- Potentiometer ladder (15%): top arm with multiple resistor segments and a center tap (like fig-03).
- Transformer-coupled (10%): bridge with a transformer module on one arm.
- Pi-network (10%): three components arranged as series-shunt-series.
- Y-network (10%): three arms meeting at a center node (like fig-04's interior).

**Per-arm component dice**:
- Resistor (50%), wire (20%), capacitor (15%), inductor (8%), varCapacitor (5%), varInductor (2%).

**Test cluster** (60% chance to include): 3- or 4-node sub-network in a quadrant of the chassis with caps between adjacent pairs. Pick configuration: triangle, diamond, square, line.

**Auxiliary elements** (each ~30% chance): ground symbol, additional source on outer chassis edge, isolation switch.

**Constraints** (the hard part):
- No two components overlap.
- Wires use right angles where they're not bridge arms; bridge arms are diagonal.
- Labels don't collide with any drawn element.
- Test cluster fits inside chassis interior with margin.
- The source's two return wires don't cross each other.
- Total node count ≥ 4, ≤ 9.

**Labels**: nodes labeled A, B, C, D, … in order; numbered sub-nodes 1, 2, 3, 4. Resistors get labels R, R₁, R/2, S, S−R from a small library. Capacitors get C, C', C''. Mostly subscripted via existing `equationLine` markup.

### 2. Equation generator

**Form dice**:
- Single-line algebraic identity (40%): random LHS = product of 2–4 fraction-and-variable terms.
- Determinant matrix (25%): square 3×3 to 5×5 with subscripted-variable entries, off-diagonal symmetric, possibly with continuation `..` cells.
- Determinant ratio (20%): two stacked determinants over a horizontal bar.
- Multi-line polynomial (15%): operator-D polynomial with 3–5 lines, increasing indent depth.

**Variable bank**: C, C', G, R, S, L, E, I (with subscripts 0, 1, 2, ij, ip, pq, etc.). Operators: =, +, −, ·, /. Operator D for differential polynomials. ω, t for time-domain terms.

**Constraints**:
- Subscript indices stay coherent across an equation (no introducing `i` then using `j` without justification).
- Fractions don't get nested too deeply (max one level of fraction).
- Line widths fit within the diagram bounds.

### 3. Vector diagram generator

**Layout**: 4–10 phasors radiating from a single origin.

**Angle distribution**: pick angles such that no two vectors are within 12° of each other (avoids visual cluttering). Mix near-axial (0°, 90°, 180°, 270°) with off-axial.

**Magnitudes**: vary length per vector (0.7×–1.0× max radius) so the diagram doesn't look like a sunburst.

**Labels**: from the same variable bank as equations, biased toward `E_*` and `I_*`. One vector designated as the "reference" with a more prominent label.

**Optional**: a thin reference circle through the longest vector tip; an axis cross at the origin.

### 4. Waveform generator

**Components**:
- Slow envelope: sine, half-cycle cosine, exponential rise/fall, square pulse, ramp.
- Fast overlay (30% chance): sine with random frequency 20×–80× the slow component.
- Damping (50% chance): exponential decay applied to one or both.

**Grid**: 8–14 x-divisions, 6–10 y-divisions. Tick labels on x (time, 0..0.x s) and y (volts, ±k·1000).

**Axis labels**: VOLTS / TIME SECONDS, or AMPS / FREQ HZ, or PHASE / RADIANS.

## Telemetry generation

Every figure needs 4–5 lines of plausible telemetry. A small telemetry generator per category:

- Circuit telemetry: BAL.NULL, R/S ratios, FREQ, Q, FUNCTION (one of REF, NULL, IMPED.NULL, POT.NULL, DISCHG, REPEAT).
- Equation telemetry: ORDER, TERMS, RANK, SIGN, FUNCTION EVAL.
- Vector telemetry: PHASE, magnitudes for two or three vectors, FUNCTION.
- Waveform telemetry: V_PEAK, V_TROUGH, F.SLOW, F.FAST, FUNCTION.

Number formatting: keep it small and dotty (`.00021`, `.8472`, `1KHZ`, `4.7E-09 C`). The generator picks values at random within plausible ranges.

## Doc reference generation

`BSTJ V<vol> N<num> / FIG <id> / <year>` where:
- vol: 1–25
- num: 1–4
- year: matches vol (V1=1922, V11=1932, V20=1941, etc.)
- id: 2-digit zero-padded, drawn from the seed.

For generated figures we use a different prefix, e.g. `BSTJ V** N* / GEN <hex> / ****`, so they're identifiable as procedural without breaking the look.

## File layout

```
src/
  prng.js                    mulberry32 + helpers (pickWeighted, range, etc.)
  generators/
    index.js                 entry: pickCategory(seed) → returns { buildSVG, buildDiagramSVG, DIAGRAM_BOUNDS, seed, category }
    circuit.js               Phase 1
    equation.js              Phase 2
    vector.js                Phase 2
    waveform.js              Phase 2
    telemetry.js             shared telemetry-line generators
  layout/
    chassis.js               chassis-frame helper (extract from fig-02..06)
    placement.js             non-overlap-checked positioning helpers
landing.html                 button calls into generators/index.js with a fresh seed
```

The generators import from `shared/components.js` exactly like the fixed figures do — no duplication of primitive code.

## Phases

**Phase 1 — Circuit-only (~1 day)**
- `src/prng.js`
- `src/generators/circuit.js` (bridge topology only — 40% case)
- `src/generators/index.js` (single-category for now)
- `src/generators/telemetry.js` (circuit category)
- Update `landing.html`: import generator, reroll calls into it instead of indexing into a fixed array, URL `?seed=` honored.
- Quality gate: 50 consecutive rerolls, count how many produce visually-acceptable output. Target ≥ 80%.

**Phase 2 — All four categories (~2 days)**
- Add equation, vector, waveform generators.
- Add additional circuit topologies (Y, ladder, transformer-coupled, pi).
- Reroll picks category by weighted dice.
- Quality gate same as Phase 1, applied per category.

**Phase 3 — Polish (~0.5 day)**
- Add a "save" button on landing.html that writes the current figure to `dist/generated/<seed>.svg` (server-side via a small `node scripts/save-seed.js <seed>` if running purely static, or via direct download attribute if browser-only).
- Optional `?category=circuit` URL param to reroll within one category.
- Smooth crossfade transition between figures on reroll.

## Verification

Per category:
1. Generate 50 figures with sequential seeds (1..50).
2. Manual review: each one read for layout (no overlaps, balanced composition), aesthetic (matches the 14 hand-built figures' register), and information content (labels and topology make engineering sense).
3. Rate each as PASS / WEAK / FAIL.
4. Bar: ≥ 80% PASS, no FAILs that look broken (overlapping text, wires through nodes, etc.).
5. Edge-case probes: very small canvases, very dense topologies, equations with wide compound subscripts.

Cross-category:
1. Run reroll 30 times via the actual landing page, check no JS errors, all SVGs serialize cleanly.
2. Grep generated SVGs for color violations (only `#f0eef2` and `none`).
3. Assert XML well-formedness via xmllint.

## Open questions

- **Save persistence**: should the landing page save every generated figure, or only on explicit "Save" click? Persisted figures bloat `dist/` fast — favor explicit save.
- **Generator weights**: should the four categories be equal-weighted on reroll, or should circuits dominate (e.g. 60/15/15/10) since they're the most visually striking? Probably the latter.
- **Seed visibility**: should the seed appear on the page (so users can share a favorite), or stay hidden in the URL? Probably visible — small `SEED.4729` in a corner like a doc-ref.
- **Batch generation mode**: should there be a `node generate.js --count 100` mode that emits 100 figures to `dist/generated/` for offline review? Useful for quality-bar verification but optional.

## Risks

- **Aesthetic drift**: random output averages toward generic; the 14 hand-built figures have intent and idiosyncrasy that procedural generation flattens. Mitigation: keep the topology + parameter dice tightly constrained, and treat the 14 hand-built ones as in-scope reference for aesthetic eval.
- **Wire routing**: non-overlapping wire paths in arbitrary topologies is hard. Mitigation: use a small library of layout templates per topology rather than free-form routing.
- **Equation coherence**: random equations can read as nonsense. Mitigation: equation generator is template-driven (pick a template, fill its slots from the variable bank), not free-form algebra.
- **Time budget**: this could expand to a week if pursued without boundaries. Mitigation: ship Phase 1 (circuit-only) and stop unless the result clearly justifies more.
