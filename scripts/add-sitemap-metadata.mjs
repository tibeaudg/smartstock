import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sitemapPath = join(__dirname, '../public/sitemap.xml');
let sitemap = readFileSync(sitemapPath, 'utf-8');

// Get current date
const today = new Date().toISOString().split('T')[0];

// Function to determine metadata based on URL
function getUrlMetadata(path) {
  if (path === '/') {
    return { priority: '1.0', changefreq: 'daily' };
  }
  
  const importantPages = ['/pricing', '/features', '/contact', '/case-studies'];
  if (importantPages.includes(path)) {
    return { priority: '0.9', changefreq: 'weekly' };
  }
  
  if (path === '/blog') {
    return { priority: '0.8', changefreq: 'weekly' };
  }
  
  if (path.startsWith('/solutions/')) {
    return { priority: '0.8', changefreq: 'weekly' };
  }
  
  if (path.startsWith('/glossary')) {
    return { priority: '0.7', changefreq: 'monthly' };
  }
  
  // Blog posts and articles
  const pathSegments = path.split('/').filter(Boolean);
  if (pathSegments.length === 1 && !path.startsWith('/solutions') && 
      !path.startsWith('/glossary') && path !== '/' && 
      !importantPages.includes(path)) {
    return { priority: '0.7', changefreq: 'monthly' };
  }
  
  // Industry pages
  return { priority: '0.8', changefreq: 'weekly' };
}

// Add metadata to URLs that don't have it
sitemap = sitemap.replace(
  /<url>\s*<loc>(https:\/\/www\.stockflow\.be[^<]+)<\/loc>\s*(?!<lastmod>)<\/url>/g,
  (match, url) => {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const metadata = getUrlMetadata(path);
    
    return `<url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${metadata.changefreq}</changefreq>
    <priority>${metadata.priority}</priority>
  </url>`;
  }
);

// Fix URLs that have inconsistent spacing in loc tags
sitemap = sitemap.replace(/<loc>\s+(https:\/\/[^<]+)\s+<\/loc>/g, '<loc>$1</loc>');

writeFileSync(sitemapPath, sitemap, 'utf-8');
console.log('✅ Added metadata to sitemap URLs');






