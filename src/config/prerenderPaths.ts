/**
 * Marketing URLs to prerender for crawlers (see middleware.ts + PRERENDER_TOKEN).
 */
export const PRERENDER_PATHS = [
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
  '/nl/voorraadbeheer-software',
  '/nl/voorraad-software',
  '/nl/mobiel-voorraadbeheer',
  '/nl/magazijnbeheersysteem',
  '/nl/beste-voorraadbeheer-software',
  '/nl/eenvoudig-stockbeheer',
  '/nl/stockbeheer-software',
] as const;

export const BOT_USER_AGENT =
  /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|linkedinbot|slackbot|whatsapp|discordbot|applebot|semrushbot|ahrefsbot|mj12bot|petalbot/i;
