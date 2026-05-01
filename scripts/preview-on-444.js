// Composite a transparent SVG onto a #444 backdrop for visual inspection.
// Writes to /tmp/<basename>-on-444.svg.
//
// Usage: node scripts/preview-on-444.js dist/static/fig-02.svg [dist/static/fig-02-diagram.svg ...]

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { basename } from 'node:path';

const TMP = '/tmp/bell-labs-preview';
mkdirSync(TMP, { recursive: true });

for (const file of process.argv.slice(2)) {
  const s = readFileSync(file, 'utf8');
  const m = s.match(/viewBox="([^"]+)"/);
  if (!m) {
    console.error('no viewBox in', file);
    continue;
  }
  const [vx, vy, vw, vh] = m[1].split(/\s+/).map(Number);
  const out = s.replace(
    /<svg([^>]*)>/,
    `<svg$1><rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="#444"/>`,
  );
  const target = `${TMP}/${basename(file, '.svg')}-on-444.svg`;
  writeFileSync(target, out);
  console.log(target);
}
