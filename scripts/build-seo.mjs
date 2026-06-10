/**
 * SEO production build with visible phase logging for Vercel.
 */
import { execSync } from 'child_process';
import { performance } from 'perf_hooks';

const ROOT = process.cwd();

if (process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN) {
  process.stdout.write(
    '[build:seo] TIP: Link a Vercel Blob store (Storage → Create) so prerender cache persists between deploys.\n'
  );
}

function phase(label, command) {
  const started = performance.now();
  process.stdout.write(`\n========== ${label} ==========\n`);
  execSync(command, { cwd: ROOT, stdio: 'inherit', env: process.env });
  const seconds = ((performance.now() - started) / 1000).toFixed(1);
  process.stdout.write(`========== ${label} done (${seconds}s) ==========\n`);
}

phase('SEO checks', 'npm run build:seo:checks');
phase('Vite build', 'npm run build:vite');
phase('Restore prerender cache (blob)', 'node ./scripts/sync-prerender-cache-blob.mjs restore');
phase('Restore prerender cache (turbo)', 'npx turbo run prerender-cache-restore --output-logs=full');
phase('Puppeteer prerender', 'npm run prerender');
phase('Save prerender cache (turbo)', 'npx turbo run prerender-cache-save --output-logs=full');
phase('Save prerender cache (blob)', 'node ./scripts/sync-prerender-cache-blob.mjs save');
phase('Post-prerender checks', 'npm run build:seo:post');
