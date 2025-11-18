import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getGSCDataMap,
  normalizeGSCUrl,
  loadGSCPageData
} from './utils/gsc-data-loader.mjs';
import {
  collectSeoPageFiles,
  getSlugFromPath,
  extractSEOProps,
  extractH1,
  extractInternalLinks
} from './utils/seo-file-parser.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const SEO_PAGES_DIR = path.join(repoRoot, 'src', 'pages', 'SEO');

/**
 * Extract keywords from text (simple tokenization)
 */
function extractKeywords(text) {
  if (!text) return [];
  
  // Remove HTML tags, JSX expressions
  const cleanText = text
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{.*?\}/g, ' ')
    .toLowerCase();
  
  // Extract words (2+ characters)
  const words = cleanText
    .split(/\s+/)
    .filter(word => word.length >= 3)
    .filter(word => !/^(the|and|for|with|from|that|this|are|was|were|been|have|has|had|will|would|could|should)$/i.test(word));
  
  // Count frequency
  const frequency = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  // Return top keywords
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

/**
 * Calculate semantic similarity between two pages
 */
function calculateSimilarity(page1, page2) {
  const keywords1 = new Set(page1.keywords || []);
  const keywords2 = new Set(page2.keywords || []);
  
  if (keywords1.size === 0 || keywords2.size === 0) {
    return 0;
  }
  
  // Jaccard similarity
  const intersection = new Set([...keywords1].filter(k => keywords2.has(k)));
  const union = new Set([...keywords1, ...keywords2]);
  
  return intersection.size / union.size;
}

/**
 * Find best anchor text for a link
 */
function findAnchorText(targetUrl, targetPage) {
  // Use H1 or title as anchor text
  if (targetPage.h1) {
    return targetPage.h1.substring(0, 50);
  }
  
  if (targetPage.title) {
    return targetPage.title.substring(0, 50);
  }
  
  // Fall back to URL slug
  const slug = targetUrl.split('/').pop();
  return slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

/**
 * Insert internal link in content
 */
function insertInternalLink(content, targetUrl, anchorText) {
  // Find appropriate place to insert link (after H2/H3, in content sections)
  const sections = [
    // After H2
    /(<h2[^>]*>.*?<\/h2>)/g,
    // After H3
    /(<h3[^>]*>.*?<\/h3>)/g,
    // In paragraph
    /(<p[^>]*>.*?<\/p>)/g,
  ];
  
  for (const pattern of sections) {
    const matches = [...content.matchAll(pattern)];
    
    // Try to insert after first suitable section
    for (const match of matches) {
      if (match.index !== undefined) {
        const afterMatch = match.index + match[0].length;
        const nextChar = content.substring(afterMatch, afterMatch + 1);
        
        // Insert link after this section
        if (nextChar === '\n' || nextChar === ' ') {
          const before = content.substring(0, afterMatch);
          const after = content.substring(afterMatch);
          
          // Check if link already exists
          if (!before.includes(`to="${targetUrl}"`) && !after.includes(`to="${targetUrl}"`)) {
            const link = `\n              <Link to="${targetUrl}" className="text-blue-600 hover:text-blue-800 font-semibold">${anchorText}</Link>\n`;
            return before + link + after;
          }
        }
      }
    }
  }
  
  // Fallback: Insert at end of content section (before closing tags)
  const closingMatch = content.match(/(<\/section>|<\/SeoPageLayout>)/);
  if (closingMatch && closingMatch.index !== undefined) {
    const before = content.substring(0, closingMatch.index);
    const after = content.substring(closingMatch.index);
    
    if (!before.includes(`to="${targetUrl}"`)) {
      const link = `\n          <Link to="${targetUrl}" className="text-blue-600 hover:text-blue-800 font-semibold">${anchorText}</Link>\n`;
      return before + link + after;
    }
  }
  
  return content;
}

/**
 * Main linking function
 */
async function analyzeAndEnhanceInternalLinking() {
  console.log('🔗 Starting Internal Linking Analyzer...\n');
  
  // Load GSC data
  const gscDataMap = getGSCDataMap();
  const gscData = loadGSCPageData();
  console.log(`📊 Loaded ${gscData.length} URLs from GSC data\n`);
  
  // Collect all files
  const allFiles = collectSeoPageFiles(SEO_PAGES_DIR);
  console.log(`📁 Found ${allFiles.length} SEO page files\n`);
  
  // Build page index with metadata
  const pageIndex = new Map();
  const incomingLinks = new Map();
  
  // First pass: index all pages
  for (const filePath of allFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const slug = getSlugFromPath(filePath);
      const url = slug ? `/${slug}` : null;
      
      if (!url || url === '/') continue;
      
      const normalizedUrl = normalizeGSCUrl(`https://www.stockflow.be${url}`);
      const gscData = gscDataMap.get(normalizedUrl);
      
      const seoProps = extractSEOProps(content);
      const h1 = extractH1(content);
      const links = extractInternalLinks(content);
      
      // Extract keywords from title, description, H1
      const textContent = [
        seoProps.title || '',
        seoProps.description || '',
        h1 || ''
      ].join(' ');
      
      const keywords = extractKeywords(textContent);
      
      // Track incoming links
      links.forEach(link => {
        const targetUrl = link.to;
        if (!incomingLinks.has(targetUrl)) {
          incomingLinks.set(targetUrl, []);
        }
        incomingLinks.get(targetUrl).push(url);
      });
      
      pageIndex.set(url, {
        file: filePath,
        url,
        slug,
        title: seoProps.title,
        description: seoProps.description,
        h1,
        keywords,
        outgoingLinks: links.map(l => l.to),
        gscData: gscData || null,
        position: gscData?.position || 999,
        impressions: gscData?.impressions || 0,
        ctr: gscData?.ctr || 0,
        clicks: gscData?.clicks || 0
      });
    } catch (error) {
      console.error(`Error processing ${filePath}: ${error.message}`);
    }
  }
  
  // Categorize pages
  const highAuthorityPages = [];
  const lowAuthorityPages = [];
  const pagesNeedingLinks = [];
  
  pageIndex.forEach((page, url) => {
    const incomingCount = (incomingLinks.get(url) || []).length;
    
    // High authority: position < 20, impressions > 100
    if (page.position < 20 && page.impressions > 100) {
      highAuthorityPages.push(page);
    }
    
    // Low authority: position > 30, impressions < 50
    if (page.position > 30 && page.impressions < 50) {
      lowAuthorityPages.push(page);
    }
    
    // Pages needing links: < 5-10 incoming links
    if (incomingCount < 10) {
      pagesNeedingLinks.push({
        ...page,
        incomingCount
      });
    }
  });
  
  console.log(`📈 High Authority Pages (position < 20, impressions > 100): ${highAuthorityPages.length}`);
  console.log(`📉 Low Authority Pages (position > 30, impressions < 50): ${lowAuthorityPages.length}`);
  console.log(`🔗 Pages Needing Links (< 10 incoming): ${pagesNeedingLinks.length}\n`);
  
  // Generate link suggestions
  const linkSuggestions = [];
  
  // For each page needing links, find related high-authority pages
  pagesNeedingLinks.forEach(targetPage => {
    const suggestions = [];
    
    highAuthorityPages.forEach(sourcePage => {
      // Skip if already linked
      if (sourcePage.outgoingLinks.includes(targetPage.url)) {
        return;
      }
      
      // Calculate similarity
      const similarity = calculateSimilarity(sourcePage, targetPage);
      
      if (similarity > 0.2) { // Minimum similarity threshold
        suggestions.push({
          source: sourcePage,
          target: targetPage,
          similarity
        });
      }
    });
    
    // Sort by similarity and take top 3
    suggestions
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3)
      .forEach(suggestion => {
        linkSuggestions.push(suggestion);
      });
  });
  
  console.log(`💡 Generated ${linkSuggestions.length} link suggestions\n`);
  
  // Apply link suggestions
  const results = {
    added: [],
    skipped: [],
    errors: []
  };
  
  // Group suggestions by source page
  const suggestionsBySource = new Map();
  linkSuggestions.forEach(suggestion => {
    const sourceUrl = suggestion.source.url;
    if (!suggestionsBySource.has(sourceUrl)) {
      suggestionsBySource.set(sourceUrl, []);
    }
    suggestionsBySource.get(sourceUrl).push(suggestion);
  });
  
  // Apply links to source pages
  suggestionsBySource.forEach((suggestions, sourceUrl) => {
    const sourcePage = pageIndex.get(sourceUrl);
    if (!sourcePage) return;
    
    try {
      let content = fs.readFileSync(sourcePage.file, 'utf8');
      let modified = false;
      const addedLinks = [];
      
      suggestions.forEach(suggestion => {
        const targetUrl = suggestion.target.url;
        const anchorText = findAnchorText(targetUrl, suggestion.target);
        
        // Check if link already exists
        if (content.includes(`to="${targetUrl}"`)) {
          return;
        }
        
        // Insert link
        const newContent = insertInternalLink(content, targetUrl, anchorText);
        if (newContent !== content) {
          content = newContent;
          modified = true;
          addedLinks.push({
            to: targetUrl,
            anchor: anchorText,
            similarity: suggestion.similarity
          });
        }
      });
      
      if (modified) {
        fs.writeFileSync(sourcePage.file, content, 'utf8');
        
        results.added.push({
          file: path.relative(repoRoot, sourcePage.file),
          url: sourceUrl,
          links: addedLinks
        });
      } else {
        results.skipped.push({
          file: path.relative(repoRoot, sourcePage.file),
          url: sourceUrl,
          reason: 'Could not insert links (no suitable location found)'
        });
      }
    } catch (error) {
      results.errors.push({
        file: path.relative(repoRoot, sourcePage.file),
        url: sourceUrl,
        error: error.message
      });
    }
  });
  
  // Generate report
  console.log('\n📋 INTERNAL LINKING REPORT\n');
  console.log('='.repeat(80));
  
  console.log(`\n✅ Links Added (${results.added.length}):\n`);
  results.added.slice(0, 20).forEach(({ file, url, links }) => {
    console.log(`   ✓ ${file}`);
    console.log(`     URL: ${url}`);
    links.forEach(link => {
      console.log(`     → Added link to "${link.to}" (anchor: "${link.anchor}", similarity: ${(link.similarity * 100).toFixed(1)}%)`);
    });
    console.log();
  });
  
  if (results.added.length > 20) {
    console.log(`   ... and ${results.added.length - 20} more\n`);
  }
  
  if (results.skipped.length > 0) {
    console.log(`\n⏭️  Skipped (${results.skipped.length}):\n`);
    console.log(`   (Could not find suitable location to insert links)\n`);
  }
  
  if (results.errors.length > 0) {
    console.log(`\n❌ Errors (${results.errors.length}):\n`);
    results.errors.forEach(({ file, error }) => {
      console.log(`   ✗ ${file}: ${error}\n`);
    });
  }
  
  console.log('\n' + '='.repeat(80));
  console.log(`\n📊 SUMMARY:\n`);
  console.log(`   High Authority Pages: ${highAuthorityPages.length}`);
  console.log(`   Low Authority Pages: ${lowAuthorityPages.length}`);
  console.log(`   Pages Needing Links: ${pagesNeedingLinks.length}`);
  console.log(`   Link Suggestions Generated: ${linkSuggestions.length}`);
  console.log(`   Links Added: ${results.added.reduce((sum, r) => sum + r.links.length, 0)}`);
  console.log(`   Pages Modified: ${results.added.length}`);
  console.log(`   Errors: ${results.errors.length}\n`);
  
  // Save report
  const reportPath = path.join(repoRoot, 'seo-internal-linking-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    summary: {
      highAuthorityPages: highAuthorityPages.length,
      lowAuthorityPages: lowAuthorityPages.length,
      pagesNeedingLinks: pagesNeedingLinks.length,
      linkSuggestions: linkSuggestions.length,
      linksAdded: results.added.reduce((sum, r) => sum + r.links.length, 0),
      pagesModified: results.added.length,
      errors: results.errors.length
    },
    added: results.added.slice(0, 50),
    skipped: results.skipped.slice(0, 50),
    errors: results.errors
  }, null, 2));
  
  console.log(`📄 Report saved to: ${path.relative(repoRoot, reportPath)}\n`);
  
  return results;
}

// Run analyzer
analyzeAndEnhanceInternalLinking().catch(error => {
  console.error('❌ Error during internal linking analysis:', error);
  process.exit(1);
});

