import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { globby } from 'globby';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { extractRoutePathFromContent } from './utils/seo-slug.mjs';
import { getSitemapRoutes } from './utils/sitemap-routes.mjs';

const ROOT = process.cwd();
const DIST_DIR = path.join(ROOT, 'dist');
const SITEMAP_PATH = path.join(ROOT, 'public', 'sitemap.xml');
const SEO_DIR = path.join(ROOT, 'src', 'pages', 'SEO');
const SEO_DIR_LOWER = path.join(ROOT, 'src', 'pages', 'seo');
const PREVIEW_HOST = '127.0.0.1';
const PREVIEW_PORT = 4173;
const PREVIEW_ORIGIN = `http://${PREVIEW_HOST}:${PREVIEW_PORT}`;
const CONCURRENCY = Number(process.env.PRERENDER_CONCURRENCY ?? 4);
const MIN_SUCCESS_RATE = Number(process.env.PRERENDER_MIN_SUCCESS_RATE ?? 0.95);
const IS_VERCEL = Boolean(process.env.VERCEL);

async function getSeoFileRoutes() {
  const seoDir = fs.existsSync(SEO_DIR) ? SEO_DIR : SEO_DIR_LOWER;
  if (!fs.existsSync(seoDir)) return [];

  const files = await globby('**/*.tsx', { cwd: seoDir });
  const routes = new Set();
  const excluded = new Set(['glossary/createGlossaryPage', 'resources']);

  for (const rel of files) {
    const relPosix = rel.replace(/\\/g, '/');
    const baseWithoutExt = relPosix.replace(/\.tsx$/, '');
    if (excluded.has(baseWithoutExt)) continue;

    const fullPath = path.join(seoDir, rel);
    const content = fs.readFileSync(fullPath, 'utf8');
    const slug = extractRoutePathFromContent(content, `pages/SEO/${relPosix}`);
    if (!slug) continue;
    routes.add(slug.startsWith('/') ? slug : `/${slug}`);
  }

  return [...routes];
}

function writeRouteHtml(routePath, html) {
  const normalized = routePath === '/' ? '' : routePath.replace(/^\/+|\/+$/g, '');
  const outDir = normalized ? path.join(DIST_DIR, normalized) : DIST_DIR;
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
}

function sanitizeCapturedHtml(html) {
  return html
    .replaceAll(PREVIEW_ORIGIN, '')
    .replace(/<title(?![^>]*data-rh)[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta(?![^>]*data-rh)[^>]+name="description"[^>]*>/gi, '')
    .replace(/<meta(?![^>]*data-rh)[^>]+property="og:[^"]+"[^>]*>/gi, '')
    .replace(/<meta(?![^>]*data-rh)[^>]+name="twitter:[^"]+"[^>]*>/gi, '')
    .replace(/<link(?![^>]*data-rh)[^>]+rel="canonical"[^>]*>/gi, '');
}

function waitForPreviewReady(serverProcess) {
  return new Promise((resolve, reject) => {
    let resolved = false;

    const onData = (chunk) => {
      const text = String(chunk);
      if (/Local:\s+http:\/\/127\.0\.0\.1:4173/i.test(text) || /ready in/i.test(text)) {
        resolved = true;
        cleanup();
        resolve();
      }
    };

    const onExit = (code) => {
      if (!resolved) {
        cleanup();
        reject(new Error(`vite preview exited before becoming ready (code ${code ?? 'unknown'})`));
      }
    };

    const cleanup = () => {
      serverProcess.stdout?.off('data', onData);
      serverProcess.stderr?.off('data', onData);
      serverProcess.off('exit', onExit);
    };

    serverProcess.stdout?.on('data', onData);
    serverProcess.stderr?.on('data', onData);
    serverProcess.on('exit', onExit);
  });
}

async function launchWithChromium() {
  return puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
}

async function launchBrowser() {
  if (IS_VERCEL) {
    return launchWithChromium();
  }

  try {
    const fullPuppeteer = await import('puppeteer');
    return await fullPuppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  } catch (error) {
    console.warn(
      `[prerender-pages] Local Chrome unavailable (${error?.message ?? 'unknown'}); falling back to @sparticuz/chromium.`
    );
    return launchWithChromium();
  }
}

async function prerenderRoute(page, routePath) {
  const target = `${PREVIEW_ORIGIN}${routePath}`;

  await page.goto(target, { waitUntil: 'networkidle0', timeout: 120000 });
  await page.waitForSelector('body', { timeout: 30000 });

  try {
    await page.waitForSelector('h1', { timeout: 30000 });
  } catch {
    // No h1 found within timeout; still capture whatever rendered.
  }

  await page.evaluate(async () => {
    await new Promise((resolve) => {
      const distance = 400;
      const interval = setInterval(() => {
        window.scrollBy(0, distance);
        if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
          clearInterval(interval);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 80);
    });
  });
  await new Promise((resolve) => setTimeout(resolve, 900));

  const html = sanitizeCapturedHtml(await page.content());

  if (!/<h1[\s>]/i.test(html)) {
    console.warn(`[prerender-pages] WARNING: no <h1> in captured HTML for ${routePath}`);
  }

  writeRouteHtml(routePath, html);
}

async function runPool(browser, routes) {
  let rendered = 0;
  const failedRoutes = [];
  let index = 0;

  async function worker() {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 900 });

    try {
      while (index < routes.length) {
        const current = index;
        index += 1;
        const route = routes[current];
        try {
          await prerenderRoute(page, route);
          rendered += 1;
        } catch (error) {
          failedRoutes.push(route);
          console.warn(`[prerender-pages] Skipped ${route}: ${error?.message ?? 'unknown error'}`);
        }
      }
    } finally {
      await page.close();
    }
  }

  const workers = Array.from({ length: Math.min(CONCURRENCY, routes.length) }, () => worker());
  await Promise.all(workers);

  return { rendered, failedRoutes };
}

async function main() {
  if (!fs.existsSync(DIST_DIR)) {
    throw new Error('dist directory not found. Run vite build first.');
  }

  const routes = [...new Set([...(await getSeoFileRoutes()), ...getSitemapRoutes(SITEMAP_PATH)])].sort(
    (a, b) => a.localeCompare(b)
  );
  if (routes.length === 0) {
    throw new Error('No routes found in sitemap.xml for prerendering.');
  }

  const viteCliPath = path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js');
  const server = spawn(process.execPath, [viteCliPath, 'preview', '--host', PREVIEW_HOST, '--port', String(PREVIEW_PORT), '--strictPort'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: false,
  });

  try {
    await waitForPreviewReady(server);

    const browser = await launchBrowser();

    try {
      const { rendered, failedRoutes } = await runPool(browser, routes);
      const successRate = rendered / routes.length;

      if (failedRoutes.length) {
        console.warn(`[prerender-pages] ${failedRoutes.length} route(s) skipped.`);
      }

      console.log(`[prerender-pages] Prerendered ${rendered}/${routes.length} routes into dist/`);

      if (successRate < MIN_SUCCESS_RATE) {
        throw new Error(
          `Prerender success rate ${(successRate * 100).toFixed(1)}% is below minimum ${(MIN_SUCCESS_RATE * 100).toFixed(0)}%`
        );
      }
    } finally {
      await browser.close();
    }
  } finally {
    if (!server.killed) {
      server.kill();
    }
  }
}

main().catch((error) => {
  console.error('[prerender-pages] Failed:', error);
  process.exit(1);
});
