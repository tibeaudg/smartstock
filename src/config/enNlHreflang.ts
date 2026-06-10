/**
 * EN ↔ NL hreflang pairs for auto-injection in SeoPageLayout.
 * Keys and values are URL paths without leading slash.
 */

const PRODUCTION_URL = 'https://www.stockflowsystems.com';

/** English slug → Dutch slug */
export const EN_TO_NL_SLUG: Record<string, string> = {
  pricing: 'nl/voorraad-software',
  'inventory-management-software': 'nl/voorraadbeheer-software',
  'inventory-software': 'nl/voorraad-software',
  'mobile-inventory-management': 'nl/mobiel-voorraadbeheer',
  'stock-management-software': 'nl/stockbeheer-software',
  'simple-stock-management': 'nl/eenvoudig-stockbeheer',
  'warehouse-management-system': 'nl/voorraadbeheer-magazijn',
  'best-inventory-management-software': 'nl/beste-voorraadbeheer-software',
  'what-is-the-best-free-inventory-management-software': 'nl/wat-is-de-beste-gratis-voorraadbeheer-software',
  'bill-of-materials-software-free': 'nl/gratis-stuklijst-software',
  'best-free-inventory-software-with-barcode-scanning': 'nl/beste-gratis-voorraad-software-met-barcode-scannen',
  'non-profit-inventory-management-software': 'nl/voorraadbeheer-non-profit',
  'inventory-turnover-ratio': 'nl/voorraadomzetsnelheid',
  'assets-inventory': 'nl/voorraadbeheer-assets',
  suppliers: 'nl/voorraadbeheer-leveranciers',
  'medical-inventory-management': 'nl/industries/voorraadbeheer-zorg',
  'wholesaler-inventory-management': 'nl/industries/voorraadbeheer-groothandel',
  'jewelry-inventory-management': 'nl/industries/voorraadbeheer-juwelier',
  'government-inventory-management': 'nl/industries/voorraadbeheer-overheid',
  'hvac-inventory-management': 'nl/industries/voorraadbeheer-hvac',
  'retail-inventory-management': 'nl/industries/voorraadbeheer-retail',
  'contractor-inventory-management': 'nl/industries/voorraadbeheer-bouw',
  'manufacturing-inventory-management-software': 'nl/industries/voorraadbeheer-manufacturing',
  'ecommerce-inventory-management': 'nl/industries/voorraadbeheer-ecommerce',
  'restaurant-inventory-management-software': 'nl/industries/voorraadbeheer-horeca',
  'logistics-inventory-management-software': 'nl/industries/voorraadbeheer-logistiek',
  'cold-storage-inventory-management': 'nl/industries/voorraadbeheer-koude-opslag',
  'stockflow-vs-sortly': 'nl/stockflow-vs-sortly',
};

const NL_TO_EN_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(EN_TO_NL_SLUG).map(([en, nl]) => [nl, en])
);

export type HreflangEntry = { lang: string; url: string };

/** Dutch landing page paired with the English homepage */
const HOME_NL_SLUG = 'nl/beste-voorraadbeheer-software';

function toFullUrl(path: string): string {
  const normalized = path.replace(/^\/+/, '');
  return normalized ? `${PRODUCTION_URL}/${normalized}` : PRODUCTION_URL;
}

function buildHreflangSet(enSlug: string, nlSlug: string): HreflangEntry[] {
  return [
    { lang: 'en-US', url: toFullUrl(enSlug) },
    { lang: 'nl-BE', url: toFullUrl(nlSlug) },
    { lang: 'nl-NL', url: toFullUrl(nlSlug) },
    { lang: 'x-default', url: toFullUrl(enSlug) },
  ];
}

/**
 * Resolve hreflang alternates for the current pathname when not set on the page.
 */
export function getHreflangAlternates(pathname: string): HreflangEntry[] | undefined {
  const slug = pathname.replace(/^\/+/, '').replace(/\/+$/, '');

  if (slug === '') {
    return buildHreflangSet('', HOME_NL_SLUG);
  }

  if (slug.startsWith('nl/') || slug === 'nl') {
    const enSlug = NL_TO_EN_SLUG[slug];
    if (!enSlug) return undefined;
    return buildHreflangSet(enSlug, slug);
  }

  const nlSlug = EN_TO_NL_SLUG[slug];
  if (!nlSlug) return undefined;

  return buildHreflangSet(slug, nlSlug);
}
