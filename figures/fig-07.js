// figures/fig-07.js — Equation pair: C₁₂ and G₁
// Source: BSTJ V11 N1 / EQ 03.1 / 1932 (fictional doc-ref attribution)
//
// Two short equations from the potentiometer-method derivation:
//   C₁₂ = (R'/R'') · C'
//   G₁  = ((S − R'')/R'') · C'

import {
  svg,
  docRef,
  caption,
  telemetry,
  equationLine,
  fraction,
} from '../shared/components.js';

const eqlbl = (x, y, text, size = 24, align = 'middle') =>
  equationLine({ x, y, text, size, align });

const Y_EQ1 = -50;
const Y_EQ2 = 60;
const SIZE_LHS = 26;
const SIZE_FRAC = 22;

export function buildDiagram() {
  let s = '';

  // === Equation 1: C₁₂ = (R'/R'') · C' ===
  s += eqlbl(-160, Y_EQ1 + 8, 'C_{12}  =', SIZE_LHS, 'end');
  s += fraction({ x: -50, y: Y_EQ1, num: "R'", den: "R''", size: SIZE_FRAC, barWidth: 56 });
  s += eqlbl(20, Y_EQ1 + 8, "C'", SIZE_LHS, 'start');
  s += eqlbl(70, Y_EQ1 + 8, ',', SIZE_LHS, 'start');

  // === Equation 2: G₁ = ((S − R'')/R'') · C' ===
  s += eqlbl(-160, Y_EQ2 + 8, 'G_{1}   =', SIZE_LHS, 'end');
  s += fraction({ x: -40, y: Y_EQ2, num: "S − R''", den: "R''", size: SIZE_FRAC, barWidth: 96 });
  s += eqlbl(40, Y_EQ2 + 8, "C'", SIZE_LHS, 'start');
  s += eqlbl(90, Y_EQ2 + 8, '.', SIZE_LHS, 'start');

  return s;
}

export const DIAGRAM_BOUNDS = { x: -260, y: -120, w: 520, h: 250 };

export function buildSVG() {
  const tx = 800;
  const ty = 800;
  const content =
    docRef({ position: 'top-left', text: 'BSTJ V11 N1 / EQ 03.1 / 1932' }) +
    `<g id="diagram" transform="translate(${tx} ${ty})">${buildDiagram()}</g>` +
    caption({
      text: 'FIG.07  EQ.SET 03.1  /  POTENTIOMETER',
      y: 1230,
    }) +
    telemetry({
      lines: [
        "R'         .8472",
        "R''        1.0000",
        'S          2.0000',
        "C'         .000470 PF",
        'FUNCTION   IDENT',
      ],
    });
  return svg('0 0 1600 1600', content);
}

export function buildDiagramSVG() {
  const { x, y, w, h } = DIAGRAM_BOUNDS;
  return svg(`${x} ${y} ${w} ${h}`, buildDiagram());
}
