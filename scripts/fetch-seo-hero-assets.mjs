import fs from 'node:fs/promises';
import path from 'node:path';

const outDir = path.join(process.cwd(), 'public', 'assets', 'seo', 'heroes');
await fs.mkdir(outDir, { recursive: true });

// Pexels free-to-use source images. Keep the source IDs here for licensing traceability.
// Hero selection is intentionally service-specific and Mediterranean/Mallorca relevant.
const assets = [
  // Terracotta roof installation / renovation: clearly communicates roofing work.
  ['roof-renovation-mallorca-v2.jpg', 'https://images.pexels.com/photos/31763541/pexels-photo-31763541.jpeg?auto=compress&cs=tinysrgb&w=2000'],
  // White rendered Mediterranean house in Palma de Mallorca: facade/crepi direction.
  ['facade-renovation-mallorca-v2.jpg', 'https://images.pexels.com/photos/28243788/pexels-photo-28243788.jpeg?auto=compress&cs=tinysrgb&w=2000'],
  // Stone facade with traditional green shutters in Soller, Mallorca.
  ['windows-doors-mallorca-v2.jpg', 'https://images.pexels.com/photos/33299796/pexels-photo-33299796.jpeg?auto=compress&cs=tinysrgb&w=2000'],
  // Warm Mediterranean interior.
  ['interior-renovation-mallorca-v2.jpg', 'https://images.pexels.com/photos/28321103/pexels-photo-28321103.jpeg?auto=compress&cs=tinysrgb&w=2000'],
  // Mediterranean terrace with house and mountain context.
  ['terrace-renovation-mallorca-v2.jpg', 'https://images.pexels.com/photos/17861664/pexels-photo-17861664.jpeg?auto=compress&cs=tinysrgb&w=2000'],
  // Solar panel on a rustic tiled Mediterranean-style roof, rather than a northern roof type.
  ['energy-renovation-mallorca-v2.jpg', 'https://images.pexels.com/photos/9875421/pexels-photo-9875421.jpeg?auto=compress&cs=tinysrgb&w=2000']
];

for (const [filename, url] of assets) {
  const target = path.join(outDir, filename);
  try {
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
