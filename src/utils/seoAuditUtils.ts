// Utility functions for SEO validation and auditing

export interface SEOMetaData {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  hasStructuredData: boolean;
  hasH1: boolean;
  headingCount: {
    h1: number;
    h2: number;
    h3: number;
  };
  wordCount: number;
  hasImages: boolean;
  imageAltCount: number;
  internalLinks: number;
  hasHreflang: boolean;
  locale?: string;
}

/**
 * Validate title tag length (optimal: 50-60 characters)
 */
export function validateTitleLength(title: string): {
  isValid: boolean;
  length: number;
  recommendation: string;
} {
  const length = title.length;
  let recommendation = '';
  
  if (length < 50) {
    recommendation = 'Title is too short. Add more keywords or descriptive text (target: 50-60 chars)';
  } else if (length > 60) {
    recommendation = 'Title is too long. It may be truncated in search results (target: 50-60 chars)';
  }
  
  return {
    isValid: length >= 50 && length <= 60,
    length,
    recommendation: recommendation || 'Title length is optimal'
  };
}

/**
 * Validate meta description length (optimal: 150-160 characters)
 */
export function validateDescriptionLength(description: string): {
  isValid: boolean;
  length: number;
  recommendation: string;
} {
  const length = description.length;
  let recommendation = '';
  
  if (length < 120) {
    recommendation = 'Description is too short. Add more compelling details (target: 150-160 chars)';
  } else if (length < 150) {
    recommendation = 'Description could be longer for better visibility (target: 150-160 chars)';
  } else if (length > 160) {
    recommendation = 'Description is too long. It may be truncated in search results (target: 150-160 chars)';
  }
  
  return {
    isValid: length >= 150 && length <= 160,
    length,
    recommendation: recommendation || 'Description length is optimal'
  };
}

/**
 * Check if page has proper heading hierarchy
 */
export function validateHeadingHierarchy(headingCount: { h1: number; h2: number; h3: number }): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  if (headingCount.h1 === 0) {
    issues.push('Missing H1 tag - every page should have exactly one H1');
  } else if (headingCount.h1 > 1) {
    issues.push(`Multiple H1 tags found (${headingCount.h1}) - should have exactly one`);
  }
  
  if (headingCount.h1 === 1 && headingCount.h2 === 0 && headingCount.h3 > 0) {
    issues.push('H3 tags used without H2 tags - hierarchy should be H1 → H2 → H3');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

/**
 * Calculate content word count (rough estimation)
 */
export function estimateWordCount(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Check if page is likely English or Dutch based on content
 */
export function detectPageLanguage(text: string): 'en' | 'nl' | 'unknown' {
  if (!text) return 'unknown';
  
  const dutchIndicators = [
    'voorraadbeheer', 'stockbeheer', 'magazijnbeheer', 'kmo', 
    'webshop', 'gratis', 'software', 'automatiseren'
  ];
  const englishIndicators = [
    'inventory', 'management', 'software', 'warehouse',
    'stock', 'tracking', 'control', 'system'
  ];
  
  const lowerText = text.toLowerCase();
  const dutchMatches = dutchIndicators.filter(indicator => lowerText.includes(indicator)).length;
  const englishMatches = englishIndicators.filter(indicator => lowerText.includes(indicator)).length;
  
  if (dutchMatches > englishMatches) return 'nl';
  if (englishMatches > dutchMatches) return 'en';
  return 'unknown';
}

/**
 * Generate SEO score based on various factors
 */
export function calculateSEOScore(meta: SEOMetaData): {
  score: number;
  maxScore: number;
  breakdown: Record<string, number>;
} {
  let score = 0;
  const maxScore = 100;
  const breakdown: Record<string, number> = {};
  
  // Title (20 points)
  if (meta.title) {
    const titleValidation = validateTitleLength(meta.title);
    breakdown.title = titleValidation.isValid ? 20 : 10;
    score += breakdown.title;
  }
  
  // Description (20 points)
  if (meta.description) {
    const descValidation = validateDescriptionLength(meta.description);
    breakdown.description = descValidation.isValid ? 20 : 10;
    score += breakdown.description;
  }
  
  // H1 Tag (15 points)
  breakdown.h1 = meta.hasH1 && meta.headingCount.h1 === 1 ? 15 : 0;
  score += breakdown.h1;
  
  // Structured Data (15 points)
  breakdown.structuredData = meta.hasStructuredData ? 15 : 0;
  score += breakdown.structuredData;
  
  // Heading Hierarchy (10 points)
  const headingValidation = validateHeadingHierarchy(meta.headingCount);
  breakdown.headingHierarchy = headingValidation.isValid ? 10 : 5;
  score += breakdown.headingHierarchy;
  
  // Content Length (10 points)
  breakdown.contentLength = meta.wordCount >= 300 ? 10 : (meta.wordCount >= 150 ? 5 : 0);
  score += breakdown.contentLength;
  
  // Internal Links (5 points)
  breakdown.internalLinks = meta.internalLinks >= 3 ? 5 : (meta.internalLinks >= 1 ? 2 : 0);
  score += breakdown.internalLinks;
  
  // Images with Alt (5 points)
  breakdown.images = meta.hasImages && meta.imageAltCount > 0 ? 5 : 0;
  score += breakdown.images;
  
  return { score, maxScore, breakdown };
}

/**
 * Get English/Dutch page pair suggestions
 */
export function getLanguagePair(pagePath: string): {
  englishPath?: string;
  dutchPath?: string;
} {
  const path = pagePath.toLowerCase();
  
  // Common English to Dutch mappings
  const mappings: Record<string, string> = {
    'inventory-management-software': 'voorraadbeheer-software',
    'inventory-management': 'voorraadbeheer',
    'stock-management': 'stockbeheer',
    'warehouse-management': 'magazijnbeheer',
    'warehouse-software': 'magazijnbeheer-software',
    'free-inventory': 'gratis-voorraadbeheer',
    'inventory-software': 'voorraadbeheer-software',
    'stock-software': 'stockbeheer-software',
    'warehouse-software': 'magazijnbeheer-software'
  };
  
  // Check if current path is English
  for (const [en, nl] of Object.entries(mappings)) {
    if (path.includes(en)) {
      return {
        englishPath: pagePath,
        dutchPath: pagePath.replace(en, nl)
      };
    }
    if (path.includes(nl)) {
      return {
        englishPath: pagePath.replace(nl, en),
        dutchPath: pagePath
      };
    }
  }
  
  // Check if path looks Dutch (contains common Dutch words)
  const dutchPatterns = /(voorraadbeheer|stockbeheer|magazijnbeheer|gratis-voorraad|kmo|webshop)/;
  if (dutchPatterns.test(path)) {
    return { dutchPath: pagePath };
  }
  
  return { englishPath: pagePath };
}

