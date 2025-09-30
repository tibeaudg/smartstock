import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const BASE_URL = process.env.SITE_URL?.replace(/\/$/, '') || 'https://www.stockflow.be';
const SEO_PAGES_DIR = path.join(repoRoot, 'src', 'pages', 'SEO');
const BLOG_JSON_FALLBACK = path.join(repoRoot, 'src', 'lib', 'blogposts.json');
const OUTPUT_SITEMAP = path.join(repoRoot, 'public', 'sitemap.xml');
const OUTPUT_SITEMAP_INDEX = path.join(repoRoot, 'public', 'sitemap-index.xml');

// Read actual SEO page routes
function readSeoRoutes() {
  try {
    const entries = fs.readdirSync(SEO_PAGES_DIR, { withFileTypes: true });
    const routes = entries
      .filter((e) => e.isFile() && e.name.endsWith('.tsx'))
      .map((e) => `/${e.name.replace(/\.tsx$/, '')}`)
      .sort();
    return routes;
  } catch (err) {
    console.error('Error reading SEO routes:', err);
    return [];
  }
}

// Read blog posts from Supabase or JSON fallback
async function readBlogPosts() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  // Try Supabase first
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
  } catch {
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

// Build URL tag with proper SEO attributes
function buildUrlTag(loc, lastmod, changefreq = 'weekly', priority = '0.8') {
  const parts = [
    '  <url>',
    `    <loc>${xmlEscape(loc)}</loc>`,
  ];
  if (lastmod) {
    parts.push(`    <lastmod>${new Date(lastmod).toISOString()}</lastmod>`);
  }
  parts.push(`    <changefreq>${changefreq}</changefreq>`);
  parts.push(`    <priority>${priority}</priority>`);
  parts.push('  </url>');
  return parts.join('\n');
}

async function generateOptimizedSitemap() {
  const today = new Date().toISOString();
  
  // Define all public static routes with their priorities and change frequencies
  const staticRoutes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },          // Homepage
    { path: '/features', priority: '0.9', changefreq: 'weekly' }, // Features page
    { path: '/pricing', priority: '0.9', changefreq: 'weekly' },  // Pricing page
    { path: '/demo', priority: '0.8', changefreq: 'monthly' },    // Demo page
    { path: '/contact', priority: '0.7', changefreq: 'monthly' }, // Contact page
    { path: '/blog', priority: '0.8', changefreq: 'daily' },      // Blog index
    { path: '/about', priority: '0.6', changefreq: 'monthly' },   // About page
    { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
    { path: '/terms-conditions', priority: '0.3', changefreq: 'yearly' },
  ];

  const urls = [];

  // Add static routes
  for (const route of staticRoutes) {
    urls.push({
      loc: `${BASE_URL}${route.path}`,
      lastmod: today,
      changefreq: route.changefreq,
      priority: route.priority,
    });
  }

  // Add SEO pages (all the keyword-focused landing pages)
  const seoRoutes = readSeoRoutes();
  for (const route of seoRoutes) {
    // Skip pages already included in static routes
    if (staticRoutes.some(sr => sr.path === route)) {
      continue;
    }
    
    // Determine priority based on page type
    let priority = '0.7';
    let changefreq = 'monthly';
    
    // High priority for main Dutch keywords
    if (route.match(/^\/voorraadbeheer-software$|^\/stockbeheer$/)) {
      priority = '0.9';
      changefreq = 'weekly';
    }
    // Medium-high priority for English main keywords
    else if (route.match(/^\/inventory-management-software$|^\/inventory-management$/)) {
      priority = '0.8';
      changefreq = 'weekly';
    }
    // Standard priority for long-tail keywords
    else {
      priority = '0.7';
      changefreq = 'monthly';
    }

    urls.push({
      loc: `${BASE_URL}${route}`,
      lastmod: today,
      changefreq,
      priority,
    });
  }

  // Add blog posts
  const blogPosts = await readBlogPosts();
  for (const post of blogPosts) {
    urls.push({
      loc: `${BASE_URL}/blog/${post.slug}`,
      lastmod: post.date_published || today,
      changefreq: 'monthly',
      priority: '0.6',
    });
  }

  // Sort by priority (highest first) for better crawling
  urls.sort((a, b) => parseFloat(b.priority) - parseFloat(a.priority));

  // Generate sitemap XML
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
    '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9',
    '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">',
    ...urls.map((u) => buildUrlTag(u.loc, u.lastmod, u.changefreq, u.priority)),
    '</urlset>',
  ].join('\n');

  fs.writeFileSync(OUTPUT_SITEMAP, xml + '\n', 'utf8');

  // Generate sitemap index
  const sitemapIndex = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <sitemap>',
    `    <loc>${BASE_URL}/sitemap.xml</loc>`,
    `    <lastmod>${today}</lastmod>`,
    '  </sitemap>',
    '</sitemapindex>',
  ].join('\n');

  fs.writeFileSync(OUTPUT_SITEMAP_INDEX, sitemapIndex + '\n', 'utf8');

  console.log(`✅ Optimized sitemap generated with ${urls.length} URLs`);
  console.log(`   - Static routes: ${staticRoutes.length}`);
  console.log(`   - SEO pages: ${seoRoutes.length}`);
  console.log(`   - Blog posts: ${blogPosts.length}`);
  console.log(`   - Output: ${OUTPUT_SITEMAP}`);
  
  return urls;
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
    `Sitemap: ${BASE_URL}/sitemap-index.xml`,
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
