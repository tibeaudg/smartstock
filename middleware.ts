import { BOT_USER_AGENT, PRERENDER_PATHS } from './src/config/prerenderPaths';

const PRODUCTION_HOST = 'www.stockflowsystems.com';

export const config = {
  matcher: [
    '/',
    '/pricing',
    '/features',
    '/contact',
    '/inventory-management-software',
    '/inventory-software',
    '/mobile-inventory-management',
    '/simple-stock-management',
    '/stock-management-software',
    '/best-inventory-management-software',
    '/barcode-inventory-system-for-small-business',
    '/bill-of-materials-software-free',
    '/nl/:path*',
  ],
};

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

  const shouldPrerender =
    (PRERENDER_PATHS as readonly string[]).includes(pathname) ||
    pathname.startsWith('/nl/');

  if (!shouldPrerender) {
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
