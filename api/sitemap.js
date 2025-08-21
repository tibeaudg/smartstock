const fs = require('fs');
const path = require('path');

const BASE_URL = (process.env.SITE_URL || 'https://www.stockflow.be').replace(/\/$/, '');

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

function getSeoRoutes() {
  const staticFallback = [
    '/gratis-stockbeheer',
    '/mobiel-voorraadbeheer',
    '/voorraadbeheer-automatiseren',
    '/voorraadbeheer-excel-vs-software',
    '/voorraadbeheer-fouten-voorkomen',
    '/voorraadbeheer-horeca',
    '/voorraadbeheer-software-vergelijken',
    '/voorraadbeheer-tips',
    '/voorraadbeheer-voor-starters',
    '/voorraadbeheer-webshop',
  ];

  try {
    const seoDir = path.join(process.cwd(), 'src', 'pages', 'SEO');
    const entries = fs.readdirSync(seoDir, { withFileTypes: true });
    const routes = entries
      .filter((e) => e.isFile() && e.name.endsWith('.tsx'))
      .map((e) => `/${e.name.replace(/\.tsx$/, '')}`)
      .sort();
    return routes.length ? routes : staticFallback;
  } catch {
    return staticFallback;
  }
}

async function getPublishedBlogPosts() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return [];

  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from('blogposts')
      .select('slug,date_published,published')
      .eq('published', true)
      .order('date_published', { ascending: false });
    if (error) throw error;
    return (data || []).map((p) => ({ slug: p.slug, date_published: p.date_published }));
  } catch (e) {
    console.error('[sitemap] Failed to fetch blogposts from Supabase:', e);
    return [];
  }
}

module.exports = async (req, res) => {
  try {
    const today = new Date().toISOString();
    const staticRoutes = ['/', '/blog'];
    const seoRoutes = getSeoRoutes();
    const blogPosts = await getPublishedBlogPosts();

    const urls = [];
    for (const route of staticRoutes) {
      urls.push({ loc: `${BASE_URL}${route}`, lastmod: today });
    }
    for (const route of seoRoutes) {
      urls.push({ loc: `${BASE_URL}${route}`, lastmod: today });
    }
    for (const post of blogPosts) {
      urls.push({ loc: `${BASE_URL}/blog/${post.slug}`, lastmod: post.date_published || today });
    }

    const deduped = Array.from(new Map(urls.map((u) => [u.loc, u])).values());
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...deduped.map((u) => buildUrlTag(u.loc, u.lastmod)),
      '</urlset>'
    ].join('\n');

    res.setHeader('Content-Type', 'application/xml');
    // Cache for 10 minutes on edge/CDN, allow stale for 1 day
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400');
    res.status(200).send(xml + '\n');
  } catch (err) {
    console.error('[sitemap] Unexpected error:', err);
    res.status(500).send('');
  }
};


