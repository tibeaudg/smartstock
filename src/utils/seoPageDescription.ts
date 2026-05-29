/**
 * Auto-generate unique meta descriptions for SEO layout pages.
 */

const EN_SUFFIX =
  ' Free inventory software with barcode scanning and real-time stock tracking.';

const NL_SUFFIX =
  ' Gratis voorraadsoftware met barcodescannen en realtime voorraadinzicht.';

function stripBrandSuffix(title: string): string {
  return title
    .replace(/\s*\|\s*StockFlow\s*$/i, '')
    .replace(/\s*Strategy\s*&\s*Automation\s*Guide\s*$/i, '')
    .replace(/\s*Guide\s*$/i, '')
    .replace(/\s*-\s*A Technical Framework\s*$/i, '')
    .replace(/\s*:\s*A Technical Framework\s*$/i, '')
    .trim();
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const cut = text.substring(0, maxLength - 3);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > maxLength * 0.6 ? cut.substring(0, lastSpace) : cut) + '...';
}

/**
 * Build a page-specific meta description from hero/title when none is provided.
 */
export function generatePageMetaDescription(
  heroTitle: string,
  pageLanguage: 'en' | 'nl'
): string {
  const topic = stripBrandSuffix(heroTitle);
  const suffix = pageLanguage === 'nl' ? NL_SUFFIX : EN_SUFFIX;

  if (pageLanguage === 'nl') {
    const base = `Leer hoe ${topic} uw voorraadbeheer verbetert.${suffix}`;
    return truncate(base, 160);
  }

  const base = `Learn how ${topic} improves inventory accuracy, reduces stockouts, and saves time.${suffix}`;
  return truncate(base, 160);
}

export function isThinTemplatePage(heroTitle: string, keyTakeaways: string[]): boolean {
  if (heroTitle.includes('A Technical Framework')) return true;
  if (
    keyTakeaways.some(
      (item) => item.includes('${title') || item.includes('${topic}')
    )
  ) {
    return true;
  }
  return false;
}

/**
 * Replace literal ${title...} placeholders in key takeaways with topic from heroTitle.
 */
export function normalizeKeyTakeaways(
  takeaways: string[],
  heroTitle: string
): string[] {
  const topic = stripBrandSuffix(heroTitle).toLowerCase();
  return takeaways.map((item) =>
    item
      .replace(/\$\{title\.toLowerCase\(\)\}/g, topic)
      .replace(/\$\{title\}/g, topic)
      .replace(/\$\{topic\}/g, topic)
  );
}
