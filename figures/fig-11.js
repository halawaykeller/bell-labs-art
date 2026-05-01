// figures/fig-11.js — Voltage from sound phase to ground, post arc-extinction
// Source: BSTJ V07 N4 / FIG 04 / 1928 (fictional doc-ref attribution)
//
// Wide horizontal plot showing a slow sinusoidal envelope with high-frequency
// oscillation superimposed. Y-axis = Volts (range −2000 to 8000), X-axis =
// Time (Seconds).

import {
  svg,
  gridAxes,
  docRef,
  caption,
  telemetry,
  equationLine,
  label,
  COLOR,
  STROKE,
} from '../shared/components.js';

const PLOT = { w: 720, h: 280 };

// Generate the trace: slow sine + high-frequency ringing
function traceData(samples = 800) {
  const pts = [];
  for (let i = 0; i < samples; i++) {
    const t = i / (samples - 1); // 0..1
    // Slow sine wave: ~1.5 cycles across the plot, amplitude ~3500, offset 1500
    const slow = Math.sin(t * Math.PI * 2.0) * 3000 + 2200;
    // Fast oscillation: amplitude decreasing toward right (damped)
    const damp = Math.exp(-t * 1.2);
    const fast = Math.sin(t * Math.PI * 60) * 1400 * damp;
    pts.push([t, slow + fast]);
  }
  return pts;
}

// Map data points (t, volts) to plot coords (x, y) within the plot box
function mapToPlot(pts, vMin, vMax) {
  return pts.map(([t, v]) => {
    const px = t * PLOT.w;
    const py = PLOT.h - ((v - vMin) / (vMax - vMin)) * PLOT.h;
    return [px, py];
  });
}

export function buildDiagram() {
  let s = '';

  // Grid + axes
  s += gridAxes({
    x: 0,
    y: 0,
    w: PLOT.w,
    h: PLOT.h,
    xDivisions: 12,
    yDivisions: 10,
    xTickLabels: ['0', '0.05', '0.10', '0.15', '0.20', '0.25'],
    yTickLabels: ['−2000', '0', '2000', '4000', '6000', '8000'],
    fontSize: 11,
  });

  // Trace
  const vMin = -2000;
  const vMax = 8000;
  const pts = mapToPlot(traceData(), vMin, vMax);
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i][0].toFixed(2)} ${pts[i][1].toFixed(2)}`;
  }
  s += `<path d="${d}" stroke="${COLOR}" stroke-width="${STROKE}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

  // Axis titles
  s += label({
    x: -38,
    y: PLOT.h / 2,
    text: 'VOLTS',
    size: 11,
    align: 'middle',
  });
  s += label({
    x: PLOT.w + 6,
    y: PLOT.h - 10,
    text: 'TIME SECONDS',
    size: 11,
    align: 'start',
  });

  return s;
}

export const DIAGRAM_BOUNDS = { x: -80, y: -30, w: PLOT.w + 200, h: PLOT.h + 80 };

export function buildSVG() {
  const tx = 800 - PLOT.w / 2 - 30;
  const ty = 800 - PLOT.h / 2 - 80;
  const content =
    docRef({ position: 'top-left', text: 'BSTJ V07 N4 / FIG 04 / 1928' }) +
    `<g id="diagram" transform="translate(${tx} ${ty})">${buildDiagram()}</g>` +
    caption({
      text: 'FIG.11  VOLT.SOUND-GND  /  POST.ARC.EXT',
      y: 1230,
    }) +
    telemetry({
      lines: [
        'V_PEAK     7480 V',
        'V_TROUGH  −1820 V',
        'F.SLOW     60 HZ',
        'F.FAST     3.6 KHZ',
        'FUNCTION   TRACE',
      ],
    });
  return svg('0 0 1600 1600', content);
}

export function buildDiagramSVG() {
  const { x, y, w, h } = DIAGRAM_BOUNDS;
  return svg(`${x} ${y} ${w} ${h}`, buildDiagram());
}
