import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const BASE_URL = (process.env.SITE_URL || 'https://www.stockflow.be').replace(/\/$/, '');

function xmlEscape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getPriorityForRoute(route) {
  // Homepage has highest priority
  if (route === '/' || route === '/nl') return '1.0';
  // Main category pages
  if (route.includes('inventory-management-software') || route.includes('voorraadbeheer-software')) return '0.9';
  // Important SEO pages
  if (route.includes('tips') || route.includes('software') || route.includes('management')) return '0.8';
  // Regular pages
  if (route.includes('/blog/')) return '0.7';
  // Default
  return '0.6';
}

function getChangeFreqForRoute(route) {
  // Homepage and main pages change frequently
  if (route === '/' || route === '/nl') return 'daily';
  // SEO pages updated regularly
  if (route.includes('software') || route.includes('management')) return 'weekly';
  // Blog posts change less frequently
  if (route.includes('/blog/')) return 'monthly';
  // Default
  return 'monthly';
}

function buildUrlTag(loc, lastmod, priority, changefreq, imageUrl) {
  const parts = [
    '  <url>',
    `    <loc>${xmlEscape(loc)}</loc>`,
  ];
  if (lastmod) {
    parts.push(`    <lastmod>${new Date(lastmod).toISOString()}</lastmod>`);
  }
  if (priority) {
    parts.push(`    <priority>${priority}</priority>`);
  }
  if (changefreq) {
    parts.push(`    <changefreq>${changefreq}</changefreq>`);
  }
  // Add image if provided
  if (imageUrl) {
    parts.push('    <image:image>');
    parts.push(`      <image:loc>${xmlEscape(imageUrl)}</image:loc>`);
    parts.push(`      <image:title>StockFlow - Inventory Management</image:title>`);
    parts.push(`      <image:caption>Professional inventory management software</image:caption>`);
    parts.push('    </image:image>');
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

  // Recursive function to collect routes from all subdirectories
  function collectRoutesFromDir(dirPath, baseDir = dirPath) {
    const routes = [];
    if (!fs.existsSync(dirPath)) {
      return routes;
    }

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        // Recursively scan subdirectories (dutch/, blog/, glossary/, etc.)
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
        continue;
      }

      routes.push(`/${relative}`);
    }

    return routes;
  }

  try {
    const seoDir = path.join(process.cwd(), 'src', 'pages', 'SEO');
    // Recursively collect all routes from all subdirectories
    const routes = collectRoutesFromDir(seoDir);
    
    // Return routes without language-prefixed versions
    // Note: /nl/ routes are handled separately in App.tsx for Belgian market
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
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    // Use a high limit to ensure all published blog posts are included
    // Supabase default limit is 1000, but we'll be explicit
    const { data, error } = await supabase
      .from('blogposts')
      .select('slug,date_published,published')
      .eq('published', true)
      .order('date_published', { ascending: false })
      .limit(10000); // High limit to include all blog posts
    if (error) throw error;
    return (data || []).map((p) => ({ slug: p.slug, date_published: p.date_published }));
  } catch (e) {
    console.error('[sitemap] Failed to fetch blogposts from Supabase:', e);
    return [];
  }
}

export default async function sitemapHandler(req, res) {
  try {
    const today = new Date().toISOString();
    const staticRoutes = ['/', '/nl', '/blog']; // Added /nl for Dutch homepage
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
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
      ...deduped.map((u) => {
        const route = u.loc.replace(BASE_URL, '');
        const priority = getPriorityForRoute(route);
        const changefreq = getChangeFreqForRoute(route);
        // Add main image for homepage and important pages
        const imageUrl = (route === '/' || route === '/nl') 
          ? `${BASE_URL}/Inventory-Management.png`
          : null;
        return buildUrlTag(u.loc, u.lastmod, priority, changefreq, imageUrl);
      }),
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
}


