import fs from 'node:fs';
import path from 'node:path';
import { globby } from 'globby';
import { extractRoutePathFromContent } from './utils/seo-slug.mjs';

const ROOT = process.cwd();
const DEFAULT_CSV = path.join(ROOT, 'seo-pruning-actions-2026-06-02.csv');
const SEO_ROOTS = [
  path.join(ROOT, 'src', 'pages', 'SEO'),
  path.join(ROOT, 'src', 'pages', 'seo'),
];
const OUTPUT_PLAN = path.join(ROOT, 'seo-file-deletion-plan.json');
const OUTPUT_REVIEW = path.join(ROOT, 'seo-file-deletion-review.csv');
const DEFAULT_MAX_AMBIGUOUS = 250;

const PROTECTED_PATHS = new Set([
  '/',
  '/pricing',
  '/features',
  '/contact',
  '/customers',
  '/integrations',
  '/resources',
  '/reporting',
  '/inventory-management-software',
  '/best-free-inventory-software-with-barcode-scanning',
  '/best-inventory-management-software',
  '/inventory-management',
  '/warehouse-management-system',
  '/reorder-point-formula',
  '/how-to-perform-an-inventory-cycle-count',
  '/glossary/asset-controller-meaning',
]);

function parseArgs(argv) {
  const args = {
    csv: DEFAULT_CSV,
    apply: false,
    maxAmbiguous: DEFAULT_MAX_AMBIGUOUS,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--apply') args.apply = true;
    if (arg === '--csv' && argv[i + 1]) args.csv = path.resolve(ROOT, argv[i + 1]);
    if (arg === '--max-ambiguous' && argv[i + 1]) args.maxAmbiguous = Number(argv[i + 1]);
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

function normalizePath(input) {
  if (!input) return '';
  let value = String(input).trim().toLowerCase();
  if (!value.startsWith('/')) value = `/${value}`;
  return value;
}

function readNumber(input) {
  const clean = String(input ?? '').replace(/[^0-9.-]/g, '');
  const num = Number(clean);
  return Number.isFinite(num) ? num : 0;
}

async function buildRouteToFileMap() {
  const routeMap = new Map();

  for (const root of SEO_ROOTS) {
    if (!fs.existsSync(root)) continue;
    const files = await globby('**/*.tsx', { cwd: root, absolute: true });

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const relativeForSlug = path
        .relative(path.join(ROOT, 'src'), file)
        .replace(/\\/g, '/');
      const route = normalizePath(extractRoutePathFromContent(content, relativeForSlug));
      if (!route) continue;
      const list = routeMap.get(route) ?? [];
      list.push(file);
      routeMap.set(route, list);
    }
  }

  return routeMap;
}

function toCsv(rows) {
  const headers = ['path', 'reason', 'action', 'clicks', 'impressions', 'position', 'mappedFiles', 'target'];
  const escape = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;
  const lines = [headers.map(escape).join(',')];
  for (const row of rows) {
    lines.push(
      [
        row.path,
        row.reason,
        row.action,
        row.clicks,
        row.impressions,
        row.position,
        row.mappedFiles,
        row.target,
      ]
        .map(escape)
        .join(',')
    );
  }
  return `${lines.join('\n')}\n`;
}

function isSafeDeleteCandidate(row, mappedFiles, routeMap) {
  const action = String(row.action || '').trim();
  const pathValue = normalizePath(row.path);
  const target = normalizePath(row.target);
  const clicks = readNumber(row.clicks);
  const impressions = readNumber(row.impressions);

  if (PROTECTED_PATHS.has(pathValue)) return { ok: false, reason: 'protected path' };
  if (mappedFiles.length === 0) return { ok: false, reason: 'no mapped file for route' };
  if (mappedFiles.length > 1) return { ok: false, reason: 'multiple mapped files for route' };

  if (action === '301') {
    if (!target || target === pathValue) return { ok: false, reason: 'invalid redirect target' };
    if (!routeMap.has(target)) return { ok: false, reason: 'redirect target route missing in codebase' };
    return { ok: true, reason: '301 with existing target route' };
  }

  // Conservative deletion for noindex_follow only when there is very low demand.
  if (action === 'noindex_follow') {
    if (clicks !== 0) return { ok: false, reason: 'has clicks' };
    if (impressions > 20) return { ok: false, reason: 'impressions too high for safe auto-delete' };
    return { ok: true, reason: 'zero clicks and <=20 impressions' };
  }

  return { ok: false, reason: 'action not deletable' };
}

async function main() {
  const { csv, apply, maxAmbiguous } = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(csv)) {
    throw new Error(`CSV file not found: ${csv}`);
  }

  const rows = readCsvRows(csv);
  const routeMap = await buildRouteToFileMap();

  const deletable = [];
  const review = [];
  let ambiguousCount = 0;

  for (const row of rows) {
    const pathValue = normalizePath(row.path);
    if (!pathValue) continue;
    const mappedFiles = routeMap.get(pathValue) ?? [];
    const decision = isSafeDeleteCandidate(row, mappedFiles, routeMap);
    const payload = {
      path: pathValue,
      action: String(row.action || ''),
      target: normalizePath(row.target),
      clicks: readNumber(row.clicks),
      impressions: readNumber(row.impressions),
      position: readNumber(row.position),
      mappedFiles,
      reason: decision.reason,
    };

    if (decision.ok) {
      deletable.push(payload);
    } else {
      if (decision.reason === 'no mapped file for route' || decision.reason === 'multiple mapped files for route') {
        ambiguousCount += 1;
      }
      review.push(payload);
    }
  }

  // Deduplicate by file path for delete execution
  const uniqueDeleteFiles = new Map();
  for (const item of deletable) {
    const file = item.mappedFiles[0];
    if (!uniqueDeleteFiles.has(file)) uniqueDeleteFiles.set(file, item);
  }

  const plan = {
    generatedAt: new Date().toISOString(),
    sourceCsv: csv,
    totals: {
      rows: rows.length,
      routesMapped: routeMap.size,
      deletableRows: deletable.length,
      uniqueFilesToDelete: uniqueDeleteFiles.size,
      reviewRows: review.length,
      ambiguousRows: ambiguousCount,
    },
    deletable: Array.from(uniqueDeleteFiles.values()),
  };

  fs.writeFileSync(OUTPUT_PLAN, `${JSON.stringify(plan, null, 2)}\n`, 'utf8');
  fs.writeFileSync(
    OUTPUT_REVIEW,
    toCsv(
      review.map((r) => ({
        ...r,
        mappedFiles: r.mappedFiles.join(';'),
      }))
    ),
    'utf8'
  );

  console.log(`Plan file: ${OUTPUT_PLAN}`);
  console.log(`Review file: ${OUTPUT_REVIEW}`);
  console.log(`Rows in CSV: ${rows.length}`);
  console.log(`Deletable (rows): ${deletable.length}`);
  console.log(`Deletable (unique files): ${uniqueDeleteFiles.size}`);
  console.log(`Ambiguous review rows: ${ambiguousCount}`);

  if (!apply) {
    console.log('\nDry run only. No files deleted.');
    console.log('Use: node scripts/plan-seo-file-deletions.mjs --apply');
    return;
  }

  if (ambiguousCount > maxAmbiguous) {
    console.error(
      `Refusing to delete files: ambiguous row count (${ambiguousCount}) exceeds max-ambiguous (${maxAmbiguous}).`
    );
    process.exit(1);
  }

  let deleted = 0;
  for (const [filePath] of uniqueDeleteFiles) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      deleted += 1;
    }
  }
  console.log(`\nDeleted files: ${deleted}`);
}

main();
