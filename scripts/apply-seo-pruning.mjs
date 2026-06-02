import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DEFAULT_CSV = path.join(ROOT, 'seo-pruning-actions-2026-06-02.csv');
const VERCEL_JSON_PATH = path.join(ROOT, 'vercel.json');
const GENERATED_CONFIG_PATH = path.join(ROOT, 'src', 'config', 'seoPruning.generated.ts');
const SUMMARY_OUTPUT_PATH = path.join(ROOT, 'seo-pruning-summary.json');

const DEFAULT_ALLOWLIST = path.join(ROOT, 'seo-pruning-allowlist.txt');
const DEFAULT_DENYLIST = path.join(ROOT, 'seo-pruning-denylist.txt');

function parseArgs(argv) {
  const args = {
    csv: DEFAULT_CSV,
    apply: false,
    summary: SUMMARY_OUTPUT_PATH,
    allowlist: DEFAULT_ALLOWLIST,
    denylist: DEFAULT_DENYLIST,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--apply') args.apply = true;
    if (arg === '--csv' && argv[i + 1]) args.csv = path.resolve(ROOT, argv[i + 1]);
    if (arg === '--summary' && argv[i + 1]) args.summary = path.resolve(ROOT, argv[i + 1]);
    if (arg === '--allowlist' && argv[i + 1]) args.allowlist = path.resolve(ROOT, argv[i + 1]);
    if (arg === '--denylist' && argv[i + 1]) args.denylist = path.resolve(ROOT, argv[i + 1]);
  }

  return args;
}

function parseCsvLine(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      cells.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells;
}

function readCsvRows(csvPath) {
  const raw = fs.readFileSync(csvPath, 'utf8');
  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row = {};
    headers.forEach((key, idx) => {
      row[key] = values[idx] ?? '';
    });
    return row;
  });
}

function normalizePath(urlPath) {
  if (!urlPath) return '';
  let p = String(urlPath).trim();
  if (!p.startsWith('/')) p = `/${p}`;
  return p.toLowerCase();
}

function readPathList(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const items = fs
    .readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith('#'))
    .map(normalizePath)
    .filter(Boolean);
  if (items.length === 0) return null;
  return new Set(items);
}

function sortRedirects(redirects) {
  return [...redirects].sort((a, b) => {
    const aSource = String(a.source || '');
    const bSource = String(b.source || '');
    const aParameterized = /[:*()]/.test(aSource);
    const bParameterized = /[:*()]/.test(bSource);
    if (aParameterized !== bParameterized) {
      return aParameterized ? 1 : -1;
    }
    return aSource.localeCompare(bSource);
  });
}

function collapseRedirectChains(redirects) {
  const map = new Map(
    redirects
      .filter((r) => typeof r?.source === 'string' && typeof r?.destination === 'string')
      .map((r) => [normalizePath(r.source), normalizePath(r.destination)])
  );

  const resolve = (destination) => {
    let current = destination;
    const seen = new Set();
    while (map.has(current) && !seen.has(current)) {
      seen.add(current);
      current = map.get(current);
    }
    return current;
  };

  return redirects.map((redirect) => {
    if (typeof redirect?.destination !== 'string') return redirect;
    const normalized = normalizePath(redirect.destination);
    if (!normalized.startsWith('/')) return redirect;
    return {
      ...redirect,
      destination: resolve(normalized),
    };
  });
}

function buildPlan(rows, allowlist, denylist) {
  const redirects = new Map();
  const forcedNoindex = new Set();
  const skipped = [];

  for (const row of rows) {
    const sourcePath = normalizePath(row.path);
    const action = String(row.action || '').trim();
    const target = normalizePath(row.target || '');

    if (!sourcePath) continue;

    if (denylist?.has(sourcePath)) {
      skipped.push({ path: sourcePath, reason: 'denylisted' });
      continue;
    }
    if (allowlist && !allowlist.has(sourcePath)) {
      skipped.push({ path: sourcePath, reason: 'not in allowlist' });
      continue;
    }

    if (action === '301' && target && target !== sourcePath) {
      redirects.set(sourcePath, target);
      continue;
    }

    if (action === 'noindex_follow' || action === 'keep_noindex') {
      forcedNoindex.add(sourcePath);
    }
  }

  return { redirects, forcedNoindex, skipped };
}

function mergeRedirects(vercelConfig, redirectMap) {
  if (!Array.isArray(vercelConfig.redirects)) {
    vercelConfig.redirects = [];
  }

  const existingBySource = new Map(
    vercelConfig.redirects
      .filter((r) => typeof r?.source === 'string')
      .map((r) => [normalizePath(r.source), r])
  );

  let added = 0;
  let updated = 0;

  const resolveDestination = (destination) => {
    let current = destination;
    const visited = new Set();
    while (redirectMap.has(current) && !visited.has(current)) {
      visited.add(current);
      current = redirectMap.get(current);
    }
    return current;
  };

  for (const [source, rawDestination] of redirectMap.entries()) {
    const destination = resolveDestination(rawDestination);
    const existing = existingBySource.get(source);
    if (existing) {
      if (existing.destination !== destination || existing.permanent !== true) {
        existing.destination = destination;
        existing.permanent = true;
        updated += 1;
      }
      continue;
    }

    vercelConfig.redirects.push({
      source,
      destination,
      permanent: true,
    });
    added += 1;
  }

  return { added, updated };
}

function writeGeneratedConfig(filePath, noindexSet) {
  const sorted = Array.from(noindexSet).sort((a, b) => a.localeCompare(b));
  const lines = [
    '// AUTO-GENERATED by scripts/apply-seo-pruning.mjs',
    '// Do not edit manually. Regenerate from SEO action CSV.',
    '',
    'export const FORCED_NOINDEX_PATHS = new Set<string>([',
    ...sorted.map((item) => `  '${item}',`),
    ']);',
    '',
  ];

  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
}

function main() {
  const { csv, apply, summary, allowlist: allowlistPath, denylist: denylistPath } = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(csv)) {
    throw new Error(`CSV file not found: ${csv}`);
  }

  const rows = readCsvRows(csv);
  const allowlist = readPathList(allowlistPath);
  const denylist = readPathList(denylistPath);
  const { redirects, forcedNoindex, skipped } = buildPlan(rows, allowlist, denylist);

  console.log(`CSV: ${csv}`);
  console.log(`Rows parsed: ${rows.length}`);
  console.log(`Planned redirects: ${redirects.size}`);
  console.log(`Planned forced noindex paths: ${forcedNoindex.size}`);
  console.log(`Skipped rows: ${skipped.length}`);

  const actionCounts = rows.reduce((acc, row) => {
    const action = String(row.action || 'unknown');
    acc[action] = (acc[action] ?? 0) + 1;
    return acc;
  }, {});

  const summaryData = {
    generatedAt: new Date().toISOString(),
    csv,
    rowsParsed: rows.length,
    plan: {
      redirects: redirects.size,
      forcedNoindex: forcedNoindex.size,
      skipped: skipped.length,
    },
    actionCounts,
    topRedirects: Array.from(redirects.entries())
      .slice(0, 50)
      .map(([source, destination]) => ({ source, destination })),
    topNoindexPaths: Array.from(forcedNoindex).slice(0, 100),
    skipped: skipped.slice(0, 200),
  };
  fs.writeFileSync(summary, `${JSON.stringify(summaryData, null, 2)}\n`, 'utf8');
  console.log(`Summary written: ${summary}`);

  if (!apply) {
    console.log('\nDry run only. No files changed.');
    console.log('Use: node scripts/apply-seo-pruning.mjs --apply');
    return;
  }

  const vercelConfig = JSON.parse(fs.readFileSync(VERCEL_JSON_PATH, 'utf8'));
  const redirectChanges = mergeRedirects(vercelConfig, redirects);
  vercelConfig.redirects = collapseRedirectChains(vercelConfig.redirects ?? []);
  vercelConfig.redirects = sortRedirects(vercelConfig.redirects ?? []);
  fs.writeFileSync(VERCEL_JSON_PATH, `${JSON.stringify(vercelConfig, null, 2)}\n`, 'utf8');

  writeGeneratedConfig(GENERATED_CONFIG_PATH, forcedNoindex);

  console.log('\nApplied SEO pruning changes:');
  console.log(`- vercel redirects added: ${redirectChanges.added}`);
  console.log(`- vercel redirects updated: ${redirectChanges.updated}`);
  console.log(`- generated noindex config: ${GENERATED_CONFIG_PATH}`);
}

main();
