import fs from 'node:fs';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';

const ROOT = process.cwd();
const VERCEL_PATH = path.join(ROOT, 'vercel.json');
const SITEMAP_PATH = path.join(ROOT, 'public', 'sitemap.xml');
const GENERATED_NOINDEX_PATHS = path.join(ROOT, 'src', 'config', 'seoPruning.generated.ts');

function normalizePath(p) {
  if (!p) return '';
  let value = String(p).trim().toLowerCase();
  if (!value.startsWith('/')) value = `/${value}`;
  return value;
}

function parseArgs(argv) {
  return {
    strict: argv.includes('--strict'),
  };
}

function readRedirects() {
  const config = JSON.parse(fs.readFileSync(VERCEL_PATH, 'utf8'));
  return Array.isArray(config.redirects) ? config.redirects : [];
}

function getNoindexPaths() {
  if (!fs.existsSync(GENERATED_NOINDEX_PATHS)) return new Set();
  const content = fs.readFileSync(GENERATED_NOINDEX_PATHS, 'utf8');
  const matches = [...content.matchAll(/'([^']+)'/g)].map((m) => normalizePath(m[1]));
  return new Set(matches);
}

function getSitemapPaths() {
  if (!fs.existsSync(SITEMAP_PATH)) return new Set();
  const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
  const parsed = parser.parse(xml.replace(/^(\s*<\?xml[^?]*\?>\s*)+/, ''));
  const urls = parsed?.urlset?.url ?? [];
  const list = Array.isArray(urls) ? urls : [urls];
  const paths = list
    .map((entry) => {
      try {
        return normalizePath(new URL(entry.loc).pathname);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  return new Set(paths);
}

function checkRedirects(redirects) {
  const errors = [];
  const bySource = new Map();
  for (const r of redirects) {
    const source = normalizePath(r?.source);
    if (!source) continue;
    bySource.set(source, (bySource.get(source) ?? 0) + 1);
    if (source === normalizePath(r?.destination)) {
      errors.push(`self redirect: ${source}`);
    }
  }
  for (const [source, count] of bySource.entries()) {
    if (count > 1) errors.push(`duplicate redirect source: ${source} (${count})`);
  }
  return errors;
}

async function main() {
  const { strict } = parseArgs(process.argv.slice(2));
  const failures = [];
  const redirects = readRedirects();
  const noindexPaths = getNoindexPaths();
  const sitemapPaths = getSitemapPaths();

  failures.push(...checkRedirects(redirects));

  // noindex/sitemap coherence
  for (const p of noindexPaths) {
    if (sitemapPaths.has(p)) {
      failures.push(`noindex path present in sitemap: ${p}`);
    }
  }

  // redirect/sitemap coherence
  for (const r of redirects) {
    const source = normalizePath(r?.source);
    if (!source || /[:*()]/.test(source)) continue;
    if (sitemapPaths.has(source)) {
      failures.push(`redirect source present in sitemap: ${source}`);
    }
  }

  // /blog duplicate discoverability guard
  if (!redirects.some((r) => normalizePath(r?.source) === '/blog/:slug')) {
    failures.push('missing /blog/:slug redirect rule');
  }
  for (const p of sitemapPaths) {
    if (p.startsWith('/blog/')) {
      failures.push(`blog duplicate present in sitemap: ${p}`);
      break;
    }
  }

  if (failures.length) {
    const prefix = strict ? 'SEO regression check failed' : 'SEO regression check warnings';
    console[strict ? 'error' : 'warn'](`${prefix} (${failures.length} issues):`);
    failures.forEach((item) => console[strict ? 'error' : 'warn'](`- ${item}`));
    if (strict) process.exit(1);
    return;
  }

  console.log('SEO regression check passed.');
  console.log(`- redirect rules checked: ${redirects.length}`);
  console.log(`- noindex paths checked: ${noindexPaths.size}`);
  console.log(`- sitemap urls checked: ${sitemapPaths.size}`);
}

main();
