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
