# SEO Content Enhancement Guide

This guide explains how to use the new SEO enhancements in your SEO pages.

## New Features

### 1. Table of Contents
Automatically generates a sticky table of contents based on headings in your content.

**Usage:**
```tsx
<SeoPageLayout
  tableOfContents={[
    { id: 'overview', title: 'Overview', level: 1 },
    { id: 'features', title: 'Key Features', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]}
  showTOC={true}
>
```

### 2. Reading Time
Shows estimated reading time for the page.

**Usage:**
```tsx
<SeoPageLayout
  readingTime={8} // minutes
>
```

Or calculate automatically:
```tsx
import { calculateReadingTime } from '@/utils/contentEnhancement';

const readingTime = calculateReadingTime(content);
```

### 3. Enhanced Structured Data
- Organization schema with social links
- Enhanced Article schema
- HowTo schema for implementation guides
- FAQ schema with author information

### 4. Content Enhancement Utilities
Use `findRelevantInternalLinks()` and `enhanceContentWithLinks()` to automatically add internal links to your content.

## Best Practices

1. **Always provide tableOfContents** - Helps with navigation and SEO
2. **Include readingTime** - Improves user experience
3. **Use HowTo schema** for step-by-step guides
4. **Add contextual internal links** within content sections
5. **Keep content updated** - Use updatedDate prop

