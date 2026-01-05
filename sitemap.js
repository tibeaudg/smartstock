import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_URL = 'https://yourdomain.com'; // Change this to your actual domain
const TARGET_DIR = path.join(__dirname, 'src', 'pages');
const OUTPUT_FILE = path.join(__dirname, 'public', 'sitemap.xml');

/**
 * Traverses directory to find all valid page files
 */
function getPageFiles(dir, fileList = []) {
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      getPageFiles(fullPath, fileList);
    } else {
      // Filter for web-compatible files and exclude private/system files
      if (
        (item.endsWith('.tsx') || item.endsWith('.js')) &&
        !item.startsWith('_') && 
        !item.startsWith('[') &&
        !item.includes('api')
      ) {
        fileList.push(fullPath);
      }
    }
  });

  return fileList;
}

/**
 * Converts system paths into URL slugs
 */
function generateSlug(filePath) {
  let slug = filePath
    .replace(TARGET_DIR, '')
    .replace(/\\/g, '/') // Handle Windows paths
    .replace(/\.(tsx|js)$/, '')
    .replace(/\/index$/, ''); // Convert /index to root

  return slug === '' ? '/' : slug;
}

try {
  const files = getPageFiles(TARGET_DIR);
  const lastMod = new Date().toISOString().split('T')[0];

  const sitemapEntries = files
    .map((file) => {
      const slug = generateSlug(file);
      return `  <url>
    <loc>${BASE_URL}${slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <priority>${slug === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
    })
    .join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>`;

  // Ensure public directory exists
  const publicDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.writeFileSync(OUTPUT_FILE, sitemapXml, 'utf8');
} catch (err) {
  process.stderr.write(`Sitemap generation failed: ${err.message}\n`);
}