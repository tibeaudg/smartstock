/**
 * Build-time per-route meta injection.
 *
 * Runs AFTER `vite build`. Uses the built `dist/index.html` (which already has the
 * hashed JS/CSS asset references) as a shell template, then emits a per-route
 * `dist/<path>/index.html` with correct <head> tags baked in:
 *   - <title>, <meta name="description">
 *   - a SELF-REFERENCING <link rel="canonical"> (the template has none — the core fix)
 *   - <meta name="robots">, Open Graph + Twitter tags, optional JSON-LD
 *
 * This fixes the CSR canonical/metadata bug for crawlers that do not run JS
 * (Bing, social, AI). Body content continues to hydrate client-side.
 *
 * All injected tags carry data-rh="true" so react-helmet-async takes ownership and
 * reconciles them on mount instead of appending duplicates.
 */

import fs from 'fs';
import path from 'path';
import { globby } from 'globby';
import { parse } from '@babel/parser';
import { extractRoutePathFromContent } from './utils/seo-slug.mjs';

const ROOT = process.cwd();
const BASE_URL = 'https://www.stockflowsystems.com';
const DIST = path.join(ROOT, 'dist');
const TEMPLATE_PATH = path.join(DIST, 'index.html');
const SEO_DIR = path.join(ROOT, 'src/pages/SEO');
const APP_PATH = path.join(ROOT, 'src/App.tsx');

const DEFAULT_TITLE = 'StockFlow - Free Inventory Management Software';
const DEFAULT_DESCRIPTION =
  'StockFlow is free inventory management software for small businesses. Track stock, barcode scanning, BOMs, and orders with no hidden costs.';
const DEFAULT_IMAGE = `${BASE_URL}/Inventory-Management.png`;

// Routes that redirect elsewhere (App.tsx <Navigate> + sitemap redirect set).
// Never emit a static page for these — it would shadow the redirect.
const SKIP_SLUGS = new Set([
  'best-free-alternative-to-katana-mrp',
  'inventory-software-management',
  'asset-tracking',
  'what-is-bill-of-materials',
  'bill-of-materials',
  'prix',
  'prix-abonnement',
  'non-profit-inventory-management',
  'createGlossaryPage',
  'resources', // handled as a core route below, not via SEO dir scan
]);

// Mirrors src/routes/seoRoutes.tsx excludedFiles (by path-without-extension).
const EXCLUDED_FILES = new Set(['glossary/createGlossaryPage', 'resources']);

const PRIVATE_PREFIXES = ['/dashboard', '/auth', '/admin', '/checkout', '/billing-success', '/500'];

// Core public routes whose <SEO> lives inline in App.tsx but which have no
// extractable title/description there (they manage meta in their own component).
// We still emit a self-canonical so they never canonicalize to the homepage.
const MANUAL_ROUTES = [
  { route: '/pricing', title: 'Pricing | StockFlow', h1: "Start free. Scale when you're ready.", description: 'StockFlow pricing — free inventory management software for small businesses, with paid plans for growing teams.' },
  { route: '/faq', title: 'Frequently Asked Questions | StockFlow', h1: 'Frequently Asked Questions', description: 'Answers to common questions about StockFlow free inventory management software, features, pricing, and getting started.' },
  { route: '/resources', title: 'Inventory Management Resources & Guides | StockFlow', h1: 'Inventory Management Resources & Guides', description: 'Find free inventory software guides, operating tips, and best practices for inventory control, barcode scanning, and stock management.' },
  { route: '/integrations', title: 'Integrations | StockFlow', h1: 'Powerful Integrations', description: 'Connect StockFlow with Shopify, Stripe, e-commerce platforms, and business tools. Sync inventory, orders, and data across your stack.' },
];

/** H1 text for core App.tsx routes where the visible heading differs from the <title>. */
const MANUAL_H1_OVERRIDES = {
  '/': 'Free Inventory Software with Barcode Scanning',
  '/features': 'Powerful Features for Your Business',
  '/contact': 'Contact Us',
  '/reporting': 'Reporting & Analytics',
};

// ---------------------------------------------------------------------------
// AST helpers
// ---------------------------------------------------------------------------

function parseSource(code) {
  return parse(code, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
    errorRecovery: true,
  });
}

/** Recursively walk every AST node, calling visit(node). */
function walk(node, visit) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const child of node) walk(child, visit);
    return;
  }
  if (typeof node.type === 'string') visit(node);
  for (const key of Object.keys(node)) {
    if (key === 'loc' || key === 'start' || key === 'end' || key === 'leadingComments' || key === 'trailingComments') continue;
    walk(node[key], visit);
  }
}

/** Map of top-level `const x = <init>` name -> init AST node. */
function collectTopLevelConsts(ast) {
  const map = new Map();
  for (const stmt of ast.program.body) {
    if (stmt.type === 'VariableDeclaration' && stmt.kind === 'const') {
      for (const decl of stmt.declarations) {
        if (decl.id?.type === 'Identifier' && decl.init) {
          map.set(decl.id.name, decl.init);
        }
      }
    }
  }
  return map;
}

/** Resolve an expression node to a plain string, or undefined if not statically resolvable. */
function resolveString(node, constInit, seen = new Set()) {
  if (!node) return undefined;
  switch (node.type) {
    case 'StringLiteral':
      return node.value;
    case 'TemplateLiteral': {
      let out = '';
      for (let i = 0; i < node.quasis.length; i++) {
        out += node.quasis[i].value.cooked ?? '';
        if (i < node.expressions.length) {
          const part = resolveString(node.expressions[i], constInit, seen);
          if (part === undefined) return undefined;
          out += part;
        }
      }
      return out;
    }
    case 'Identifier': {
      if (seen.has(node.name)) return undefined;
      seen.add(node.name);
      return resolveString(constInit.get(node.name), constInit, seen);
    }
    case 'BinaryExpression': {
      if (node.operator !== '+') return undefined;
      const left = resolveString(node.left, constInit, seen);
      const right = resolveString(node.right, constInit, seen);
      if (left === undefined || right === undefined) return undefined;
      return left + right;
    }
    default:
      return undefined;
  }
}

/** Resolve an expression node to a JSON-serializable literal, or undefined. */
function resolveLiteral(node, constInit, seen = new Set()) {
  if (!node) return undefined;
  switch (node.type) {
    case 'StringLiteral':
    case 'NumericLiteral':
    case 'BooleanLiteral':
      return node.value;
    case 'NullLiteral':
      return null;
    case 'TemplateLiteral':
      return node.expressions.length === 0 ? node.quasis[0].value.cooked : undefined;
    case 'ArrayExpression': {
      const out = [];
      for (const el of node.elements) {
        if (!el || el.type === 'SpreadElement') return undefined;
        const v = resolveLiteral(el, constInit, seen);
        if (v === undefined) return undefined;
        out.push(v);
      }
      return out;
    }
    case 'ObjectExpression': {
      const out = {};
      for (const prop of node.properties) {
        if (prop.type !== 'ObjectProperty' || prop.computed) return undefined;
        const key =
          prop.key.type === 'Identifier' ? prop.key.name :
          prop.key.type === 'StringLiteral' ? prop.key.value : undefined;
        if (key === undefined) return undefined;
        const v = resolveLiteral(prop.value, constInit, seen);
        if (v === undefined) return undefined;
        out[key] = v;
      }
      return out;
    }
    case 'Identifier': {
      if (seen.has(node.name)) return undefined;
      seen.add(node.name);
      return resolveLiteral(constInit.get(node.name), constInit, seen);
    }
    default:
      return undefined;
  }
}

/** Find the first <SEO> JSX element within a node subtree. */
function findSeoElement(root) {
  let found = null;
  walk(root, (node) => {
    if (found) return;
    if (node.type === 'JSXOpeningElement' && node.name?.type === 'JSXIdentifier' && node.name.name === 'SEO') {
      found = node;
    }
  });
  return found;
}

/** Extract { title, description, image, noindex, structuredData } from a <SEO> opening element. */
function extractSeoMeta(seoOpening, constInit) {
  const meta = {};
  for (const attr of seoOpening.attributes) {
    if (attr.type !== 'JSXAttribute' || attr.name?.type !== 'JSXIdentifier') continue;
    const name = attr.name.name;
    const valNode = attr.value;
    const exprNode = valNode?.type === 'JSXExpressionContainer' ? valNode.expression : valNode;

    if (name === 'noindex') {
      if (valNode == null) meta.noindex = true;
      else if (exprNode?.type === 'BooleanLiteral') meta.noindex = exprNode.value;
      continue;
    }
    if (name === 'structuredData') {
      const v = resolveLiteral(exprNode, constInit);
      if (v !== undefined) meta.structuredData = v;
      continue;
    }
    if (['title', 'description', 'image'].includes(name)) {
      const v = resolveString(exprNode, constInit);
      if (v !== undefined) meta[name] = v;
    }
  }
  if (meta.title) {
    meta.h1 = stripBrandSuffix(meta.title);
  }
  return meta;
}

// ---------------------------------------------------------------------------
// SeoPageLayout extraction helpers
// ---------------------------------------------------------------------------

/** Mirrors src/utils/seoPageDescription.ts */
function stripBrandSuffix(title) {
  return title
    .replace(/\s*\|\s*StockFlow\s*$/i, '')
    .replace(/\s*Strategy\s*&\s*Automation\s*Guide\s*$/i, '')
    .replace(/\s*Guide\s*$/i, '')
    .replace(/\s*-\s*A Technical Framework\s*$/i, '')
    .replace(/\s*:\s*A Technical Framework\s*$/i, '')
    .trim();
}

function truncate160(text) {
  if (text.length <= 160) return text;
  const cut = text.substring(0, 157);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 157 * 0.6 ? cut.substring(0, lastSpace) : cut) + '...';
}

function generatePageMetaDescription(heroTitle, lang) {
  const topic = stripBrandSuffix(heroTitle);
  if (lang === 'nl') {
    return truncate160(`Leer hoe ${topic} uw voorraadbeheer verbetert. Gratis voorraadsoftware met barcodescannen en realtime voorraadinzicht.`);
  }
  return truncate160(`Learn how ${topic} improves inventory accuracy, reduces stockouts, and saves time. Free inventory software with barcode scanning and real-time stock tracking.`);
}

function isThinTemplate(heroTitle) {
  return heroTitle.includes('A Technical Framework');
}

function shortenSeoTitle(pageTitle) {
  if (pageTitle.length <= 60) return pageTitle;
  const brandSuffix = ' | StockFlow';
  const withoutSuffix = pageTitle.endsWith(brandSuffix)
    ? pageTitle.slice(0, -brandSuffix.length)
    : pageTitle;
  const shortened = withoutSuffix
    .replace(/ Strategy & Automation Guide$/, '')
    .replace(/ Guide$/, '')
    .replace(/ - A Technical Framework$/, '');
  const candidate = shortened + brandSuffix;
  return candidate.length <= 60 ? candidate : candidate.substring(0, 57) + '...';
}

/** Find the first <SeoPageLayout> JSX opening element. */
function findSeoPageLayoutElement(root) {
  let found = null;
  walk(root, (node) => {
    if (found) return;
    if (
      node.type === 'JSXOpeningElement' &&
      node.name?.type === 'JSXIdentifier' &&
      node.name.name === 'SeoPageLayout'
    ) {
      found = node;
    }
  });
  return found;
}

/**
 * Extract meta from a <SeoPageLayout title="..." heroTitle="..." ...> element,
 * mirroring the runtime logic in src/components/SeoPageLayout.tsx.
 */
function extractSeoPageLayoutMeta(opening, constInit, routePath) {
  const attrs = {};
  for (const attr of opening.attributes) {
    if (attr.type !== 'JSXAttribute' || attr.name?.type !== 'JSXIdentifier') continue;
    const name = attr.name.name;
    const valNode = attr.value;
    const exprNode = valNode?.type === 'JSXExpressionContainer' ? valNode.expression : valNode;
    if (name === 'noindex') {
      if (valNode == null) attrs.noindex = true;
      else if (exprNode?.type === 'BooleanLiteral') attrs.noindex = exprNode.value;
    } else if (['title', 'seoTitle', 'heroTitle', 'seoDescription', 'heroDescription', 'pageLanguage'].includes(name)) {
      const v = resolveString(exprNode, constInit);
      if (v !== undefined) attrs[name] = v;
    }
  }

  const heroTitle = attrs.heroTitle || '';
  const pageTitle = attrs.title || heroTitle;
  const candidateTitle = attrs.seoTitle || pageTitle;
  const seoTitle = candidateTitle ? shortenSeoTitle(candidateTitle) : undefined;

  const lang = attrs.pageLanguage || (routePath.startsWith('/nl') ? 'nl' : 'en');
  const description =
    attrs.seoDescription ||
    attrs.heroDescription ||
    (heroTitle ? generatePageMetaDescription(heroTitle, lang) : undefined);

  const noindex = attrs.noindex ?? (heroTitle ? isThinTemplate(heroTitle) : false);
  const h1 = heroTitle || (pageTitle ? stripBrandSuffix(pageTitle) : undefined);

  return { title: seoTitle, description, noindex, h1 };
}

// ---------------------------------------------------------------------------
// Glossary factory helper
// ---------------------------------------------------------------------------

const GLOSSARY_DATA_PATH = path.join(ROOT, 'src/pages/SEO/glossary/glossaryData.ts');

/** Lazily parse glossaryData.ts into a map: slug -> { title, metaDescription, definition }. */
let _glossaryMap = null;
function getGlossaryMap() {
  if (_glossaryMap) return _glossaryMap;
  _glossaryMap = new Map();
  if (!fs.existsSync(GLOSSARY_DATA_PATH)) return _glossaryMap;

  const src = fs.readFileSync(GLOSSARY_DATA_PATH, 'utf8');
  let ast;
  try {
    ast = parseSource(src);
  } catch {
    return _glossaryMap;
  }

  // Walk the top-level glossaryEntries object literal and collect each entry.
  walk(ast, (node) => {
    if (node.type !== 'ObjectExpression') return;
    for (const prop of node.properties) {
      if (prop.type !== 'ObjectProperty' || prop.computed) continue;
      const slug =
        prop.key.type === 'Identifier' ? prop.key.name :
        prop.key.type === 'StringLiteral' ? prop.key.value : null;
      if (!slug || prop.value.type !== 'ObjectExpression') continue;

      const entry = {};
      for (const inner of prop.value.properties) {
        if (inner.type !== 'ObjectProperty' || inner.computed) continue;
        const k =
          inner.key.type === 'Identifier' ? inner.key.name :
          inner.key.type === 'StringLiteral' ? inner.key.value : null;
        if (!k) continue;
        if (['title', 'metaDescription', 'definition'].includes(k)) {
          const v = resolveString(inner.value, new Map());
          if (v !== undefined) entry[k] = v;
        }
      }
      if (entry.title) _glossaryMap.set(slug, entry);
    }
  });

  return _glossaryMap;
}

/**
 * If a file matches `createGlossaryPage(getGlossaryEntry('slug'))`,
 * return extracted meta from glossaryData.ts.
 */
function tryGlossaryFactory(content) {
  const m = content.match(/getGlossaryEntry\(['"]([^'"]+)['"]\)/);
  if (!m) return null;
  const slug = m[1];
  const entry = getGlossaryMap().get(slug);
  if (!entry) return null;

  const title = `${entry.title} | StockFlow Glossary`;
  const description = entry.metaDescription || (entry.definition
    ? truncate160(`${entry.title}: ${entry.definition}`)
    : undefined);
  return { title, description, h1: entry.title };
}

/** First static <h1> literal in a TSX file (skips JSX expressions). */
function extractFirstH1FromSource(content) {
  const match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!match) return undefined;
  if (match[1].includes('{')) return undefined;
  const text = match[1]
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text || undefined;
}

function resolveRouteH1(route, meta, content) {
  if (MANUAL_H1_OVERRIDES[route]) return MANUAL_H1_OVERRIDES[route];
  if (meta.h1) return meta.h1;
  const fromSource = content ? extractFirstH1FromSource(content) : undefined;
  if (fromSource) return fromSource;
  if (meta.title) return stripBrandSuffix(meta.title);
  return undefined;
}

// ---------------------------------------------------------------------------
// Route collection
// ---------------------------------------------------------------------------

function normalizeRoute(slug) {
  const trimmed = String(slug).replace(/^\/+/, '').replace(/\/+$/, '');
  return trimmed ? `/${trimmed}` : '/';
}

const warnings = [];

/** Collect routes from SEO landing pages (src/pages/SEO/**). */
async function collectSeoRoutes() {
  const files = await globby('**/*.tsx', { cwd: SEO_DIR });
  const byRoute = new Map();

  for (const rel of files) {
    const relPosix = rel.replace(/\\/g, '/');
    const withoutExt = relPosix.replace(/\.tsx$/, '');
    if (EXCLUDED_FILES.has(withoutExt)) continue;

    const fullPath = path.join(SEO_DIR, rel);
    const content = fs.readFileSync(fullPath, 'utf8');
    const slug = extractRoutePathFromContent(content, `pages/SEO/${relPosix}`);
    if (!slug) continue;

    const route = normalizeRoute(slug);
    const baseSlug = route.replace(/^\//, '');
    if (SKIP_SLUGS.has(baseSlug) || SKIP_SLUGS.has(baseSlug.split('/').pop())) continue;
    if (byRoute.has(route)) continue; // first file wins, mirrors seoRoutes.tsx

    let meta = {};
    try {
      const ast = parseSource(content);
      const constInit = collectTopLevelConsts(ast);
      const seoOpening = findSeoElement(ast);
      if (seoOpening) {
        meta = extractSeoMeta(seoOpening, constInit);
      } else {
        // Pages using <SeoPageLayout> — extract title/description from layout props.
        const layoutOpening = findSeoPageLayoutElement(ast);
        if (layoutOpening) {
          meta = extractSeoPageLayoutMeta(layoutOpening, constInit, normalizeRoute(slug));
        } else {
          // Glossary factory pages: createGlossaryPage(getGlossaryEntry('slug'))
          const glossaryMeta = tryGlossaryFactory(content);
          if (glossaryMeta) meta = glossaryMeta;
        }
      }
    } catch (err) {
      warnings.push(`AST parse failed for ${relPosix}: ${err.message}`);
    }

    // Belt-and-suspenders thin-template guard (catches raw source patterns).
    if (/heroTitle\s*=\s*["'`][^"'`]*A Technical Framework/.test(content) || /\$\{title/.test(content) || /\$\{topic\}/.test(content)) {
      meta.noindex = true;
    }

    const resolved = { route, ...meta };
    resolved.h1 = resolveRouteH1(route, resolved, content);
    if (!resolved.h1) {
      warnings.push(`No h1 resolved for ${route}`);
    }
    byRoute.set(route, resolved);
  }
  return byRoute;
}

/** Collect routes whose <SEO> lives inline in App.tsx (home + core public pages). */
function collectAppRoutes() {
  const routes = [];
  const content = fs.readFileSync(APP_PATH, 'utf8');
  let ast;
  try {
    ast = parseSource(content);
  } catch (err) {
    warnings.push(`AST parse failed for App.tsx: ${err.message}`);
    return routes;
  }
  const constInit = collectTopLevelConsts(ast);

  walk(ast, (node) => {
    if (node.type !== 'JSXElement') return;
    const opening = node.openingElement;
    if (opening?.name?.type !== 'JSXIdentifier' || opening.name.name !== 'Route') return;

    const pathAttr = opening.attributes.find(
      (a) => a.type === 'JSXAttribute' && a.name?.name === 'path'
    );
    if (!pathAttr || pathAttr.value?.type !== 'StringLiteral') return;
    const routePath = pathAttr.value.value;
    if (!routePath.startsWith('/')) return;
    if (routePath.includes(':') || routePath.includes('*')) return;
    if (PRIVATE_PREFIXES.some((p) => routePath === p || routePath.startsWith(p + '/'))) return;

    const elementAttr = opening.attributes.find(
      (a) => a.type === 'JSXAttribute' && a.name?.name === 'element'
    );
    if (!elementAttr || elementAttr.value?.type !== 'JSXExpressionContainer') return;
    const seoOpening = findSeoElement(elementAttr.value.expression);
    if (!seoOpening) return;

    const route = normalizeRoute(routePath);

    const meta = extractSeoMeta(seoOpening, constInit);
    routes.push({ route, ...meta });
  });

  return routes;
}

// ---------------------------------------------------------------------------
// HTML emission
// ---------------------------------------------------------------------------

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeText(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function absoluteImage(image) {
  if (!image) return DEFAULT_IMAGE;
  if (/^https?:\/\//.test(image)) return image;
  return `${BASE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
}

/** Strip the per-page <head> tags we are going to re-inject from the template. */
function stripManagedTags(html) {
  return html
    .replace(/\s*<title>[\s\S]*?<\/title>/i, '')
    .replace(/\s*<meta\s+name="description"[^>]*>/gi, '')
    .replace(/\s*<meta\s+property="og:[^"]*"[^>]*>/gi, '')
    .replace(/\s*<meta\s+name="twitter:[^"]*"[^>]*>/gi, '')
    .replace(/\s*<link\s+rel="canonical"[^>]*>/gi, '');
}

function buildCrawlH1Block(h1) {
  if (!h1) return '';
  return `<h1 id="crawl-h1" data-crawl-h1="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">${escapeText(h1)}</h1>`;
}

function injectCrawlH1(html, h1) {
  const block = buildCrawlH1Block(h1);
  if (!block) return html;
  const cleaned = html.replace(/<h1[^>]*\bid=["']crawl-h1["'][^>]*>[\s\S]*?<\/h1>\s*/i, '');
  return cleaned.replace(/(<body[^>]*>)/i, `$1\n  ${block}\n`);
}

function buildHeadBlock({ route, title, description, image, noindex, structuredData }) {
  const canonical = `${BASE_URL}${route === '/' ? '' : route}`;
  const t = title || DEFAULT_TITLE;
  const d = description || DEFAULT_DESCRIPTION;
  if (d.length > 160) {
    warnings.push(
      `Meta description for ${route} is ${d.length} chars (max 160): "${d.substring(0, 80)}..."`
    );
  }
  const img = absoluteImage(image);
  const robots = noindex
    ? 'noindex, follow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const lines = [
    `<title data-rh="true">${escapeText(t)}</title>`,
    `<meta data-rh="true" name="description" content="${escapeAttr(d)}" />`,
    `<link data-rh="true" rel="canonical" href="${escapeAttr(canonical)}" />`,
    `<meta data-rh="true" name="robots" content="${robots}" />`,
    `<meta data-rh="true" property="og:type" content="website" />`,
    `<meta data-rh="true" property="og:site_name" content="StockFlow" />`,
    `<meta data-rh="true" property="og:url" content="${escapeAttr(canonical)}" />`,
    `<meta data-rh="true" property="og:title" content="${escapeAttr(t)}" />`,
    `<meta data-rh="true" property="og:description" content="${escapeAttr(d)}" />`,
    `<meta data-rh="true" property="og:image" content="${escapeAttr(img)}" />`,
    `<meta data-rh="true" name="twitter:card" content="summary_large_image" />`,
    `<meta data-rh="true" name="twitter:url" content="${escapeAttr(canonical)}" />`,
    `<meta data-rh="true" name="twitter:title" content="${escapeAttr(t)}" />`,
    `<meta data-rh="true" name="twitter:description" content="${escapeAttr(d)}" />`,
    `<meta data-rh="true" name="twitter:image" content="${escapeAttr(img)}" />`,
  ];

  if (structuredData) {
    const json = JSON.stringify(structuredData).replace(/</g, '\\u003c');
    lines.push(`<script type="application/ld+json">${json}</script>`);
  }

  return lines.map((l) => `    ${l}`).join('\n');
}

function emitRoute(template, meta) {
  const stripped = stripManagedTags(template);
  const headBlock = buildHeadBlock(meta);
  const withHead = stripped.replace(/<\/head>/i, `${headBlock}\n  </head>`);
  const html = injectCrawlH1(withHead, meta.h1);

  const outDir = meta.route === '/' ? DIST : path.join(DIST, meta.route.replace(/^\//, ''));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`[generate-seo-html] dist/index.html not found — run vite build first.`);
    process.exit(1);
  }
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  const byRoute = await collectSeoRoutes();

  // App.tsx inline routes (home + core public pages). These take precedence
  // over any SEO-dir collision (e.g. the homepage).
  for (const r of collectAppRoutes()) {
    const resolved = {
      ...r,
      h1: resolveRouteH1(r.route, r),
    };
    if (!resolved.h1) {
      warnings.push(`No h1 resolved for ${r.route}`);
    }
    byRoute.set(r.route, resolved);
  }

  // Manual fallbacks (self-canonical for pages without extractable meta).
  for (const r of MANUAL_ROUTES) {
    if (!byRoute.has(r.route)) {
      byRoute.set(r.route, { ...r, h1: r.h1 || resolveRouteH1(r.route, r) });
    }
  }

  const routes = [...byRoute.values()].sort((a, b) => a.route.localeCompare(b.route));

  let missingMeta = 0;
  let missingH1 = 0;
  for (const meta of routes) {
    if (!meta.title || !meta.description) {
      missingMeta++;
      warnings.push(`No ${!meta.title ? 'title' : ''}${!meta.title && !meta.description ? '/' : ''}${!meta.description ? 'description' : ''} for ${meta.route} (using defaults)`);
    }
    if (!meta.h1) {
      missingH1++;
    }
    emitRoute(template, meta);
  }

  console.log(`[generate-seo-html] Emitted ${routes.length} per-route HTML files into dist/.`);
  console.log(`[generate-seo-html] ${routes.length - missingMeta} with extracted title+description, ${missingMeta} using defaults.`);
  console.log(`[generate-seo-html] ${routes.length - missingH1} with crawl <h1>, ${missingH1} without.`);
  if (warnings.length) {
    console.log(`[generate-seo-html] ${warnings.length} warning(s):`);
    for (const w of warnings.slice(0, 40)) console.log(`  - ${w}`);
    if (warnings.length > 40) console.log(`  …and ${warnings.length - 40} more.`);
  }
}

main().catch((err) => {
  console.error('[generate-seo-html] Failed:', err);
  process.exit(1);
});
