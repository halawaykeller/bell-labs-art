// figures/fig-03.js — Potentiometer Method for Direct Capacity
// Source: BSTJ V11 N1 / FIG 03 / 1932 (fictional doc-ref attribution)
//
// Topology:
//   Outer chassis rectangle. Top edge carries: A — R — B — (S-R) — C — SOURCE.
//   B drops down to a detector galvanometer; detector continues right to node D.
//   C' capacitor sits to the left of D (between D and the chassis left edge).
//   Test cluster (1, 2, 3) to the right of D — caps C₁₂ between 1 and 2,
//   node 3 below; cluster's right side connects up to C.

import {
  svg,
  resistor,
  capacitor,
  galvanometer,
  node,
  wire,
  alongArm,
  docRef,
  caption,
  telemetry,
  equationLine,
  junction,
} from '../shared/components.js';

const NODE_R = 14;
const NODE_FONT = 14;
const SN_R = 10;
const SN_FONT = 10;

// Diagram-internal coords
const CHASSIS = { left: -360, right: 320, top: -160, bottom: 140 };

const A = [-310, CHASSIS.top];
const B = [-80, CHASSIS.top];
const C = [180, CHASSIS.top];
const SRC = { x: 248, y: CHASSIS.top, r: 18 };

const DET = { x: B[0], y: -55, r: 22 };
const D = [40, -10];

// C' cap (between D and chassis left edge), horizontal
const CP = { x: -180, y: D[1], gap: 12, plateLen: 22, leadLen: 0 };

// Test cluster
const N1 = [110, D[1]];
const N2 = [180, D[1]];
const N3 = [145, 50];

const smallNode = (x, y, lbl) =>
  node({ x, y, label: lbl, r: SN_R, fontSize: SN_FONT });
const eqlbl = (x, y, text, size = 14, align = 'middle') =>
  equationLine({ x, y, text, size, align });

export function buildDiagram() {
  let s = '';

  // === CHASSIS RECTANGLE ===
  // Bottom + left + right edges drawn explicitly. Top edge is built piecewise
  // because it carries components.
  s += wire([
    [CHASSIS.left, CHASSIS.top],
    [CHASSIS.left, CHASSIS.bottom],
    [CHASSIS.right, CHASSIS.bottom],
    [CHASSIS.right, CHASSIS.top],
  ]);

  // === TOP EDGE ===
  s += wire([[CHASSIS.left, CHASSIS.top], [A[0] - NODE_R, A[1]]]);
  s += alongArm(A, B, NODE_R, (opts) => resistor({ ...opts, height: 11 }), 130);
  s += eqlbl((A[0] + B[0]) / 2, A[1] - 22, 'R', 16);
  s += alongArm(B, C, NODE_R, (opts) => resistor({ ...opts, height: 11 }), 160);
  s += eqlbl((B[0] + C[0]) / 2, B[1] - 22, 'S-R', 16);
  s += wire([[C[0] + NODE_R, C[1]], [SRC.x - SRC.r, SRC.y]]);
  s += galvanometer({ x: SRC.x, y: SRC.y, r: SRC.r });
  s += wire([[SRC.x + SRC.r, SRC.y], [CHASSIS.right, CHASSIS.top]]);

  // === DETECTOR (B drops to detector) ===
  s += wire([[B[0], B[1] + NODE_R], [DET.x, DET.y - DET.r]]);
  s += galvanometer({ x: DET.x, y: DET.y, r: DET.r });

  // === DETECTOR → D ===
  s += wire([
    [DET.x, DET.y + DET.r],
    [DET.x, D[1]],
    [D[0] - NODE_R, D[1]],
  ]);
  s += junction(DET.x, D[1]);

  // === C' (cap to the left of D, between D and chassis-left) ===
  // Cap occupies x ∈ [CP.x, CP.x + (2*leadLen + gap)] = [CP.x, CP.x + 12]
  const capLeft = CP.x;
  const capRight = CP.x + 2 * CP.leadLen + CP.gap;
  // Wire from D's left edge leftward to cap's right plate
  s += wire([[D[0] - NODE_R, D[1]], [capRight, CP.y]]);
  // Cap itself
  s += capacitor({
    x: capLeft,
    y: CP.y,
    gap: CP.gap,
    plateLen: CP.plateLen,
    leadLen: CP.leadLen,
  });
  // Wire from cap's left plate to chassis-left edge
  s += wire([[capLeft, CP.y], [CHASSIS.left, CP.y]]);
  // C' label above cap
  s += eqlbl((capLeft + capRight) / 2, CP.y - 16, "C'", 14);

  // === C₁₂ (between N1 and N2) and connections ===
  s += wire([[D[0] + NODE_R, D[1]], [N1[0] - SN_R, N1[1]]]);
  s += alongArm(
    N1,
    N2,
    SN_R,
    (opts) => capacitor({ ...opts, gap: 8, plateLen: 16, leadLen: (opts.length - 8) / 2 }),
    24,
  );
  s += eqlbl((N1[0] + N2[0]) / 2, N1[1] - 18, 'C_{12}', 12);
  // From N2 right side, wire up to meet C from below
  s += wire([
    [N2[0] + SN_R, N2[1]],
    [N2[0] + 30, N2[1]],
    [N2[0] + 30, C[1] + NODE_R],
    [C[0], C[1] + NODE_R],
  ]);

  // === NODE 3 connections (down-Δ from 1, 2) ===
  s += wire([[N1[0], N1[1] + SN_R], [N3[0] - SN_R * 0.7, N3[1] - SN_R * 0.7]]);
  s += wire([[N2[0], N2[1] + SN_R], [N3[0] + SN_R * 0.7, N3[1] - SN_R * 0.7]]);

  // === MAIN NODES ===
  s += node({ x: A[0], y: A[1], label: 'A', r: NODE_R, fontSize: NODE_FONT });
  s += node({ x: B[0], y: B[1], label: 'B', r: NODE_R, fontSize: NODE_FONT });
  s += node({ x: C[0], y: C[1], label: 'C', r: NODE_R, fontSize: NODE_FONT });
  s += node({ x: D[0], y: D[1], label: 'D', r: NODE_R, fontSize: NODE_FONT });

  // === SMALL NUMBERED NODES ===
  s += smallNode(...N1, '1');
  s += smallNode(...N2, '2');
  s += smallNode(...N3, '3');

  return s;
}

export const DIAGRAM_BOUNDS = {
  x: CHASSIS.left - 30,
  y: CHASSIS.top - 30,
  w: CHASSIS.right - CHASSIS.left + 60,
  h: CHASSIS.bottom - CHASSIS.top + 60,
};

export function buildSVG() {
  const tx = 800;
  const ty = 800;
  const content =
    docRef({ position: 'top-left', text: 'BSTJ V11 N1 / FIG 03 / 1932' }) +
    `<g id="diagram" transform="translate(${tx} ${ty})">${buildDiagram()}</g>` +
    caption({
      text: 'FIG.03  POTENTIOMETER METH.  /  DIR.CAP',
      y: 1230,
    }) +
    telemetry({
      lines: [
        'R/S        .4710',
        'C12        .000128 PF',
        "C'         .000470 PF",
        'BAL.NULL   .00007',
        'FUNCTION   POT.NULL',
      ],
    });
  return svg('0 0 1600 1600', content);
}

export function buildDiagramSVG() {
  const { x, y, w, h } = DIAGRAM_BOUNDS;
  return svg(`${x} ${y} ${w} ${h}`, buildDiagram());
}
