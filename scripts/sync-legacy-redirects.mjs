/**
 * Sync server-side 301 redirects for legacy SEO file-path URLs -> canonical paths.
 * Mirrors client-side legacyRedirects in src/routes/seoRoutes.tsx.
 */

import fs from 'fs';
import path from 'path';
import { getLegacyRedirects } from './utils/collect-prerender-routes.mjs';

const ROOT = process.cwd();
const VERCEL_PATH = path.join(ROOT, 'vercel.json');
const GENERATED_MANIFEST = path.join(ROOT, 'scripts', 'legacy-redirects.generated.json');

function normalizeSource(source) {
  return source.replace(/\/+$/, '') || '/';
}

function readVercelConfig() {
  return JSON.parse(fs.readFileSync(VERCEL_PATH, 'utf8'));
}

function readPreviousSources() {
  if (!fs.existsSync(GENERATED_MANIFEST)) return new Set();
  try {
    const data = JSON.parse(fs.readFileSync(GENERATED_MANIFEST, 'utf8'));
    return new Set(Array.isArray(data.sources) ? data.sources : []);
  } catch {
    return new Set();
  }
}

function buildLegacyRedirectEntries(legacyMap) {
  const entries = [];
  for (const [from, to] of [...legacyMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    entries.push({
      source: from,
      destination: to,
      permanent: true,
    });
  }
  return entries;
}

async function main() {
  const legacyMap = await getLegacyRedirects();
  const config = readVercelConfig();
  const redirects = Array.isArray(config.redirects) ? [...config.redirects] : [];
  const previousSources = readPreviousSources();
  const generated = buildLegacyRedirectEntries(legacyMap);
  const generatedSources = new Set(generated.map((r) => normalizeSource(r.source)));

  // Drop any prior auto-synced legacy redirects, then insert the fresh set once.
  const managedSources = new Set([...previousSources, ...generatedSources]);
  const filtered = redirects.filter((r) => !managedSources.has(normalizeSource(r?.source ?? '')));

  const insertAt = filtered.findIndex(
    (r) => r?.source === '/(.*)' || r?.source === '/blog/:slug'
  );
  const index = insertAt === -1 ? filtered.length : insertAt;
  filtered.splice(index, 0, ...generated);

  config.redirects = filtered;
  fs.writeFileSync(VERCEL_PATH, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
  fs.writeFileSync(
    GENERATED_MANIFEST,
    `${JSON.stringify({ sources: [...generatedSources], updatedAt: new Date().toISOString() }, null, 2)}\n`,
    'utf8'
  );

  console.log(`[sync-legacy-redirects] Synced ${generated.length} legacy redirect(s) in vercel.json.`);
  for (const entry of generated.slice(0, 15)) {
    console.log(`  ${entry.source} -> ${entry.destination}`);
  }
  if (generated.length > 15) {
    console.log(`  …and ${generated.length - 15} more`);
  }
}

main().catch((error) => {
  console.error('[sync-legacy-redirects] Failed:', error);
  process.exit(1);
});
