import fs from 'fs';
import path from 'path';
import { globby } from 'globby';

const PAGES_DIR = path.join(process.cwd(), 'src/pages');
const SEO_DIR = path.join(process.cwd(), 'src/pages/seo');
const BASE_URL = 'https://www.stockflowsystems.com';

async function checkInternalLinks() {
  console.log('--- Starting Internal Link Audit ---');

  // 1. Build a map of all valid internal routes
  const allFiles = await globby('**/*.{js,jsx,ts,tsx}', { cwd: PAGES_DIR });
  const validRoutes = new Set(
    allFiles.map(file => {
      let route = file
        .replace(/\.(js|jsx|ts|tsx)$/, '')
        .replace(/\/index$/, '')
        .replace(/^seo\//, ''); // Because your SEO files are served at root
      return route === 'index' ? '/' : `/${route}`;
    })
  );

  // 2. Scan SEO files for links
  const seoFiles = await globby('**/*.{js,jsx,ts,tsx}', { cwd: SEO_DIR });
  let brokenCount = 0;

  for (const file of seoFiles) {
    const filePath = path.join(SEO_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Regex to find href="/path" or href={'/path'}
    const linkRegex = /href=["'](\/[^"']+)["']|href=\{["'](\/[^"']+)["']\}/g;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      const link = match[1] || match[2];
      
      // Skip external links, anchors, and dynamic segments
      if (link.startsWith('http') || link.includes('#') || link.includes('[')) continue;

      if (!validRoutes.has(link)) {
        console.warn(`[BROKEN LINK] in ${file}: Destination "${link}" does not exist.`);
        brokenCount++;
      }
    }
  }

  if (brokenCount === 0) {
    console.log('✅ No broken internal links found in SEO pages.');
  } else {
    console.log(`\nFound ${brokenCount} broken links. Please fix these before deploying.`);
  }
}

checkInternalLinks().catch(console.error);