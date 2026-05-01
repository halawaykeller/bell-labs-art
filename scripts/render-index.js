// Generates index.html: a thumbnail grid linking to each fig-NN.static.html.
// Each thumbnail inlines the figure's diagram-only SVG (lightweight, no iframe).

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

// Use an ordered array — JS objects auto-sort numeric-string keys, so
// '10'..'14' would otherwise come before '01'..'09'.
const FIGS = [
  ['01', 'EQUIV.DIR.CAPACITIES'],
  ['02', 'COLPITTS SUB.BRIDGE'],
  ['03', 'POTENTIOMETER METH.'],
  ['04', 'NULL.IMPED.BRIDGE A'],
  ['05', 'NULL.IMPED.BRIDGE B'],
  ['06', 'MAXWELL DISCHG.METH.'],
  ['07', 'EQ.SET 03.1'],
  ['08', 'EQ.SET 09.4'],
  ['09', 'EQ.SET 09.7'],
  ['10', 'VECTOR DIAG.'],
  ['11', 'VOLT.SOUND-GND'],
  ['12', 'EQ.SET 11.2'],
  ['13', 'VT.REPEATER ELEM.'],
  ['14', 'TWO-WAY VT.REPEATER'],
];

const tiles = FIGS
  .map(([id, title]) => {
    const svgPath = resolve(root, `dist/static/fig-${id}-diagram.svg`);
    const svgContent = readFileSync(svgPath, 'utf8');
    return `
  <a href="figures/fig-${id}.static.html" class="tile">
    <div class="tile-svg">${svgContent}</div>
    <div class="tile-meta">
      <span class="tile-id">FIG.${id}</span>
      <span class="tile-title">${title}</span>
    </div>
  </a>`;
  })
  .join('');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>bell-labs-art — figure index</title>
<link rel="stylesheet" href="shared/style.css" />
<style>
  :root { color-scheme: dark; }
  body { padding: 32px 40px; }
  header { max-width: 1400px; margin: 0 auto 32px; padding: 0 12px; }
  h1 { font-weight: 500; font-size: 14px; letter-spacing: 0.12em; text-transform: uppercase; margin: 0 0 4px 0; }
  p.intro { font-size: 11px; opacity: 0.7; max-width: 720px; line-height: 1.5; letter-spacing: 0.04em; }
  .grid { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 18px; }
  .tile { display: block; border: 1px solid rgba(240, 238, 242, 0.18); padding: 16px; transition: border-color 120ms ease; text-decoration: none; }
  .tile:hover { border-color: rgba(240, 238, 242, 0.5); text-decoration: none; }
  .tile-svg { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .tile-svg svg { width: 100%; height: auto; max-height: 100%; }
  .tile-meta { display: flex; justify-content: space-between; align-items: baseline; font-size: 10px; letter-spacing: 0.08em; margin-top: 12px; }
  .tile-id { opacity: 0.6; }
  .tile-title { opacity: 0.95; text-transform: uppercase; }
  footer { max-width: 1400px; margin: 32px auto 0; padding: 0 12px; font-size: 10px; opacity: 0.5; letter-spacing: 0.04em; }
  footer a { margin-right: 0; }
  footer .sep { margin: 0 8px; opacity: 0.5; }
</style>
</head>
<body>
<header>
  <h1>bell-labs-art / figure index</h1>
  <p class="intro">14 figures translated from Bell System Technical Journal originals into the supervisory-display register of HAL 9000. The diagram-only SVGs on each tile (transparent background) are the actual deliverables; click a tile to open the full composition + composite tests against multiple background colors.</p>
</header>
<div class="grid">${tiles}
</div>
<footer>
  <a href="figures/primitives.static.html">PRIMITIVES TEST</a>
  <span class="sep">·</span>
  <a href="https://github.com/halawaykeller/bell-labs-art" target="_blank" rel="noopener">GITHUB</a>
</footer>
</body>
</html>
`;

writeFileSync(resolve(root, 'index.html'), html);
console.log('wrote index.html');
