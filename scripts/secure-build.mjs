import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const root = 'dist/wedding/browser';
const headers = await readFile(join(root, '_headers'), 'utf8');
const policy = headers.match(/^\s+Content-Security-Policy: (.+)$/m)?.[1];
if (!policy) throw new Error('Missing production CSP');
const path = join(root, 'index.html');
const html = await readFile(path, 'utf8');
if (/<style\b|\son[a-z]+\s*=|<script(?![^>]*\bsrc=)/i.test(html)) {
  throw new Error('Inline script/style found; disable Angular inlineCritical before release.');
}
// frame-ancestors requires HTTP headers, so do not put it in the fallback meta.
const metaPolicy = policy.replace(/; frame-ancestors 'none'/, '');
await writeFile(path, html.replace('<head>', `<head><meta http-equiv="Content-Security-Policy" content="${metaPolicy}"><meta name="referrer" content="no-referrer">`));
async function verify(dir) {
  for (const entry of await readdir(dir, {withFileTypes:true})) {
    if (entry.isDirectory()) await verify(join(dir, entry.name));
    else if (/\.(map|ts|env)$/.test(entry.name)) throw new Error(`Source/private file in output: ${entry.name}`);
  }
}
await verify(root);
console.log('Production CSP applied; no inline scripts/styles or source maps.');
