/**
 * Known high-traffic marketing URLs (kept for reference / legacy imports).
 * The middleware now prerendering ALL public paths — this list is no longer
 * used for path gating.
 */
export const PRERENDER_PATHS = [
  '/',
  '/pricing',
  '/features',
  '/contact',
  '/best-free-inventory-software-with-barcode-scanning',
  '/bill-of-materials-software-free',
  '/barcode-inventory-system',
  '/barcode-inventory-system-for-small-business',
  '/inventory-management-software',
  '/inventory-software',
  '/mobile-inventory-management',
  '/simple-stock-management',
  '/stock-management-software',
  '/best-inventory-management-software',
  '/business-inventory-app',
  '/warehouse-management-system',
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
