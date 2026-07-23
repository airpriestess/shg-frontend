// Build prep for design-sync (wired via cfg.buildCmd). Two jobs:
//   1. Materialize the runtime `CSS` string from tokens.js into ds-styles.css.
//   2. Emit ds-entry.jsx re-exporting every DEFAULT-exported component as a
//      NAMED export. Synth-entry uses `export * from`, which drops defaults, so
//      without this the page/screen components never reach window.SHG.
// Both regenerate from source on every run, so nothing rots on re-sync.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { CSS } from '../src/design/tokens.js';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..');
const srcDir = join(repo, 'src');

// 1. styles
writeFileSync(join(here, 'ds-styles.css'), CSS.trimStart(), 'utf8');

// 2. default-export barrel
const SKIP = new Set(['App']); // App renders the whole site; excluded as a card
const DEFAULT_RX = /export\s+default\s+(?:function|class)\s+([A-Z][A-Za-z0-9]*)/;
const DEFAULT_ID_RX = /export\s+default\s+([A-Z][A-Za-z0-9]*)\s*;?\s*$/m;
const lines = [];
function scan(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { scan(p); continue; }
    if (!/\.jsx$/.test(e.name)) continue;
    const txt = readFileSync(p, 'utf8');
    const m = txt.match(DEFAULT_RX) || txt.match(DEFAULT_ID_RX);
    if (!m) continue;
    const name = m[1];
    if (SKIP.has(name)) continue;
    const rel = './' + relative(here, p).split('\\').join('/');
    lines.push(`export { default as ${name} } from ${JSON.stringify(rel)};`);
  }
}
scan(srcDir);
lines.sort();
writeFileSync(join(here, 'ds-entry.jsx'), lines.join('\n') + '\n', 'utf8');
console.error(`[prep] ds-styles.css (${CSS.length}b) + ds-entry.jsx (${lines.length} default re-exports)`);
