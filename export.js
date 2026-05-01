// export.js — top-level static export driver.
// Runs the full build (in order):
//   1. Render every figure to dist/static/fig-NN.svg + dist/static/fig-NN-diagram.svg
//      and per-figure preview pages (figures/fig-NN.static.html)
//   2. Generate the primitives test page
//   3. Generate index.html (thumbnail grid; reads from dist/static)
//
// Usage: node export.js

console.log('--- 1. rendering figures ---');
await import('./scripts/render-all.js');
console.log('\n--- 2. rendering primitives test ---');
await import('./scripts/render-primitives.js');
console.log('\n--- 3. rendering index ---');
await import('./scripts/render-index.js');
console.log('\n--- 4. rendering landing page ---');
await import('./scripts/render-landing.js');
console.log('\ndone.');
