// figures/fig-02.js — Colpitts Substitution Bridge Method for Direct Capacity
// Source: BSTJ V11 N1 / FIG 02 / 1932 (fictional doc-ref attribution)
//
// Topology:
//   Bridge diamond ABCD with:
//     A→B  resistor R1 (ratio arm)
//     B→C  resistor R2 (ratio arm)
//     C→D  plain wire
//     D→A  variable capacitor (substitution standard)
//   Detector galvanometer in upper interior, wires diagonal to A and C.
//   Source galvanometer on the far left, wires loop up to B and down to D.
//   Chassis enclosure: outer rectangle around source + bridge.
//   Test network: small 4-node diamond cluster (1, 2, 3, 4) in the lower-right
//   interior, connected to C and D.

import {
  svg,
  resistor,
  capacitor,
  varCapacitor,
  galvanometer,
  node,
  wire,
  docRef,
  caption,
  telemetry,
  COLOR,
} from '../shared/components.js';

// -------------------------------------------------------------
// Diagram-internal coordinates (centered at 0,0)
// -------------------------------------------------------------
const A = [-220, 0];
const B = [0, -220];
const C = [220, 0];
const D = [0, 220];
const NODE_R = 16;

const DET = { x: 0, y: -85, r: 22 };
const SRC = { x: -440, y: 0, r: 32 };

// Test network — small 4-node diamond cluster (lower-right interior)
const SN_R = 10;
const N2 = [140, 25]; // top
const N4 = [95, 70]; // left
const N3 = [185, 70]; // right
const N1 = [140, 115]; // bottom

// Chassis frame extents
const FRAME = {
  left: SRC.x, // source sits on left edge
  right: 260,
  top: -270,
  bottom: 270,
};

// Bounds for diagram-only export (slight pad past the chassis frame).
export const DIAGRAM_BOUNDS = {
  x: FRAME.left - 38,
  y: FRAME.top - 38,
  w: FRAME.right - FRAME.left + 76,
  h: FRAME.bottom - FRAME.top + 76,
};

// -------------------------------------------------------------
// Helpers
// -------------------------------------------------------------
function alongArm(p1, p2, gap, generator, length, opts = {}) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const total = Math.hypot(dx, dy);
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  const ux = dx / total;
  const uy = dy / total;
  const visStart = [p1[0] + ux * gap, p1[1] + uy * gap];
  const visEnd = [p2[0] - ux * gap, p2[1] - uy * gap];
  const compStartDist = (total - length) / 2;
  const cs = [
    p1[0] + ux * compStartDist,
    p1[1] + uy * compStartDist,
  ];
  const ce = [
    p1[0] + ux * (compStartDist + length),
    p1[1] + uy * (compStartDist + length),
  ];
  return (
    wire([visStart, cs]) +
    `<g transform="translate(${cs[0].toFixed(2)} ${cs[1].toFixed(2)}) rotate(${ang.toFixed(2)})">${generator({ length, ...opts })}</g>` +
    wire([ce, visEnd])
  );
}

function plainArm(p1, p2, gap = NODE_R) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const total = Math.hypot(dx, dy);
  const ux = dx / total;
  const uy = dy / total;
  return wire([
    [p1[0] + ux * gap, p1[1] + uy * gap],
    [p2[0] - ux * gap, p2[1] - uy * gap],
  ]);
}

function inlineCap(p1, p2, padFromNode = SN_R) {
  return alongArm(
    p1,
    p2,
    padFromNode,
    (opts) =>
      capacitor({ ...opts, plateLen: 18, gap: 7, leadLen: 7 }),
    22,
  );
}

function junction(x, y, r = 3) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${COLOR}"/>`;
}

// -------------------------------------------------------------
// Diagram body
// -------------------------------------------------------------
export function buildDiagram() {
  let s = '';

  // === CHASSIS FRAME (outer enclosure rectangle) ===
  // Top edge spans from above source up to the right boundary, with a
  // junction at x=0 where the source's top loop branches down to B.
  s += wire([
    [FRAME.left, FRAME.top],
    [FRAME.right, FRAME.top],
    [FRAME.right, FRAME.bottom],
    [FRAME.left, FRAME.bottom],
  ]);

  // === SOURCE LOOP (left edge) ===
  // Source galvanometer interrupts the chassis left edge.
  s += wire([[FRAME.left, FRAME.top], [SRC.x, SRC.y - SRC.r]]);
  s += wire([[SRC.x, SRC.y + SRC.r], [FRAME.left, FRAME.bottom]]);
  s += galvanometer({ x: SRC.x, y: SRC.y, r: SRC.r });

  // === SOURCE FEEDS TO BRIDGE ===
  // Top: from chassis top junction down to B
  s += wire([[B[0], FRAME.top], [B[0], B[1] - NODE_R]]);
  s += junction(B[0], FRAME.top);
  // Bottom: from chassis bottom junction up to D
  s += wire([[D[0], FRAME.bottom], [D[0], D[1] + NODE_R]]);
  s += junction(D[0], FRAME.bottom);

  // === BRIDGE ARMS ===
  s += alongArm(A, B, NODE_R, (opts) => resistor({ ...opts, height: 12 }), 150);
  s += alongArm(B, C, NODE_R, (opts) => resistor({ ...opts, height: 12 }), 150);
  s += plainArm(C, D);
  s += alongArm(
    D,
    A,
    NODE_R,
    (opts) =>
      varCapacitor({
        ...opts,
        gap: 18,
        plateLen: 44,
        leadLen: (opts.length - 18) / 2,
      }),
    104,
  );

  // === DETECTOR ===
  // Diagonal wires from A and C up to the detector.
  const angA = Math.atan2(DET.y - A[1], DET.x - A[0]);
  const angC = Math.atan2(DET.y - C[1], DET.x - C[0]);
  s += wire([
    [A[0] + NODE_R * Math.cos(angA), A[1] + NODE_R * Math.sin(angA)],
    [DET.x - DET.r * Math.cos(angA), DET.y - DET.r * Math.sin(angA)],
  ]);
  s += wire([
    [C[0] + NODE_R * Math.cos(angC), C[1] + NODE_R * Math.sin(angC)],
    [DET.x - DET.r * Math.cos(angC), DET.y - DET.r * Math.sin(angC)],
  ]);
  s += galvanometer({ x: DET.x, y: DET.y, r: DET.r });

  // === TEST NETWORK ===
  s += inlineCap(N2, N4);
  s += inlineCap(N2, N3);
  s += inlineCap(N4, N1);
  s += inlineCap(N3, N1);

  // C → cluster top (via tap on the A-C horizontal)
  const tapC = [N2[0], 0];
  s += wire([[C[0] - NODE_R, C[1]], tapC, [N2[0], N2[1] - SN_R]]);
  s += junction(tapC[0], tapC[1]);
  // D → cluster bottom (via interior right-angle path)
  s += wire([
    [D[0], D[1] - NODE_R],
    [0, 165],
    [N1[0], 165],
    [N1[0], N1[1] + SN_R],
  ]);

  // === MAIN NODES ===
  s += node({ x: A[0], y: A[1], label: 'A', r: NODE_R, fontSize: 16 });
  s += node({ x: B[0], y: B[1], label: 'B', r: NODE_R, fontSize: 16 });
  s += node({ x: C[0], y: C[1], label: 'C', r: NODE_R, fontSize: 16 });
  s += node({ x: D[0], y: D[1], label: 'D', r: NODE_R, fontSize: 16 });

  // === SMALL NUMBERED NODES ===
  s += node({ x: N1[0], y: N1[1], label: '1', r: SN_R, fontSize: 11 });
  s += node({ x: N2[0], y: N2[1], label: '2', r: SN_R, fontSize: 11 });
  s += node({ x: N3[0], y: N3[1], label: '3', r: SN_R, fontSize: 11 });
  s += node({ x: N4[0], y: N4[1], label: '4', r: SN_R, fontSize: 11 });

  return s;
}

// -------------------------------------------------------------
// Full 1600 composition
// -------------------------------------------------------------
export function buildSVG() {
  // Center the diagram on the canvas: diagram extents are
  // x ∈ [FRAME.left, FRAME.right], so geometric center is
  // (FRAME.left + FRAME.right) / 2; placing it at canvas x = 800.
  const tx = 800 - (FRAME.left + FRAME.right) / 2;
  const ty = 800;
  const content =
    docRef({ position: 'top-left', text: 'BSTJ V11 N1 / FIG 02 / 1932' }) +
    `<g id="diagram" transform="translate(${tx} ${ty})">${buildDiagram()}</g>` +
    caption({ text: 'FIG.02  COLPITTS SUB.BRIDGE  /  DIR.CAP', y: 1230 }) +
    telemetry({
      lines: [
        'BAL.NULL  .00021',
        'R1/R2     .8472',
        'FREQ      1KHZ',
        'Q          .043',
        'FUNCTION   REF',
      ],
    });
  return svg('0 0 1600 1600', content);
}

// -------------------------------------------------------------
// Diagram-only SVG (tight viewBox)
// -------------------------------------------------------------
export function buildDiagramSVG() {
  const { x, y, w, h } = DIAGRAM_BOUNDS;
  return svg(`${x} ${y} ${w} ${h}`, buildDiagram());
}
