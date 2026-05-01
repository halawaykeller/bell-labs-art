// figures/fig-01.js — Equivalent Direct Capacities
// Source: BSTJ V11 N1 / FIG 01 / 1932 (fictional doc-ref attribution)
//
// Three rows of capacitor identities. Each row: LHS sub-circuit, "=", RHS
// sub-circuit. From original caption: "Fig. 1—Equivalent Direct Capacities.
// G₄ = C₁₄ + C₂₄ + C₃₄ = Grounded Capacity of Branch-Point 4"
//
// Row 1: parallel caps  (1—C₁—2  ‖  1—C₂—2)            =  (1—(C₁+C₂)—2)
// Row 2: series caps    (1—C₁—C₂—2)                     =  (1—(C₁C₂/(C₁+C₂))—2)
// Row 3: triangular mesh of nodes 1, 2, 3 with interior node 4 and a
//        capacitor on every node-pair  =  same triangle without node 4
//        and compound capacitances on each outer edge.

import {
  svg,
  capacitor,
  node,
  wire,
  alongArm,
  docRef,
  caption,
  telemetry,
  equationLine,
  label,
} from '../shared/components.js';

const SN_R = 11;
const SN_FONT = 11;
const LABEL_SIZE = 14;
const COMPOUND_SIZE = 12;

// Row baselines (diagram-internal y)
const Y_ROW1 = -240;
const Y_ROW2 = -110;
const Y_ROW3 = 70;

const X_LHS = -210;
const X_EQ = 0;
const X_RHS = 200;

const smallNode = (x, y, lbl) =>
  node({ x, y, label: lbl, r: SN_R, fontSize: SN_FONT });

const defaultCap = (opts) =>
  capacitor({ ...opts, gap: 8, plateLen: 14, leadLen: (opts.length - 8) / 2 });

// Equation-style label with monospace + subscripts via tspan.
const eqlbl = (x, y, text, size = LABEL_SIZE, align = 'middle') =>
  equationLine({ x, y, text, size, align });

// -------------------------------------------------------------
// Row 1 — parallel caps
// -------------------------------------------------------------
function row1Lhs() {
  let s = '';
  s += smallNode(-50, 0, '1');
  s += smallNode(50, 0, '2');
  // Top branch
  s += wire([[-50 + SN_R, 0], [-50 + SN_R, -22], [-12, -22]]);
  s += capacitor({ x: -12, y: -22, gap: 8, plateLen: 14, leadLen: 12 });
  s += wire([[12, -22], [50 - SN_R, -22], [50 - SN_R, 0]]);
  s += eqlbl(0, -36, 'C_{1}');
  // Bottom branch
  s += wire([[-50 + SN_R, 0], [-50 + SN_R, 22], [-12, 22]]);
  s += capacitor({ x: -12, y: 22, gap: 8, plateLen: 14, leadLen: 12 });
  s += wire([[12, 22], [50 - SN_R, 22], [50 - SN_R, 0]]);
  s += eqlbl(0, 44, 'C_{2}');
  return s;
}

function row1Rhs() {
  let s = '';
  s += smallNode(-50, 0, '1');
  s += smallNode(50, 0, '2');
  s += wire([[-50 + SN_R, 0], [-15, 0]]);
  s += capacitor({ x: -15, y: 0, gap: 10, plateLen: 16, leadLen: 12 });
  s += wire([[15, 0], [50 - SN_R, 0]]);
  s += eqlbl(0, -18, 'C_{1}+C_{2}');
  return s;
}

// -------------------------------------------------------------
// Row 2 — series caps
// -------------------------------------------------------------
function row2Lhs() {
  let s = '';
  s += smallNode(-80, 0, '1');
  s += smallNode(80, 0, '2');
  s += wire([[-80 + SN_R, 0], [-50, 0]]);
  s += capacitor({ x: -50, y: 0, gap: 8, plateLen: 14, leadLen: 12 });
  s += wire([[-26, 0], [26, 0]]);
  s += capacitor({ x: 26, y: 0, gap: 8, plateLen: 14, leadLen: 12 });
  s += wire([[50, 0], [80 - SN_R, 0]]);
  s += eqlbl(-38, -16, 'C_{1}');
  s += eqlbl(38, -16, 'C_{2}');
  return s;
}

function row2Rhs() {
  let s = '';
  s += smallNode(-50, 0, '1');
  s += smallNode(50, 0, '2');
  s += wire([[-50 + SN_R, 0], [-15, 0]]);
  s += capacitor({ x: -15, y: 0, gap: 10, plateLen: 16, leadLen: 12 });
  s += wire([[15, 0], [50 - SN_R, 0]]);
  s += eqlbl(0, -18, 'C_{1}C_{2}/(C_{1}+C_{2})');
  return s;
}

// -------------------------------------------------------------
// Row 3 — triangular mesh
// -------------------------------------------------------------
function row3Lhs() {
  const n1 = [-90, -60];
  const n2 = [90, -60];
  const n3 = [0, 100];
  const n4 = [0, 0];
  let s = '';
  // Outer edges
  s += alongArm(n1, n2, SN_R, defaultCap, 24);
  s += eqlbl(0, -68, 'C_{12}');
  s += alongArm(n1, n3, SN_R, defaultCap, 22);
  s += eqlbl(-66, 32, 'C_{13}');
  s += alongArm(n2, n3, SN_R, defaultCap, 22);
  s += eqlbl(66, 32, 'C_{23}');
  // Interior edges (1-4, 2-4, 3-4)
  s += alongArm(n1, n4, SN_R, defaultCap, 18);
  s += eqlbl(-50, -22, 'C_{14}');
  s += alongArm(n2, n4, SN_R, defaultCap, 18);
  s += eqlbl(50, -22, 'C_{24}');
  s += alongArm(n3, n4, SN_R, defaultCap, 16);
  s += eqlbl(20, 56, 'C_{34}', LABEL_SIZE, 'start');
  // Nodes
  s += smallNode(...n1, '1');
  s += smallNode(...n2, '2');
  s += smallNode(...n3, '3');
  s += smallNode(...n4, '4');
  return s;
}

function row3Rhs() {
  const n1 = [-90, -60];
  const n2 = [90, -60];
  const n3 = [0, 100];
  let s = '';
  s += alongArm(n1, n2, SN_R, defaultCap, 26);
  s += eqlbl(0, -72, 'C_{12}+C_{14}C_{24}/G_{4}', COMPOUND_SIZE);
  s += alongArm(n1, n3, SN_R, defaultCap, 24);
  s += eqlbl(-92, 32, 'C_{13}+C_{14}C_{34}/G_{4}', COMPOUND_SIZE, 'end');
  s += alongArm(n2, n3, SN_R, defaultCap, 24);
  s += eqlbl(92, 32, 'C_{23}+C_{24}C_{34}/G_{4}', COMPOUND_SIZE, 'start');
  s += smallNode(...n1, '1');
  s += smallNode(...n2, '2');
  s += smallNode(...n3, '3');
  return s;
}

// -------------------------------------------------------------
// Compose
// -------------------------------------------------------------
export function buildDiagram() {
  let s = '';
  s += `<g transform="translate(${X_LHS} ${Y_ROW1})">${row1Lhs()}</g>`;
  s += label({ x: X_EQ, y: Y_ROW1 + 6, text: '=', size: 26 });
  s += `<g transform="translate(${X_RHS} ${Y_ROW1})">${row1Rhs()}</g>`;

  s += `<g transform="translate(${X_LHS} ${Y_ROW2})">${row2Lhs()}</g>`;
  s += label({ x: X_EQ, y: Y_ROW2 + 6, text: '=', size: 26 });
  s += `<g transform="translate(${X_RHS} ${Y_ROW2})">${row2Rhs()}</g>`;

  s += `<g transform="translate(${X_LHS} ${Y_ROW3})">${row3Lhs()}</g>`;
  s += label({ x: X_EQ, y: Y_ROW3 + 6, text: '=', size: 26 });
  s += `<g transform="translate(${X_RHS} ${Y_ROW3})">${row3Rhs()}</g>`;
  return s;
}

export const DIAGRAM_BOUNDS = { x: -360, y: -290, w: 720, h: 530 };

export function buildSVG() {
  const tx = 800;
  const ty = 800;
  const content =
    docRef({ position: 'top-left', text: 'BSTJ V11 N1 / FIG 01 / 1932' }) +
    `<g id="diagram" transform="translate(${tx} ${ty})">${buildDiagram()}</g>` +
    caption({
      text: 'FIG.01  EQUIV.DIR.CAPACITIES  /  G4 = C14+C24+C34',
      y: 1310,
    }) +
    telemetry({
      lines: [
        'NETWORK    4N6E',
        'G4         .00043 PF',
        "C12'       .00021 PF",
        'BRANCH.PT  4',
        'FUNCTION   IDENT',
      ],
    });
  return svg('0 0 1600 1600', content);
}

export function buildDiagramSVG() {
  const { x, y, w, h } = DIAGRAM_BOUNDS;
  return svg(`${x} ${y} ${w} ${h}`, buildDiagram());
}
