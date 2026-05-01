// figures/fig-04.js — Null-Impedance Bridge Method for Direct Capacity (variant a)
// Source: BSTJ V11 N1 / FIG 04A / 1932 (fictional doc-ref attribution)
//
// Topology:
//   Chassis enclosure. Source galvanometer on the left edge. B at top.
//   B → R/2 → MID junction → R to A (down-left) and R to C (down-right) —
//   forming a Y. Detector galvanometer on the horizontal A-C axis.
//   T₂ transformer module (drawn as a dashed rectangle with two small
//   coils inside) sits in the upper-right interior; connects to B and to C.
//   L (variable inductor) below A and C' (capacitor) below that lead down
//   to D at chassis-bottom-center. Test cluster (1, 2, 3) lower-right
//   interior, connected to D and C with C₁₂ between 1 and 2.

import {
  svg,
  resistor,
  capacitor,
  inductor,
  galvanometer,
  node,
  wire,
  alongArm,
  docRef,
  caption,
  telemetry,
  equationLine,
  junction,
  COLOR,
  STROKE,
  FINE,
} from '../shared/components.js';

const NODE_R = 14;
const NODE_FONT = 14;
const SN_R = 9;
const SN_FONT = 9;

const CHASSIS = { left: -280, right: 270, top: -210, bottom: 200 };

const B = [0, CHASSIS.top];
const D = [0, CHASSIS.bottom];
const SRC = { x: CHASSIS.left, y: 0, r: 22 };

const A = [-130, -10];
const C = [130, -10];
const MID = [0, -110];

const DET = { x: 0, y: -10, r: 18 };

// T₂ transformer dashed enclosure (upper-right interior)
const T2 = { x: 200, y: -120, w: 80, h: 110 };

// Inductor L (below A) and cap C' (below L) on the path A → D
const L_POS = { x: A[0], y: 50 };
const CP_POS = { x: A[0], y: 110 };

// Test cluster (lower-right)
const N1 = [120, 130];
const N2 = [180, 130];
const N3 = [225, 165];

const smallNode = (x, y, lbl) =>
  node({ x, y, label: lbl, r: SN_R, fontSize: SN_FONT });
const eqlbl = (x, y, text, size = 13, align = 'middle') =>
  equationLine({ x, y, text, size, align });

// Dashed rectangle for the transformer enclosure.
function dashedRect(x, y, w, h) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" stroke="${COLOR}" stroke-width="${FINE}" fill="none" stroke-dasharray="6 4"/>`;
}

export function buildDiagram() {
  let s = '';

  // === CHASSIS ===
  s += wire([
    [CHASSIS.left, CHASSIS.top],
    [CHASSIS.right, CHASSIS.top],
    [CHASSIS.right, CHASSIS.bottom],
    [CHASSIS.left, CHASSIS.bottom],
    [CHASSIS.left, SRC.y + SRC.r],
  ]);
  s += wire([[CHASSIS.left, SRC.y - SRC.r], [CHASSIS.left, CHASSIS.top]]);
  s += galvanometer({ x: SRC.x, y: SRC.y, r: SRC.r });

  // === B → R/2 → MID ===
  s += wire([[B[0], B[1] + NODE_R], [B[0], -180]]);
  s += alongArm(
    [B[0], -180],
    MID,
    0,
    (opts) => resistor({ ...opts, height: 12 }),
    50,
  );
  s += eqlbl(B[0] + 24, -150, 'R/2', 13, 'start');

  // === MID → R → A and MID → R → C (Y-arms) ===
  s += alongArm(MID, A, NODE_R, (opts) => resistor({ ...opts, height: 10 }), 70);
  s += eqlbl((MID[0] + A[0]) / 2 + 10, (MID[1] + A[1]) / 2 - 18, 'R', 13);
  s += alongArm(MID, C, NODE_R, (opts) => resistor({ ...opts, height: 10 }), 70);
  s += eqlbl((MID[0] + C[0]) / 2 - 10, (MID[1] + C[1]) / 2 - 18, 'R', 13);
  s += junction(MID[0], MID[1]);

  // === DETECTOR (galvanometer between A and C) ===
  s += wire([[A[0] + NODE_R, A[1]], [DET.x - DET.r, DET.y]]);
  s += wire([[DET.x + DET.r, DET.y], [C[0] - NODE_R, C[1]]]);
  s += galvanometer({ x: DET.x, y: DET.y, r: DET.r });

  // === T₂ TRANSFORMER (dashed enclosure upper-right) ===
  s += dashedRect(T2.x, T2.y, T2.w, T2.h);
  // Two small coils inside, stacked vertically
  const coilLen = 56;
  const coilCx = T2.x + T2.w / 2;
  const coilY1 = T2.y + 30;
  const coilY2 = T2.y + 80;
  s += `<g transform="translate(${coilCx - coilLen / 2} ${coilY1})">${inductor({ length: coilLen, loops: 4 })}</g>`;
  s += `<g transform="translate(${coilCx - coilLen / 2} ${coilY2})">${inductor({ length: coilLen, loops: 4 })}</g>`;
  // Iron-core dashes between coils
  s += `<line x1="${coilCx - coilLen * 0.4}" y1="${(coilY1 + coilY2) / 2 - 2}" x2="${coilCx + coilLen * 0.4}" y2="${(coilY1 + coilY2) / 2 - 2}" stroke="${COLOR}" stroke-width="${FINE}"/>`;
  s += `<line x1="${coilCx - coilLen * 0.4}" y1="${(coilY1 + coilY2) / 2 + 2}" x2="${coilCx + coilLen * 0.4}" y2="${(coilY1 + coilY2) / 2 + 2}" stroke="${COLOR}" stroke-width="${FINE}"/>`;
  s += eqlbl(T2.x + T2.w / 2, T2.y - 8, 'T_{2}', 14);
  // Connect transformer top to B-area (B's top wire going right)
  s += wire([
    [B[0], CHASSIS.top],
    [coilCx, CHASSIS.top],
    [coilCx, T2.y],
  ]);
  // Connect transformer bottom out to C-side
  s += wire([
    [coilCx, T2.y + T2.h],
    [coilCx, C[1]],
    [C[0] + NODE_R, C[1]],
  ]);
  s += junction(coilCx, C[1]);

  // === L (variable inductor) below A ===
  s += wire([[A[0], A[1] + NODE_R], [L_POS.x, L_POS.y - 12]]);
  s += `<g transform="translate(${L_POS.x - 24} ${L_POS.y})">${inductor({ length: 48, loops: 4 })}</g>`;
  // Variable arrow over the inductor (diagonal arrow)
  s += `<line x1="${L_POS.x - 18}" y1="${L_POS.y + 16}" x2="${L_POS.x + 18}" y2="${L_POS.y - 16}" stroke="${COLOR}" stroke-width="${STROKE}" stroke-linecap="round"/>`;
  s += `<polyline points="${L_POS.x + 12},${L_POS.y - 14} ${L_POS.x + 18},${L_POS.y - 16} ${L_POS.x + 14},${L_POS.y - 9}" stroke="${COLOR}" stroke-width="${STROKE}" stroke-linecap="round" fill="none"/>`;
  s += eqlbl(L_POS.x - 36, L_POS.y - 4, 'L', 13, 'end');

  // === C' (vertical cap below L) ===
  // Cap occupies y ∈ [CP_POS.y - 17, CP_POS.y + 17] (leadLen=12, gap=10 → total 34).
  s += wire([[L_POS.x, L_POS.y + 12], [CP_POS.x, CP_POS.y - 17]]);
  s += capacitor({
    x: CP_POS.x,
    y: CP_POS.y - 17,
    gap: 10,
    plateLen: 22,
    leadLen: 12,
    orientation: 'v',
  });
  s += eqlbl(CP_POS.x - 24, CP_POS.y + 4, "C'", 13, 'end');
  // Continue from C' bottom DOWN to bottom-rail, then over to D's left edge.
  s += wire([[CP_POS.x, CP_POS.y + 17], [CP_POS.x, 170], [D[0] - NODE_R * 0.8, 170]]);

  // === D node and connections ===
  // D sits ON the chassis bottom edge; bottom-edge of chassis is the wire path back.
  // Wire from chassis bottom up to D
  s += wire([[D[0], CHASSIS.bottom], [D[0], D[1] + NODE_R]]);

  // === TEST CLUSTER ===
  // Wire from C down-right to N2 area
  s += wire([
    [C[0] + NODE_R, C[1]],
    [N2[0], C[1]],
    [N2[0], N2[1] - SN_R],
  ]);
  // (junction at top of vertical wire is implied — already created earlier)
  // Caps between cluster nodes
  s += alongArm(
    N1,
    N2,
    SN_R,
    (opts) => capacitor({ ...opts, gap: 7, plateLen: 14, leadLen: (opts.length - 7) / 2 }),
    22,
  );
  s += eqlbl((N1[0] + N2[0]) / 2, N1[1] - 14, 'C_{12}', 11);
  // Wire from D right to N1
  s += wire([[D[0] + NODE_R, D[1] - 36], [D[0] + NODE_R, N1[1]], [N1[0] - SN_R, N1[1]]]);
  s += junction(D[0] + NODE_R, N1[1]);
  // Wires to N3 from N2 (and wire from N3 going right to chassis-right interior tap)
  s += wire([[N2[0] + SN_R * 0.7, N2[1] + SN_R * 0.7], [N3[0], N3[1]]]);

  // === MAIN NODES ===
  s += node({ x: A[0], y: A[1], label: 'A', r: NODE_R, fontSize: NODE_FONT });
  s += node({ x: C[0], y: C[1], label: 'C', r: NODE_R, fontSize: NODE_FONT });
  s += node({ x: B[0], y: B[1], label: 'B', r: NODE_R, fontSize: NODE_FONT });
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
    docRef({ position: 'top-right', text: 'BSTJ V11 N1 / FIG 04A / 1932' }) +
    `<g id="diagram" transform="translate(${tx} ${ty})">${buildDiagram()}</g>` +
    caption({
      text: 'FIG.04  NULL.IMPED.BRIDGE  /  VAR A',
      y: 1230,
    }) +
    telemetry({
      lines: [
        'T2 RATIO   1.0000',
        'R/2        100R0',
        "C12'       .00009 PF",
        'BAL.NULL   .00003',
        'FUNCTION   IMPED.NULL',
      ],
    });
  return svg('0 0 1600 1600', content);
}

export function buildDiagramSVG() {
  const { x, y, w, h } = DIAGRAM_BOUNDS;
  return svg(`${x} ${y} ${w} ${h}`, buildDiagram());
}
