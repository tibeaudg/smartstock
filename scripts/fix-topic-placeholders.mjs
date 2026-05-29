#!/usr/bin/env node
/**
 * Replace literal ${topic} (and ${title}) placeholders in SEO page sources
 * with the topic derived from heroTitle or the page slug.
 */
import fs from 'fs';
import path from 'path';
import { globby } from 'globby';
import { getSlugFromSeoFile } from './utils/seo-slug.mjs';

const SEO_DIR = path.join(process.cwd(), 'src/pages/SEO');

function stripBrandSuffix(title) {
  return title
    .replace(/\s*\|\s*StockFlow\s*$/i, '')
    .replace(/\s*Strategy\s*&\s*Automation\s*Guide\s*$/i, '')
    .replace(/\s*Guide\s*$/i, '')
    .replace(/\s*-\s*A Technical Framework\s*$/i, '')
    .replace(/\s*:\s*A Technical Framework\s*$/i, '')
    .replace(/^Advancing Enterprise\s+/i, '')
    .trim();
}

function slugToTopic(slug) {
  const base = slug.split('/').pop() ?? slug;
  return base.replace(/-/g, ' ').toLowerCase();
}

function resolveConst(content, varName) {
  const re = new RegExp(`const\\s+${varName}\\s*=\\s*["']([^"']+)["']`, 'm');
  return content.match(re)?.[1] ?? null;
}

function extractHeroTitle(content) {
  const literal = content.match(/heroTitle=["']([^"']+)["']/);
  if (literal) return literal[1];

  const expr = content.match(/heroTitle=\{(\w+)\}/);
  if (expr) return resolveConst(content, expr[1]);

  const titleLiteral = content.match(/\btitle=["']([^"']+)["']/);
  if (titleLiteral) return titleLiteral[1];

  const titleExpr = content.match(/\btitle=\{(\w+)\}/);
  if (titleExpr) return resolveConst(content, titleExpr[1]);

  return null;
}

function deriveTopic(content, file) {
  const heroTitle = extractHeroTitle(content);
  if (heroTitle) {
    return stripBrandSuffix(heroTitle).toLowerCase();
  }
  const slug = getSlugFromSeoFile(file);
  return slugToTopic(slug);
}

async function main() {
  const files = await globby('**/*.tsx', {
    cwd: SEO_DIR,
    ignore: ['**/createGlossaryPage.tsx'],
  });

  let fixed = 0;

  for (const file of files) {
    const fullPath = path.join(SEO_DIR, file);
    let content = fs.readFileSync(fullPath, 'utf-8');

    if (!content.includes('${topic}') && !content.includes('${title')) continue;

    const topic = deriveTopic(content, file);
    const updated = content
      .replace(/\$\{title\.toLowerCase\(\)\}/g, topic)
      .replace(/\$\{title\}/g, topic)
      .replace(/\$\{topic\}/g, topic)
      .replace(/: a technical framework/g, '');

    if (updated !== content) {
      fs.writeFileSync(fullPath, updated);
      fixed += 1;
      console.log(`Fixed: ${file} → "${topic}"`);
    }
  }

  console.log(`\nUpdated ${fixed} file(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
