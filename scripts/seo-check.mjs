#!/usr/bin/env node
/**
 * CI-friendly SEO audit for SEO page sources.
 * Usage: node scripts/seo-check.mjs
 */
import fs from 'fs';
import path from 'path';
import { globby } from 'globby';
import { getSlugFromSeoFile } from './utils/seo-slug.mjs';

const SEO_DIR = path.join(process.cwd(), 'src/pages/SEO');
const APP_PATH = path.join(process.cwd(), 'src/App.tsx');
const META_DESCRIPTION_MAX = 160;

let errors = 0;
let warnings = 0;

function error(msg) {
  console.error(`ERROR: ${msg}`);
  errors += 1;
}

function warn(msg) {
  console.warn(`WARN: ${msg}`);
  warnings += 1;
}

function resolveConst(content, varName) {
  const re = new RegExp(`const\\s+${varName}\\s*=\\s*["']([^"']+)["']`, 'm');
  return content.match(re)?.[1] ?? null;
}

function extractStringProp(content, propName) {
  const literal = new RegExp(`${propName}=["']([^"']+)["']`, 'm');
  const literalMatch = content.match(literal);
  if (literalMatch) return literalMatch[1];

  const expr = new RegExp(`${propName}=\\{([\\w]+)\\}`, 'm');
  const exprMatch = content.match(expr);
  if (exprMatch) {
    const resolved = resolveConst(content, exprMatch[1]);
    if (resolved) return resolved;
  }

  return null;
}

function extractHeroTitle(content) {
  return extractStringProp(content, 'heroTitle');
}

function extractSeoComponentDescription(content) {
  const literal = content.match(/<SEO[\s\S]*?\bdescription=["']([^"']+)["']/);
  if (literal) return literal[1];

  const expr = content.match(/<SEO[\s\S]*?\bdescription=\{([\w]+)\}/);
  if (expr) return resolveConst(content, expr[1]);

  return null;
}

function extractHeaderPublicDescription(content) {
  const literal = content.match(/<HeaderPublic[\s\S]*?\bdescription=["']([^"']+)["']/);
  if (literal) return literal[1];

  const expr = content.match(/<HeaderPublic[\s\S]*?\bdescription=\{([\w]+)\}/);
  if (expr) return resolveConst(content, expr[1]);

  return null;
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
  return candidate.length <= 60 ? candidate : `${candidate.substring(0, 57)}...`;
}

function hasSeoMeta(content) {
  const seoDesc = extractStringProp(content, 'seoDescription');
  const heroDesc = extractStringProp(content, 'heroDescription');
  const heroTitle = extractHeroTitle(content);
  const title = extractStringProp(content, 'title');
  const seoComponentDesc = extractSeoComponentDescription(content);
  const headerDesc = extractHeaderPublicDescription(content);

  return Boolean(seoDesc || heroDesc || heroTitle || title || seoComponentDesc || headerDesc);
}

/** Resolve the meta description a page will emit (mirrors SeoPageLayout + nested SEO precedence). */
function extractEffectiveMetaDescription(content) {
  const seoDesc = extractStringProp(content, 'seoDescription');
  const seoComponentDesc = extractSeoComponentDescription(content);
  const heroDesc = extractStringProp(content, 'heroDescription');
  const headerDesc = extractHeaderPublicDescription(content);
  const metaDesc =
    resolveConst(content, 'metaDescription') ||
    resolveConst(content, 'pageDescription') ||
    resolveConst(content, 'PAGE_DESCRIPTION') ||
    resolveConst(content, 'PAGE_META_DESCRIPTION');

  return seoDesc || seoComponentDesc || heroDesc || headerDesc || metaDesc || null;
}

function checkDescriptionLength(label, description) {
  if (!description || description.length <= META_DESCRIPTION_MAX) return;
  error(
    `${label}: meta description is ${description.length} chars (max ${META_DESCRIPTION_MAX}): "${description.substring(0, 80)}..."`
  );
}

function checkAppRouteDescriptions() {
  if (!fs.existsSync(APP_PATH)) return;
  const content = fs.readFileSync(APP_PATH, 'utf-8');
  const routePattern = /<Route\s+path="([^"]+)"[^>]*element=\{[\s\S]*?<SEO[\s\S]*?\bdescription="([^"]+)"/g;
  let match;
  while ((match = routePattern.exec(content)) !== null) {
    const [, routePath, description] = match;
    checkDescriptionLength(`App.tsx route ${routePath}`, description);
  }
}

async function main() {
  checkAppRouteDescriptions();

  const files = await globby('**/*.{tsx,ts}', {
    cwd: SEO_DIR,
    ignore: ['**/createGlossaryPage.tsx'],
  });

  const descriptions = new Map();
  const slugs = new Set();

  for (const file of files) {
    const fullPath = path.join(SEO_DIR, file);
    const content = fs.readFileSync(fullPath, 'utf-8');

    if (content.includes('${title')) {
      error(`${file}: contains literal \${title} placeholder in source`);
    }
    if (content.includes('${topic}')) {
      warn(`${file}: contains \${topic} placeholder (noindex until rewritten)`);
    }

    const slug = getSlugFromSeoFile(file);

    if (slug && slugs.has(slug)) {
      warn(`Duplicate route slug "${slug}" from ${file}`);
    }
    if (slug) slugs.add(slug);

    if (!content.includes('SeoPageLayout') && !content.includes('HeaderPublic')) continue;

    if (content.includes('SeoPageLayout') && !hasSeoMeta(content)) {
      warn(`${file}: SeoPageLayout without seoDescription, heroDescription, or heroTitle`);
    }

    const effectiveDesc = extractEffectiveMetaDescription(content);
    if (effectiveDesc) {
      checkDescriptionLength(file, effectiveDesc);
    }

    const seoDesc =
      extractStringProp(content, 'seoDescription') ||
      extractStringProp(content, 'heroDescription') ||
      extractSeoComponentDescription(content) ||
      extractHeaderPublicDescription(content);
    const heroTitle = extractHeroTitle(content) || extractStringProp(content, 'title');

    const descKey = seoDesc || (heroTitle ? `auto:${heroTitle}` : null);
    if (descKey) {
      const list = descriptions.get(descKey) ?? [];
      list.push(file);
      descriptions.set(descKey, list);
    }

    const titleMatch = content.match(/\btitle=["']([^"']+)["']/);
    if (titleMatch) {
      const effectiveTitle = content.includes('SeoPageLayout')
        ? shortenSeoTitle(titleMatch[1])
        : titleMatch[1];
      if (effectiveTitle.length > 60) {
        warn(`${file}: title may exceed 60 chars (${effectiveTitle.length})`);
      }
    }
  }

  for (const [desc, filesWithDesc] of descriptions) {
    if (desc.startsWith('auto:')) continue;
    if (filesWithDesc.length > 3 && !desc.includes('StockFlow')) {
      warn(
        `Duplicate meta description used on ${filesWithDesc.length} pages: "${desc.substring(0, 60)}..."`
      );
    }
  }

  console.log(
    `\nSEO check complete: ${errors} error(s), ${warnings} warning(s), ${files.length} files scanned.`
  );

  if (errors > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
