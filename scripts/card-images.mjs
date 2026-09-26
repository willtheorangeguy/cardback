import { mkdir, readFile, writeFile } from 'node:fs/promises';
const pages = {
  tangerine: 'https://www.tangerine.ca/en/personal/spend/credit-cards',
  simplii: 'https://www.simplii.com/en/credit-cards/cash-back-visa.html',
  rbc: 'https://www.rbcroyalbank.com/credit-cards/cash-back/rbc-preferred-world-elite-mastercard.html',
  scotia: 'https://www.scotiabank.com/ca/en/personal/credit-cards/visa/momentum-infinite-card.html',
};
if (process.argv.includes('--discover')) {
  await Promise.all(Object.entries(pages).map(async ([id, url]) => {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      const images = [...html.matchAll(/<img\b[^>]*>/gi)].map(m => m[0]);
      const relevant = images.filter(tag => /credit|mastercard|money.?back|cash.?back|momentum|visa/i.test(tag));
      console.log(id, [...new Set(relevant.map(tag => tag.match(/\bsrc="([^"]+)"/i)?.[1]).filter(Boolean))].filter(src => !/svg|badge|award|icon|transformer/i.test(src)).join('\n').slice(0, 4000));
      const assets = [...new Set(html.match(/(?:https?:\/\/[^\s"'<>]+)?\/content\/dam\/[^\s"'<>]+\.(?:png|webp|jpg)/gi))].filter(src => /card|visa|momentum|cash/i.test(src));
      console.log(id, 'DAM assets:', assets.join('\n').slice(0, 4000));
    } catch (error) { console.error(id, String(error)); process.exitCode = 1; }
  }));
}
if (process.argv.includes('--download')) {
  const sources = JSON.parse(await readFile(new URL('./card-image-sources.json', import.meta.url), 'utf8'));
  const destination = new URL('../public/cards/', import.meta.url);
  await mkdir(destination, { recursive: true });
  await Promise.all(Object.entries(sources).map(async ([id, url]) => {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      const png = bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
      const webp = bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP';
      const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
      if (!png && !webp && !jpeg) throw new Error('Response is not PNG, JPEG or WebP artwork');
      const extension = id === 'rbc' ? 'webp' : id === 'tangerine' ? 'jpg' : 'png';
      if ((extension === 'png' && !png) || (extension === 'webp' && !webp) || (extension === 'jpg' && !jpeg)) throw new Error('Unexpected image format');
      await writeFile(new URL(`${id}.${extension}`, destination), bytes);
      console.log(`${id}: ${Math.round(bytes.length / 1024)} KB${png ? `, ${bytes.readUInt32BE(16)} × ${bytes.readUInt32BE(20)}` : ''}`);
    } catch (error) { console.error(id, String(error)); process.exitCode = 1; }
  }));
}
