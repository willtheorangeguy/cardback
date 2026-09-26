import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const artwork = JSON.parse(readFileSync(new URL('../src/card-artwork.json', import.meta.url), 'utf8'));
it('bundles real artwork with the format declared in the filename manifest', () => {
  for (const filename of Object.values(artwork)) {
    const bytes = readFileSync(new URL('../public/cards/'+filename, import.meta.url));
    expect(bytes.length).toBeGreaterThan(1000);
    if (filename.endsWith('.png')) expect([...bytes.subarray(0,8)]).toEqual([137,80,78,71,13,10,26,10]);
    if (filename.endsWith('.jpg')) expect([...bytes.subarray(0,3)]).toEqual([255,216,255]);
    if (filename.endsWith('.webp')) {
      expect(bytes.subarray(0,4).toString()).toBe('RIFF');
      expect(bytes.subarray(8,12).toString()).toBe('WEBP');
    }
  }
});
