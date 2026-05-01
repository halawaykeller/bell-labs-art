// figures/fig-14.js — Two-Way Vacuum-Tube Repeater Circuit
// Source: BSTJ V01 N2 / FIG 22 / 1922 (fictional doc-ref attribution)
//
// Topology:
//   Two vacuum-tube repeater stages mirror-imaged left/right.
//   East Line (left) connects via input transformer + balancing network to the
//   left tube; West Line (right) connects similarly via the right tube.
//   Hybrid coil X-crossover connects the two stages: each tube's output
//   feeds the OTHER side's line via a hybrid coil. Battery cells visible.

import {
  svg,
  inductor,
  wire,
  docRef,
  caption,
  telemetry,
  equationLine,
  label,
  junction,
  COLOR,
  STROKE,
  FINE,
} from '../shared/components.js';

// Two tubes mirror-imaged
const TUBE_L = { x: -180, y: -10, r: 50 };
const TUBE_R = { x: 180, y: -10, r: 50 };

// Line transformers (input/output of tubes)
const T_EAST_LINE = { x: -360, y: -10 };
const T_WEST_LINE = { x: 360, y: -10 };

// Hybrid coils (between the two tubes)
const HC_TOP = { x: 0, y: -120 };
const HC_BOT = { x: 0, y: 120 };

const eqlbl = (x, y, text, size = 11, align = 'middle') =>
  equationLine({ x, y, text, size, align });

// Helper: small tube with internal symbols (filament/grid/plate)
function smallTube(cx, cy, r) {
  let s = '';
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" stroke="${COLOR}" stroke-width="${STROKE}" fill="none"/>`;
  // Filament zigzag (left)
  const filX = cx - 18;
  const top = cy - 22;
  const bot = cy + 22;
  let d = `M ${filX} ${top}`;
  for (let i = 0; i < 4; i++) {
    const ax = filX + (i % 2 === 0 ? -5 : 5);
    const ay = top + (i + 0.5) * (bot - top) / 4;
    const bx = filX;
    const by = top + (i + 1) * (bot - top) / 4;
    d += ` L ${ax} ${ay} L ${bx} ${by}`;
  }
  s += `<path d="${d}" stroke="${COLOR}" stroke-width="${STROKE}" fill="none" stroke-linecap="round"/>`;
  // Grid (center, small parallel lines)
  s += `<line x1="${cx}" y1="${cy - 18}" x2="${cx}" y2="${cy + 18}" stroke="${COLOR}" stroke-width="${STROKE}" stroke-linecap="round"/>`;
  for (let i = 0; i < 4; i++) {
    const yy = cy - 16 + i * 10;
    s += `<line x1="${cx - 4}" y1="${yy}" x2="${cx + 4}" y2="${yy}" stroke="${COLOR}" stroke-width="${STROKE}" stroke-linecap="round"/>`;
  }
  // Plate (right)
  const pX = cx + 16;
  s += `<rect x="${pX - 3}" y="${cy - 16}" width="6" height="32" stroke="${COLOR}" stroke-width="${STROKE}" fill="none"/>`;
  return s;
}

// Transformer pair
function xfmr(cx, cy, length = 56) {
  let s = '';
  const half = length / 2;
  s += `<g transform="translate(${cx - half} ${cy - 14})">${inductor({ length, loops: 4 })}</g>`;
  s += `<g transform="translate(${cx - half} ${cy + 14})">${inductor({ length, loops: 4 })}</g>`;
  s += `<line x1="${cx - length * 0.4}" y1="${cy - 2}" x2="${cx + length * 0.4}" y2="${cy - 2}" stroke="${COLOR}" stroke-width="${FINE}"/>`;
  s += `<line x1="${cx - length * 0.4}" y1="${cy + 2}" x2="${cx + length * 0.4}" y2="${cy + 2}" stroke="${COLOR}" stroke-width="${FINE}"/>`;
  return s;
}

// Hybrid coil: 4-coil cluster (used as a hybrid junction)
function hybridCoil(cx, cy) {
  let s = '';
  // Two pairs stacked
  s += xfmr(cx, cy - 14, 50);
  s += xfmr(cx, cy + 14, 50);
  return s;
}

// Battery cell
function battery(cx, cy) {
  let s = '';
  s += `<line x1="${cx - 4}" y1="${cy - 6}" x2="${cx - 4}" y2="${cy + 6}" stroke="${COLOR}" stroke-width="${FINE}" stroke-linecap="round"/>`;
  s += `<line x1="${cx + 4}" y1="${cy - 10}" x2="${cx + 4}" y2="${cy + 10}" stroke="${COLOR}" stroke-width="${STROKE}" stroke-linecap="round"/>`;
  return s;
}

export function buildDiagram() {
  let s = '';

  // === EAST LINE (left edge) ===
  s += xfmr(T_EAST_LINE.x, T_EAST_LINE.y);
  s += label({ x: T_EAST_LINE.x - 60, y: T_EAST_LINE.y, text: 'EAST LINE', size: 11, align: 'end' });

  // === WEST LINE (right edge) ===
  s += xfmr(T_WEST_LINE.x, T_WEST_LINE.y);
  s += label({ x: T_WEST_LINE.x + 60, y: T_WEST_LINE.y, text: 'WEST LINE', size: 11, align: 'start' });

  // === LEFT TUBE ===
  s += smallTube(TUBE_L.x, TUBE_L.y, TUBE_L.r);
  // Connect east-line transformer to left-tube grid via wire
  s += wire([
    [T_EAST_LINE.x + 30, T_EAST_LINE.y - 14],
    [T_EAST_LINE.x + 60, T_EAST_LINE.y - 14],
    [T_EAST_LINE.x + 60, TUBE_L.y - 30],
    [TUBE_L.x - TUBE_L.r * 0.7, TUBE_L.y - 18],
  ]);

  // === RIGHT TUBE ===
  s += smallTube(TUBE_R.x, TUBE_R.y, TUBE_R.r);
  s += wire([
    [T_WEST_LINE.x - 30, T_WEST_LINE.y - 14],
    [T_WEST_LINE.x - 60, T_WEST_LINE.y - 14],
    [T_WEST_LINE.x - 60, TUBE_R.y - 30],
    [TUBE_R.x + TUBE_R.r * 0.7, TUBE_R.y - 18],
  ]);

  // === HYBRID COILS (top and bottom, between the two tubes) ===
  s += hybridCoil(HC_TOP.x, HC_TOP.y);
  s += label({ x: HC_TOP.x, y: HC_TOP.y - 50, text: 'HYBRID COIL', size: 10 });
  s += hybridCoil(HC_BOT.x, HC_BOT.y);
  s += label({ x: HC_BOT.x, y: HC_BOT.y + 50, text: 'BAL.NETWORK', size: 10 });

  // === X-CROSSOVER WIRES ===
  // Left tube plate → right hybrid (down-right diagonal)
  s += wire([
    [TUBE_L.x + TUBE_L.r * 0.7, TUBE_L.y + 18],
    [HC_BOT.x - 40, HC_BOT.y - 14],
  ]);
  // Right tube plate → left hybrid (down-left diagonal)
  s += wire([
    [TUBE_R.x - TUBE_R.r * 0.7, TUBE_R.y + 18],
    [HC_BOT.x + 40, HC_BOT.y - 14],
  ]);
  // Top hybrid → both tubes
  s += wire([
    [HC_TOP.x - 28, HC_TOP.y + 22],
    [HC_TOP.x - 28, TUBE_L.y - 30],
    [TUBE_L.x + TUBE_L.r * 0.7, TUBE_L.y - 30],
  ]);
  s += wire([
    [HC_TOP.x + 28, HC_TOP.y + 22],
    [HC_TOP.x + 28, TUBE_R.y - 30],
    [TUBE_R.x - TUBE_R.r * 0.7, TUBE_R.y - 30],
  ]);

  // === BATTERY CELLS (under each tube) ===
  s += battery(TUBE_L.x, TUBE_L.y + TUBE_L.r + 24);
  s += battery(TUBE_R.x, TUBE_R.y + TUBE_R.r + 24);

  // === Tube labels ===
  s += label({ x: TUBE_L.x, y: TUBE_L.y - TUBE_L.r - 12, text: 'V.T. REPEATER', size: 10 });
  s += label({ x: TUBE_R.x, y: TUBE_R.y - TUBE_R.r - 12, text: 'V.T. REPEATER', size: 10 });

  return s;
}

export const DIAGRAM_BOUNDS = { x: -460, y: -210, w: 920, h: 420 };

export function buildSVG() {
  const tx = 800;
  const ty = 800;
  const content =
    docRef({ position: 'top-left', text: 'BSTJ V01 N2 / FIG 22 / 1922' }) +
    `<g id="diagram" transform="translate(${tx} ${ty})">${buildDiagram()}</g>` +
    caption({
      text: 'FIG.14  TWO-WAY VT.REPEATER  /  HYBRID.CIRC.',
      y: 1230,
    }) +
    telemetry({
      lines: [
        'E.LINE     600 OHM',
        'W.LINE     600 OHM',
        'HYBRID.BAL .998',
        'GAIN.E→W   +12.4 DB',
        'FUNCTION   TWO-WAY',
      ],
    });
  return svg('0 0 1600 1600', content);
}

export function buildDiagramSVG() {
  const { x, y, w, h } = DIAGRAM_BOUNDS;
  return svg(`${x} ${y} ${w} ${h}`, buildDiagram());
}
