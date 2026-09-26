import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';

const base = '/cardback/';
const dist = new URL('../dist/', import.meta.url);
const html = await readFile(new URL('index.html', dist), 'utf8');
const assets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map(match => match[1])
  .filter(path => !/^(?:https?:|#)/.test(path));
assert(assets.length > 0, 'Expected generated JS and CSS assets');
for (const path of assets) {
  assert(path.startsWith(base), `Asset URL does not use the Pages base: ${path}`);
  assert((await stat(new URL(path.slice(base.length), dist))).size > 0, `Missing or empty asset: ${path}`);
}
const images = Object.values(JSON.parse(await readFile(new URL('../src/card-artwork.json', import.meta.url), 'utf8')));
for (const image of images) {
  assert((await stat(new URL(`cards/${image}`, dist))).size > 0, `Missing card image: ${image}`);
}
console.log(`Pages build verified: ${assets.length} assets use ${base}; all ${images.length} card images are bundled.`);
