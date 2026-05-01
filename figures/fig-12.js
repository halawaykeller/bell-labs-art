// figures/fig-12.js — Multi-line polynomial equation: Φ(D) iₙ = …
// Source: BSTJ V07 N4 / EQ 11.2 / 1928 (fictional doc-ref attribution)
//
// A long polynomial expression in operator D defining Φ(D), part of the
// arc-extinction analysis. Multi-line stacked layout, each line indented
// to align with the operator-D structure.

import {
  svg,
  docRef,
  caption,
  telemetry,
  equationLine,
} from '../shared/components.js';

const eqlbl = (x, y, text, size = 18, align = 'start') =>
  equationLine({ x, y, text, size, align });

// Y positions for each line (relative to diagram origin)
const Y0 = -240; // line 1
const LINE_H = 58;

export function buildDiagram() {
  let s = '';

  // Line 1: Φ(D) iₙ = [E/2 cos ωt]
  s += eqlbl(-200, Y0, 'Φ(D) i_{n}  =  [ E/2  cos ωt ]', 20);

  // Line 2: (1/g) Φ(D) i_1a = [r/2 + 2r_n + (L/2 + 2L_n) D] E/2 cos ωt
  s += eqlbl(
    -340,
    Y0 + LINE_H,
    '(1/g) Φ(D) i_{1a}  =  [ r/2 + 2r_{n} + (L/2 + 2L_{n}) D ] E/2 cos ωt',
    18,
  );

  // Line 3: where
  s += eqlbl(-340, Y0 + LINE_H * 2, 'where', 16);

  // Line 4: Φ(D) = LC'₀ (L/2 + 2L_n) D⁴ + …
  s += eqlbl(
    -340,
    Y0 + LINE_H * 3,
    "Φ(D) = LC'_{0} (L/2 + 2L_{n}) D^{4} + [ C'_{0} (rL + 2L_{a}r + 2r_{n}L) + g'_{0} L (L/2 + 2L_{n}) ] D^{3}",
    16,
  );

  // Line 5
  s += eqlbl(
    -260,
    Y0 + LINE_H * 4,
    "+ [ g'_{0} (rL + 2L_{a}r + 2r_{n}L) + C'_{0} (r^{2}/2 + 2rr_{n}) + L + 2L_{n} ] D",
    16,
  );

  // Line 6
  s += eqlbl(
    -260,
    Y0 + LINE_H * 5,
    "+ g'_{0} (r^{2}/2 + 2rr_{n}) + r + 2r_{n}",
    16,
  );

  // Line 7: C'₀ = C + C', g'₀ = g + g'
  s += eqlbl(
    -260,
    Y0 + LINE_H * 6,
    "C'_{0} = C + C',     g'_{0} = g + g'",
    16,
  );

  return s;
}

export const DIAGRAM_BOUNDS = { x: -380, y: -290, w: 880, h: 460 };

export function buildSVG() {
  const tx = 800;
  const ty = 800;
  const content =
    docRef({ position: 'top-right', text: 'BSTJ V07 N4 / EQ 11.2 / 1928' }) +
    `<g id="diagram" transform="translate(${tx} ${ty})">${buildDiagram()}</g>` +
    caption({
      text: 'FIG.12  EQ.SET 11.2  /  ARC EXT. POLY',
      y: 1310,
    }) +
    telemetry({
      lines: [
        'ORDER      4',
        'COEF       6',
        'L          2.4 MH',
        'L_N        0.6 MH',
        'FUNCTION   EVAL',
      ],
    });
  return svg('0 0 1600 1600', content);
}

export function buildDiagramSVG() {
  const { x, y, w, h } = DIAGRAM_BOUNDS;
  return svg(`${x} ${y} ${w} ${h}`, buildDiagram());
}
