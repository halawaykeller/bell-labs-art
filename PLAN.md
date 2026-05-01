# PLAN.md — per-figure interpretations

Canvas is 1600×1600 for every figure. **The diagram is the deliverable** — it must be self-contained, well-proportioned on its own merits, and scale cleanly up or down for use outside this project. The diagram is wrapped in `<g id="diagram">` with its own tight internal bounds; sizing it to the canvas is a layout decision, not a constraint on the diagram itself. Position on the 1600 canvas is described by quadrant (TL, TR, BL, BR) plus center variants (TC, BC, CL, CR, C). Doc reference goes top-left or top-right (per-figure choice). Telemetry block goes bottom-right (CLAUDE.md spec). Caption is terse uppercase monospace, placed below the diagram.

Each figure ships **two static SVGs**:
- `dist/static/fig-NN.svg` — full composition (diagram + doc ref + caption + telemetry) on the 1600 canvas.
- `dist/static/fig-NN-diagram.svg` — diagram only, tight viewBox, no metadata, ready to drop into other contexts at any size.

Color is always `#f0eef2`. Stroke 1px (0.5px on grids and very fine elements). All telemetry numbers and refs below are authored — they are *plausible*, not historically accurate. CLAUDE.md says "fake," so I'm not trying to be archivally correct.

Three fictional source-paper attributions used in doc refs:
- **Capacitance bridges paper**: BSTJ V11 N1 / 1932 (figs 01–06)
- **Arc extinction paper**: BSTJ V07 N4 / 1928 (figs 10–12)
- **Vacuum-tube repeaters paper**: BSTJ V01 N2 / 1922 (figs 13–14)

Equations (figs 07–09, 12) inherit the paper attribution of the figure they accompany.

---

## fig-01 — Equivalent Direct Capacities (Cap Fig 1)
- **Source**: `Screenshot 2026-04-30 at 8.37.02 PM.png`
- **What it shows**: Three rows of small circuit identities. Row 1: nodes 1—C1—2 in parallel with C2 ⇒ nodes 1—C1+C2—2. Row 2: 1—C1—C2—2 (series) ⇒ 1—(C1·C2/(C1+C2))—2. Row 3: a 4-node mesh (1, 2, 3, 4) with capacitors C12, C13, C14, C23, C24, C34 between them, equated to a similar mesh of compound expressions involving G4 = C14+C24+C34.
- **Components**: 4 small node circles (1, 2, 3, 4) per sub-diagram, simple capacitor symbols, "=" signs as plain text between sub-diagrams, lots of tiny equation labels.
- **Layout**: 3 horizontal "rows" of mini-figures stacked vertically. Center-aligned on canvas. The diagram itself just needs the three rows to sit in their own sensible internal grid; canvas placement is incidental.
- **Doc ref** (top-left): `BSTJ V11 N1 / FIG 01 / 1932`
- **Caption** (below): `FIG.01  EQUIV.DIR.CAPACITIES  /  G4 = C14+C24+C34`
- **Telemetry** (bottom-right, 4 lines):
  ```
  NETWORK 4N6E
  G4    .00043 PF
  C12'  .00021 PF
  FUNCTION  IDENT
  ```

## fig-02 — Colpitts Substitution Bridge (Cap Fig 2) ★ pilot
- **Source**: `Screenshot 2026-04-30 at 8.36.52 PM.png`
- **What it shows**: A Wheatstone-style bridge. Top: node B. Across the top: B → resistor → C. Down right: C connects via wires to a sub-network of small numbered nodes 1, 2, 3, 4 forming a small cluster bottom-right. Bottom: node D. Left side: node A, with a galvanometer-on-its-side just below it, plus an additional galvanometer/source on the far-left edge. Center: a galvanometer between the bridge arms. There's also a small variable capacitor or switch near node A.
- **Components**: 4 main nodes A, B, C, D arranged as a diamond. 1–2 resistors. 2–3 galvanometers (one center as null detector, one as source on far-left). Small numbered cluster (1, 2, 3, 4) in the BR. 1 variable capacitor near node A.
- **Layout**: Diamond bridge centered on canvas. Source/galvanometer hangs to the left of the diamond. Small numbered cluster bottom-right of the diamond. Diagram's internal proportions are what matter — the source group should read as "to the side" of the bridge, not floating in space.
- **Doc ref** (top-left): `BSTJ V11 N1 / FIG 02 / 1932`
- **Caption** (below): `FIG.02  COLPITTS SUB.BRIDGE  /  DIR.CAP`
- **Telemetry** (bottom-right, 5 lines):
  ```
  BAL.NULL  .00021
  R1/R2     .8472
  FREQ     1KHZ
  Q         .043
  FUNCTION  REF
  ```

## fig-03 — Potentiometer Method (Cap Fig 3)
- **Source**: `Screenshot 2026-04-30 at 8.37.13 PM.png`
- **What it shows**: A long horizontal layout. Top wire runs across the full width. From left: source/galvanometer, then node A on a vertical drop, then a long horizontal resistor strip labeled R, then a node B (with galvanometer drop), then S–R (rest of the resistance), then node C on the right end. Below: capacitor C′, node D, then a sub-cluster with C12 and small nodes 1, 2, 3.
- **Components**: 3 main nodes A, B, C across the top; node D in the bottom-mid. One large compound resistor (drawn as 6-peak zigzag with a tap labeled B in the middle splitting it into R and S–R). Two galvanometers (vertical drops). Capacitor C′. Sub-cluster of 3 small nodes plus a labeled C12.
- **Layout**: Wide and shallow internally. Center-aligned on canvas.
- **Doc ref** (top-left): `BSTJ V11 N1 / FIG 03 / 1932`
- **Caption**: `FIG.03  POTENTIOMETER METH.  /  DIR.CAP`
- **Telemetry** (BR, 4 lines):
  ```
  R/S       .4710
  C12       .000128 PF
  C'        .000470 PF
  FUNCTION  POT.NULL
  ```

## fig-04 — Null-Impedance Bridge (Cap Fig 4, variant a)
- **Source**: `Screenshot 2026-04-30 at 8.37.39 PM.png`
- **What it shows**: A diamond mesh of resistors. Top apex labeled B with R/2 dropping toward a center junction. Two resistors labeled R form the lower diamond legs to apex A (left) and apex C (right). Galvanometer center between A and C. Below the diamond: variable capacitor (with arrow) labeled L? or C′; small node D, plus the C12 / 1, 2, 3 sub-cluster. Top-right: a dashed-outline box labeled T₂ (a transformer drawn as an inset box).
- **Components**: nodes A, B, C, D arranged as diamond; 3 resistors (R/2, R, R); 1 galvanometer; 1 variable capacitor; T₂ transformer drawn as a dashed rectangle with two small inductor coils inside; 1 small inductor L on left edge; 3-node sub-cluster.
- **Layout**: Diamond at canvas center; transformer inset to the upper-right of the diamond inside the same diagram group.
- **Doc ref** (top-right): `BSTJ V11 N1 / FIG 04A / 1932`
- **Caption**: `FIG.04  NULL.IMPED.BRIDGE  /  VAR A`
- **Telemetry** (BR, 5 lines):
  ```
  T2 RATIO   1.0000
  R/2        100R0
  C12'       .00009 PF
  BAL.NULL   .00003
  FUNCTION   IMPED.NULL
  ```

## fig-05 — Null-Impedance Bridge (Cap Fig 4, variant b)
- **Source**: `Screenshot 2026-04-30 at 8.37.51 PM.png`
- **Note**: Visually nearly identical to fig-04 in the source. Diff during redraw — if it's the same content I'll merge with fig-04 and renumber 06→05, etc., dropping to 13 figures total. Default assumption: it's a redraw at a different stage of derivation (e.g., simplified equivalent), so I keep it but emphasize one differentiating element.
- **Components**: same as fig-04 but with the T₂ transformer collapsed into an in-line equivalent (single labeled inductor instead of dashed box) — this is a common BSTJ rhetorical move ("redrawn for analysis").
- **Layout**: Diamond center. No outset transformer box; the equivalent inductor lives inside the diamond perimeter.
- **Doc ref** (top-right): `BSTJ V11 N1 / FIG 04B / 1932`
- **Caption**: `FIG.05  NULL.IMPED.BRIDGE  /  VAR B  REDRAW`
- **Telemetry**:
  ```
  EQUIV.NULL .00003
  L_T2       2.4 MH
  C'         .000470 PF
  FUNCTION   IMPED.NULL
  ```

## fig-06 — Maxwell Discharge Method (Cap Fig 5)
- **Source**: `Screenshot 2026-04-30 at 8.38.03 PM.png`
- **What it shows**: Wide horizontal layout. Left: a switching cluster of small numbered contacts (5, 2, 1, 6, 3, 7) feeding into capacitors C′, C″, C‴ (three cap symbols stacked). Center: node A connects upward toward node B at top-right. Right: a sub-cluster of nodes 1, 2, 3 with capacitors C12, C13, C23 between them. Bottom: node D.
- **Components**: 5–6 small numbered contacts + 1 main switch on the left; 3 capacitors stacked vertically; nodes A, B, D, plus the right-side 3-node mesh; 3 mesh capacitors C12/C13/C23; ground symbol on far-left.
- **Layout**: Full-width horizontal composition; centered on canvas.
- **Doc ref** (top-left): `BSTJ V11 N1 / FIG 05 / 1932`
- **Caption**: `FIG.06  MAXWELL DISCHG.METH.  /  DIR.CAP`
- **Telemetry** (BR, 5 lines):
  ```
  Q.STORED  4.7E-09 C
  C'        .000470 PF
  C''       .000128 PF
  C'''      .000043 PF
  FUNCTION  DISCHG
  ```

## fig-07 — Equation pair: C12 and G1
- **Source**: `Screenshot 2026-04-30 at 8.37.23 PM.png`
- **What it shows**: Two short equations.
  ```
  C12 = (R'/R'') * C'
  G1  = ((S - R'')/R'') * C'
  ```
- **Components**: pure typography — two equation lines stacked. Use monospace with `tspan` for subscripts (C12 → C₁₂).
- **Layout**: Equation block centered on canvas; the two equations are stacked tightly with consistent baseline alignment, sized to feel like a typeset page block rather than a banner.
- **Doc ref** (top-left): `BSTJ V11 N1 / EQ 03.1 / 1932`
- **Caption**: `FIG.07  EQ.SET 03.1  /  POTENTIOMETER`
- **Telemetry**:
  ```
  R'        .8472
  R''      1.0000
  S        2.0000
  C'        .000470 PF
  FUNCTION  IDENT
  ```

## fig-08 — Determinant ratio for C′ᵢⱼ
- **Source**: `Screenshot 2026-04-30 at 8.39.29 PM.png`
- **What it shows**: A large "ratio of two determinants" expression. Numerator: a 3×3+ determinant of capacitance entries (−C_ij, −C_ip, −C_iq; −C_jp, G_p, −C_pq; −C_jq, −C_pq, G_q; ⋯). Denominator: a 2×2+ determinant (G_p, −C_pq; −C_pq, G_q; ⋯). Plus a footer line G′ₛ = −C′ᵢᵢ.
- **Components**: typography only. Vertical bars for determinants; rows aligned in monospace columns; central horizontal fraction bar; the trailing `..` (continuation dots).
- **Layout**: Centered on canvas. The numerator/denominator stack and shared fraction bar are the diagram's internal structure — they should align cleanly regardless of overall scale.
- **Doc ref** (top-right): `BSTJ V11 N1 / EQ 09.4 / 1932`
- **Caption**: `FIG.08  EQ.SET 09.4  /  N-MESH IDENT.`
- **Telemetry**:
  ```
  ORDER     N=4
  TERMS    16
  DET.RATIO C'_IJ
  RANK      FULL
  FUNCTION  EVAL
  ```

## fig-09 — Matrix D
- **Source**: `Screenshot 2026-04-30 at 8.39.42 PM.png`
- **What it shows**: A symmetric (n+1)×(n+1) determinant labeled D, with diagonals = 0 except the bottom-right which is 0, off-diagonals are S_ij with i<j, and the last row/column are all 1s. Plus continuation dots.
- **Components**: typography only. Vertical bars. Aligned columns. Last-row 1s. Center the determinant on the canvas.
- **Layout**: Compact determinant block, centered on canvas.
- **Doc ref** (top-right): `BSTJ V11 N1 / EQ 09.7 / 1932`
- **Caption**: `FIG.09  EQ.SET 09.7  /  CAYLEY-MENGER  D`
- **Telemetry**:
  ```
  ORDER     N+1
  S_IJ.SYM  TRUE
  D.SIGN    POS
  RANK      FULL
  FUNCTION  EVAL
  ```

## fig-10 — Vector diagram (Arc paper Fig 2)
- **Source**: `Screenshot 2026-04-30 at 8.40.08 PM.png`
- **What it shows**: 8 vectors radiating from a single origin, labeled E_pg, E_po, E_og, E_io, E_ig, I_c, I_f, I_n, E_30. Arrowheads at the tips, monospace labels just past each tip.
- **Components**: 8 vectorArrow primitives. Origin at center. Each vector at a different angle and length.
- **Layout**: Origin at canvas center; vectors radiate in 8 distinct directions. Internally the angles and relative lengths of the vectors are what matter — that ratio drives the diagram's character.
- **Doc ref** (top-left): `BSTJ V07 N4 / FIG 02 / 1928`
- **Caption**: `FIG.10  VECTOR DIAG.  /  POST-ARC EXT.`
- **Telemetry**:
  ```
  PHASE     SOUND.GND
  I_F        .82A
  I_C        .31A
  I_N        .04A
  FUNCTION   POST.EXT
  ```

## fig-11 — Voltage waveform (Arc paper Fig 4)
- **Source**: `Screenshot 2026-04-30 at 8.40.14 PM.png`
- **What it shows**: A grid-backed plot. X-axis = "Time Seconds". Y-axis = "Volts" (range visible: −2000 to 8000 or similar). Trace = a low-frequency sinusoidal envelope with high-frequency ringing superimposed (fast oscillation riding on a slow swing). Grid behind it.
- **Components**: gridAxes primitive (full grid); a single complex waveform path; tick labels on both axes; small "Time Seconds" annotation at the right end of the trace.
- **Layout**: Plot positioned upper-center on the canvas. Internally, the plot's aspect should be wide-shallow (roughly 2:1) regardless of scale.
- **Doc ref** (top-left): `BSTJ V07 N4 / FIG 04 / 1928`
- **Caption** (below plot): `FIG.11  VOLT.SOUND-GND  /  POST.ARC.EXT`
- **Telemetry** (BR):
  ```
  V_PEAK    7480 V
  V_TROUGH -1820 V
  F.SLOW   60 HZ
  F.FAST   3.6 KHZ
  FUNCTION TRACE
  ```

## fig-12 — Multi-line equation Φ(D)i_n = …
- **Source**: `Screenshot 2026-04-30 at 8.40.31 PM.png`
- **What it shows**: A long polynomial equation in operator D, defining Φ(D) as a sum of D⁴, D³, D², D, constant terms, each coefficient itself a sum of L, C′, r, and 2L_n compounds. Plus a definition footer C'_0 = C + C', g'_0 = g + g'.
- **Components**: typography only. Many lines, each line indented to align with operator D. Use monospace with tspan for super/subscripts (D², D³, D⁴, r_n, 2L_n).
- **Layout**: Multi-line equation block, centered slightly above middle on the canvas. The internal indentation and operator-D alignment are what carry the diagram.
- **Doc ref** (top-right): `BSTJ V07 N4 / EQ 11.2 / 1928`
- **Caption**: `FIG.12  EQ.SET 11.2  /  ARC EXT. POLY`
- **Telemetry** (BR):
  ```
  ORDER     4
  COEF      6
  L         2.4 MH
  L_N       0.6 MH
  FUNCTION  EVAL
  ```

## fig-13 — Vacuum-Tube Repeater Element (VT Fig 21)
- **Source**: `Screenshot 2026-04-30 at 8.41.06 PM.png`
- **What it shows**: A schematic vacuum tube (large circle outline with three internal symbols: filament — vertical zigzag with arrow, grid — vertical dashed line, plate — small box). Below the tube, a horizontal wire connects to two transformers (drawn as two stacked inductor pairs) labeled "Receiving Circuit" on the left and "Transmitting Circuit" on the right.
- **Components**: 1 large circle (the envelope), 1 internal filament zigzag, 1 internal grid line, 1 internal plate box, 4 inductor pairs (2 transformers), 2 long horizontal wires, 2 small caption labels under the transformers.
- **Layout**: Tube above the transformer pair; transformers symmetric left-right beneath it. Tube roughly twice the diameter of one transformer coil for a readable hierarchy.
- **Doc ref** (top-right): `BSTJ V01 N2 / FIG 21 / 1922`
- **Caption** (below): `FIG.13  VT.REPEATER ELEM.  /  ONE-WAY`
- **Telemetry**:
  ```
  GAIN      +12.4 DB
  FIL.V      4.0 V
  PLATE.V   90.0 V
  GRID.V    -1.5 V
  FUNCTION  REPEAT
  ```

## fig-14 — Two-Way Vacuum-Tube Repeater Circuit (VT Fig 22)
- **Source**: `Screenshot 2026-04-30 at 8.41.16 PM.png`
- **What it shows**: A complex symmetrical schematic. Two vacuum tubes mid-canvas, oriented mirror-image. Each tube has its own input/output transformer pair on the outside. Hybrid coils ("balancing networks") in the lower portion connect both directions. Lots of crossover wires forming an X shape between the two halves. Labels: "East Line", "West Line", "VT Repeater", "Hybrid Coil", etc.
- **Components**: 2 vacuum tube schematics (reuse fig-13's tube primitive), 4 transformer pairs, 2 hybrid coils (drawn as 4-coil cluster with ground), many wires with right-angle routing, several small labels.
- **Layout**: Wide horizontal composition; the two repeater halves mirror left-right, hybrid coils below, X-shaped crossover wires in the middle.
- **Doc ref** (top-left): `BSTJ V01 N2 / FIG 22 / 1922`
- **Caption** (below): `FIG.14  TWO-WAY VT.REPEATER  /  HYBRID.CIRC.`
- **Telemetry**:
  ```
  E.LINE    600 OHM
  W.LINE    600 OHM
  HYBRID.BAL  .998
  GAIN.E→W  +12.4 DB
  FUNCTION  TWO-WAY
  ```

---

## Resolutions

- **fig-04 vs fig-05**: the two screenshots are visually identical scans of the same BSTJ "Fig. 4". To honor "use all 14" without inventing content, fig-05 is rendered as the "redrawn for analysis" form of fig-04 — same Y-network, but the T₂ transformer is *inlined* in the B-arm path (drawn as two stacked coils with iron-core dashes between them) instead of appearing as a separate dashed-rectangle module on the right of the chassis. Layout is also slightly more compact. The two figures share topology but read as a published-then-simplified pair.
- **Canvas placement**: the placements were tunable; final positions chosen per figure. Diagrams' internal proportions are the deliverable.
- **Telemetry strings**: all authored. Open to redirection on any specific values.
