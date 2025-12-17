/**
 * SEO optimization utilities
 */

/**
 * Generate optimized meta description from content
 * Ensures proper length (150-160 characters) and includes keywords
 */
export function generateMetaDescription(
  content: string,
  keywords: string[] = [],
  maxLength: number = 160
): string {
  // Extract first sentence or first 160 characters
  let description = content
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, maxLength);
  
  // Try to end at sentence boundary
  const lastPeriod = description.lastIndexOf('.');
  const lastExclamation = description.lastIndexOf('!');
  const lastQuestion = description.lastIndexOf('?');
  const lastPunctuation = Math.max(lastPeriod, lastExclamation, lastQuestion);
  
  if (lastPunctuation > maxLength * 0.7) {
    description = description.substring(0, lastPunctuation + 1);
  } else {
    // End at word boundary
    const lastSpace = description.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      description = description.substring(0, lastSpace) + '...';
    }
  }
  
  // Ensure keywords are included if possible
  if (keywords.length > 0) {
    const descriptionLower = description.toLowerCase();
    const missingKeywords = keywords.filter(
      keyword => !descriptionLower.includes(keyword.toLowerCase())
    );
    
    if (missingKeywords.length > 0 && description.length < maxLength - 30) {
      description += ` ${missingKeywords[0]}.`;
    }
  }
  
  return description.trim();
}

/**
 * Generate optimized title tag
 * Ensures proper length (50-60 characters) and includes primary keyword
 */
export function generateTitleTag(
  primaryKeyword: string,
  brand: string = 'StockFlow',
  maxLength: number = 60
): string {
  const separator = ' | ';
  const availableLength = maxLength - brand.length - separator.length;
  
  if (primaryKeyword.length <= availableLength) {
    return `${primaryKeyword}${separator}${brand}`;
  }
  
  // Truncate keyword if needed
  const truncatedKeyword = primaryKeyword.substring(0, availableLength - 3) + '...';
  return `${truncatedKeyword}${separator}${brand}`;
}

/**
 * Extract keywords from content
 */
export function extractKeywords(
  content: string,
  minLength: number = 4,
  maxKeywords: number = 10
): string[] {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, ' ');
  
  // Extract words
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length >= minLength);
  
  // Count frequency
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  // Sort by frequency and return top keywords
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Calculate content quality score
 */
export function calculateContentQualityScore(
  content: string,
  wordCount: number,
  headingCount: number,
  linkCount: number,
  imageCount: number
): {
  score: number;
  recommendations: string[];
} {
  const recommendations: string[] = [];
  let score = 100;
  
  // Word count check (ideal: 1000-2500 words)
  if (wordCount < 300) {
    score -= 30;
    recommendations.push('Content is too short. Aim for at least 1000 words for better SEO.');
  } else if (wordCount < 1000) {
    score -= 15;
    recommendations.push('Consider expanding content to 1000+ words for better rankings.');
  } else if (wordCount > 5000) {
    score -= 10;
    recommendations.push('Content is very long. Consider splitting into multiple pages.');
  }
  
  // Heading structure check
  if (headingCount < 3) {
    score -= 20;
    recommendations.push('Add more headings (H2, H3) to improve content structure.');
  }
  
  // Internal links check
  if (linkCount < 3) {
    score -= 15;
    recommendations.push('Add more internal links to related content.');
  }
  
  // Images check
  if (imageCount === 0) {
    score -= 10;
    recommendations.push('Add relevant images to improve engagement.');
  }
  
  // Keyword density check (should be 1-2%)
  const keywordDensity = extractKeywords(content, 5, 5);
  if (keywordDensity.length < 3) {
    score -= 10;
    recommendations.push('Ensure primary keywords appear naturally throughout content.');
  }
  
  return {
    score: Math.max(0, score),
    recommendations
  };
}

/**
 * Generate schema.org Article with all recommended properties
 */
export function generateEnhancedArticleSchema(config: {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  author?: string;
  publisher?: string;
  keywords?: string[];
  wordCount?: number;
  readingTime?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": config.headline,
    "description": config.description,
    "image": config.image || "https://www.stockflow.be/Inventory-Management.png",
    "datePublished": config.datePublished,
    "dateModified": config.dateModified,
    "author": {
      "@type": "Organization",
      "name": config.author || "StockFlow"
    },
    "publisher": {
      "@type": "Organization",
      "name": config.publisher || "StockFlow",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.stockflow.be/Inventory-Management.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": config.url
    },
    ...(config.keywords && config.keywords.length > 0 && {
      "keywords": config.keywords.join(", ")
    }),
    ...(config.wordCount && {
      "wordCount": config.wordCount
    }),
    ...(config.readingTime && {
      "timeRequired": `PT${config.readingTime}M`
    })
  };
}

