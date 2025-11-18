import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  loadGSCPageData,
  getURLsWithImpressions,
  isLanguagePrefixedUrl,
  normalizeGSCUrl
} from './utils/gsc-data-loader.mjs';
import {
  collectSeoPageFiles,
  getSlugFromPath
} from './utils/seo-file-parser.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const SEO_PAGES_DIR = path.join(repoRoot, 'src', 'pages', 'SEO');

/**
 * Check if a page should be kept based on future relevance heuristics
 */
function isFutureRelevant(filename, urlSlug) {
  // Keep glossary pages
  if (urlSlug && urlSlug.startsWith('glossary/')) {
    return true;
  }
  
  // Keep industry-specific pages
  const industryKeywords = ['hospitality', 'bakery', 'retail', 'manufacturing', 'healthcare'];
  if (industryKeywords.some(kw => filename.includes(kw) || urlSlug.includes(kw))) {
    return true;
  }
  
  // Keep comparison pages
  if (filename.includes('vs-') || urlSlug.includes('vs-')) {
    return true;
  }
  
  // Keep feature pages
  if (filename.includes('feature') || urlSlug.includes('feature')) {
    return true;
  }
  
  // Keep guide/tips pages
  const guideKeywords = ['guide', 'tip', 'how-to', 'best'];
  if (guideKeywords.some(kw => filename.includes(kw) || urlSlug.includes(kw))) {
    return true;
  }
  
  // Remove test/experimental pages
  if (filename.includes('test') || filename.includes('experiment') || filename.includes('temp')) {
    return false;
  }
  
  // Default: keep if uncertain
  return true;
}

/**
 * Main cleanup function
 */
async function cleanupPages() {
  console.log('🧹 Starting SEO Page Cleanup...\n');
  
  // Load GSC data
  const gscData = loadGSCPageData();
  const urlsWithImpressions = getURLsWithImpressions();
  
  console.log(`📊 Loaded ${gscData.length} URLs from GSC data`);
  console.log(`📈 Found ${urlsWithImpressions.size} URLs with impressions > 0\n`);
  
  // Collect all SEO page files
  const allFiles = collectSeoPageFiles(SEO_PAGES_DIR);
  console.log(`📁 Found ${allFiles.length} SEO page files\n`);
  
  // Map files to URLs and categorize
  const pagesToDelete = [];
  const pagesToKeep = [];
  const pagesToReview = [];
  const languagePrefixedUrls = [];
  
  // First, identify language-prefixed URLs from GSC
  gscData.forEach(row => {
    const normalizedUrl = normalizeGSCUrl(row.url);
    if (isLanguagePrefixedUrl(row.url) && !normalizedUrl.startsWith('/nl')) {
      languagePrefixedUrls.push(row.url);
    }
  });
  
  console.log(`🌍 Found ${languagePrefixedUrls.length} language-prefixed URLs (excluding /nl/):\n`);
  languagePrefixedUrls.forEach(url => {
    console.log(`   - ${url}`);
  });
  console.log();
  
  // Analyze each file
  for (const filePath of allFiles) {
    const slug = getSlugFromPath(filePath);
    const url = slug ? `/${slug}` : null;
    const filename = path.basename(filePath);
    
    // Skip if no slug could be determined
    if (!url || url === '/') {
      pagesToReview.push({
        file: filePath,
        reason: 'Could not determine URL slug',
        url: null
      });
      continue;
    }
    
    // Check if URL exists in GSC with impressions
    const hasImpressions = urlsWithImpressions.has(url);
    
    // Check future relevance
    const futureRelevant = isFutureRelevant(filename, slug);
    
    if (!hasImpressions && !futureRelevant) {
      pagesToDelete.push({
        file: filePath,
        url: url,
        reason: 'No impressions in GSC and not future-relevant'
      });
    } else if (!hasImpressions && futureRelevant) {
      pagesToKeep.push({
        file: filePath,
        url: url,
        reason: 'No impressions but future-relevant (glossary, industry, comparison, etc.)'
      });
    } else {
      pagesToKeep.push({
        file: filePath,
        url: url,
        reason: `Has impressions in GSC (${gscData.find(d => normalizeGSCUrl(d.url) === url)?.impressions || 0})`
      });
    }
  }
  
  // Generate report
  console.log('\n📋 CLEANUP REPORT\n');
  console.log('=' .repeat(80));
  
  console.log(`\n🗑️  Pages to DELETE (${pagesToDelete.length}):\n`);
  if (pagesToDelete.length > 0) {
    pagesToDelete.forEach(({ file, url, reason }) => {
      console.log(`   ❌ ${path.relative(repoRoot, file)}`);
      console.log(`      URL: ${url}`);
      console.log(`      Reason: ${reason}\n`);
    });
  } else {
    console.log('   (None)\n');
  }
  
  console.log(`\n✅ Pages to KEEP (${pagesToKeep.length}):\n`);
  // Show first 10 and summary
  pagesToKeep.slice(0, 10).forEach(({ file, url, reason }) => {
    console.log(`   ✓ ${path.relative(repoRoot, file)}`);
    console.log(`     URL: ${url}`);
    console.log(`     Reason: ${reason}\n`);
  });
  if (pagesToKeep.length > 10) {
    console.log(`   ... and ${pagesToKeep.length - 10} more\n`);
  }
  
  console.log(`\n⚠️  Pages to REVIEW (${pagesToReview.length}):\n`);
  if (pagesToReview.length > 0) {
    pagesToReview.forEach(({ file, reason }) => {
      console.log(`   ? ${path.relative(repoRoot, file)}`);
      console.log(`     Reason: ${reason}\n`);
    });
  } else {
    console.log('   (None)\n');
  }
  
  // Ask for confirmation before deleting
  console.log('\n' + '='.repeat(80));
  console.log(`\n⚠️  SUMMARY:\n`);
  console.log(`   Pages to delete: ${pagesToDelete.length}`);
  console.log(`   Pages to keep: ${pagesToKeep.length}`);
  console.log(`   Pages to review: ${pagesToReview.length}`);
  console.log(`   Language-prefixed URLs found: ${languagePrefixedUrls.length}`);
  
  // For now, just report - actual deletion will be done separately
  // or can be enabled with a flag
  if (process.argv.includes('--delete')) {
    console.log('\n🗑️  DELETING PAGES...\n');
    let deletedCount = 0;
    
    for (const { file } of pagesToDelete) {
      try {
        fs.unlinkSync(file);
        console.log(`   ✓ Deleted: ${path.relative(repoRoot, file)}`);
        deletedCount++;
      } catch (error) {
        console.error(`   ✗ Failed to delete ${path.relative(repoRoot, file)}: ${error.message}`);
      }
    }
    
    console.log(`\n✅ Deleted ${deletedCount} files\n`);
  } else {
    console.log('\n💡 To actually delete files, run with --delete flag');
    console.log('   Example: node scripts/seo-page-cleanup.mjs --delete\n');
  }
  
  // Save report to file
  const reportPath = path.join(repoRoot, 'seo-cleanup-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    summary: {
      totalFiles: allFiles.length,
      pagesToDelete: pagesToDelete.length,
      pagesToKeep: pagesToKeep.length,
      pagesToReview: pagesToReview.length,
      languagePrefixedUrls: languagePrefixedUrls.length
    },
    pagesToDelete: pagesToDelete.map(p => ({
      file: path.relative(repoRoot, p.file),
      url: p.url,
      reason: p.reason
    })),
    pagesToKeep: pagesToKeep.slice(0, 50).map(p => ({
      file: path.relative(repoRoot, p.file),
      url: p.url,
      reason: p.reason
    })),
    pagesToReview: pagesToReview.map(p => ({
      file: path.relative(repoRoot, p.file),
      reason: p.reason
    })),
    languagePrefixedUrls
  }, null, 2));
  
  console.log(`📄 Report saved to: ${path.relative(repoRoot, reportPath)}\n`);
  
  return {
    pagesToDelete,
    pagesToKeep,
    pagesToReview,
    languagePrefixedUrls
  };
}

// Run cleanup
cleanupPages().catch(error => {
  console.error('❌ Error during cleanup:', error);
  process.exit(1);
});

