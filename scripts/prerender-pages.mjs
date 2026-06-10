import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { getAllPrerenderRoutes } from './utils/collect-prerender-routes.mjs';
import { getCacheDiagnostics, planIncrementalPrerender, saveRouteCache } from './utils/prerender-cache.mjs';
import { getRouteContentHash } from './utils/prerender-route-sources.mjs';
import { emitFallbackForRoutes } from './generate-seo-html.mjs';

const ROOT = process.cwd();
const DIST_DIR = path.join(ROOT, 'dist');
const SITEMAP_PATH = path.join(ROOT, 'public', 'sitemap.xml');
const RESULTS_MANIFEST = path.join(ROOT, 'scripts', 'prerender-results.generated.json');
const PREVIEW_HOST = '127.0.0.1';
const PREVIEW_PORT = 4173;
const PREVIEW_ORIGIN = `http://${PREVIEW_HOST}:${PREVIEW_PORT}`;
const IS_VERCEL = Boolean(process.env.VERCEL);
const CONCURRENCY = Number(process.env.PRERENDER_CONCURRENCY ?? (IS_VERCEL ? 8 : 3));
const MAX_ROUTE_ATTEMPTS = Number(process.env.PRERENDER_ROUTE_ATTEMPTS ?? 2);
const MIN_SUCCESS_RATE = Number(process.env.PRERENDER_MIN_SUCCESS_RATE ?? 0.95);
const NAV_TIMEOUT_MS = Number(process.env.PRERENDER_NAV_TIMEOUT_MS ?? 18000);
const PROTOCOL_TIMEOUT_MS = Number(process.env.PRERENDER_PROTOCOL_TIMEOUT_MS ?? 120000);
const SCROLL_TIMEOUT_MS = Number(process.env.PRERENDER_SCROLL_TIMEOUT_MS ?? 2500);
const CONTENT_RETRY_MS = Number(process.env.PRERENDER_CONTENT_RETRY_MS ?? 1500);
const INCREMENTAL = process.env.PRERENDER_INCREMENTAL !== '0';

/** Third-party analytics keep networkidle0 open indefinitely during preview. */
const BLOCKED_REQUEST_HOSTS = [
  'google-analytics.com',
  'googletagmanager.com',
  'googleadservices.com',
  'doubleclick.net',
  'facebook.com',
  'connect.facebook.net',
  'posthog.com',
  'i.posthog.com',
  'eu.i.posthog.com',
  'eu-assets.i.posthog.com',
  'clarity.ms',
  'hotjar.com',
];

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
    protocolTimeout: PROTOCOL_TIMEOUT_MS,
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
      protocolTimeout: PROTOCOL_TIMEOUT_MS,
    });
  } catch (error) {
    console.warn(
      `[prerender-pages] Local Chrome unavailable (${error?.message ?? 'unknown'}); falling back to @sparticuz/chromium.`
    );
    return launchWithChromium();
  }
}

function shouldBlockRequest(request) {
  const resourceType = request.resourceType();
  if (['image', 'font', 'media'].includes(resourceType)) {
    return true;
  }

  try {
    const host = new URL(request.url()).hostname;
    return BLOCKED_REQUEST_HOSTS.some((blocked) => host === blocked || host.endsWith(`.${blocked}`));
  } catch {
    return false;
  }
}

async function waitForRenderedContent(page) {
  await page.waitForFunction(
    () => {
      const root = document.getElementById('root');
      if (!root) return false;
      const text = (root.innerText ?? '').replace(/\s+/g, ' ').trim();
      return text.length >= 200;
    },
    { timeout: NAV_TIMEOUT_MS }
  );
}

async function quickScroll(page) {
  await page.evaluate(
    (maxMs) =>
      new Promise((resolve) => {
        const started = Date.now();
        const interval = setInterval(() => {
          if (Date.now() - started > maxMs) {
            clearInterval(interval);
            window.scrollTo(0, 0);
            resolve();
            return;
          }
          window.scrollBy(0, 600);
          if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
            clearInterval(interval);
            window.scrollTo(0, 0);
            resolve();
          }
        }, 50);
      }),
    SCROLL_TIMEOUT_MS
  );
}

async function prerenderRoute(page, routePath) {
  const target = `${PREVIEW_ORIGIN}${routePath}`;

  // `load` + content wait is much faster than `networkidle2` for SPAs.
  await page.goto(target, { waitUntil: 'load', timeout: NAV_TIMEOUT_MS });

  try {
    await waitForRenderedContent(page);
  } catch {
    await new Promise((resolve) => setTimeout(resolve, CONTENT_RETRY_MS));
  }

  try {
    await page.waitForSelector('h1', { timeout: 5000 });
  } catch {
    // No h1 within timeout; still capture whatever rendered.
  }

  try {
    await quickScroll(page);
  } catch {
    // Scroll is best-effort for lazy sections.
  }

  const html = sanitizeCapturedHtml(await page.content());

  if (/onverwachte fout opgetreden|unexpected error occurred/i.test(html)) {
    throw new Error('error boundary rendered');
  }

  const rootText = await page.evaluate(() => {
    const root = document.getElementById('root');
    return (root?.innerText ?? '').replace(/\s+/g, ' ').trim();
  });
  if (rootText.length < 200) {
    throw new Error(`insufficient rendered content (${rootText.length} chars)`);
  }

  if (!/<h1[\s>]/i.test(html)) {
    console.warn(`[prerender-pages] WARNING: no <h1> in captured HTML for ${routePath}`);
  }

  writeRouteHtml(routePath, html);
  return html;
}

async function runPool(browser, routes, { buildFingerprint, onRouteRendered }) {
  let rendered = 0;
  const failedRoutes = [];
  let index = 0;

  async function worker() {
    const page = await browser.newPage();
    await page.setCacheEnabled(true);
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (shouldBlockRequest(request)) {
        request.abort();
        return;
      }
      request.continue();
    });
    await page.setViewport({ width: 1366, height: 900 });

    try {
      while (index < routes.length) {
        const current = index;
        index += 1;
        const route = routes[current];
        let succeeded = false;
        let lastError = null;
        for (let attempt = 1; attempt <= MAX_ROUTE_ATTEMPTS; attempt += 1) {
          try {
            const html = await prerenderRoute(page, route);
            if (onRouteRendered) {
              await onRouteRendered(route, html);
            }
            rendered += 1;
            succeeded = true;
            break;
          } catch (error) {
            lastError = error;
            if (attempt < MAX_ROUTE_ATTEMPTS) {
              console.warn(
                `[prerender-pages] Retry ${attempt}/${MAX_ROUTE_ATTEMPTS} for ${route}: ${error?.message ?? 'unknown error'}`
              );
              await new Promise((resolve) => setTimeout(resolve, 1200));
            }
          }
        }
        if (!succeeded) {
          failedRoutes.push(route);
          console.warn(`[prerender-pages] Skipped ${route}: ${lastError?.message ?? 'unknown error'}`);
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

  const routes = await getAllPrerenderRoutes(SITEMAP_PATH);
  if (routes.length === 0) {
    throw new Error('No routes found for prerendering.');
  }

  const cacheBefore = getCacheDiagnostics();
  if (cacheBefore.htmlFileCount === 0) {
    console.warn(
      '[prerender-pages] Cold cache (no .prerender-cache on disk). First deploy or remote cache miss — Puppeteer will render all routes.'
    );
  }

  const { cached, patched, toPrerender, buildFingerprint } = await planIncrementalPrerender(
    routes,
    DIST_DIR,
    INCREMENTAL
  );

  const restored = cached + patched;
  if (restored > 0) {
    console.log(
      `[prerender-pages] Restored ${restored}/${routes.length} route(s) from cache (${cached} exact, ${patched} asset-patched).`
    );
  }

  if (toPrerender.length === 0) {
    console.log('[prerender-pages] All routes served from cache — skipping Puppeteer.');
    fs.writeFileSync(
      RESULTS_MANIFEST,
      `${JSON.stringify(
        {
          updatedAt: new Date().toISOString(),
          total: routes.length,
          rendered: restored,
          cached,
          patched,
          fallback: [],
        },
        null,
        2
      )}\n`,
      'utf8'
    );
    return;
  }

  console.log(`[prerender-pages] Puppeteer will render ${toPrerender.length} route(s).`);

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
      const onRouteRendered = async (route, html) => {
        const contentHash = await getRouteContentHash(route);
        saveRouteCache(route, html, contentHash, buildFingerprint);
      };

      const { rendered, failedRoutes } = await runPool(browser, toPrerender, {
        buildFingerprint,
        onRouteRendered,
      });
      let fallbackCount = 0;

      if (failedRoutes.length) {
        console.warn(`[prerender-pages] ${failedRoutes.length} route(s) skipped — applying meta-only fallback.`);
        for (const route of failedRoutes) {
          console.warn(`[prerender-pages]   fallback: ${route}`);
        }
        await emitFallbackForRoutes(failedRoutes);
        fallbackCount = failedRoutes.length;
      }

      const totalRendered = cached + patched + rendered;
      const effectiveRendered = totalRendered + fallbackCount;
      const successRate = effectiveRendered / routes.length;

      console.log(
        `[prerender-pages] Done: ${totalRendered} full HTML (${cached} cached + ${patched} patched + ${rendered} fresh), ${fallbackCount} meta-only fallback, ${routes.length} total.`
      );

      if (successRate < MIN_SUCCESS_RATE) {
        throw new Error(
          `Prerender success rate ${(successRate * 100).toFixed(1)}% is below minimum ${(MIN_SUCCESS_RATE * 100).toFixed(0)}%`
        );
      }

      fs.writeFileSync(
        RESULTS_MANIFEST,
        `${JSON.stringify(
          {
            updatedAt: new Date().toISOString(),
            total: routes.length,
            rendered: totalRendered,
            cached,
            patched,
            fallback: failedRoutes,
          },
          null,
          2
        )}\n`,
        'utf8'
      );
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
