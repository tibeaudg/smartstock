/**
 * Comprehensive SEO Validation Utility
 * 
 * Provides validation functions for:
 * - Title/description length (≤60 chars titles, ≤160 chars descriptions)
 * - Header hierarchy (exactly one H1, sequential H2-H6)
 * - Image alt text and optimization attributes
 * - Canonical tags (self-referencing)
 * - External link security (rel="noopener noreferrer")
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-100
}

export interface TitleValidation {
  isValid: boolean;
  length: number;
  maxLength: number;
  errors: string[];
  warnings: string[];
}

export interface DescriptionValidation {
  isValid: boolean;
  length: number;
  maxLength: number;
  errors: string[];
  warnings: string[];
}

export interface HeaderHierarchyValidation {
  isValid: boolean;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  h4Count: number;
  h5Count: number;
  h6Count: number;
  errors: string[];
  warnings: string[];
}

export interface ImageValidation {
  isValid: boolean;
  totalImages: number;
  imagesWithAlt: number;
  imagesWithWidth: number;
  imagesWithHeight: number;
  imagesWithLazy: number;
  errors: string[];
  warnings: string[];
}

export interface LinkValidation {
  isValid: boolean;
  externalLinks: number;
  secureExternalLinks: number;
  errors: string[];
  warnings: string[];
}

export interface CanonicalValidation {
  isValid: boolean;
  hasCanonical: boolean;
  isSelfReferencing: boolean;
  canonicalUrl?: string;
  currentUrl?: string;
  errors: string[];
  warnings: string[];
}

/**
 * Validate title tag length
 * Optimal: 50-60 characters
 * Maximum: 60 characters (truncated if longer)
 */
export function validateTitle(title: string | undefined | null): TitleValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const maxLength = 60;
  
  if (!title || title.trim().length === 0) {
    return {
      isValid: false,
      length: 0,
      maxLength,
      errors: ['Title is missing or empty'],
      warnings: []
    };
  }
  
  const length = title.length;
  
  if (length > maxLength) {
    errors.push(`Title exceeds maximum length (${length}/${maxLength} characters). Will be truncated.`);
  } else if (length > 57) {
    warnings.push(`Title is close to limit (${length}/${maxLength} characters). Consider shortening.`);
  }
  
  if (length < 30) {
    warnings.push(`Title is short (${length} characters). Aim for 50-60 characters for better SEO.`);
  }
  
  // Check for keyword at the beginning
  if (length > 30 && title.split(' ').length < 3) {
    warnings.push('Title should be more descriptive (3+ words recommended).');
  }
  
  return {
    isValid: errors.length === 0,
    length,
    maxLength,
    errors,
    warnings
  };
}

/**
 * Validate meta description length
 * Optimal: 150-160 characters
 * Maximum: 160 characters (truncated if longer)
 */
export function validateDescription(description: string | undefined | null): DescriptionValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const maxLength = 160;
  
  if (!description || description.trim().length === 0) {
    return {
      isValid: false,
      length: 0,
      maxLength,
      errors: ['Meta description is missing or empty'],
      warnings: []
    };
  }
  
  const length = description.length;
  
  if (length > maxLength) {
    errors.push(`Description exceeds maximum length (${length}/${maxLength} characters). Will be truncated.`);
  } else if (length > 157) {
    warnings.push(`Description is close to limit (${length}/${maxLength} characters). Consider shortening.`);
  }
  
  if (length < 120) {
    warnings.push(`Description is short (${length} characters). Aim for 150-160 characters for better SEO.`);
  }
  
  // Check for call-to-action repetition
  const ctaPatterns = /(join for free|no credit card|sign up|start free)/gi;
  const ctaMatches = description.match(ctaPatterns);
  if (ctaMatches && ctaMatches.length > 1) {
    warnings.push('Description contains repeated CTAs. Consider removing redundant phrases.');
  }
  
  // Check for keyword at the beginning
  if (length > 50 && description.split(' ').length < 10) {
    warnings.push('Description should be more descriptive (10+ words recommended).');
  }
  
  return {
    isValid: errors.length === 0,
    length,
    maxLength,
    errors,
    warnings
  };
}

/**
 * Validate header hierarchy
 * Rules:
 * - Exactly one H1 per page
 * - Sequential hierarchy (no skipped levels)
 * - H2 should appear before H3, etc.
 */
export function validateHeaderHierarchy(
  h1Count: number,
  h2Count: number = 0,
  h3Count: number = 0,
  h4Count: number = 0,
  h5Count: number = 0,
  h6Count: number = 0
): HeaderHierarchyValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // H1 validation
  if (h1Count === 0) {
    errors.push('Page is missing an H1 tag. Every page should have exactly one H1.');
  } else if (h1Count > 1) {
    errors.push(`Page has ${h1Count} H1 tags. There should be exactly one H1 per page.`);
  }
  
  // H2 validation (recommended for content structure)
  if (h2Count === 0 && h1Count > 0) {
    warnings.push('No H2 tags found. Consider adding H2 subheadings to structure your content.');
  }
  
  // Hierarchy validation (no skipped levels)
  if (h3Count > 0 && h2Count === 0) {
    errors.push('H3 tags found without H2 tags. Header hierarchy should be sequential (H2 before H3).');
  }
  
  if (h4Count > 0 && h3Count === 0) {
    errors.push('H4 tags found without H3 tags. Header hierarchy should be sequential (H3 before H4).');
  }
  
  if (h5Count > 0 && h4Count === 0) {
    errors.push('H5 tags found without H4 tags. Header hierarchy should be sequential (H4 before H5).');
  }
  
  if (h6Count > 0 && h5Count === 0) {
    errors.push('H6 tags found without H5 tags. Header hierarchy should be sequential (H5 before H6).');
  }
  
  return {
    isValid: errors.length === 0,
    h1Count,
    h2Count,
    h3Count,
    h4Count,
    h5Count,
    h6Count,
    errors,
    warnings
  };
}

/**
 * Validate images for SEO best practices
 * Checks for:
 * - Alt text (required for all images)
 * - Width/height attributes (prevent CLS)
 * - Loading="lazy" for non-critical images
 */
export function validateImages(
  totalImages: number,
  imagesWithAlt: number,
  imagesWithWidth: number = 0,
  imagesWithHeight: number = 0,
  imagesWithLazy: number = 0
): ImageValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (totalImages === 0) {
    warnings.push('No images found on page. Consider adding relevant images for better engagement.');
    return {
      isValid: true,
      totalImages: 0,
      imagesWithAlt: 0,
      imagesWithWidth: 0,
      imagesWithHeight: 0,
      imagesWithLazy: 0,
      errors: [],
      warnings
    };
  }
  
  // Alt text validation
  const missingAlt = totalImages - imagesWithAlt;
  if (missingAlt > 0) {
    errors.push(`${missingAlt} image(s) missing alt text. All images require descriptive alt attributes.`);
  }
  
  // Width/height validation (prevent CLS)
  const missingDimensions = totalImages - Math.min(imagesWithWidth, imagesWithHeight);
  if (missingDimensions > 0) {
    warnings.push(`${missingDimensions} image(s) missing width/height attributes. Add dimensions to prevent Cumulative Layout Shift (CLS).`);
  }
  
  // Lazy loading validation (recommended for non-critical images)
  const missingLazy = totalImages - imagesWithLazy;
  if (missingLazy > 0) {
    warnings.push(`${missingLazy} image(s) missing loading="lazy" attribute. Consider lazy-loading images below the fold.`);
  }
  
  return {
    isValid: errors.length === 0,
    totalImages,
    imagesWithAlt,
    imagesWithWidth,
    imagesWithHeight,
    imagesWithLazy,
    errors,
    warnings
  };
}

/**
 * Validate external links for security
 * All external links should have rel="noopener noreferrer"
 */
export function validateExternalLinks(
  externalLinks: number,
  secureExternalLinks: number
): LinkValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (externalLinks === 0) {
    return {
      isValid: true,
      externalLinks: 0,
      secureExternalLinks: 0,
      errors: [],
      warnings: []
    };
  }
  
  const insecureLinks = externalLinks - secureExternalLinks;
  
  if (insecureLinks > 0) {
    errors.push(
      `${insecureLinks} external link(s) missing rel="noopener noreferrer". ` +
      'External links should include these attributes for security.'
    );
  }
  
  // Check if all links are secure
  if (secureExternalLinks === externalLinks && externalLinks > 0) {
    // All good - no warnings needed
  }
  
  return {
    isValid: errors.length === 0,
    externalLinks,
    secureExternalLinks,
    errors,
    warnings
  };
}

/**
 * Validate canonical tag
 * - Must be present
 * - Should be self-referencing (match current URL)
 */
export function validateCanonical(
  canonicalUrl: string | undefined | null,
  currentUrl: string
): CanonicalValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!canonicalUrl || canonicalUrl.trim().length === 0) {
    return {
      isValid: false,
      hasCanonical: false,
      isSelfReferencing: false,
      currentUrl,
      errors: ['Canonical tag is missing. Every page should have a self-referencing canonical URL.'],
      warnings: []
    };
  }
  
  // Normalize URLs for comparison (remove trailing slashes, protocol, etc.)
  const normalizeUrl = (url: string): string => {
    return url
      .replace(/^https?:\/\//, '') // Remove protocol
      .replace(/\/$/, '') // Remove trailing slash
      .toLowerCase();
  };
  
  const normalizedCanonical = normalizeUrl(canonicalUrl);
  const normalizedCurrent = normalizeUrl(currentUrl);
  
  if (normalizedCanonical !== normalizedCurrent) {
    warnings.push(
      `Canonical URL (${canonicalUrl}) does not match current URL (${currentUrl}). ` +
      'Canonical tags should be self-referencing.'
    );
  }
  
  return {
    isValid: errors.length === 0,
    hasCanonical: true,
    isSelfReferencing: normalizedCanonical === normalizedCurrent,
    canonicalUrl,
    currentUrl,
    errors,
    warnings
  };
}

/**
 * Comprehensive SEO validation for a page
 * Combines all validation checks into a single result
 */
export function validatePageSEO(config: {
  title?: string | null;
  description?: string | null;
  h1Count: number;
  h2Count?: number;
  h3Count?: number;
  h4Count?: number;
  h5Count?: number;
  h6Count?: number;
  totalImages?: number;
  imagesWithAlt?: number;
  imagesWithWidth?: number;
  imagesWithHeight?: number;
  imagesWithLazy?: number;
  externalLinks?: number;
  secureExternalLinks?: number;
  canonicalUrl?: string | null;
  currentUrl: string;
}): ValidationResult {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  
  // Validate title
  const titleValidation = validateTitle(config.title);
  allErrors.push(...titleValidation.errors);
  allWarnings.push(...titleValidation.warnings);
  
  // Validate description
  const descriptionValidation = validateDescription(config.description);
  allErrors.push(...descriptionValidation.errors);
  allWarnings.push(...descriptionValidation.warnings);
  
  // Validate header hierarchy
  const headerValidation = validateHeaderHierarchy(
    config.h1Count,
    config.h2Count || 0,
    config.h3Count || 0,
    config.h4Count || 0,
    config.h5Count || 0,
    config.h6Count || 0
  );
  allErrors.push(...headerValidation.errors);
  allWarnings.push(...headerValidation.warnings);
  
  // Validate images
  const imageValidation = validateImages(
    config.totalImages || 0,
    config.imagesWithAlt || 0,
    config.imagesWithWidth || 0,
    config.imagesWithHeight || 0,
    config.imagesWithLazy || 0
  );
  allErrors.push(...imageValidation.errors);
  allWarnings.push(...imageValidation.warnings);
  
  // Validate external links
  const linkValidation = validateExternalLinks(
    config.externalLinks || 0,
    config.secureExternalLinks || 0
  );
  allErrors.push(...linkValidation.errors);
  allWarnings.push(...linkValidation.warnings);
  
  // Validate canonical
  const canonicalValidation = validateCanonical(config.canonicalUrl, config.currentUrl);
  allErrors.push(...canonicalValidation.errors);
  allWarnings.push(...canonicalValidation.warnings);
  
  // Calculate score (0-100)
  let score = 100;
  score -= allErrors.length * 10; // Each error costs 10 points
  score -= allWarnings.length * 2; // Each warning costs 2 points
  score = Math.max(0, Math.min(100, score));
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    score
  };
}

/**
 * Format validation result for console output
 * Useful for development/debugging
 */
export function formatValidationReport(result: ValidationResult): string {
  const lines: string[] = [];
  
  lines.push('='.repeat(60));
  lines.push('SEO VALIDATION REPORT');
  lines.push('='.repeat(60));
  lines.push(`Score: ${result.score}/100`);
  lines.push(`Status: ${result.isValid ? '✅ PASS' : '❌ FAIL'}`);
  lines.push('');
  
  if (result.errors.length > 0) {
    lines.push('ERRORS:');
    result.errors.forEach((error, index) => {
      lines.push(`  ${index + 1}. ❌ ${error}`);
    });
    lines.push('');
  }
  
  if (result.warnings.length > 0) {
    lines.push('WARNINGS:');
    result.warnings.forEach((warning, index) => {
      lines.push(`  ${index + 1}. ⚠️  ${warning}`);
    });
    lines.push('');
  }
  
  if (result.errors.length === 0 && result.warnings.length === 0) {
    lines.push('✅ All SEO checks passed!');
    lines.push('');
  }
  
  lines.push('='.repeat(60));
  
  return lines.join('\n');
}

/**
 * Log validation result to console (only in development)
 */
export function logValidationResult(result: ValidationResult, pagePath?: string): void {
  if (process.env.NODE_ENV === 'development') {
    const report = formatValidationReport(result);
    console.log(`\n[SEO Validator]${pagePath ? ` Page: ${pagePath}` : ''}\n${report}\n`);
  }
}

