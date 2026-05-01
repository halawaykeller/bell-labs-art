// shared/components.js
// Pure SVG-string generators. No DOM, no browser globals.
// Importable from both browser ESM and Node ESM.
// All output uses #f0eef2 for stroke/fill. No other colors. Ever.

export const COLOR = '#f0eef2';
// Stroke widths are in viewBox units. Figures use a 1600 viewBox typically
// rendered at 600-1000 visual px, so stroke-width 1.4 reads as ~0.5-0.9
// visual px — still hairline but with enough body to land in the
// mid-century printed-page register rather than feeling sterile.
export const STROKE = 1.4;
export const FINE = 0.75;
export const FONT_WEIGHT = 500;

const n = (v) => {
  if (Number.isInteger(v)) return String(v);
  return Number(v.toFixed(3)).toString();
};

// Round caps + joins are the single biggest mid-century lever — they
// soften linework toward "ink on paper" without thickening it.
const strokeAttrs = (w = STROKE, opts = {}) => {
  const cls = opts.cls ? ` class="${opts.cls}"` : '';
  return `stroke="${COLOR}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"${cls}`;
};

const escapeText = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const at = (x, y, body) => {
  if (!x && !y) return body;
  return `<g transform="translate(${n(x)} ${n(y)})">${body}</g>`;
};

// =====================================================================
// Outer SVG builder
// =====================================================================

export function svg(viewBox, content, opts = {}) {
  const {
    shapeRendering = 'geometricPrecision',
    width,
    height,
    extraAttrs = '',
  } = opts;
  const sizeAttrs =
    width != null && height != null
      ? ` width="${width}" height="${height}"`
      : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"${sizeAttrs} shape-rendering="${shapeRendering}" font-family="'IBM Plex Mono', monospace" font-weight="${FONT_WEIGHT}"${extraAttrs ? ' ' + extraAttrs : ''}>${content}</svg>`;
}

// =====================================================================
// Resistor — N-peak alternating zigzag (default 6)
// =====================================================================

export function resistor({
  x = 0,
  y = 0,
  length = 90,
  peaks = 6,
  height = 14,
  orientation = 'h',
  cls,
} = {}) {
  const leadFrac = 0.13;
  const lead = length * leadFrac;
  const body = length - 2 * lead;
  const step = body / peaks;
  let d = `M 0 0 L ${n(lead)} 0`;
  for (let i = 0; i < peaks; i++) {
    const apexX = lead + (i + 0.5) * step;
    const baseX = lead + (i + 1) * step;
    const apexY = i % 2 === 0 ? -height : height;
    d += ` L ${n(apexX)} ${n(apexY)} L ${n(baseX)} 0`;
  }
  d += ` L ${n(length)} 0`;
  // Resistor uses miter joins specifically — round joins on a sharp zigzag
  // soften the apexes too much and lose the schematic-tooth read. The
  // round-cap default still applies to the leads.
  const path = `<path d="${d}" stroke="${COLOR}" stroke-width="${STROKE}" fill="none" stroke-linecap="round" stroke-linejoin="miter" stroke-miterlimit="3"${cls ? ` class="${cls}"` : ''}/>`;
  const inner = orientation === 'v' ? `<g transform="rotate(90)">${path}</g>` : path;
  return at(x, y, inner);
}

// =====================================================================
// Capacitor — two parallel plates with leads
// =====================================================================

export function capacitor({
  x = 0,
  y = 0,
  gap = 10,
  plateLen = 30,
  leadLen = 14,
  orientation = 'h',
  cls,
} = {}) {
  const total = leadLen * 2 + gap;
  const half = plateLen / 2;
  let body;
  if (orientation === 'h') {
    const c1 = leadLen;
    const c2 = leadLen + gap;
    body = `<line x1="0" y1="0" x2="${n(c1)}" y2="0" ${strokeAttrs(STROKE, { cls })}/><line x1="${n(c1)}" y1="${n(-half)}" x2="${n(c1)}" y2="${n(half)}" ${strokeAttrs(STROKE, { cls })}/><line x1="${n(c2)}" y1="${n(-half)}" x2="${n(c2)}" y2="${n(half)}" ${strokeAttrs(STROKE, { cls })}/><line x1="${n(c2)}" y1="0" x2="${n(total)}" y2="0" ${strokeAttrs(STROKE, { cls })}/>`;
  } else {
    const c1 = leadLen;
    const c2 = leadLen + gap;
    body = `<line x1="0" y1="0" x2="0" y2="${n(c1)}" ${strokeAttrs(STROKE, { cls })}/><line x1="${n(-half)}" y1="${n(c1)}" x2="${n(half)}" y2="${n(c1)}" ${strokeAttrs(STROKE, { cls })}/><line x1="${n(-half)}" y1="${n(c2)}" x2="${n(half)}" y2="${n(c2)}" ${strokeAttrs(STROKE, { cls })}/><line x1="0" y1="${n(c2)}" x2="0" y2="${n(total)}" ${strokeAttrs(STROKE, { cls })}/>`;
  }
  return at(x, y, body);
}

// =====================================================================
// Variable capacitor — capacitor + diagonal arrow through plates
// =====================================================================

export function varCapacitor(opts = {}) {
  const cap = capacitor(opts);
  const {
    x = 0,
    y = 0,
    gap = 10,
    plateLen = 30,
    leadLen = 14,
    orientation = 'h',
    cls,
  } = opts;
  const arrowLen = plateLen * 1.6;
  const headSize = 6;
  let arrow;
  if (orientation === 'h') {
    const cx = leadLen + gap / 2;
    // Diagonal arrow at -30deg passing through plate gap
    const ang = -30;
    arrow = `<g transform="translate(${n(cx)} 0) rotate(${ang})"><line x1="${n(-arrowLen / 2)}" y1="0" x2="${n(arrowLen / 2)}" y2="0" ${strokeAttrs(STROKE, { cls })}/><polyline points="${n(arrowLen / 2 - headSize)},${n(-headSize * 0.6)} ${n(arrowLen / 2)},0 ${n(arrowLen / 2 - headSize)},${n(headSize * 0.6)}" ${strokeAttrs(STROKE, { cls })}/></g>`;
  } else {
    const cy = leadLen + gap / 2;
    const ang = 60;
    arrow = `<g transform="translate(0 ${n(cy)}) rotate(${ang})"><line x1="${n(-arrowLen / 2)}" y1="0" x2="${n(arrowLen / 2)}" y2="0" ${strokeAttrs(STROKE, { cls })}/><polyline points="${n(arrowLen / 2 - headSize)},${n(-headSize * 0.6)} ${n(arrowLen / 2)},0 ${n(arrowLen / 2 - headSize)},${n(headSize * 0.6)}" ${strokeAttrs(STROKE, { cls })}/></g>`;
  }
  return cap + at(x, y, arrow);
}

// =====================================================================
// Inductor — N connected semicircles
// =====================================================================

export function inductor({
  x = 0,
  y = 0,
  length = 80,
  loops = 4,
  orientation = 'h',
  cls,
} = {}) {
  const r = length / (loops * 2);
  let d = 'M 0 0';
  for (let i = 0; i < loops; i++) {
    const ex = (i + 1) * 2 * r;
    d += ` A ${n(r)} ${n(r)} 0 0 1 ${n(ex)} 0`;
  }
  const path = `<path d="${d}" ${strokeAttrs(STROKE, { cls })}/>`;
  const inner = orientation === 'v' ? `<g transform="rotate(90)">${path}</g>` : path;
  return at(x, y, inner);
}

// =====================================================================
// Galvanometer — circle with a needle pointing up-right
// =====================================================================

export function galvanometer({ x = 0, y = 0, r = 26, cls } = {}) {
  const needleAng = -Math.PI / 4;
  const needleLen = r * 0.72;
  const tipX = needleLen * Math.cos(needleAng);
  const tipY = needleLen * Math.sin(needleAng);
  const headSize = 5;
  const back1Ang = needleAng + Math.PI - 0.45;
  const back2Ang = needleAng + Math.PI + 0.45;
  const h1x = tipX + headSize * Math.cos(back1Ang);
  const h1y = tipY + headSize * Math.sin(back1Ang);
  const h2x = tipX + headSize * Math.cos(back2Ang);
  const h2y = tipY + headSize * Math.sin(back2Ang);
  return at(
    x,
    y,
    `<circle cx="0" cy="0" r="${n(r)}" ${strokeAttrs(STROKE, { cls })}/><line x1="0" y1="0" x2="${n(tipX)}" y2="${n(tipY)}" ${strokeAttrs(STROKE, { cls })}/><polyline points="${n(h1x)},${n(h1y)} ${n(tipX)},${n(tipY)} ${n(h2x)},${n(h2y)}" ${strokeAttrs(STROKE, { cls })}/>`,
  );
}

// =====================================================================
// Ground — three descending parallel horizontals
// =====================================================================

export function ground({ x = 0, y = 0, width = 32, cls } = {}) {
  const w1 = width;
  const w2 = width * 0.62;
  const w3 = width * 0.28;
  const gap = 6;
  return at(
    x,
    y,
    `<line x1="${n(-w1 / 2)}" y1="0" x2="${n(w1 / 2)}" y2="0" ${strokeAttrs(STROKE, { cls })}/><line x1="${n(-w2 / 2)}" y1="${n(gap)}" x2="${n(w2 / 2)}" y2="${n(gap)}" ${strokeAttrs(STROKE, { cls })}/><line x1="${n(-w3 / 2)}" y1="${n(gap * 2)}" x2="${n(w3 / 2)}" y2="${n(gap * 2)}" ${strokeAttrs(STROKE, { cls })}/>`,
  );
}

// =====================================================================
// Switch — open contact at angle
// =====================================================================

export function switchSym({
  x = 0,
  y = 0,
  length = 50,
  angle = 30,
  open = true,
  contactR = 2.5,
  orientation = 'h',
  cls,
} = {}) {
  const rad = (open ? angle : 0) * (Math.PI / 180);
  const x2 = length * Math.cos(rad);
  const y2 = -length * Math.sin(rad);
  const body = `<circle cx="0" cy="0" r="${n(contactR)}" fill="${COLOR}"${cls ? ` class="${cls}"` : ''}/><circle cx="${n(length)}" cy="0" r="${n(contactR)}" fill="${COLOR}"${cls ? ` class="${cls}"` : ''}/><line x1="0" y1="0" x2="${n(x2)}" y2="${n(y2)}" ${strokeAttrs(STROKE, { cls })}/>`;
  const inner = orientation === 'v' ? `<g transform="rotate(90)">${body}</g>` : body;
  return at(x, y, inner);
}

// =====================================================================
// Node — circle with letter centered
// =====================================================================

export function node({
  x = 0,
  y = 0,
  label = 'A',
  r = 16,
  fontSize = 18,
  cls,
} = {}) {
  return at(
    x,
    y,
    `<circle cx="0" cy="0" r="${n(r)}" ${strokeAttrs(STROKE, { cls })}/><text x="0" y="${n(fontSize * 0.34)}" text-anchor="middle" font-size="${n(fontSize)}" font-family="'IBM Plex Mono', monospace" font-weight="${FONT_WEIGHT}" fill="${COLOR}"${cls ? ` class="${cls}"` : ''}>${escapeText(label)}</text>`,
  );
}

// =====================================================================
// Wire — polyline of axis-aligned right-angle segments
// =====================================================================

export function wire(points, opts = {}) {
  const w = opts.strokeWidth ?? STROKE;
  const cls = opts.cls ? ` class="${opts.cls}"` : '';
  if (!points || points.length < 2) return '';
  const d = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${n(p[0])} ${n(p[1])}`)
    .join(' ');
  return `<path d="${d}" stroke="${COLOR}" stroke-width="${w}" fill="none"${cls}/>`;
}

// =====================================================================
// Vector arrow — line + arrowhead + label past tip
// =====================================================================

export function vectorArrow({
  x1 = 0,
  y1 = 0,
  x2 = 0,
  y2 = 0,
  label,
  labelOffset = 14,
  fontSize = 14,
  headSize = 10,
  cls,
} = {}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  const a1x = x2 - headSize * ux + headSize * 0.4 * px;
  const a1y = y2 - headSize * uy + headSize * 0.4 * py;
  const a2x = x2 - headSize * ux - headSize * 0.4 * px;
  const a2y = y2 - headSize * uy - headSize * 0.4 * py;
  let body = `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" ${strokeAttrs(STROKE, { cls })}/><polyline points="${n(a1x)},${n(a1y)} ${n(x2)},${n(y2)} ${n(a2x)},${n(a2y)}" ${strokeAttrs(STROKE, { cls })}/>`;
  if (label) {
    const lx = x2 + ux * labelOffset;
    const ly = y2 + uy * labelOffset + fontSize * 0.34;
    body += `<text x="${n(lx)}" y="${n(ly)}" font-size="${n(fontSize)}" font-family="'IBM Plex Mono', monospace" font-weight="${FONT_WEIGHT}" fill="${COLOR}" text-anchor="middle"${cls ? ` class="${cls}"` : ''}>${escapeText(label)}</text>`;
  }
  return body;
}

// =====================================================================
// Grid + axes for waveforms / characteristic curves
// =====================================================================

export function gridAxes({
  x = 0,
  y = 0,
  w = 600,
  h = 300,
  xDivisions = 12,
  yDivisions = 8,
  xTickLabels = [],
  yTickLabels = [],
  fontSize = 11,
  cls,
} = {}) {
  let body = '';
  body += `<rect x="0" y="0" width="${n(w)}" height="${n(h)}" stroke="${COLOR}" stroke-width="${FINE}" fill="none"${cls ? ` class="${cls}"` : ''}/>`;
  for (let i = 1; i < xDivisions; i++) {
    const xx = (i / xDivisions) * w;
    body += `<line x1="${n(xx)}" y1="0" x2="${n(xx)}" y2="${n(h)}" stroke="${COLOR}" stroke-width="${FINE}" opacity="0.45"${cls ? ` class="${cls}"` : ''}/>`;
  }
  for (let i = 1; i < yDivisions; i++) {
    const yy = (i / yDivisions) * h;
    body += `<line x1="0" y1="${n(yy)}" x2="${n(w)}" y2="${n(yy)}" stroke="${COLOR}" stroke-width="${FINE}" opacity="0.45"${cls ? ` class="${cls}"` : ''}/>`;
  }
  xTickLabels.forEach((label, i) => {
    const xx = (i / Math.max(1, xTickLabels.length - 1)) * w;
    body += `<text x="${n(xx)}" y="${n(h + fontSize + 4)}" text-anchor="middle" font-size="${n(fontSize)}" font-family="'IBM Plex Mono', monospace" font-weight="${FONT_WEIGHT}" fill="${COLOR}">${escapeText(label)}</text>`;
  });
  yTickLabels.forEach((label, i) => {
    const yy = h - (i / Math.max(1, yTickLabels.length - 1)) * h;
    body += `<text x="${n(-6)}" y="${n(yy + fontSize * 0.34)}" text-anchor="end" font-size="${n(fontSize)}" font-family="'IBM Plex Mono', monospace" font-weight="${FONT_WEIGHT}" fill="${COLOR}">${escapeText(label)}</text>`;
  });
  return at(x, y, body);
}

// =====================================================================
// Equation line — monospace text with _{...} subscript and ^{...} superscript
// =====================================================================

export function equationLine({
  x = 0,
  y = 0,
  text = '',
  size = 28,
  align = 'start',
  cls,
} = {}) {
  let body = '';
  let i = 0;
  let inSub = false;
  let inSup = false;
  let buf = '';
  const flush = () => {
    if (!buf) return;
    if (inSub) {
      body += `<tspan baseline-shift="sub" font-size="${n(size * 0.65)}">${escapeText(buf)}</tspan>`;
    } else if (inSup) {
      body += `<tspan baseline-shift="super" font-size="${n(size * 0.65)}">${escapeText(buf)}</tspan>`;
    } else {
      body += escapeText(buf);
    }
    buf = '';
  };
  while (i < text.length) {
    const c = text[i];
    if (c === '_' && text[i + 1] === '{') {
      flush();
      inSub = true;
      i += 2;
      continue;
    }
    if (c === '^' && text[i + 1] === '{') {
      flush();
      inSup = true;
      i += 2;
      continue;
    }
    if (c === '}' && (inSub || inSup)) {
      flush();
      inSub = false;
      inSup = false;
      i++;
      continue;
    }
    buf += c;
    i++;
  }
  flush();
  return `<text x="${n(x)}" y="${n(y)}" font-size="${n(size)}" font-family="'IBM Plex Mono', monospace" font-weight="${FONT_WEIGHT}" fill="${COLOR}" text-anchor="${align}"${cls ? ` class="${cls}"` : ''} xml:space="preserve">${body}</text>`;
}

// =====================================================================
// Composition helpers — doc reference, caption, telemetry block
// =====================================================================

// position: 'top-left' | 'top-right'
export function docRef({
  position = 'top-left',
  text = '',
  margin = 60,
  fontSize = 18,
  canvasWidth = 1600,
  cls,
} = {}) {
  const y = margin;
  if (position === 'top-right') {
    return `<text x="${n(canvasWidth - margin)}" y="${n(y)}" font-size="${n(fontSize)}" font-family="'IBM Plex Mono', monospace" font-weight="${FONT_WEIGHT}" fill="${COLOR}" text-anchor="end" letter-spacing="1.2"${cls ? ` class="${cls}"` : ''}>${escapeText(text)}</text>`;
  }
  return `<text x="${n(margin)}" y="${n(y)}" font-size="${n(fontSize)}" font-family="'IBM Plex Mono', monospace" font-weight="${FONT_WEIGHT}" fill="${COLOR}" letter-spacing="1.2"${cls ? ` class="${cls}"` : ''}>${escapeText(text)}</text>`;
}

export function caption({
  text = '',
  x,
  y,
  fontSize = 18,
  align = 'middle',
  canvasWidth = 1600,
  cls,
} = {}) {
  const cx = x ?? canvasWidth / 2;
  const cy = y ?? canvasWidth - 240;
  return `<text x="${n(cx)}" y="${n(cy)}" font-size="${n(fontSize)}" font-family="'IBM Plex Mono', monospace" font-weight="${FONT_WEIGHT}" fill="${COLOR}" text-anchor="${align}" letter-spacing="1.4"${cls ? ` class="${cls}"` : ''}>${escapeText(text)}</text>`;
}

export function telemetry({
  lines = [],
  margin = 60,
  fontSize = 16,
  lineHeight = 22,
  canvasWidth = 1600,
  canvasHeight = 1600,
  cls,
} = {}) {
  const x = canvasWidth - margin;
  const startY = canvasHeight - margin - (lines.length - 1) * lineHeight;
  return lines
    .map(
      (line, i) =>
        `<text x="${n(x)}" y="${n(startY + i * lineHeight)}" font-size="${n(fontSize)}" font-family="'IBM Plex Mono', monospace" font-weight="${FONT_WEIGHT}" fill="${COLOR}" text-anchor="end" letter-spacing="1.1"${cls ? ` class="${cls}"` : ''} xml:space="preserve">${escapeText(line)}</text>`,
    )
    .join('');
}

// =====================================================================
// Scan-line overlay (for ambient phase, post draft-on)
// =====================================================================

export function scanLine({
  canvasWidth = 1600,
  canvasHeight = 1600,
  opacity = 0.04,
  cls = 'scanline',
} = {}) {
  return `<rect x="0" y="-2" width="${n(canvasWidth)}" height="2" fill="${COLOR}" opacity="${opacity}" class="${cls}"/>`;
}

// =====================================================================
// Diagram routing helpers — shared between figure files
// =====================================================================

// Place a horizontal generator centered along the line from p1 to p2,
// with `gap` clearance from each end node. Returns lead-wires + the
// rotated component group. `generator` is called with { length, ...opts }
// and must return SVG-string content drawn horizontally from x=0 to x=length
// centered on y=0.
export function alongArm(p1, p2, gap, generator, length, opts = {}) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const total = Math.hypot(dx, dy);
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  const ux = dx / total;
  const uy = dy / total;
  const visStart = [p1[0] + ux * gap, p1[1] + uy * gap];
  const visEnd = [p2[0] - ux * gap, p2[1] - uy * gap];
  const compStartDist = (total - length) / 2;
  const cs = [p1[0] + ux * compStartDist, p1[1] + uy * compStartDist];
  const ce = [
    p1[0] + ux * (compStartDist + length),
    p1[1] + uy * (compStartDist + length),
  ];
  return (
    wire([visStart, cs]) +
    `<g transform="translate(${n(cs[0])} ${n(cs[1])}) rotate(${n(ang)})">${generator({ length, ...opts })}</g>` +
    wire([ce, visEnd])
  );
}

// Plain wire from p1 to p2 with `gap` clearance on each end (pads past
// nodes so the wire doesn't visually overlap the node circle).
export function plainArm(p1, p2, gap = 0) {
  if (gap === 0) return wire([p1, p2]);
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

// Junction dot — small filled circle showing a wire tap.
export function junction(x, y, r = 3) {
  return `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="${COLOR}"/>`;
}

// Anchor a wire on a node circle's circumference at the angle pointing
// toward `target`. Returns the on-circumference [x, y].
export function nodeAnchor(node, target, r) {
  const dx = target[0] - node[0];
  const dy = target[1] - node[1];
  const len = Math.hypot(dx, dy) || 1;
  return [node[0] + (dx / len) * r, node[1] + (dy / len) * r];
}

// Plain text label — convenience over a raw <text>.
export function label({
  x = 0,
  y = 0,
  text = '',
  size = 14,
  align = 'middle',
  weight = FONT_WEIGHT,
  cls,
} = {}) {
  return `<text x="${n(x)}" y="${n(y)}" font-size="${n(size)}" font-family="'IBM Plex Mono', monospace" font-weight="${weight}" fill="${COLOR}" text-anchor="${align}"${cls ? ` class="${cls}"` : ''}>${escapeText(text)}</text>`;
}

// Italicized text label (for engineering script-like labels: R, L, C, etc.
// — even though we're rendering in mono, italic mono adds variation).
export function italic({
  x = 0,
  y = 0,
  text = '',
  size = 14,
  align = 'middle',
  weight = FONT_WEIGHT,
  cls,
} = {}) {
  return `<text x="${n(x)}" y="${n(y)}" font-size="${n(size)}" font-family="'IBM Plex Mono', monospace" font-style="italic" font-weight="${weight}" fill="${COLOR}" text-anchor="${align}"${cls ? ` class="${cls}"` : ''}>${escapeText(text)}</text>`;
}

// Transformer — two inductors stacked with a center bar between them
// indicating the iron core. Both coils horizontal; suitable for placing
// on horizontal wires. Returns content centered on (0, 0).
export function transformer({
  x = 0,
  y = 0,
  length = 80,
  loops = 4,
  coilGap = 6,
  cls,
} = {}) {
  const r = length / (loops * 2);
  // Two coils: one above center, one below
  let coil1 = `M 0 0`;
  let coil2 = `M 0 0`;
  for (let i = 0; i < loops; i++) {
    const ex = (i + 1) * 2 * r;
    coil1 += ` A ${n(r)} ${n(r)} 0 0 1 ${n(ex)} 0`;
    coil2 += ` A ${n(r)} ${n(r)} 0 0 0 ${n(ex)} 0`;
  }
  // Center bar (iron core, drawn as 2 thin parallel lines)
  const bar1 = -1.5;
  const bar2 = 1.5;
  return at(
    x - length / 2,
    y,
    `<g transform="translate(0 ${n(-coilGap - r)})"><path d="${coil1}" ${strokeAttrs(STROKE, { cls })}/></g>` +
      `<g transform="translate(0 ${n(coilGap + r)})"><path d="${coil2}" ${strokeAttrs(STROKE, { cls })}/></g>` +
      `<line x1="0" y1="${n(bar1)}" x2="${n(length)}" y2="${n(bar1)}" stroke="${COLOR}" stroke-width="${FINE}" stroke-linecap="round"/>` +
      `<line x1="0" y1="${n(bar2)}" x2="${n(length)}" y2="${n(bar2)}" stroke="${COLOR}" stroke-width="${FINE}" stroke-linecap="round"/>`,
  );
}

// Vacuum tube envelope — circle outline. The internal elements
// (filament, grid, plate) are figure-specific so they're not baked in.
export function tubeEnvelope({ x = 0, y = 0, r = 60, cls } = {}) {
  return `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" ${strokeAttrs(STROKE, { cls })}/>`;
}

// Determinant bars — draws two vertical lines flanking a content block,
// used in matrix-determinant equations. Caller positions content inside.
export function determinantBars({
  x = 0,
  y = 0,
  height = 100,
  width = 200,
  barLen = 12,
  cls,
} = {}) {
  const left = x;
  const right = x + width;
  const top = y;
  const bot = y + height;
  // Vertical bar with small horizontal serifs at top and bottom (giving
  // a subtle "matrix bracket" feel without going full square brackets).
  const bar = (bx) => `<line x1="${n(bx)}" y1="${n(top)}" x2="${n(bx)}" y2="${n(bot)}" ${strokeAttrs(STROKE, { cls })}/>`;
  return bar(left) + bar(right);
}

// Fraction bar — horizontal line for displayed fractions.
export function fractionBar({
  x = 0,
  y = 0,
  width = 240,
  cls,
} = {}) {
  return `<line x1="${n(x - width / 2)}" y1="${n(y)}" x2="${n(x + width / 2)}" y2="${n(y)}" ${strokeAttrs(STROKE, { cls })}/>`;
}

// =====================================================================
// Displayed math helpers
// =====================================================================

// A vertically-stacked fraction: numerator over denominator with a horizontal
// bar between. Returns SVG content centered horizontally on `x`, with the
// bar at `y`.
export function fraction({
  x = 0,
  y = 0,
  num = '',
  den = '',
  size = 22,
  barWidth,
  cls,
} = {}) {
  const w = barWidth ?? Math.max(num.length, den.length) * size * 0.55;
  const numY = y - size * 0.32;
  const denY = y + size * 0.85;
  return (
    equationLine({ x, y: numY, text: num, size, align: 'middle', cls }) +
    fractionBar({ x, y, width: w, cls }) +
    equationLine({ x, y: denY, text: den, size, align: 'middle', cls })
  );
}

// Lay out a matrix of cells (rows × cols) flanked by vertical determinant
// bars. `rows` is an array of row-arrays of cell strings (using equationLine
// markup for subscripts). Returns content centered on (x, y).
export function determinantMatrix({
  x = 0,
  y = 0,
  rows = [],
  cellW = 56,
  cellH = 32,
  size = 18,
  barPad = 14,
  cls,
} = {}) {
  const nRows = rows.length;
  const nCols = Math.max(0, ...rows.map((r) => r.length));
  if (nRows === 0 || nCols === 0) return '';
  const totalW = cellW * nCols;
  const totalH = cellH * nRows;
  const left = x - totalW / 2;
  const top = y - totalH / 2;
  let s = '';
  // Cells
  for (let r = 0; r < nRows; r++) {
    for (let c = 0; c < nCols; c++) {
      const cellText = rows[r][c] ?? '';
      if (!cellText) continue;
      const cx = left + c * cellW + cellW / 2;
      const cy = top + r * cellH + cellH * 0.6;
      s += equationLine({ x: cx, y: cy, text: cellText, size, align: 'middle', cls });
    }
  }
  // Vertical bars
  const barTop = top - 4;
  const barBot = top + totalH + 4;
  s += `<line x1="${n(left - barPad)}" y1="${n(barTop)}" x2="${n(left - barPad)}" y2="${n(barBot)}" stroke="${COLOR}" stroke-width="${STROKE}" stroke-linecap="round"${cls ? ` class="${cls}"` : ''}/>`;
  s += `<line x1="${n(left + totalW + barPad)}" y1="${n(barTop)}" x2="${n(left + totalW + barPad)}" y2="${n(barBot)}" stroke="${COLOR}" stroke-width="${STROKE}" stroke-linecap="round"${cls ? ` class="${cls}"` : ''}/>`;
  return s;
}
