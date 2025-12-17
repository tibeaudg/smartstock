/**
 * Utilities for enhancing SEO content
 */

import { getAllSeoPages, type PageMetadata } from '@/config/topicClusters';

/**
 * Calculate reading time from content
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  const words = content.trim().split(/\s+/).filter(word => word.length > 0).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * Extract headings from content to generate table of contents
 */
export function extractHeadingsFromContent(content: string): Array<{ id: string; title: string; level: number }> {
  const headings: Array<{ id: string; title: string; level: number }> = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // Match markdown-style headings or HTML headings
    const markdownMatch = line.match(/^(#{1,6})\s+(.+)$/);
    const htmlMatch = line.match(/<h([1-6])[^>]*>(?:<[^>]+>)*([^<]+)/i);
    
    if (markdownMatch) {
      const level = markdownMatch[1].length;
      const title = markdownMatch[2].trim();
      const id = generateHeadingId(title, index);
      headings.push({ id, title, level });
    } else if (htmlMatch) {
      const level = parseInt(htmlMatch[1]);
      const title = htmlMatch[2].trim();
      const id = generateHeadingId(title, index);
      headings.push({ id, title, level });
    }
  });
  
  return headings;
}

/**
 * Generate a URL-friendly ID from heading text
 */
function generateHeadingId(text: string, index: number): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 50) || `heading-${index}`;
}

/**
 * Find relevant internal links for content
 */
export function findRelevantInternalLinks(
  content: string,
  currentPath: string,
  maxLinks: number = 5
): PageMetadata[] {
  const allPages = getAllSeoPages();
  const contentLower = content.toLowerCase();
  
  const scoredPages = allPages
    .filter(page => page.path !== currentPath)
    .map(page => {
      let score = 0;
      const titleLower = (page.title || '').toLowerCase();
      const descLower = (page.description || '').toLowerCase();
      const keywords = (page.title || '').split(/\s+/).filter(k => k.length > 4);
      
      // Score based on keyword matches in content
      keywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase();
        const matches = (contentLower.match(new RegExp(`\\b${keywordLower}\\b`, 'g')) || []).length;
        score += matches * 2;
      });
      
      // Boost for common terms
      const commonTerms = ['inventory', 'stock', 'warehouse', 'management', 'tracking', 'software'];
      commonTerms.forEach(term => {
        if (titleLower.includes(term) && contentLower.includes(term)) {
          score += 3;
        }
      });
      
      // Boost for description matches
      if (descLower && contentLower.includes(descLower.substring(0, 20).toLowerCase())) {
        score += 2;
      }
      
      return { page, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxLinks)
    .map(item => item.page);
  
  return scoredPages;
}

/**
 * Enhance content with natural keyword linking
 */
export function enhanceContentWithLinks(
  content: string,
  relevantPages: PageMetadata[],
  maxLinks: number = 3
): string {
  let enhanced = content;
  const usedLinks = new Set<string>();
  
  relevantPages.slice(0, maxLinks).forEach(page => {
    if (usedLinks.has(page.path)) return;
    
    const title = page.title || '';
    // Extract main keywords (longer words are better for linking)
    const keywords = title
      .split(/\s+/)
      .filter(k => k.length > 6 && !['inventory', 'management', 'software'].includes(k.toLowerCase()))
      .slice(0, 2); // Limit keywords per page
    
    keywords.forEach(keyword => {
      // Only link first occurrence and avoid linking if already in a link
      const regex = new RegExp(`\\b${keyword}\\b(?![^<]*</a>)`, 'i');
      if (regex.test(enhanced) && usedLinks.size < maxLinks) {
        enhanced = enhanced.replace(
          regex,
          `<a href="${page.path}" class="text-blue-600 hover:text-blue-800 hover:underline font-medium" data-internal-link="true">${keyword}</a>`
        );
        usedLinks.add(page.path);
      }
    });
  });
  
  return enhanced;
}

/**
 * Generate HowTo structured data from implementation steps
 */
export function generateHowToSchema(
  name: string,
  description: string,
  steps: Array<{ step: string; title: string; description: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.title,
      "text": step.description
    }))
  };
}

