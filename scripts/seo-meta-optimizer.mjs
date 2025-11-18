import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getGSCDataMap,
  normalizeGSCUrl
} from './utils/gsc-data-loader.mjs';
import {
  collectSeoPageFiles,
  getSlugFromPath,
  extractSEOProps,
  updateSEOProps,
  generatePrimaryKeyword
} from './utils/seo-file-parser.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const SEO_PAGES_DIR = path.join(repoRoot, 'src', 'pages', 'SEO');

/**
 * Optimize title based on GSC data and page content
 */
function optimizeTitle(currentTitle, primaryKeyword, gscData, filename) {
  // Check if page needs aggressive optimization (high impressions, low CTR)
  const needsAggressiveOptimization = gscData && 
    gscData.impressions > 500 && 
    gscData.ctr < 1.0;
  
  // Start with primary keyword
  let optimized = primaryKeyword;
  
  // Add benefit/number for high-impression pages
  if (needsAggressiveOptimization) {
    const benefits = ['2025', 'Beste', 'Complete Guide', '10 Tips', 'Handleiding'];
    const randomBenefit = benefits[Math.floor(Math.random() * benefits.length)];
    optimized = `${randomBenefit} ${optimized}`;
  } else {
    // Add year for relevance
    optimized = `${optimized} 2025`;
  }
  
  // Truncate to 60 chars (optimal for search results)
  if (optimized.length > 60) {
    optimized = optimized.substring(0, 57) + '...';
  }
  
  // Ensure minimum length
  if (optimized.length < 40 && currentTitle) {
    // Use part of current title if available
    const currentWords = currentTitle.split(' ').slice(0, 3);
    optimized = `${optimized} - ${currentWords.join(' ')}`;
    if (optimized.length > 60) {
      optimized = optimized.substring(0, 57) + '...';
    }
  }
  
  return optimized;
}

/**
 * Optimize description based on GSC data and page content
 */
function optimizeDescription(currentDesc, primaryKeyword, gscData, filename) {
  // Check language (Dutch vs English)
  const isDutch = filename.includes('voorraadbeheer') || 
                  filename.includes('stockbeheer') || 
                  filename.includes('magazijnbeheer');
  
  // Action-oriented opening (Dutch or English)
  const openings = isDutch ? [
    'Ontdek hoe',
    'Lees de gids',
    'Bekijk hoe',
    'Vind uit hoe'
  ] : [
    'Discover how',
    'Learn how',
    'Find out how',
    'Read the guide'
  ];
  
  const opening = openings[Math.floor(Math.random() * openings.length)];
  
  // Value proposition
  const valueProps = isDutch ? [
    'uw voorraadbeheer te optimaliseren',
    'de beste software te kiezen',
    'tijd en geld te besparen',
    'uw processen te automatiseren'
  ] : [
    'to optimize your inventory management',
    'to choose the best software',
    'to save time and money',
    'to automate your processes'
  ];
  
  const valueProp = valueProps[Math.floor(Math.random() * valueProps.length)];
  
  // Call to action
  const ctas = isDutch ? [
    'Start vandaag gratis',
    'Begin nu met gratis proefperiode',
    'Krijg direct toegang'
  ] : [
    'Start free today',
    'Try free now',
    'Get started free'
  ];
  
  const cta = ctas[Math.floor(Math.random() * ctas.length)];
  
  // Build description
  let description = `${opening} ${primaryKeyword.toLowerCase()} ${valueProp}. ${cta}.`;
  
  // Add context if space allows
  if (description.length < 140 && currentDesc) {
    const currentWords = currentDesc.split(' ').slice(0, 10);
    const extraContext = currentWords.join(' ');
    description = `${opening} ${primaryKeyword.toLowerCase()} ${valueProp}. ${extraContext}. ${cta}.`;
  }
  
  // Ensure length is between 150-160 chars (optimal for search results)
  if (description.length < 150) {
    description = description + ' StockFlow helpt bedrijven hun voorraad efficiënt te beheren.';
    if (!isDutch) {
      description = description.replace('helpt bedrijven hun voorraad efficiënt te beheren', 'helps businesses manage inventory efficiently');
    }
  }
  
  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  }
  
  return description;
}

/**
 * Main optimization function
 */
async function optimizeMetaTags() {
  console.log('📝 Starting Meta Tag Optimizer...\n');
  
  // Load GSC data
  const gscDataMap = getGSCDataMap();
  console.log(`📊 Loaded ${gscDataMap.size} URLs from GSC data\n`);
  
  // Collect all files
  const allFiles = collectSeoPageFiles(SEO_PAGES_DIR);
  console.log(`📁 Found ${allFiles.length} SEO page files\n`);
  
  const results = {
    optimized: [],
    skipped: [],
    errors: []
  };
  
  // Identify high-priority pages (high impressions, low CTR)
  const highPriorityPages = [];
  
  for (const filePath of allFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const slug = getSlugFromPath(filePath);
      const url = slug ? `/${slug}` : null;
      const filename = path.basename(filePath);
      
      if (!url || url === '/') {
        results.skipped.push({
          file: path.relative(repoRoot, filePath),
          reason: 'Could not determine URL'
        });
        continue;
      }
      
      // Get GSC data for this URL
      const normalizedUrl = normalizeGSCUrl(`https://www.stockflow.be${url}`);
      const gscData = gscDataMap.get(normalizedUrl);
      
      // Extract current SEO props
      const currentProps = extractSEOProps(content);
      
      // Generate primary keyword from filename/slug
      const primaryKeyword = generatePrimaryKeyword(filename);
      
      // Optimize title
      const optimizedTitle = optimizeTitle(
        currentProps.title,
        primaryKeyword,
        gscData,
        filename
      );
      
      // Optimize description
      const optimizedDesc = optimizeDescription(
        currentProps.description,
        primaryKeyword,
        gscData,
        filename
      );
      
      // Check if optimization is needed
      const titleChanged = optimizedTitle !== currentProps.title;
      const descChanged = optimizedDesc !== currentProps.description;
      
      if (!titleChanged && !descChanged) {
        results.skipped.push({
          file: path.relative(repoRoot, filePath),
          url,
          reason: 'Already optimized'
        });
        continue;
      }
      
      // Track high-priority pages
      if (gscData && gscData.impressions > 500 && gscData.ctr < 1.0) {
        highPriorityPages.push({
          file: path.relative(repoRoot, filePath),
          url,
          impressions: gscData.impressions,
          ctr: gscData.ctr
        });
      }
      
      // Update content
      const updates = {};
      if (titleChanged) {
        updates.title = optimizedTitle;
      }
      if (descChanged) {
        updates.description = optimizedDesc;
      }
      
      const updatedContent = updateSEOProps(content, updates);
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      
      results.optimized.push({
        file: path.relative(repoRoot, filePath),
        url,
        changes: {
          title: titleChanged ? { from: currentProps.title, to: optimizedTitle } : null,
          description: descChanged ? { from: currentProps.description, to: optimizedDesc } : null
        },
        gscData: gscData || null
      });
      
    } catch (error) {
      results.errors.push({
        file: path.relative(repoRoot, filePath),
        error: error.message
      });
    }
  }
  
  // Generate report
  console.log('\n📋 META TAG OPTIMIZATION REPORT\n');
  console.log('='.repeat(80));
  
  console.log(`\n🎯 High-Priority Pages (Impressions > 500, CTR < 1%): ${highPriorityPages.length}\n`);
  highPriorityPages.slice(0, 10).forEach(({ file, url, impressions, ctr }) => {
    console.log(`   ⚡ ${file}`);
    console.log(`     URL: ${url}`);
    console.log(`     Impressions: ${impressions}, CTR: ${ctr.toFixed(2)}%\n`);
  });
  
  console.log(`\n✅ Optimized Pages (${results.optimized.length}):\n`);
  results.optimized.slice(0, 20).forEach(({ file, url, changes }) => {
    console.log(`   ✓ ${file}`);
    console.log(`     URL: ${url}`);
    if (changes.title) {
      console.log(`     Title: "${changes.title.from}" → "${changes.title.to}"`);
    }
    if (changes.description) {
      const fromDesc = changes.description.from ? changes.description.from.substring(0, 60) : 'N/A';
      const toDesc = changes.description.to ? changes.description.to.substring(0, 60) : 'N/A';
      console.log(`     Description: "${fromDesc}..." → "${toDesc}..."`);
    }
    console.log();
  });
  
  if (results.optimized.length > 20) {
    console.log(`   ... and ${results.optimized.length - 20} more\n`);
  }
  
  console.log(`\n⏭️  Skipped Pages (${results.skipped.length}):\n`);
  if (results.skipped.length > 0) {
    console.log(`   (All pages already optimized or could not determine URL)\n`);
  }
  
  if (results.errors.length > 0) {
    console.log(`\n❌ Errors (${results.errors.length}):\n`);
    results.errors.forEach(({ file, error }) => {
      console.log(`   ✗ ${file}: ${error}\n`);
    });
  }
  
  console.log('\n' + '='.repeat(80));
  console.log(`\n📊 SUMMARY:\n`);
  console.log(`   Optimized: ${results.optimized.length}`);
  console.log(`   High-priority: ${highPriorityPages.length}`);
  console.log(`   Skipped: ${results.skipped.length}`);
  console.log(`   Errors: ${results.errors.length}`);
  console.log(`   Total: ${allFiles.length}\n`);
  
  // Save report
  const reportPath = path.join(repoRoot, 'seo-meta-optimization-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    summary: {
      optimized: results.optimized.length,
      highPriority: highPriorityPages.length,
      skipped: results.skipped.length,
      errors: results.errors.length,
      total: allFiles.length
    },
    highPriorityPages: highPriorityPages.slice(0, 50),
    optimized: results.optimized.slice(0, 100).map(r => ({
      file: r.file,
      url: r.url,
      titleChange: r.changes.title,
      descriptionChange: r.changes.description
    })),
    errors: results.errors
  }, null, 2));
  
  console.log(`📄 Report saved to: ${path.relative(repoRoot, reportPath)}\n`);
  
  return results;
}

// Run optimizer
optimizeMetaTags().catch(error => {
  console.error('❌ Error during meta optimization:', error);
  process.exit(1);
});

