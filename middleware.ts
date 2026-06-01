import { BOT_USER_AGENT } from './src/config/prerenderPaths';

const PRODUCTION_HOST = 'www.stockflowsystems.com';

// Private routes that should never be prerendered (robots.txt also disallows these)
const PRIVATE_PREFIXES = [
  '/dashboard',
  '/auth',
  '/admin',
  '/checkout',
  '/billing-success',
  '/500',
];

export const config = {
  // Catch all paths; filtering happens inside the function
  matcher: ['/:path*'],
};

const STATIC_ASSET_RE = /\.(?:js|css|png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|otf|json|xml|txt|map)$/i;

export default async function middleware(request: Request): Promise<Response | undefined> {
  const token = process.env.PRERENDER_TOKEN;
  if (!token) {
    return undefined;
  }

  const userAgent = request.headers.get('user-agent') ?? '';
  if (!BOT_USER_AGENT.test(userAgent)) {
    return undefined;
  }

  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/+$/, '') || '/';

  // Skip static file requests (JS bundles, images, fonts, etc.)
  if (STATIC_ASSET_RE.test(pathname)) {
    return undefined;
  }

  // Skip private/authenticated routes
  const isPrivate = PRIVATE_PREFIXES.some(prefix => pathname.startsWith(prefix));
  if (isPrivate) {
    return undefined;
  }

  const target = `https://service.prerender.io/https://${PRODUCTION_HOST}${pathname}`;

  return fetch(target, {
    headers: {
      'X-Prerender-Token': token,
    },
    redirect: 'manual',
  });
}
