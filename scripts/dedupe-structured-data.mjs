#!/usr/bin/env node
/**
 * Remove duplicate <StructuredData> when the same file passes structuredData to <SEO>.
 */
import fs from 'fs';
import path from 'path';
import { globby } from 'globby';

const SEO_DIR = path.join(process.cwd(), 'src/pages/SEO');

async function main() {
  const files = await globby('**/*.tsx', { cwd: SEO_DIR });
  let updated = 0;

  for (const file of files) {
    const fullPath = path.join(SEO_DIR, file);
    let content = fs.readFileSync(fullPath, 'utf-8');

    if (!content.includes('StructuredData') || !content.includes('structuredData')) {
      continue;
    }

    const original = content;

    content = content.replace(
      /\s*<StructuredData\s+data=\{[^}]+\}\s*\/>\s*\n?/g,
      '\n'
    );

    if (content !== original) {
      if (
        content.includes("from '@/components/StructuredData'") ||
        content.includes('from "@/components/StructuredData"')
      ) {
        if (!content.includes('<StructuredData')) {
          content = content
            .replace(
              /import\s+\{\s*StructuredData\s*\}\s+from\s+['"]@\/components\/StructuredData['"];\s*\n/g,
              ''
            )
            .replace(
              /import\s+StructuredData\s+from\s+['"]@\/components\/StructuredData['"];\s*\n/g,
              ''
            );
        }
      }
      fs.writeFileSync(fullPath, content);
      updated += 1;
      console.log(`Deduped: ${file}`);
    }
  }

  console.log(`\nRemoved duplicate StructuredData from ${updated} file(s).`);
}

main().catch(console.error);
