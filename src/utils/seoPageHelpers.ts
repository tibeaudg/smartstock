import { getRelatedPages, getAllSeoPages, type PageMetadata } from '@/config/topicClusters';

export interface SidebarContent {
  relatedArticles?: PageMetadata[];
  tableOfContents?: Array<{ id: string; title: string; level: number }>;
  language: 'nl' | 'en';
}

/**
 * Detect page language based on pathname
 * Only pages in /dutch/ or /nl/ folders should be detected as Dutch
 */
export function detectPageLanguage(pathname: string): 'nl' | 'en' {
  // Dutch pages are only those explicitly in /dutch/ or /nl/ routes
  if (pathname.includes('/dutch/') || pathname.includes('/nl/')) {
    return 'nl';
  }
  return 'en';
}

/**
 * Generate sidebar content for SEO pages
 */
export function generateSidebarContent(
  pathname: string,
  tableOfContents?: Array<{ id: string; title: string; level: number }>,
  customRelatedArticles?: PageMetadata[]
): SidebarContent {
  const language = detectPageLanguage(pathname);
  
  // Get all SEO pages, excluding current page
  const allSeoPages = getAllSeoPages().filter(page => page.path !== pathname);
  
  // If custom articles provided, use those; otherwise use all pages
  const relatedArticles = customRelatedArticles || allSeoPages;

  return {
    relatedArticles: relatedArticles.length > 0 ? relatedArticles : undefined,
    tableOfContents,
    language
  };
}

