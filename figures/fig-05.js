// figures/fig-05.js — Null-Impedance Bridge Method (variant b: redrawn for analysis)
// Source: same BSTJ Fig. 4 as fig-04 (the two screenshot scans are visually
// identical). Per PLAN.md, this variant is rendered as the "redrawn for
// analysis" form: T₂ transformer inlined directly in the B-arm rather than
// drawn as a separate dashed module on the right; layout slightly compressed.

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

const CHASSIS = { left: -250, right: 240, top: -200, bottom: 190 };

const B = [0, CHASSIS.top];
const D = [0, CHASSIS.bottom];
const SRC = { x: CHASSIS.left, y: 0, r: 22 };

const A = [-115, -10];
const C = [115, -10];
const MID = [0, -90];

const DET = { x: 0, y: -10, r: 18 };

// Inline transformer in B-arm
const T2_TOP = -160; // top coil center y
const T2_BOT = -120; // bottom coil center y
const T2_LEN = 50;

const L_POS = { x: A[0], y: 50 };
const CP_POS = { x: A[0], y: 105 };

const N1 = [115, 130];
const N2 = [175, 130];
const N3 = [215, 165];

const smallNode = (x, y, lbl) =>
  node({ x, y, label: lbl, r: SN_R, fontSize: SN_FONT });
const eqlbl = (x, y, text, size = 13, align = 'middle') =>
  equationLine({ x, y, text, size, align });

export function buildDiagram() {
  let s = '';

  // === CHASSIS (with source interrupting left edge) ===
  s += wire([
    [CHASSIS.left, CHASSIS.top],
    [CHASSIS.right, CHASSIS.top],
    [CHASSIS.right, CHASSIS.bottom],
    [CHASSIS.left, CHASSIS.bottom],
    [CHASSIS.left, SRC.y + SRC.r],
  ]);
  s += wire([[CHASSIS.left, SRC.y - SRC.r], [CHASSIS.left, CHASSIS.top]]);
  s += galvanometer({ x: SRC.x, y: SRC.y, r: SRC.r });

  // === B → T₂ (inline transformer) → R/2 → MID ===
  // Wire from B down to top coil
  s += wire([[B[0], B[1] + NODE_R], [B[0], T2_TOP - 12]]);
  // Top coil (horizontal, centered)
  s += `<g transform="translate(${B[0] - T2_LEN / 2} ${T2_TOP})">${inductor({ length: T2_LEN, loops: 4 })}</g>`;
  // Iron-core dashes between coils
  const coreY = (T2_TOP + T2_BOT) / 2;
  s += `<line x1="${B[0] - T2_LEN * 0.4}" y1="${coreY - 2}" x2="${B[0] + T2_LEN * 0.4}" y2="${coreY - 2}" stroke="${COLOR}" stroke-width="${FINE}"/>`;
  s += `<line x1="${B[0] - T2_LEN * 0.4}" y1="${coreY + 2}" x2="${B[0] + T2_LEN * 0.4}" y2="${coreY + 2}" stroke="${COLOR}" stroke-width="${FINE}"/>`;
  // Bottom coil
  s += `<g transform="translate(${B[0] - T2_LEN / 2} ${T2_BOT})">${inductor({ length: T2_LEN, loops: 4 })}</g>`;
  // T₂ label to the right of the transformer
  s += eqlbl(B[0] + T2_LEN / 2 + 8, coreY + 4, 'T_{2}', 13, 'start');
  // Connect bottom coil down to R/2 resistor
  s += wire([[B[0], T2_BOT + 12], [B[0], -110]]);
  // R/2 resistor centered at y=-100, just before MID
  s += alongArm([B[0], -110], MID, 0, (opts) => resistor({ ...opts, height: 11 }), 18);
  s += eqlbl(B[0] + 22, -100, 'R/2', 13, 'start');

  // === MID → R → A and MID → R → C ===
  s += alongArm(MID, A, NODE_R, (opts) => resistor({ ...opts, height: 10 }), 60);
  s += eqlbl((MID[0] + A[0]) / 2 + 10, (MID[1] + A[1]) / 2 - 18, 'R', 13);
  s += alongArm(MID, C, NODE_R, (opts) => resistor({ ...opts, height: 10 }), 60);
  s += eqlbl((MID[0] + C[0]) / 2 - 10, (MID[1] + C[1]) / 2 - 18, 'R', 13);
  s += junction(MID[0], MID[1]);

  // === DETECTOR ===
  s += wire([[A[0] + NODE_R, A[1]], [DET.x - DET.r, DET.y]]);
  s += wire([[DET.x + DET.r, DET.y], [C[0] - NODE_R, C[1]]]);
  s += galvanometer({ x: DET.x, y: DET.y, r: DET.r });

  // === L (variable inductor) below A ===
  s += wire([[A[0], A[1] + NODE_R], [L_POS.x, L_POS.y - 12]]);
  s += `<g transform="translate(${L_POS.x - 24} ${L_POS.y})">${inductor({ length: 48, loops: 4 })}</g>`;
  s += `<line x1="${L_POS.x - 18}" y1="${L_POS.y + 16}" x2="${L_POS.x + 18}" y2="${L_POS.y - 16}" stroke="${COLOR}" stroke-width="${STROKE}" stroke-linecap="round"/>`;
  s += `<polyline points="${L_POS.x + 12},${L_POS.y - 14} ${L_POS.x + 18},${L_POS.y - 16} ${L_POS.x + 14},${L_POS.y - 9}" stroke="${COLOR}" stroke-width="${STROKE}" stroke-linecap="round" fill="none"/>`;
  s += eqlbl(L_POS.x - 36, L_POS.y - 4, 'L', 13, 'end');

  // === C' (cap below L) ===
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
  s += wire([[CP_POS.x, CP_POS.y + 17], [CP_POS.x, 165], [D[0] - NODE_R, 165]]);

  // === D ===
  s += wire([[D[0], CHASSIS.bottom], [D[0], D[1] + NODE_R]]);

  // === Test cluster ===
  s += wire([
    [C[0] + NODE_R, C[1]],
    [N2[0], C[1]],
    [N2[0], N2[1] - SN_R],
  ]);
  s += alongArm(
    N1,
    N2,
    SN_R,
    (opts) => capacitor({ ...opts, gap: 7, plateLen: 14, leadLen: (opts.length - 7) / 2 }),
    22,
  );
  s += eqlbl((N1[0] + N2[0]) / 2, N1[1] - 14, 'C_{12}', 11);
  s += wire([[D[0] + NODE_R, D[1] - 36], [D[0] + NODE_R, N1[1]], [N1[0] - SN_R, N1[1]]]);
  s += junction(D[0] + NODE_R, N1[1]);
  s += wire([[N2[0] + SN_R * 0.7, N2[1] + SN_R * 0.7], [N3[0], N3[1]]]);

  // === Nodes ===
  s += node({ x: A[0], y: A[1], label: 'A', r: NODE_R, fontSize: NODE_FONT });
  s += node({ x: C[0], y: C[1], label: 'C', r: NODE_R, fontSize: NODE_FONT });
  s += node({ x: B[0], y: B[1], label: 'B', r: NODE_R, fontSize: NODE_FONT });
  s += node({ x: D[0], y: D[1], label: 'D', r: NODE_R, fontSize: NODE_FONT });
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
    docRef({ position: 'top-right', text: 'BSTJ V11 N1 / FIG 04B / 1932' }) +
    `<g id="diagram" transform="translate(${tx} ${ty})">${buildDiagram()}</g>` +
    caption({
      text: 'FIG.05  NULL.IMPED.BRIDGE  /  REDRAW',
      y: 1230,
    }) +
    telemetry({
      lines: [
        'EQUIV.NULL .00003',
        'L_T2       2.4 MH',
        "C'         .000470 PF",
        'GAIN       0.000 DB',
        'FUNCTION   IMPED.NULL',
      ],
    });
  return svg('0 0 1600 1600', content);
}

export function buildDiagramSVG() {
  const { x, y, w, h } = DIAGRAM_BOUNDS;
  return svg(`${x} ${y} ${w} ${h}`, buildDiagram());
}
