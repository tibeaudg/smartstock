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

// Supported languages
const SUPPORTED_LANGUAGES = ['en', 'de', 'fr', 'es', 'it', 'pl', 'hu', 'sv', 'th', 'si', 'ro'];

function readSeoRoutes() {
  try {
    const entries = fs.readdirSync(SEO_PAGES_DIR, { withFileTypes: true });
    const routes = entries
      .filter((e) => e.isFile() && e.name.endsWith('.tsx'))
      .map((e) => `/${e.name.replace(/\.tsx$/, '')}`)
      .sort();
    return routes;
  } catch (err) {
    return [];
  }
}

async function readBlogPosts() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

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
      return (data || []).map((p) => ({ slug: p.slug, date_published: p.date_published }));
    } catch (e) {
      // Fall through to JSON fallback
    }
  }

  try {
    const json = JSON.parse(fs.readFileSync(BLOG_JSON_FALLBACK, 'utf8'));
    return (Array.isArray(json) ? json : [])
      .filter((p) => p.published)
      .map((p) => ({ slug: p.slug, date_published: p.datePublished || p.date_published }));
  } catch {
    return [];
  }
}

function xmlEscape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

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

function buildHreflangUrlTag(loc, lastmod, hreflang = []) {
  const parts = [
    '  <url>',
    `    <loc>${xmlEscape(loc)}</loc>`,
  ];
  if (lastmod) {
    parts.push(`    <lastmod>${new Date(lastmod).toISOString()}</lastmod>`);
  }
  
  // Add hreflang alternatives
  hreflang.forEach((alt) => {
    parts.push(`    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${xmlEscape(alt.url)}" />`);
  });
  
  parts.push('  </url>');
  return parts.join('\n');
}

async function generateInternationalSitemap() {
  const today = new Date().toISOString();
  const staticRoutes = ['/', '/blog'];
  const seoRoutes = readSeoRoutes();
  const blogPosts = await readBlogPosts();

  const urls = [];

  // Generate URLs for each language
  for (const lang of SUPPORTED_LANGUAGES) {
    const langPrefix = lang === 'en' ? '' : `/${lang}`;
    
    // Static routes
    for (const route of staticRoutes) {
      const hreflang = SUPPORTED_LANGUAGES.map(l => ({
        lang: l,
        url: `${BASE_URL}${l === 'en' ? '' : `/${l}`}${route}`
      }));
      
      urls.push({ 
        loc: `${BASE_URL}${langPrefix}${route}`, 
        lastmod: today,
        hreflang,
        priority: route === '/' ? '1.0' : '0.9'
      });
    }

    // SEO pages
    for (const route of seoRoutes) {
      const hreflang = SUPPORTED_LANGUAGES.map(l => ({
        lang: l,
        url: `${BASE_URL}${l === 'en' ? '' : `/${l}`}${route}`
      }));
      
      urls.push({ 
        loc: `${BASE_URL}${langPrefix}${route}`, 
        lastmod: today,
        hreflang,
        priority: '0.8'
      });
    }

    // Blog posts
    for (const post of blogPosts) {
      const hreflang = SUPPORTED_LANGUAGES.map(l => ({
        lang: l,
        url: `${BASE_URL}${l === 'en' ? '' : `/${l}`}/blog/${post.slug}`
      }));
      
      urls.push({ 
        loc: `${BASE_URL}${langPrefix}/blog/${post.slug}`, 
        lastmod: post.date_published || today,
        hreflang,
        priority: '0.7'
      });
    }
  }

  // Deduplicate by loc
  const deduped = Array.from(new Map(urls.map((u) => [u.loc, u])).values());

  // Generate main sitemap with hreflang
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...deduped.map((u) => buildHreflangUrlTag(u.loc, u.lastmod, u.hreflang)),
    '</urlset>'
  ].join('\n');

  fs.writeFileSync(OUTPUT_SITEMAP, xml + '\n', 'utf8');
  
  // Generate sitemap index
  const sitemapIndex = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <sitemap>`,
    `    <loc>${BASE_URL}/sitemap.xml</loc>`,
    `    <lastmod>${today}</lastmod>`,
    `  </sitemap>`,
    '</sitemapindex>'
  ].join('\n');

  fs.writeFileSync(OUTPUT_SITEMAP_INDEX, sitemapIndex + '\n', 'utf8');
  
  console.log(`International sitemap generated with ${deduped.length} URLs at ${OUTPUT_SITEMAP}`);
  console.log(`Sitemap index generated at ${OUTPUT_SITEMAP_INDEX}`);
}

// Generate robots.txt with international sitemaps
function generateRobotsTxt() {
  const robotsContent = [
    'User-agent: *',
    'Allow: /',
    '',
    '# International sitemaps',
    `Sitemap: ${BASE_URL}/sitemap.xml`,
    `Sitemap: ${BASE_URL}/sitemap-index.xml`,
    '',
    '# Language-specific sitemaps',
    ...SUPPORTED_LANGUAGES.map(lang => 
      `Sitemap: ${BASE_URL}${lang === 'en' ? '' : `/${lang}`}/sitemap.xml`
    )
  ].join('\n');

  fs.writeFileSync(path.join(repoRoot, 'public', 'robots.txt'), robotsContent, 'utf8');
  console.log('Robots.txt generated with international sitemaps');
}

generateInternationalSitemap()
  .then(() => generateRobotsTxt())
  .catch((err) => {
    console.error('Failed to generate international sitemap:', err);
    process.exit(1);
  });
