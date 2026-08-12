import fs from 'node:fs/promises';
import path from 'node:path';

const outDir = path.join(process.cwd(), 'public', 'assets', 'seo', 'heroes');
await fs.mkdir(outDir, { recursive: true });

// Pexels free-to-use source images. Keep the source IDs here for licensing traceability.
const assets = [
  // Approved: weathered traditional clay roof that clearly needs renovation.
  ['roof-renovation-mallorca-v3.jpg', 'https://images.pexels.com/photos/15562216/pexels-photo-15562216.jpeg?auto=compress&cs=tinysrgb&w=2000'],
  // Approved: wider Mallorcan facade in Soller, suitable as a renovation-before image.
  ['facade-renovation-mallorca-v3.jpg', 'https://images.pexels.com/photos/33299796/pexels-photo-33299796.jpeg?auto=compress&cs=tinysrgb&w=2000'],
  // Palma de Mallorca apartment facade with multiple wooden shutters/openings.
  ['windows-doors-mallorca-v3.jpg', 'https://images.pexels.com/photos/28243804/pexels-photo-28243804.jpeg?auto=compress&cs=tinysrgb&w=2000'],
  // Real residential interior undergoing renovation, with exposed beams and construction fabric visible.
  ['interior-renovation-mallorca-v3.jpg', 'https://images.pexels.com/photos/4756490/pexels-photo-4756490.jpeg?auto=compress&cs=tinysrgb&w=2000'],
  ['terrace-renovation-mallorca-v2.jpg', 'https://images.pexels.com/photos/17861664/pexels-photo-17861664.jpeg?auto=compress&cs=tinysrgb&w=2000'],
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
