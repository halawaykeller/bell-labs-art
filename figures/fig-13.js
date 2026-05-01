// figures/fig-13.js — Vacuum-Tube Repeater Element
// Source: BSTJ V01 N2 / FIG 21 / 1922 (fictional doc-ref attribution)
//
// Topology:
//   Large tube envelope (circle) at top-center with 3 internal elements:
//     • Filament (vertical zigzag) — left
//     • Grid (parallel horizontal short lines) — center
//     • Plate (vertical rectangle) — right
//   Below the tube, two sub-circuits flank the bottom:
//     • Receiving Circuit (left): transformer pair + battery
//     • Transmitting Circuit (right): transformer pair + battery
//   Wires from tube internals run down to the appropriate sub-circuits.

import {
  svg,
  inductor,
  node,
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

const TUBE = { x: 0, y: -120, r: 90 };

// Internal element x positions (relative to tube center)
const FIL_DX = -36;
const GRID_DX = 0;
const PLATE_DX = 36;

// Bottom sub-circuit centers
const RX_CENTER = [-180, 110]; // Receiving Circuit
const TX_CENTER = [180, 110];  // Transmitting Circuit

const eqlbl = (x, y, text, size = 13, align = 'middle') =>
  equationLine({ x, y, text, size, align });

// Filament: vertical zigzag
function filament(cx, cy, height = 60, peaks = 4, width = 8) {
  const top = cy - height / 2;
  const bot = cy + height / 2;
  const step = height / peaks;
  let d = `M ${cx} ${top}`;
  for (let i = 0; i < peaks; i++) {
    const ax = cx + (i % 2 === 0 ? -width : width);
    const ay = top + (i + 0.5) * step;
    const bx = cx;
    const by = top + (i + 1) * step;
    d += ` L ${ax} ${ay} L ${bx} ${by}`;
  }
  return `<path d="${d}" stroke="${COLOR}" stroke-width="${STROKE}" fill="none" stroke-linecap="round" stroke-linejoin="miter"/>`;
}

// Grid: stack of short horizontal lines
function grid(cx, cy, height = 60, lines = 5, width = 14) {
  const top = cy - height / 2;
  const step = height / (lines - 1);
  let s = '';
  // Vertical wire that the lines hang off
  s += `<line x1="${cx}" y1="${top}" x2="${cx}" y2="${cy + height / 2}" stroke="${COLOR}" stroke-width="${STROKE}" stroke-linecap="round"/>`;
  for (let i = 0; i < lines; i++) {
    const y = top + i * step;
    s += `<line x1="${cx - width / 2}" y1="${y}" x2="${cx + width / 2}" y2="${y}" stroke="${COLOR}" stroke-width="${STROKE}" stroke-linecap="round"/>`;
  }
  return s;
}

// Plate: vertical bar
function plate(cx, cy, height = 56, width = 8) {
  return `<rect x="${cx - width / 2}" y="${cy - height / 2}" width="${width}" height="${height}" stroke="${COLOR}" stroke-width="${STROKE}" fill="none"/>`;
}

// Battery cell: pairs of short long/short line with the long line for + plate
function battery(cx, cy, cells = 2, gap = 8) {
  // Each cell: long line (h=10) + short line (h=6), separated horizontally by 4px
  const cellW = 8;
  const total = cells * cellW + (cells - 1) * gap;
  const start = cx - total / 2;
  let s = '';
  for (let i = 0; i < cells; i++) {
    const x0 = start + i * (cellW + gap);
    s += `<line x1="${x0}" y1="${cy - 6}" x2="${x0}" y2="${cy + 6}" stroke="${COLOR}" stroke-width="${FINE}" stroke-linecap="round"/>`;
    s += `<line x1="${x0 + cellW}" y1="${cy - 10}" x2="${x0 + cellW}" y2="${cy + 10}" stroke="${COLOR}" stroke-width="${STROKE}" stroke-linecap="round"/>`;
  }
  return s;
}

// Transformer pair (two horizontal coils stacked with iron-core dashes between)
function transformerPair(cx, cy, length = 80, gap = 22) {
  const halfLen = length / 2;
  const topY = cy - gap / 2 - 8;
  const botY = cy + gap / 2 + 8;
  let s = '';
  s += `<g transform="translate(${cx - halfLen} ${topY})">${inductor({ length, loops: 4 })}</g>`;
  s += `<g transform="translate(${cx - halfLen} ${botY})">${inductor({ length, loops: 4 })}</g>`;
  // Iron-core dashes
  s += `<line x1="${cx - length * 0.4}" y1="${cy - 2}" x2="${cx + length * 0.4}" y2="${cy - 2}" stroke="${COLOR}" stroke-width="${FINE}"/>`;
  s += `<line x1="${cx - length * 0.4}" y1="${cy + 2}" x2="${cx + length * 0.4}" y2="${cy + 2}" stroke="${COLOR}" stroke-width="${FINE}"/>`;
  return s;
}

export function buildDiagram() {
  let s = '';

  // === TUBE ENVELOPE ===
  s += `<circle cx="${TUBE.x}" cy="${TUBE.y}" r="${TUBE.r}" stroke="${COLOR}" stroke-width="${STROKE}" fill="none" stroke-linecap="round"/>`;

  // Internal elements
  s += filament(TUBE.x + FIL_DX, TUBE.y);
  s += grid(TUBE.x + GRID_DX, TUBE.y);
  s += plate(TUBE.x + PLATE_DX, TUBE.y);

  // Internal element labels — placed well above the envelope and spread out.
  s += label({ x: TUBE.x - 70, y: TUBE.y - TUBE.r - 14, text: 'FILAMENT', size: 10, align: 'middle' });
  s += label({ x: TUBE.x, y: TUBE.y - TUBE.r - 14, text: 'GRID', size: 10, align: 'middle' });
  s += label({ x: TUBE.x + 70, y: TUBE.y - TUBE.r - 14, text: 'PLATE', size: 10, align: 'middle' });
  // Small leader lines from each label down to its element top
  s += `<line x1="${TUBE.x - 70}" y1="${TUBE.y - TUBE.r - 8}" x2="${TUBE.x + FIL_DX}" y2="${TUBE.y - 30}" stroke="${COLOR}" stroke-width="${FINE}" stroke-linecap="round"/>`;
  s += `<line x1="${TUBE.x}" y1="${TUBE.y - TUBE.r - 8}" x2="${TUBE.x + GRID_DX}" y2="${TUBE.y - 30}" stroke="${COLOR}" stroke-width="${FINE}" stroke-linecap="round"/>`;
  s += `<line x1="${TUBE.x + 70}" y1="${TUBE.y - TUBE.r - 8}" x2="${TUBE.x + PLATE_DX}" y2="${TUBE.y - 30}" stroke="${COLOR}" stroke-width="${FINE}" stroke-linecap="round"/>`;

  // === RECEIVING CIRCUIT (bottom-left) ===
  s += transformerPair(RX_CENTER[0], RX_CENTER[1]);
  // Battery to the right of transformer
  s += battery(RX_CENTER[0] + 70, RX_CENTER[1]);
  // Wires back to chassis-bottom rail
  s += wire([
    [RX_CENTER[0] - 40, RX_CENTER[1] - 22],
    [RX_CENTER[0] - 40, RX_CENTER[1] + 60],
  ]);
  s += wire([
    [RX_CENTER[0] + 40, RX_CENTER[1] - 22],
    [RX_CENTER[0] + 40, RX_CENTER[1] + 60],
  ]);
  s += label({
    x: RX_CENTER[0],
    y: RX_CENTER[1] + 80,
    text: 'RECEIVING CIRCUIT',
    size: 11,
  });

  // === TRANSMITTING CIRCUIT (bottom-right) ===
  s += transformerPair(TX_CENTER[0], TX_CENTER[1]);
  s += battery(TX_CENTER[0] - 70, TX_CENTER[1]);
  s += wire([
    [TX_CENTER[0] - 40, TX_CENTER[1] - 22],
    [TX_CENTER[0] - 40, TX_CENTER[1] + 60],
  ]);
  s += wire([
    [TX_CENTER[0] + 40, TX_CENTER[1] - 22],
    [TX_CENTER[0] + 40, TX_CENTER[1] + 60],
  ]);
  s += label({
    x: TX_CENTER[0],
    y: TX_CENTER[1] + 80,
    text: 'TRANSMITTING CIRCUIT',
    size: 11,
  });

  // === WIRES from tube internals down to sub-circuits ===
  // Filament has TWO terminals (top and bottom of zigzag) — connect both to RX
  const filTop = TUBE.x + FIL_DX + 6;
  const filBot = TUBE.x + FIL_DX - 6;
  // Top of filament emerges from envelope-top? Actually filament leads exit
  // through the envelope edge. Let me run wires from envelope edge.
  // Filament wire: from below envelope to RX-circuit-top
  s += wire([
    [TUBE.x + FIL_DX, TUBE.y + TUBE.r - 4], // approximate exit
    [TUBE.x + FIL_DX, RX_CENTER[1] + 22],
    [RX_CENTER[0] + 40, RX_CENTER[1] + 22],
  ]);
  s += junction(TUBE.x + FIL_DX, TUBE.y + TUBE.r - 4);

  // Grid wire: from below envelope down (with cap inline)
  s += wire([
    [TUBE.x + GRID_DX, TUBE.y + TUBE.r - 4],
    [TUBE.x + GRID_DX, RX_CENTER[1] - 8],
    [RX_CENTER[0] - 40, RX_CENTER[1] - 8],
  ]);
  s += junction(TUBE.x + GRID_DX, TUBE.y + TUBE.r - 4);
  // Small "C" label on the grid wire (input coupling cap is implied in original)
  s += eqlbl(TUBE.x + GRID_DX - 10, RX_CENTER[1] - 16, 'C', 11, 'end');

  // Plate wire: from below envelope to TX
  s += wire([
    [TUBE.x + PLATE_DX, TUBE.y + TUBE.r - 4],
    [TUBE.x + PLATE_DX, RX_CENTER[1] - 8],
    [TX_CENTER[0] - 40, RX_CENTER[1] - 8],
  ]);
  s += junction(TUBE.x + PLATE_DX, TUBE.y + TUBE.r - 4);
  s += eqlbl(TUBE.x + PLATE_DX + 10, RX_CENTER[1] - 16, 'C', 11, 'start');

  return s;
}

export const DIAGRAM_BOUNDS = { x: -290, y: -240, w: 580, h: 480 };

export function buildSVG() {
  const tx = 800;
  const ty = 800;
  const content =
    docRef({ position: 'top-right', text: 'BSTJ V01 N2 / FIG 21 / 1922' }) +
    `<g id="diagram" transform="translate(${tx} ${ty})">${buildDiagram()}</g>` +
    caption({
      text: 'FIG.13  VT.REPEATER ELEM.  /  ONE-WAY',
      y: 1280,
    }) +
    telemetry({
      lines: [
        'GAIN       +12.4 DB',
        'FIL.V      4.0 V',
        'PLATE.V    90.0 V',
        'GRID.V    −1.5 V',
        'FUNCTION   REPEAT',
      ],
    });
  return svg('0 0 1600 1600', content);
}

export function buildDiagramSVG() {
  const { x, y, w, h } = DIAGRAM_BOUNDS;
  return svg(`${x} ${y} ${w} ${h}`, buildDiagram());
}
