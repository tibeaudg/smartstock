import fs from 'fs';
import path from 'path';

const rootDir = path.join('src', 'pages', 'SEO');
const urlsFile = 'scripts/sortly-urls.txt';

const files = [];

const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
      files.push({
        rel: path.relative(rootDir, fullPath),
        base: path.basename(entry.name, '.tsx'),
      });
    }
  }
};

walk(rootDir);

const fileMap = new Map(files.map((f) => [f.base, f.rel]));

const content = fs.readFileSync(urlsFile, 'utf8').trim().split(/\r?\n/);

const results = content
  .filter((line) => line.trim())
  .map((line) => {
    const [url] = line.split('\t');
    const slug = url.replace(/^https?:\/\/[^/]+\/blog\/?/, '').replace(/\/$/, '');
    const targetSlug = slug || 'blog-index';
    const match = [...fileMap.entries()].find(([base]) => base === targetSlug);
    return {
      url,
      slug: targetSlug,
      exists: Boolean(match),
      path: match ? match[1] : null,
    };
  });

const missing = results.filter((r) => !r.exists);

console.log(`Total URLs: ${results.length}`);
console.log(`Existing: ${results.length - missing.length}`);
console.log(`Missing: ${missing.length}`);

fs.writeFileSync('scripts/sortly-missing.json', JSON.stringify(missing, null, 2));
fs.writeFileSync('scripts/sortly-results.json', JSON.stringify(results, null, 2));

