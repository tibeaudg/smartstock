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

  // Try Supabase first if credentials are provided
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

  // JSON fallback (useful locally or when Supabase is not configured in CI)
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

async function generate() {
  const today = new Date().toISOString();
  const staticRoutes = ['/', '/blog'];
  const seoRoutes = readSeoRoutes();
  const blogPosts = await readBlogPosts();

  const urls = [];

  // Static routes
  for (const route of staticRoutes) {
    urls.push({ loc: `${BASE_URL}${route}`, lastmod: today });
  }

  // SEO pages
  for (const route of seoRoutes) {
    urls.push({ loc: `${BASE_URL}${route}`, lastmod: today });
  }

  // Blog posts
  for (const post of blogPosts) {
    urls.push({ loc: `${BASE_URL}/blog/${post.slug}`, lastmod: post.date_published || today });
  }

  // Deduplicate by loc
  const deduped = Array.from(new Map(urls.map((u) => [u.loc, u])).values());

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...deduped.map((u) => buildUrlTag(u.loc, u.lastmod)),
    '</urlset>'
  ].join('\n');

  fs.writeFileSync(OUTPUT_SITEMAP, xml + '\n', 'utf8');
  // eslint-disable-next-line no-console
  console.log(`Sitemap generated with ${deduped.length} URLs at ${OUTPUT_SITEMAP}`);
}

generate().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to generate sitemap:', err);
  process.exit(1);
});


