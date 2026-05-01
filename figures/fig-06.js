// figures/fig-06.js — Maxwell Discharge Method for Direct Capacity
// Source: BSTJ V11 N1 / FIG 05 / 1932 (fictional doc-ref attribution)
//
// Topology (left-to-right wide composition, inside an outer chassis):
//   • Multi-contact switch cluster (numbered 1-7) on the far left, with a
//     ground beneath it.
//   • Three "comparison" capacitors C', C'', C''' arranged in a stack to
//     the right of the switch; their right plates all join at node A.
//   • Node A sits center-left.
//   • Test network on the right: nodes 1 (top), 2 (right), 3 (bottom) with
//     capacitors C₁₂ (top edge), C₁₃ (left edge), C₂₃ (right edge).
//   • B at top-right of chassis, D at chassis bottom.

import {
  svg,
  capacitor,
  node,
  wire,
  alongArm,
  ground,
  docRef,
  caption,
  telemetry,
  equationLine,
  junction,
  COLOR,
} from '../shared/components.js';

const NODE_R = 13;
const NODE_FONT = 13;
const SN_R = 8;
const SN_FONT = 9;

const CHASSIS = { left: -340, right: 320, top: -130, bottom: 130 };

// Switch cluster: 6 numbered contacts arranged in a small grid + an arm
const SW_CENTER = [-285, -50];
// Contact positions relative to SW_CENTER
const SW_CONTACTS = [
  { dx: -16, dy: -22, label: '5' },
  { dx: 10, dy: -22, label: '2' },
  { dx: -22, dy: 0, label: '1' },
  { dx: 16, dy: 0, label: '3' },
  { dx: -16, dy: 22, label: '6' },
  { dx: 10, dy: 22, label: '7' },
];
const SW_ARM_END = [SW_CENTER[0] - 28, SW_CENTER[1] - 36];

// Ground below switch
const GND_POS = [SW_CENTER[0], SW_CENTER[1] + 86];

// Cap stack — three caps in a vertical column. Each is horizontal, but
// stacked so their right plates align (joining at node A).
const CAP_X_LEFT = -200;
const CAP_X_RIGHT = -120;
const CAP_GAP = 8;
const CAP_PLATE = 22;
const CAPS = [
  { y: -70, label: "C'''" },
  { y: -25, label: "C''" },
  { y: 20, label: "C'" },
];

// Node A on the right of the cap stack
const A = [-60, -25];

// Test network (right side)
const N1 = [80, -55];
const N2 = [200, -10];
const N3 = [120, 65];

const B = [CHASSIS.right - NODE_R, CHASSIS.top + NODE_R];
const D = [60, CHASSIS.bottom];

const smallNode = (x, y, lbl) =>
  node({ x, y, label: lbl, r: SN_R, fontSize: SN_FONT });
const eqlbl = (x, y, text, size = 12, align = 'middle') =>
  equationLine({ x, y, text, size, align });

const dot = (x, y, r = 2) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${COLOR}"/>`;

export function buildDiagram() {
  let s = '';

  // === CHASSIS ===
  s += wire([
    [CHASSIS.left, CHASSIS.top],
    [CHASSIS.right, CHASSIS.top],
    [CHASSIS.right, CHASSIS.bottom],
    [CHASSIS.left, CHASSIS.bottom],
    [CHASSIS.left, CHASSIS.top],
  ]);

  // === SWITCH CLUSTER ===
  // Contact dots with tiny labels next to each
  for (const ct of SW_CONTACTS) {
    const cx = SW_CENTER[0] + ct.dx;
    const cy = SW_CENTER[1] + ct.dy;
    s += dot(cx, cy, 2.5);
    s += eqlbl(cx + 6, cy + 3, ct.label, 9, 'start');
  }
  // Switch arm: from a "common terminal" up-left to one of the contacts
  // (shows it as a rotary switch in some position)
  const swCommon = [SW_CENTER[0] + 0, SW_CENTER[1] + 36];
  s += dot(swCommon[0], swCommon[1], 2.5);
  s += wire([swCommon, SW_ARM_END]);
  // Bracket arc indicating rotary action
  s += `<path d="M ${SW_CENTER[0] - 28} ${SW_CENTER[1] - 22} A 28 28 0 0 1 ${SW_CENTER[0] + 16} ${SW_CENTER[1] - 22}" stroke="${COLOR}" stroke-width="0.75" fill="none" stroke-dasharray="3 3"/>`;

  // Wire from switch common down to ground, and continue right to chassis bottom rail
  s += wire([swCommon, [swCommon[0], GND_POS[1] - 6]]);
  s += ground({ x: GND_POS[0], y: GND_POS[1] - 6 });

  // Wire from switch contact group up to chassis top rail, then right
  // (representing the source connection that the switch routes)
  s += wire([
    [SW_CENTER[0] - 16, SW_CENTER[1] - 22],
    [SW_CENTER[0] - 16, CHASSIS.top + 0],
  ]);
  s += junction(SW_CENTER[0] - 16, CHASSIS.top);

  // === CAP STACK (C', C'', C''') ===
  // Each cap is horizontal, with left plate at CAP_X_LEFT and right plate at CAP_X_RIGHT.
  // Cap occupies x ∈ [CAP_X_LEFT, CAP_X_LEFT + (2*leadLen + gap)]; we want leads of 0
  // so plates are at x=CAP_X_LEFT and x=CAP_X_LEFT+gap.
  // Easier: place cap with leadLen so total length spans CAP_X_LEFT..CAP_X_RIGHT.
  const capTotal = CAP_X_RIGHT - CAP_X_LEFT;
  const leadLen = (capTotal - CAP_GAP) / 2;
  for (const c of CAPS) {
    s += capacitor({
      x: CAP_X_LEFT,
      y: c.y,
      gap: CAP_GAP,
      plateLen: CAP_PLATE,
      leadLen,
    });
    s += eqlbl(CAP_X_LEFT + capTotal / 2, c.y - 18, c.label, 11);
  }
  // Vertical wire on the LEFT side of the cap stack — connects all three left leads
  s += wire([[CAP_X_LEFT, CAPS[0].y], [CAP_X_LEFT, CAPS[CAPS.length - 1].y]]);
  // Vertical wire on the RIGHT side connecting all three right plates → goes to A
  s += wire([[CAP_X_RIGHT, CAPS[0].y], [CAP_X_RIGHT, CAPS[CAPS.length - 1].y]]);
  // Connect cap-stack-left to switch path
  s += wire([
    [CAP_X_LEFT, CAPS[0].y],
    [CAP_X_LEFT, CHASSIS.top],
    [SW_CENTER[0] - 16, CHASSIS.top],
  ]);
  // Connect cap-stack-right to A
  s += wire([
    [CAP_X_RIGHT, A[1]],
    [A[0] - NODE_R, A[1]],
  ]);
  s += junction(CAP_X_RIGHT, A[1]);

  // === A → Test cluster ===
  // From A right to N1 (top of cluster)
  s += wire([
    [A[0] + NODE_R, A[1]],
    [N1[0], A[1]],
    [N1[0], N1[1] + SN_R],
  ]);
  s += junction(N1[0], A[1]);

  // === Test network caps ===
  // C₁₂ (1-2 edge)
  s += alongArm(
    N1,
    N2,
    SN_R,
    (opts) => capacitor({ ...opts, gap: 8, plateLen: 16, leadLen: (opts.length - 8) / 2 }),
    24,
  );
  s += eqlbl((N1[0] + N2[0]) / 2 + 8, (N1[1] + N2[1]) / 2 - 16, 'C_{12}', 11);
  // C₁₃ (1-3 edge)
  s += alongArm(
    N1,
    N3,
    SN_R,
    (opts) => capacitor({ ...opts, gap: 8, plateLen: 16, leadLen: (opts.length - 8) / 2 }),
    22,
  );
  s += eqlbl(N1[0] - 16, (N1[1] + N3[1]) / 2, 'C_{13}', 11, 'end');
  // C₂₃ (2-3 edge)
  s += alongArm(
    N2,
    N3,
    SN_R,
    (opts) => capacitor({ ...opts, gap: 8, plateLen: 16, leadLen: (opts.length - 8) / 2 }),
    22,
  );
  s += eqlbl(N2[0] + 18, (N2[1] + N3[1]) / 2, 'C_{23}', 11, 'start');

  // === B (top-right) — connect via top chassis rail ===
  // The cluster's N2 connects up to B (via chassis top right area)
  s += wire([
    [N2[0] + SN_R, N2[1]],
    [B[0], N2[1]],
    [B[0], B[1] + NODE_R],
  ]);
  s += junction(B[0], N2[1]);

  // === D (bottom) — connect from N3 down to chassis bottom rail ===
  s += wire([
    [N3[0], N3[1] + SN_R],
    [N3[0], CHASSIS.bottom],
  ]);
  s += junction(N3[0], CHASSIS.bottom);
  s += wire([[D[0], CHASSIS.bottom], [D[0], D[1] - NODE_R]]);
  // Wait — D is on the chassis bottom edge; need to position D correctly.

  // === MAIN NODES ===
  s += node({ x: A[0], y: A[1], label: 'A', r: NODE_R, fontSize: NODE_FONT });
  s += node({ x: B[0], y: B[1], label: 'B', r: NODE_R, fontSize: NODE_FONT });
  s += node({ x: D[0], y: D[1] - NODE_R, label: 'D', r: NODE_R, fontSize: NODE_FONT });
  s += smallNode(...N1, '1');
  s += smallNode(...N2, '2');
  s += smallNode(...N3, '3');

  return s;
}

export const DIAGRAM_BOUNDS = {
  x: CHASSIS.left - 30,
  y: CHASSIS.top - 30,
  w: CHASSIS.right - CHASSIS.left + 60,
  h: CHASSIS.bottom - CHASSIS.top + 60 + 30, // extra for ground/D
};

export function buildSVG() {
  const tx = 800;
  const ty = 800;
  const content =
    docRef({ position: 'top-left', text: 'BSTJ V11 N1 / FIG 05 / 1932' }) +
    `<g id="diagram" transform="translate(${tx} ${ty})">${buildDiagram()}</g>` +
    caption({
      text: 'FIG.06  MAXWELL DISCHG.METH.  /  DIR.CAP',
      y: 1230,
    }) +
    telemetry({
      lines: [
        'Q.STORED   4.7E-09 C',
        "C'         .000470 PF",
        "C''        .000128 PF",
        "C'''       .000043 PF",
        'FUNCTION   DISCHG',
      ],
    });
  return svg('0 0 1600 1600', content);
}

export function buildDiagramSVG() {
  const { x, y, w, h } = DIAGRAM_BOUNDS;
  return svg(`${x} ${y} ${w} ${h}`, buildDiagram());
}
