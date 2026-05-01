// figures/fig-09.js — Symmetric matrix D (Cayley-Menger style)
// Source: BSTJ V11 N1 / EQ 09.7 / 1932 (fictional doc-ref attribution)
//
//   D = | 0    S₁₂   S₁₃   ..   1 |
//       | S₁₂   0    S₂₃   ..   1 |
//       | S₁₃   S₂₃   0    ..   1 |
//       |  ·    ·     ·    ··   · |
//       |  1    1     1    ··   0 |

import {
  svg,
  docRef,
  caption,
  telemetry,
  equationLine,
  determinantMatrix,
} from '../shared/components.js';

const eqlbl = (x, y, text, size = 22, align = 'middle') =>
  equationLine({ x, y, text, size, align });

const ROWS = [
  ['0', 'S_{12}', 'S_{13}', '..', '1'],
  ['S_{12}', '0', 'S_{23}', '..', '1'],
  ['S_{13}', 'S_{23}', '0', '..', '1'],
  ['.', '.', '.', '..', '.'],
  ['1', '1', '1', '..', '0'],
];

export function buildDiagram() {
  let s = '';
  s += eqlbl(-220, 8, 'D  =', 28, 'end');
  s += determinantMatrix({
    x: 0,
    y: 0,
    rows: ROWS,
    cellW: 56,
    cellH: 36,
    size: 18,
    barPad: 16,
  });
  return s;
}

export const DIAGRAM_BOUNDS = { x: -300, y: -130, w: 600, h: 260 };

export function buildSVG() {
  const tx = 800;
  const ty = 800;
  const content =
    docRef({ position: 'top-right', text: 'BSTJ V11 N1 / EQ 09.7 / 1932' }) +
    `<g id="diagram" transform="translate(${tx} ${ty})">${buildDiagram()}</g>` +
    caption({
      text: 'FIG.09  EQ.SET 09.7  /  CAYLEY-MENGER  D',
      y: 1230,
    }) +
    telemetry({
      lines: [
        'ORDER      N+1',
        'S_IJ.SYM   TRUE',
        'D.SIGN     POS',
        'RANK       FULL',
        'FUNCTION   EVAL',
      ],
    });
  return svg('0 0 1600 1600', content);
}

export function buildDiagramSVG() {
  const { x, y, w, h } = DIAGRAM_BOUNDS;
  return svg(`${x} ${y} ${w} ${h}`, buildDiagram());
}
