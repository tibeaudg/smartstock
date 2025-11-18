import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const LEGACY_TOP_LEVEL_SLUGS = new Set([
  'asset-tracking',
  'inventory-management',
  'what-is-lead-time',
  'warehouse-management',
  'warehouse-management-system',
]);

/**
 * Get slug from file path (matching logic from seoRoutes.tsx)
 * @param {string} filePath - Full file path
 * @returns {string|null} - URL slug or null
 */
export function getSlugFromPath(filePath) {
  const relative = path
    .relative(path.join(repoRoot, 'src', 'pages'), filePath)
    .replace(/\\/g, '/')
    .replace(/^(SEO|seo)\//, '')
    .replace(/index\.tsx$/i, '')
    .replace(/\.tsx$/, '')
    .replace(/\/+$/, '');

  if (!relative || relative === '.') {
    return null;
  }

  const segments = relative.split('/').filter(Boolean);
  
  if (segments.length === 0) {
    return null;
  }

  const lastSegment = segments[segments.length - 1];
  if (lastSegment === 'index') {
    segments.pop();
  }

  if (segments.length === 0) {
    return null;
  }

  if (segments[0] === 'glossary') {
    if (segments.length === 1) {
      return 'glossary';
    }
    if (segments.length === 2 && LEGACY_TOP_LEVEL_SLUGS.has(segments[1])) {
      return segments[1];
    }
    return segments.join('/');
  }

  return segments[segments.length - 1];
}

/**
 * Collect all SEO page files recursively
 * @param {string} dirPath - Directory to scan
 * @returns {Array<string>} - Array of file paths
 */
export function collectSeoPageFiles(dirPath = path.join(repoRoot, 'src', 'pages', 'SEO')) {
  const pages = [];
  
  if (!fs.existsSync(dirPath)) {
    return pages;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    // Skip certain directories
    if (entry.isDirectory() && entry.name === 'utils') {
      continue;
    }
    
    if (entry.isDirectory()) {
      const childPages = collectSeoPageFiles(path.join(dirPath, entry.name));
      pages.push(...childPages);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith('.tsx')) {
      continue;
    }

    // Skip certain files
    if (entry.name.includes('SEOPAGETEMPLATE') || 
        entry.name.includes('PageResults') ||
        entry.name.includes('SearchResults')) {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);
    pages.push(fullPath);
  }

  return pages;
}

/**
 * Extract SEO component props from file content
 * @param {string} content - File content
 * @returns {{title: string|null, description: string|null, keywords: string|null, url: string|null}}
 */
export function extractSEOProps(content) {
  const result = {
    title: null,
    description: null,
    keywords: null,
    url: null
  };

  // Match title="..." or title={`...`}
  const titleMatch = content.match(/<SEO\s+[^>]*title\s*=\s*{?["'`]([^"'`]+)["'`]}?/);
  if (titleMatch) {
    result.title = titleMatch[1];
  }

  // Match description="..." or description={`...`}
  const descMatch = content.match(/<SEO\s+[^>]*description\s*=\s*{?["'`]([^"'`]+)["'`]}?/);
  if (descMatch) {
    result.description = descMatch[1];
  }

  // Match keywords="..." or keywords={`...`}
  const keywordsMatch = content.match(/<SEO\s+[^>]*keywords\s*=\s*{?["'`]([^"'`]+)["'`]}?/);
  if (keywordsMatch) {
    result.keywords = keywordsMatch[1];
  }

  // Match url="..." or url={`...`}
  const urlMatch = content.match(/<SEO\s+[^>]*url\s*=\s*{?["'`]([^"'`]+)["'`]}?/);
  if (urlMatch) {
    result.url = urlMatch[1];
  }

  return result;
}

/**
 * Extract H1 tag from content
 * @param {string} content - File content
 * @returns {string|null} - H1 text content
 */
export function extractH1(content) {
  // Match <h1>...</h1> or <h1 className="...">...</h1>
  const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/s);
  if (h1Match) {
    // Remove JSX/React elements from content
    let h1Text = h1Match[1]
      .replace(/<[^>]+>/g, '') // Remove tags
      .replace(/\{.*?\}/g, '') // Remove JSX expressions
      .trim();
    return h1Text || null;
  }
  return null;
}

/**
 * Extract all headings from content
 * @param {string} content - File content
 * @returns {Array<{level: number, text: string, line: number}>}
 */
export function extractHeadings(content) {
  const headings = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // Match h1-h6 tags
    const headingMatch = line.match(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/);
    if (headingMatch) {
      const level = parseInt(headingMatch[1]);
      let text = headingMatch[2]
        .replace(/<[^>]+>/g, '')
        .replace(/\{.*?\}/g, '')
        .trim();
      
      if (text) {
        headings.push({
          level,
          text,
          line: index + 1
        });
      }
    }
  });
  
  return headings;
}

/**
 * Extract internal links from content
 * @param {string} content - File content
 * @returns {Array<{to: string, text: string}>}
 */
export function extractInternalLinks(content) {
  const links = [];
  
  // Match <Link to="/..."> or <Link to={...}>
  const linkMatches = content.matchAll(/<Link\s+to\s*=\s*{?["']([^"']+)["']}?[^>]*>(.*?)<\/Link>/gs);
  
  for (const match of linkMatches) {
    const to = match[1];
    let text = match[2]
      .replace(/<[^>]+>/g, '')
      .replace(/\{.*?\}/g, '')
      .trim();
    
    // Only include internal links (starting with /)
    if (to.startsWith('/')) {
      links.push({ to, text });
    }
  }
  
  return links;
}

/**
 * Update SEO component props in content
 * @param {string} content - Original file content
 * @param {{title?: string, description?: string, keywords?: string, url?: string}} updates
 * @returns {string} - Updated content
 */
export function updateSEOProps(content, updates) {
  let updated = content;
  
  if (updates.title !== undefined) {
    // Replace title prop
    updated = updated.replace(
      /(<SEO\s+[^>]*title\s*=\s*{?["'`])[^"'`]+(["'`]}?)/,
      `$1${updates.title}$2`
    );
  }
  
  if (updates.description !== undefined) {
    // Replace description prop
    updated = updated.replace(
      /(<SEO\s+[^>]*description\s*=\s*{?["'`])[^"'`]+(["'`]}?)/,
      `$1${updates.description}$2`
    );
  }
  
  if (updates.keywords !== undefined) {
    // Replace keywords prop (may not exist)
    if (updated.includes('keywords=')) {
      updated = updated.replace(
        /(<SEO\s+[^>]*keywords\s*=\s*{?["'`])[^"'`]+(["'`]}?)/,
        `$1${updates.keywords}$2`
      );
    }
  }
  
  if (updates.url !== undefined) {
    // Replace url prop
    if (updated.includes('url=')) {
      updated = updated.replace(
        /(<SEO\s+[^>]*url\s*=\s*{?["'`])[^"'`]+(["'`]}?)/,
        `$1${updates.url}$2`
      );
    }
  }
  
  return updated;
}

/**
 * Generate primary keyword from filename
 * @param {string} filename - File name (e.g., "free-inventory-management.tsx")
 * @returns {string} - Primary keyword (e.g., "free inventory management")
 */
export function generatePrimaryKeyword(filename) {
  const withoutExt = filename.replace(/\.tsx$/, '');
  const words = withoutExt.split('-').filter(Boolean);
  
  // Capitalize first letter of each word and join
  return words.map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

