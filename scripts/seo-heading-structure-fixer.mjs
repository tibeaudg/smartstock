import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  collectSeoPageFiles,
  getSlugFromPath,
  extractHeadings,
  extractH1,
  extractSEOProps,
  generatePrimaryKeyword
} from './utils/seo-file-parser.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const SEO_PAGES_DIR = path.join(repoRoot, 'src', 'pages', 'SEO');

/**
 * Check heading hierarchy for skipped levels
 */
function checkHeadingHierarchy(headings) {
  const issues = [];
  let lastLevel = 0;
  
  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    
    // Check if we're skipping levels (e.g., H2 → H4)
    if (lastLevel > 0 && heading.level > lastLevel + 1) {
      issues.push({
        type: 'skipped-level',
        heading,
        expected: lastLevel + 1,
        actual: heading.level
      });
    }
    
    lastLevel = heading.level;
  }
  
  return issues;
}

/**
 * Generate H1 from filename/keyword
 */
function generateH1FromSlug(slug, filename) {
  if (!slug) {
    const baseName = path.basename(filename, '.tsx');
    slug = baseName;
  }
  
  // Convert slug to readable title
  const words = slug.split('/').pop().split('-');
  const title = words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  return title;
}

/**
 * Fix heading structure in content
 */
function fixHeadingStructure(content, slug, filename) {
  const headings = extractHeadings(content);
  const h1 = extractH1(content);
  const issues = checkHeadingHierarchy(headings);
  
  let fixed = content;
  let fixes = [];
  
  // Check if H1 exists
  if (!h1 || h1.trim() === '') {
    // Generate H1 from slug
    const generatedH1 = generateH1FromSlug(slug, filename);
    
    // Try to find where to insert H1 (usually after SEO component or first section)
    const seoMatch = content.match(/<SEO[^>]*\/>/s);
    const sectionMatch = content.match(/<section[^>]*>/i);
    
    let insertPosition = 0;
    if (seoMatch && seoMatch.index !== undefined) {
      insertPosition = seoMatch.index + seoMatch[0].length;
    } else if (sectionMatch && sectionMatch.index !== undefined) {
      insertPosition = sectionMatch.index;
    }
    
    // Insert H1
    const beforeInsert = fixed.substring(0, insertPosition);
    const afterInsert = fixed.substring(insertPosition);
    
    // Find a good place to insert (after whitespace/newline)
    const newlineMatch = afterInsert.match(/^\s*\n/);
    const insertOffset = newlineMatch ? newlineMatch[0].length : 0;
    
    fixed = beforeInsert + afterInsert.substring(0, insertOffset) + 
            `\n              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">${generatedH1}</h1>\n` +
            afterInsert.substring(insertOffset);
    
    fixes.push({ type: 'added-h1', h1: generatedH1 });
  }
  
  // Fix skipped levels
  if (issues.length > 0) {
    issues.forEach(issue => {
      if (issue.type === 'skipped-level') {
        // Replace the heading level
        const headingPattern = new RegExp(
          `<h${issue.actual}[^>]*>${issue.heading.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\/h${issue.actual}>`,
          'i'
        );
        
        if (headingPattern.test(fixed)) {
          fixed = fixed.replace(
            headingPattern,
            `<h${issue.expected} className="${issue.heading.text.length > 50 ? 'text-2xl' : 'text-3xl'} font-bold mb-4">${issue.heading.text}</h${issue.expected}>`
          );
          fixes.push({
            type: 'fixed-skipped-level',
            from: `h${issue.actual}`,
            to: `h${issue.expected}`,
            text: issue.heading.text
          });
        }
      }
    });
  }
  
  // Check for multiple H1s
  const h1Matches = fixed.match(/<h1[^>]*>/gi);
  if (h1Matches && h1Matches.length > 1) {
    // Keep the first H1, convert others to H2
    let h1Count = 0;
    fixed = fixed.replace(/<h1([^>]*)>/gi, (match, attrs) => {
      h1Count++;
      if (h1Count === 1) {
        return match;
      }
      // Convert to H2
      fixes.push({ type: 'converted-h1-to-h2', text: 'Multiple H1s found' });
      return `<h2${attrs}>`;
    });
    
    fixed = fixed.replace(/<\/h1>/gi, (match, offset) => {
      const before = fixed.substring(0, offset);
      const h1Count = (before.match(/<h1[^>]*>/gi) || []).length;
      const h1CloseCount = (before.match(/<\/h1>/gi) || []).length;
      
      if (h1CloseCount >= h1Count) {
        return '</h2>';
      }
      return match;
    });
  }
  
  return { fixed, fixes };
}

/**
 * Main fix function
 */
async function fixHeadingStructures() {
  console.log('🔧 Starting Heading Structure Fixer...\n');
  
  const allFiles = collectSeoPageFiles(SEO_PAGES_DIR);
  console.log(`📁 Found ${allFiles.length} SEO page files\n`);
  
  const results = {
    fixed: [],
    skipped: [],
    errors: []
  };
  
  for (const filePath of allFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const slug = getSlugFromPath(filePath);
      const filename = path.basename(filePath);
      
      // Extract current structure
      const headings = extractHeadings(content);
      const h1 = extractH1(content);
      const issues = checkHeadingHierarchy(headings);
      
      // Check if fixes are needed
      const needsFix = !h1 || issues.length > 0 || (content.match(/<h1[^>]*>/gi) || []).length !== 1;
      
      if (!needsFix) {
        results.skipped.push({
          file: path.relative(repoRoot, filePath),
          url: slug ? `/${slug}` : null,
          reason: 'Already correct'
        });
        continue;
      }
      
      // Apply fixes
      const { fixed, fixes } = fixHeadingStructure(content, slug, filename);
      
      if (fixes.length > 0) {
        // Write fixed content
        fs.writeFileSync(filePath, fixed, 'utf8');
        
        results.fixed.push({
          file: path.relative(repoRoot, filePath),
          url: slug ? `/${slug}` : null,
          fixes
        });
      } else {
        results.skipped.push({
          file: path.relative(repoRoot, filePath),
          url: slug ? `/${slug}` : null,
          reason: 'No fixes applied (unexpected)'
        });
      }
    } catch (error) {
      results.errors.push({
        file: path.relative(repoRoot, filePath),
        error: error.message
      });
    }
  }
  
  // Generate report
  console.log('\n📋 HEADING STRUCTURE FIX REPORT\n');
  console.log('='.repeat(80));
  
  console.log(`\n✅ Fixed Pages (${results.fixed.length}):\n`);
  results.fixed.slice(0, 20).forEach(({ file, url, fixes }) => {
    console.log(`   ✓ ${file}`);
    console.log(`     URL: ${url || 'N/A'}`);
    fixes.forEach(fix => {
      if (fix.type === 'added-h1') {
        console.log(`     + Added H1: "${fix.h1}"`);
      } else if (fix.type === 'fixed-skipped-level') {
        console.log(`     ↻ Fixed ${fix.from} → ${fix.to}: "${fix.text.substring(0, 50)}..."`);
      } else if (fix.type === 'converted-h1-to-h2') {
        console.log(`     ↻ Converted duplicate H1 to H2`);
      }
    });
    console.log();
  });
  
  if (results.fixed.length > 20) {
    console.log(`   ... and ${results.fixed.length - 20} more\n`);
  }
  
  console.log(`\n⏭️  Skipped Pages (${results.skipped.length}):\n`);
  if (results.skipped.length > 0) {
    console.log(`   (All pages already have correct heading structure)\n`);
  }
  
  if (results.errors.length > 0) {
    console.log(`\n❌ Errors (${results.errors.length}):\n`);
    results.errors.forEach(({ file, error }) => {
      console.log(`   ✗ ${file}: ${error}\n`);
    });
  }
  
  console.log('\n' + '='.repeat(80));
  console.log(`\n📊 SUMMARY:\n`);
  console.log(`   Fixed: ${results.fixed.length}`);
  console.log(`   Skipped: ${results.skipped.length}`);
  console.log(`   Errors: ${results.errors.length}`);
  console.log(`   Total: ${allFiles.length}\n`);
  
  // Save report
  const reportPath = path.join(repoRoot, 'seo-heading-fix-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`📄 Report saved to: ${path.relative(repoRoot, reportPath)}\n`);
  
  return results;
}

// Run fixer
fixHeadingStructures().catch(error => {
  console.error('❌ Error during heading fix:', error);
  process.exit(1);
});

