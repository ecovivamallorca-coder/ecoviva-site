import { spawnSync } from 'node:child_process';

const steps = [
  'fetch-seo-hero-assets.mjs',
  'generate-seo-renovation-cluster.mjs',
  'publish-damp-guide.mjs',
  'publish-technical-check.mjs',
  'sync-shared-header.mjs',
  'activate-guides-chrome.mjs',
  'link-roof-facade-services.mjs'
];

for (const script of steps) {
  const result = spawnSync(process.execPath, [`scripts/${script}`], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
