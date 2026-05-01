// Generates landing.html: a single page with a button that rerolls a random
// figure (full composition) on each click. All 14 SVGs are inlined into the
// page so it works via file:// with no server.

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const FIGS = Array.from({ length: 14 }, (_, i) => String(i + 1).padStart(2, '0'));
const svgs = FIGS.map((id) =>
  readFileSync(resolve(root, `dist/static/fig-${id}.svg`), 'utf8'),
);

// Bake the SVG strings into a JS array literal. Use JSON.stringify to safely
// escape any special characters within the SVG markup.
const svgJsArray = '[' + svgs.map((s) => JSON.stringify(s)).join(',\n') + ']';

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>bell-labs-art</title>
<link rel="stylesheet" href="shared/style.css" />
<style>
  :root { color-scheme: dark; }
  body {
    background: #2e3863;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    margin: 0;
    padding: 24px;
    box-sizing: border-box;
  }
  .stage {
    width: min(88vh, 88vw);
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .stage svg {
    width: 100%;
    height: 100%;
  }
  .controls {
    margin-top: 24px;
    display: flex;
    align-items: center;
    gap: 18px;
  }
  button.reroll {
    appearance: none;
    background: transparent;
    color: #f0eef2;
    border: 1px solid rgba(240, 238, 242, 0.5);
    padding: 12px 24px;
    font-family: 'IBM Plex Mono', monospace;
    font-weight: 500;
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    transition: border-color 120ms ease, background 120ms ease;
  }
  button.reroll:hover {
    border-color: #f0eef2;
    background: rgba(240, 238, 242, 0.06);
  }
  button.reroll:active {
    background: rgba(240, 238, 242, 0.12);
  }
  .figid {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.12em;
    opacity: 0.55;
  }
</style>
</head>
<body>
  <div class="stage" id="stage"></div>
  <div class="controls">
    <button type="button" class="reroll" id="reroll">Reroll</button>
    <span class="figid" id="figid"></span>
  </div>
  <script>
    const FIGS = ${svgJsArray};
    const stage = document.getElementById('stage');
    const figidEl = document.getElementById('figid');
    let current = -1;

    function show(idx) {
      stage.innerHTML = FIGS[idx];
      const num = String(idx + 1).padStart(2, '0');
      figidEl.textContent = 'FIG.' + num;
      current = idx;
    }

    function reroll() {
      if (FIGS.length < 2) return show(0);
      let next;
      do {
        next = Math.floor(Math.random() * FIGS.length);
      } while (next === current);
      show(next);
    }

    document.getElementById('reroll').addEventListener('click', reroll);
    reroll();
  </script>
</body>
</html>
`;

writeFileSync(resolve(root, 'landing.html'), html);
console.log('wrote landing.html (' + html.length + ' bytes, 14 figures inlined)');
