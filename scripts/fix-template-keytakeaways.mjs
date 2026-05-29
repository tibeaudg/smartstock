#!/usr/bin/env node
/**
 * Fix literal ${title} placeholders in SEO template page key takeaways.
 */
import fs from 'fs';
import path from 'path';
import { globby } from 'globby';

const SEO_DIR = path.join(process.cwd(), 'src/pages/SEO');

async function main() {
  const files = await globby('**/*.tsx', { cwd: SEO_DIR });
  let fixed = 0;

  for (const file of files) {
    const fullPath = path.join(SEO_DIR, file);
    let content = fs.readFileSync(fullPath, 'utf-8');

    if (!content.includes('${title')) continue;

    const updated = content.replace(
      /\$\{title\.toLowerCase\(\)\}/g,
      '${topic}'
    ).replace(
      /\$\{title\}/g,
      '${topic}'
    );

    if (updated !== content) {
      fs.writeFileSync(fullPath, updated);
      fixed += 1;
      console.log(`Fixed: ${file}`);
    }
  }

  console.log(`\nUpdated ${fixed} file(s). Runtime normalization in SeoPageLayout also applies.`);
}

main().catch(console.error);
