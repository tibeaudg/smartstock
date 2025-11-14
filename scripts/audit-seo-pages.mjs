import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const SEO_PAGES_DIRS = [
  path.join(repoRoot, 'src', 'pages', 'SEO'),
  path.join(repoRoot, 'src', 'pages', 'seo'),
];

const MIN_CONTENT_LENGTH = 300; // Minimum words for a quality page
const MIN_WORDS = 300;

// Collect all SEO page files
function collectSeoPages(dirPath, baseDir = dirPath) {
  const pages = [];
  if (!fs.existsSync(dirPath)) {
    return pages;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const childPages = collectSeoPages(
        path.join(dirPath, entry.name),
        baseDir
      );
      pages.push(...childPages);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith('.tsx')) {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);
    pages.push(fullPath);
  }

  return pages;
}

// Count words in content (rough estimate)
function countWords(text) {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

// Check if page has noindex
function hasNoindex(content) {
  const noindexPatterns = [
    /noindex\s*=\s*true/,
    /noindex:\s*true/,
    /"noindex"/,
    /'noindex'/,
    /meta\s+name=["']robots["']\s+content=["'][^"']*noindex/,
  ];
  
  return noindexPatterns.some(pattern => pattern.test(content));
}

// Check if page has structured data
function hasStructuredData(content) {
  return /application\/ld\+json/.test(content) || /StructuredData/.test(content);
}

// Check if page has SEO component
function hasSeoComponent(content) {
  return /<SEO\s+/.test(content) || /from ['"]@\/components\/SEO['"]/.test(content);
}

// Get route path from file path
function getRouteFromPath(filePath) {
  const relative = path
    .relative(path.join(repoRoot, 'src', 'pages'), filePath)
    .replace(/\\/g, '/')
    .replace(/^(SEO|seo)\//, '')
    .replace(/index\.tsx$/i, '')
    .replace(/\.tsx$/, '')
    .replace(/\/+$/, '');

  if (!relative || relative === '.') {
    return null;
  }

  return `/${relative}`;
}

// Main audit function
function auditSeoPages() {
  console.log('🔍 Starting SEO Pages Audit...\n');

  const allPages = SEO_PAGES_DIRS.flatMap(dir => collectSeoPages(dir));
  console.log(`Found ${allPages.length} SEO pages\n`);

  const issues = {
    noindex: [],
    lowContent: [],
    noStructuredData: [],
    noSeoComponent: [],
    encodingIssues: [],
  };

  const stats = {
    total: allPages.length,
    withNoindex: 0,
    lowContent: 0,
    noStructuredData: 0,
    noSeoComponent: 0,
    encodingIssues: 0,
    healthy: 0,
  };

  for (const pagePath of allPages) {
    const content = fs.readFileSync(pagePath, 'utf-8');
    const route = getRouteFromPath(pagePath);
    const relativePath = path.relative(repoRoot, pagePath);

    // Check for encoding issues
    if (/ï¿½/.test(content)) {
      issues.encodingIssues.push(relativePath);
      stats.encodingIssues++;
    }

    // Check for noindex
    if (hasNoindex(content)) {
      issues.noindex.push(relativePath);
      stats.withNoindex++;
    }

    // Check for SEO component
    if (!hasSeoComponent(content)) {
      issues.noSeoComponent.push(relativePath);
      stats.noSeoComponent++;
    }

    // Check for structured data
    if (!hasStructuredData(content)) {
      issues.noStructuredData.push(relativePath);
      stats.noStructuredData++;
    }

    // Check content length (rough estimate)
    const wordCount = countWords(content);
    if (wordCount < MIN_WORDS) {
      issues.lowContent.push({ path: relativePath, words: wordCount });
      stats.lowContent++;
    }

    // Count healthy pages
    if (
      !hasNoindex(content) &&
      hasSeoComponent(content) &&
      hasStructuredData(content) &&
      wordCount >= MIN_WORDS &&
      !/ï¿½/.test(content)
    ) {
      stats.healthy++;
    }
  }

  // Print results
  console.log('📊 Audit Results:\n');
  console.log(`Total pages: ${stats.total}`);
  console.log(`✅ Healthy pages: ${stats.healthy}`);
  console.log(`⚠️  Pages with issues: ${stats.total - stats.healthy}\n`);

  if (issues.noindex.length > 0) {
    console.log(`\n❌ Pages with noindex (${issues.noindex.length}):`);
    issues.noindex.forEach(p => console.log(`   - ${p}`));
  }

  if (issues.encodingIssues.length > 0) {
    console.log(`\n❌ Pages with encoding issues (${issues.encodingIssues.length}):`);
    issues.encodingIssues.forEach(p => console.log(`   - ${p}`));
  }

  if (issues.lowContent.length > 0) {
    console.log(`\n⚠️  Pages with low content (<${MIN_WORDS} words) (${issues.lowContent.length}):`);
    issues.lowContent.forEach(({ path: p, words }) => 
      console.log(`   - ${p} (${words} words)`)
    );
  }

  if (issues.noStructuredData.length > 0) {
    console.log(`\n⚠️  Pages without structured data (${issues.noStructuredData.length}):`);
    issues.noStructuredData.slice(0, 10).forEach(p => console.log(`   - ${p}`));
    if (issues.noStructuredData.length > 10) {
      console.log(`   ... and ${issues.noStructuredData.length - 10} more`);
    }
  }

  if (issues.noSeoComponent.length > 0) {
    console.log(`\n❌ Pages without SEO component (${issues.noSeoComponent.length}):`);
    issues.noSeoComponent.forEach(p => console.log(`   - ${p}`));
  }

  console.log('\n✅ Audit complete!');
  
  // Return exit code based on issues
  const hasCriticalIssues = issues.noindex.length > 0 || issues.encodingIssues.length > 0;
  process.exit(hasCriticalIssues ? 1 : 0);
}

// Run audit
auditSeoPages();

