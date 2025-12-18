// SEO Analytics Service
// Provides data for SEO keyword optimization tool
// Initially uses mock data based on Google Search Console structure

export interface SEOPage {
  url: string;
  impressions: number;
  clicks: number;
}

export interface SEOQuery {
  query: string;
  impressions: number;
  clicks: number;
  avgPosition: number;
  pageUrl: string;
}

// Mock data based on screenshots
const mockPages: SEOPage[] = [
  { url: 'https://www.stockflowsystems.com/best-inventory-management-software', impressions: 1400, clicks: 0 },
  { url: 'https://www.stockflowsystems.com/voorraadbeheer-software-vergelijken', impressions: 1031, clicks: 4 },
  { url: 'https://www.stockflowsystems.com/online-inventory-software', impressions: 992, clicks: 1 },
  { url: 'https://www.stockflowsystems.com/', impressions: 835, clicks: 60 },
  { url: 'https://www.stockflowsystems.com/magazijnbeheer-software-gratis', impressions: 754, clicks: 0 },
  { url: 'https://www.stockflowsystems.com/voorraadbeheer-horeca', impressions: 729, clicks: 3 },
  { url: 'https://www.stockflowsystems.com/voorraadbeheer-tips', impressions: 458, clicks: 5 },
  { url: 'https://www.stockflowsystems.com/softwares-for-inventory-management', impressions: 380, clicks: 1 },
];

const mockQueries: SEOQuery[] = [
  { query: 'inventory management online', impressions: 704, clicks: 0, avgPosition: 8.5, pageUrl: 'https://www.stockflowsystems.com/best-inventory-management-software' },
  { query: 'best inventory management software', impressions: 538, clicks: 0, avgPosition: 12.3, pageUrl: 'https://www.stockflowsystems.com/best-inventory-management-software' },
  { query: 'stockbeheer', impressions: 389, clicks: 0, avgPosition: 15.2, pageUrl: 'https://www.stockflowsystems.com/voorraadbeheer-software-vergelijken' },
  { query: 'stockbeheer software', impressions: 369, clicks: 1, avgPosition: 4.8, pageUrl: 'https://www.stockflowsystems.com/voorraadbeheer-software-vergelijken' },
  { query: 'software stockbeheer', impressions: 323, clicks: 0, avgPosition: 9.1, pageUrl: 'https://www.stockflowsystems.com/voorraadbeheer-software-vergelijken' },
  { query: 'inventory management software best', impressions: 306, clicks: 0, avgPosition: 11.7, pageUrl: 'https://www.stockflowsystems.com/best-inventory-management-software' },
  { query: 'inventory management software', impressions: 302, clicks: 1, avgPosition: 3.2, pageUrl: 'https://www.stockflowsystems.com/online-inventory-software' },
  { query: 'stockbeheer programma', impressions: 295, clicks: 0, avgPosition: 7.9, pageUrl: 'https://www.stockflowsystems.com/voorraadbeheer-software-vergelijken' },
  { query: 'voorraadbeheer software gratis', impressions: 69, clicks: 1, avgPosition: 5.4, pageUrl: 'https://www.stockflowsystems.com/magazijnbeheer-software-gratis' },
  { query: 'voorraadbeheer horeca', impressions: 152, clicks: 1, avgPosition: 6.1, pageUrl: 'https://www.stockflowsystems.com/voorraadbeheer-horeca' },
  { query: 'stockflow', impressions: 206, clicks: 36, avgPosition: 1.2, pageUrl: 'https://www.stockflowsystems.com/' },
  { query: 'voorraadbeheer app gratis', impressions: 28, clicks: 1, avgPosition: 8.3, pageUrl: 'https://www.stockflowsystems.com/magazijnbeheer-software-gratis' },
  { query: 'stock flow', impressions: 22, clicks: 1, avgPosition: 9.8, pageUrl: 'https://www.stockflowsystems.com/' },
  { query: 'stocks flow', impressions: 2, clicks: 1, avgPosition: 2.5, pageUrl: 'https://www.stockflowsystems.com/' },
];

/**
 * Fetch all pages sorted by impressions (descending)
 */
export async function fetchSEOPages(): Promise<SEOPage[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return sorted by impressions (descending)
  return [...mockPages].sort((a, b) => b.impressions - a.impressions);
}

/**
 * Fetch all queries, optionally filtered by page URL
 */
export async function fetchSEOQueries(pageUrl?: string): Promise<SEOQuery[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let queries = [...mockQueries];
  
  // Filter by page if specified
  if (pageUrl) {
    queries = queries.filter(q => q.pageUrl === pageUrl);
  }
  
  // Sort by impressions (descending)
  return queries.sort((a, b) => b.impressions - a.impressions);
}

/**
 * Get queries that are close to position 1 (between 2-10)
 * These are optimization opportunities
 */
export function getOptimizationOpportunities(queries: SEOQuery[]): SEOQuery[] {
  return queries.filter(q => q.avgPosition >= 2 && q.avgPosition <= 10);
}

/**
 * Get the page path from full URL
 */
export function getPagePath(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    return url;
  }
}

