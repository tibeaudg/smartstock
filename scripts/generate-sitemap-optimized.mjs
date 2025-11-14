import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const BASE_URL = process.env.SITE_URL?.replace(/\/$/, '') || 'https://www.stockflow.be';
const SEO_PAGES_DIRS = [
  path.join(repoRoot, 'src', 'pages', 'SEO'),
  path.join(repoRoot, 'src', 'pages', 'seo'),
];
const BLOG_JSON_FALLBACK = path.join(repoRoot, 'src', 'lib', 'blogposts.json');
const OUTPUT_SITEMAP = path.join(repoRoot, 'public', 'sitemap.xml');

// Read actual SEO page routes
function collectRoutesFromDir(dirPath, baseDir = dirPath) {
  const routes = [];
  if (!fs.existsSync(dirPath)) {
    return routes;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const childRoutes = collectRoutesFromDir(
        path.join(dirPath, entry.name),
        baseDir
      );
      routes.push(...childRoutes);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith('.tsx')) {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);
    const relative = path
      .relative(baseDir, fullPath)
      .replace(/\\/g, '/')
      .replace(/index\.tsx$/i, '')
      .replace(/\.tsx$/, '')
      .replace(/\/+$/, '');

    if (!relative || relative === '.') {
      // Skip empty slugs that could occur if an index.tsx is at root
      continue;
    }

    routes.push(`/${relative}`);
  }

  return routes;
}

function readSeoRoutes() {
  const collected = SEO_PAGES_DIRS
    .flatMap((dir) => collectRoutesFromDir(dir))
    // Guard against case-insensitive filesystems returning duplicates
    .reduce((acc, route) => {
      acc.add(route);
      return acc;
    }, new Set());

  return Array.from(collected).sort();
}

// Read blog posts from Supabase or JSON fallback
async function readBlogPosts() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  // Try Supabase first (only if environment variables are available)
  if (supabaseUrl && supabaseAnonKey) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await supabase
        .from('blogposts')
        .select('slug,date_published,published')
        .eq('published', true)
        .order('date_published', { ascending: false });
      if (error) throw error;
      return (data || []).map((p) => ({ 
        slug: p.slug, 
        date_published: p.date_published 
      }));
    } catch (e) {
      console.warn('Supabase fetch failed, using JSON fallback:', e.message);
    }
  } else {
    console.log('Supabase environment variables not available, using JSON fallback');
  }

  // JSON fallback
  try {
    const json = JSON.parse(fs.readFileSync(BLOG_JSON_FALLBACK, 'utf8'));
    return (Array.isArray(json) ? json : [])
      .filter((p) => p.published)
      .map((p) => ({ 
        slug: p.slug, 
        date_published: p.datePublished || p.date_published 
      }));
  } catch (e) {
    console.warn('JSON fallback failed:', e.message);
    return [];
  }
}

// XML escape helper
function xmlEscape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Build URL tag with minimal data (just loc and lastmod for indexing)
function buildUrlTag(loc, lastmod) {
  const parts = [
    '  <url>',
    `    <loc>${xmlEscape(loc)}</loc>`,
  ];
  if (lastmod) {
    parts.push(`    <lastmod>${new Date(lastmod).toISOString()}</lastmod>`);
  }
  parts.push('  </url>');
  return parts.join('\n');
}

async function generateOptimizedSitemap() {
  const today = new Date().toISOString();
  
  // Define all public static routes
  const staticRoutes = [
    '/',              // Homepage
    '/nl',            // Dutch homepage
    '/features',      // Features page
    '/pricing',       // Pricing page
    '/nl/pricing',    // Dutch pricing page
    '/auth',          // Auth landing
    '/integrations',
    '/mobile-app',
    '/seo',
    '/contact',
    '/privacy-policy',
    '/terms-conditions',
    '/checkout',
    '/blog',          // Blog index
  ];

  const urls = [];

  // Add static routes
  for (const route of staticRoutes) {
    urls.push({
      loc: `${BASE_URL}${route}`,
      lastmod: today,
    });
  }

  // Add SEO pages (all the keyword-focused landing pages)
  const seoRoutes = readSeoRoutes();
  for (const route of seoRoutes) {
    // Skip pages already included in static routes
    if (staticRoutes.includes(route)) {
      continue;
    }
    
    urls.push({
      loc: `${BASE_URL}${route}`,
      lastmod: today,
    });
  }

  // Add blog posts
  const blogPosts = await readBlogPosts();
  for (const post of blogPosts) {
    urls.push({
      loc: `${BASE_URL}/blog/${post.slug}`,
      lastmod: post.date_published || today,
    });
  }

  // Deduplicate by URL
  const uniqueUrls = Array.from(
    new Map(urls.map((entry) => [entry.loc, entry])).values()
  );

  // Sort alphabetically by URL for consistent output
  uniqueUrls.sort((a, b) => a.loc.localeCompare(b.loc));

  // Build sitemap XML
  const sitemapXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...uniqueUrls.map((u) => buildUrlTag(u.loc, u.lastmod)),
    '</urlset>',
  ].join('\n');

  // Write single sitemap.xml file
  fs.writeFileSync(OUTPUT_SITEMAP, sitemapXml + '\n', 'utf8');

  console.log(`✅ Sitemap generated`);
  console.log(`   - Total URLs: ${uniqueUrls.length}`);
  console.log(`   - Output: ${OUTPUT_SITEMAP}`);
  
  return uniqueUrls;
}

// Generate robots.txt
function generateRobotsTxt() {
  const robotsContent = [
    '# Robots.txt for StockFlow',
    'User-agent: *',
    'Allow: /',
    '',
    '# Disallow authenticated pages',
    'Disallow: /dashboard',
    'Disallow: /dashboard/*',
    'Disallow: /auth',
    'Disallow: /checkout',
    'Disallow: /admin',
    'Disallow: /admin/*',
    '',
    '# Sitemaps',
    `Sitemap: ${BASE_URL}/sitemap.xml`,
    '',
  ].join('\n');

  fs.writeFileSync(path.join(repoRoot, 'public', 'robots.txt'), robotsContent, 'utf8');
  console.log('✅ Robots.txt generated');
}

// Main execution
generateOptimizedSitemap()
  .then((urls) => {
    generateRobotsTxt();
    console.log('\n🎉 Sitemap generation complete!');
    console.log(`📊 Total URLs: ${urls.length}`);
    console.log(`🔗 View at: ${BASE_URL}/sitemap.xml`);
  })
  .catch((err) => {
    console.error('❌ Failed to generate sitemap:', err);
    process.exit(1);
  });
