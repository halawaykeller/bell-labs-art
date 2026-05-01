// figures/fig-10.js — Vector diagram of voltages and currents post arc-extinction
// Source: BSTJ V07 N4 / FIG 02 / 1928 (fictional doc-ref attribution)
//
// 8 vectors radiating from a central origin (labeled I_f, the system feed
// current), labeled with the various phase voltages and currents at and
// following extinction of arc. Original caption: "Fig. 2—Vector Diagram
// Showing Relations of Voltages and Currents at and Following Extinction of Arc"

import {
  svg,
  vectorArrow,
  docRef,
  caption,
  telemetry,
  equationLine,
  COLOR,
} from '../shared/components.js';

// Vectors as (angle in degrees, length, label).
// Angles measured from +X axis (right=0, up=−90 because SVG y is inverted).
const VECTORS = [
  { ang: 0, len: 200, label: 'E_{30}' },          // right
  { ang: -28, len: 220, label: 'I_{C}' },          // upper right
  { ang: -150, len: 200, label: 'E_{pg}' },        // upper left
  { ang: -120, len: 170, label: 'E_{ig}' },        // diagonal up-left (alt)
  { ang: 180, len: 200, label: 'E_{og}' },         // far left
  { ang: 150, len: 220, label: 'E_{io}' },         // lower-left
  { ang: 120, len: 200, label: 'E_{ig}′' },        // lower-left (alt)
  { ang: 70, len: 200, label: 'I_{n}' },           // lower-right
];

const ORIGIN_LABEL = 'I_{f}';
const ORIGIN_R = 4;

export function buildDiagram() {
  let s = '';

  // Vectors
  for (const v of VECTORS) {
    const rad = (v.ang * Math.PI) / 180;
    const x2 = Math.cos(rad) * v.len;
    const y2 = Math.sin(rad) * v.len;
    s += vectorArrow({
      x1: 0,
      y1: 0,
      x2,
      y2,
      label: '',  // we'll position labels manually for control
      headSize: 12,
    });
    // Label past the tip, oriented along the vector direction
    const lx = Math.cos(rad) * (v.len + 18);
    const ly = Math.sin(rad) * (v.len + 18);
    s += equationLine({
      x: lx,
      y: ly + 5,
      text: v.label,
      size: 14,
      align: 'middle',
    });
  }

  // Origin marker + label
  s += `<circle cx="0" cy="0" r="${ORIGIN_R}" fill="${COLOR}"/>`;
  s += equationLine({
    x: 16,
    y: -8,
    text: ORIGIN_LABEL,
    size: 14,
    align: 'start',
  });

  return s;
}

export const DIAGRAM_BOUNDS = { x: -270, y: -270, w: 540, h: 540 };

export function buildSVG() {
  const tx = 800;
  const ty = 760;
  const content =
    docRef({ position: 'top-left', text: 'BSTJ V07 N4 / FIG 02 / 1928' }) +
    `<g id="diagram" transform="translate(${tx} ${ty})">${buildDiagram()}</g>` +
    caption({
      text: 'FIG.10  VECTOR DIAG.  /  POST-ARC EXT.',
      y: 1310,
    }) +
    telemetry({
      lines: [
        'PHASE      SOUND.GND',
        'I_F        .82A',
        'I_C        .31A',
        'I_N        .04A',
        'FUNCTION   POST.EXT',
      ],
    });
  return svg('0 0 1600 1600', content);
}

export function buildDiagramSVG() {
  const { x, y, w, h } = DIAGRAM_BOUNDS;
  return svg(`${x} ${y} ${w} ${h}`, buildDiagram());
}
