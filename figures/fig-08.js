// figures/fig-08.js — Determinant ratio for C'ᵢⱼ
// Source: BSTJ V11 N1 / EQ 09.4 / 1932 (fictional doc-ref attribution)
//
//   C'ᵢⱼ = − |numerator determinant| / |denominator determinant|
// Plus footer:
//   G'ₛ = − C'ᵢᵢ
//
// Numerator (3×3+):
//   [ −Cᵢⱼ   −Cᵢₚ   −Cᵢq    .. ]
//   [ −Cⱼₚ    Gₚ    −Cₚq    .. ]
//   [ −Cⱼq   −Cₚq    Gq     .. ]
// Denominator (2×2+):
//   [  Gₚ    −Cₚq    .. ]
//   [ −Cₚq   Gq      .. ]

import {
  svg,
  docRef,
  caption,
  telemetry,
  equationLine,
  determinantMatrix,
  fractionBar,
} from '../shared/components.js';

const eqlbl = (x, y, text, size = 22, align = 'middle') =>
  equationLine({ x, y, text, size, align });

const NUM_ROWS = [
  ['−C_{ij}', '−C_{ip}', '−C_{iq}', '..'],
  ['−C_{jp}', 'G_{p}', '−C_{pq}', '..'],
  ['−C_{jq}', '−C_{pq}', 'G_{q}', '..'],
  ['.', '.', '.', '..'],
];
const DEN_ROWS = [
  ['G_{p}', '−C_{pq}', '..'],
  ['−C_{pq}', 'G_{q}', '..'],
  ['.', '.', '..'],
];

const NUM_Y = -100;
const BAR_Y = 0;
const DEN_Y = 100;
const FOOT_Y = 230;

export function buildDiagram() {
  let s = '';
  // LHS: C'ᵢⱼ =
  s += eqlbl(-260, BAR_Y + 8, "C'_{ij}  =", 24, 'end');
  // Leading minus sign before the fraction
  s += eqlbl(-200, BAR_Y + 8, '−', 26, 'middle');
  // Numerator determinant (centered around x=0, y=NUM_Y)
  s += determinantMatrix({
    x: 0,
    y: NUM_Y,
    rows: NUM_ROWS,
    cellW: 60,
    cellH: 32,
    size: 18,
    barPad: 14,
  });
  // Fraction bar
  s += fractionBar({ x: 0, y: BAR_Y, width: 280 });
  // Denominator determinant
  s += determinantMatrix({
    x: 0,
    y: DEN_Y,
    rows: DEN_ROWS,
    cellW: 64,
    cellH: 32,
    size: 18,
    barPad: 14,
  });
  // Footer: G'ₛ = − C'ᵢᵢ
  s += eqlbl(-220, FOOT_Y, "G'_{s}  =  − C'_{ii}", 22, 'start');
  return s;
}

export const DIAGRAM_BOUNDS = { x: -310, y: -180, w: 620, h: 460 };

export function buildSVG() {
  const tx = 800;
  const ty = 760;
  const content =
    docRef({ position: 'top-right', text: 'BSTJ V11 N1 / EQ 09.4 / 1932' }) +
    `<g id="diagram" transform="translate(${tx} ${ty})">${buildDiagram()}</g>` +
    caption({
      text: 'FIG.08  EQ.SET 09.4  /  N-MESH IDENT.',
      y: 1310,
    }) +
    telemetry({
      lines: [
        'ORDER      N=4',
        'TERMS      16',
        "DET.RATIO  C'_IJ",
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
