import fs from 'node:fs/promises';
import path from 'node:path';

const outDir = path.join(process.cwd(), 'public', 'assets', 'seo', 'heroes');
await fs.mkdir(outDir, { recursive: true });

const assets = [
  ['roof-renovation-mallorca.jpg', 'https://images.pexels.com/photos/5223143/pexels-photo-5223143.jpeg?auto=compress&cs=tinysrgb&w=2000'],
  ['facade-renovation-mallorca.jpg', 'https://images.pexels.com/photos/33299796/pexels-photo-33299796.jpeg?auto=compress&cs=tinysrgb&w=2000'],
  ['windows-doors-mallorca.jpg', 'https://images.pexels.com/photos/28243803/pexels-photo-28243803.jpeg?auto=compress&cs=tinysrgb&w=2000'],
  ['interior-renovation-mallorca.jpg', 'https://images.pexels.com/photos/28321103/pexels-photo-28321103.jpeg?auto=compress&cs=tinysrgb&w=2000'],
  ['terrace-renovation-mallorca.jpg', 'https://images.pexels.com/photos/17861664/pexels-photo-17861664.jpeg?auto=compress&cs=tinysrgb&w=2000'],
  ['energy-renovation-mallorca.jpg', 'https://images.pexels.com/photos/16427010/pexels-photo-16427010.jpeg?auto=compress&cs=tinysrgb&w=2000']
];

for (const [filename, url] of assets) {
  const target = path.join(outDir, filename);
  try {
    const existing = await fs.stat(target).catch(() => null);
    if (existing?.size > 10000) continue;
    const response = await fetch(url, { headers: { 'User-Agent': 'EcoVivaMallorca/1.0' } });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < 10000) throw new Error(`asset too small (${buffer.length} bytes)`);
    await fs.writeFile(target, buffer);
    console.log(`Saved ${filename} (${Math.round(buffer.length / 1024)} KB)`);
  } catch (error) {
    console.warn(`Hero asset ${filename} not refreshed: ${error.message}`);
  }
}
