/**
 * Persist .prerender-cache across Vercel deployments via Vercel Blob.
 * Requires a Blob store linked to the project (BLOB_READ_WRITE_TOKEN).
 *
 * Usage: node scripts/sync-prerender-cache-blob.mjs restore|save
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import { head, put } from '@vercel/blob';

const ROOT = process.cwd();
const CACHE_DIR = path.join(ROOT, '.prerender-cache');
const BLOB_PATHNAME = 'stockflow-prerender-cache.tar.gz';
const ARCHIVE = path.join(ROOT, '.prerender-cache.tar.gz');

const mode = process.argv[2];

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function createArchive() {
  if (!fs.existsSync(CACHE_DIR)) {
    throw new Error('No .prerender-cache directory to archive');
  }
  if (fs.existsSync(ARCHIVE)) fs.unlinkSync(ARCHIVE);
  execSync(`tar -czf "${ARCHIVE}" -C "${ROOT}" .prerender-cache`, { stdio: 'inherit' });
}

function extractArchive() {
  if (fs.existsSync(CACHE_DIR)) {
    fs.rmSync(CACHE_DIR, { recursive: true, force: true });
  }
  execSync(`tar -xzf "${ARCHIVE}" -C "${ROOT}"`, { stdio: 'inherit' });
}

async function restore() {
  if (!hasBlobToken()) {
    log('[prerender-blob] No BLOB_READ_WRITE_TOKEN — skipping remote restore (link a Blob store in Vercel → Storage).');
    return;
  }

  try {
    const meta = await head(BLOB_PATHNAME);
    const response = await fetch(meta.url);
    if (!response.ok) {
      throw new Error(`download failed (${response.status})`);
    }

    await pipeline(response.body, createWriteStream(ARCHIVE));
    extractArchive();
    fs.unlinkSync(ARCHIVE);

    const manifest = path.join(CACHE_DIR, 'manifest.json');
    const routes = manifest && fs.existsSync(manifest)
      ? Object.keys(JSON.parse(fs.readFileSync(manifest, 'utf8')).routes ?? {}).length
      : 0;
    log(`[prerender-blob] Restored remote cache (${routes} route(s) in manifest).`);
  } catch (error) {
    log(`[prerender-blob] Remote cache unavailable (${error?.message ?? 'not found'}) — cold Puppeteer run expected.`);
  }
}

async function save() {
  if (!hasBlobToken()) {
    log('[prerender-blob] No BLOB_READ_WRITE_TOKEN — skipping remote save.');
    return;
  }

  if (!fs.existsSync(CACHE_DIR)) {
    log('[prerender-blob] No local cache to save.');
    return;
  }

  createArchive();
  const body = fs.readFileSync(ARCHIVE);
  await put(BLOB_PATHNAME, body, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/gzip',
  });
  fs.unlinkSync(ARCHIVE);

  const manifest = path.join(CACHE_DIR, 'manifest.json');
  const routes = fs.existsSync(manifest)
    ? Object.keys(JSON.parse(fs.readFileSync(manifest, 'utf8')).routes ?? {}).length
    : 0;
  log(`[prerender-blob] Saved remote cache (${routes} route(s)).`);
}

async function main() {
  if (mode !== 'restore' && mode !== 'save') {
    console.error('Usage: node scripts/sync-prerender-cache-blob.mjs restore|save');
    process.exit(1);
  }

  if (mode === 'restore') await restore();
  else await save();
}

main().catch((error) => {
  console.error('[prerender-blob] Failed:', error);
  process.exit(1);
});
