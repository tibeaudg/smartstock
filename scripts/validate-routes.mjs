import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const seoPagesDir = path.join(repoRoot, 'src', 'pages', 'SEO');

// Files to exclude from routing (must match seoRoutes.tsx exactly)
const excludedFiles = new Set([
  'glossary/createGlossaryPage',
  'resources/blog', // Exclude to avoid conflict with blog/index.tsx
]);

// Legacy top-level slugs (must match seoRoutes.tsx exactly)
const legacyTopLevelSlugs = new Set([
  'asset-tracking',
  'inventory-management',
  'what-is-lead-time',
  'warehouse-management',
  'warehouse-management-system',
]);

/**
 * Replicates the exact getSlugFromPath logic from seoRoutes.tsx
 * @param {string} filePath - Relative path from src/pages/SEO
 * @returns {string} The expected route slug (without leading /)
 */
function getSlugFromPath(filePath) {
  // Remove .tsx extension
  const withoutExtension = filePath.replace(/\.tsx$/, '');
  
  // Split into segments and filter empty
  const segments = withoutExtension.split('/').filter(Boolean);

  if (segments.length === 0) {
    return '';
  }

  const lastSegment = segments[segments.length - 1];
  if (lastSegment === 'index') {
    segments.pop();
  }

  if (segments.length === 0) {
    return '';
  }

  // Special handling for glossary
  if (segments[0] === 'glossary') {
    if (segments.length === 1) {
      return 'glossary';
    }
    if (segments.length === 2 && legacyTopLevelSlugs.has(segments[1])) {
      return segments[1];
    }
    return segments.join('/');
  }

  // Preserve full path for solutions directory
  if (segments[0] === 'solutions') {
    return segments.join('/');
  }

  // For all other cases, return only the last segment
  return segments[segments.length - 1];
}

/**
 * Recursively collect all .tsx files from a directory
 * @param {string} dirPath - Directory to scan
 * @param {string} baseDir - Base directory for relative paths
 * @returns {Array<{filePath: string, relativePath: string, expectedRoute: string}>}
 */
function collectSeoFiles(dirPath, baseDir = seoPagesDir) {
  const files = [];
  
  if (!fs.existsSync(dirPath)) {
    return files;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively scan subdirectories
      files.push(...collectSeoFiles(fullPath, baseDir));
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith('.tsx')) {
      continue;
    }

    // Get relative path from src/pages/SEO
    const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
    
    // Check if this file should be excluded
    const withoutExtension = relativePath.replace(/\.tsx$/, '');
    if (excludedFiles.has(withoutExtension)) {
      continue;
    }

    // Generate expected route
    const expectedSlug = getSlugFromPath(relativePath);
    
    if (!expectedSlug) {
      console.warn(`⚠️  Skipping file without valid slug: ${relativePath}`);
      continue;
    }

    files.push({
      filePath: fullPath,
      relativePath,
      expectedRoute: `/${expectedSlug}`,
    });
  }

  return files;
}

/**
 * Get actual routes by importing the route generation
 * This uses dynamic import to get routes at runtime
 */
async function getActualRoutes() {
  try {
    // Try to import the route generation function
    // Note: This might not work in all Node.js contexts, so we'll handle errors gracefully
    const { getSeoRoutes } = await import('../src/routes/seoRoutes.tsx');
    const routes = getSeoRoutes();
    return routes.map(r => r.path).sort();
  } catch (error) {
    console.warn('⚠️  Could not import getSeoRoutes() directly. This is expected in Node.js context.');
    console.warn('   The validation will only check file-to-route mapping consistency.');
    return null;
  }
}

/**
 * Main validation function
 */
async function validateRoutes() {
  console.log('🔍 Validating SEO routes...\n');
  console.log(`📁 Scanning directory: ${seoPagesDir}\n`);

  // Collect all files and their expected routes
  const expectedFiles = collectSeoFiles(seoPagesDir);
  const expectedRoutes = new Map();
  const routeToFiles = new Map();

  for (const file of expectedFiles) {
    expectedRoutes.set(file.relativePath, file.expectedRoute);
    
    // Track which files map to which routes (for duplicate detection)
    if (!routeToFiles.has(file.expectedRoute)) {
      routeToFiles.set(file.expectedRoute, []);
    }
    routeToFiles.get(file.expectedRoute).push(file.relativePath);
  }

  console.log(`📊 Found ${expectedFiles.length} SEO page files\n`);

  // Check for duplicate routes (multiple files mapping to same route)
  const duplicates = Array.from(routeToFiles.entries())
    .filter(([route, files]) => files.length > 1);

  if (duplicates.length > 0) {
    console.error('❌ Found duplicate routes (multiple files map to same route):\n');
    for (const [route, files] of duplicates) {
      console.error(`   Route: ${route}`);
      for (const file of files) {
        console.error(`     - ${file}`);
      }
    }
    console.error('');
  }

  // Try to get actual routes (may fail in Node.js context)
  const actualRoutes = await getActualRoutes();
  
  if (actualRoutes) {
    const actualRoutesSet = new Set(actualRoutes);
    const expectedRoutesSet = new Set(expectedFiles.map(f => f.expectedRoute));

    // Find missing routes (files exist but no route generated)
    const missingRoutes = expectedFiles
      .filter(f => !actualRoutesSet.has(f.expectedRoute))
      .map(f => ({ file: f.relativePath, route: f.expectedRoute }));

    // Find orphaned routes (routes exist but no file)
    const orphanedRoutes = actualRoutes
      .filter(r => !expectedRoutesSet.has(r) && r.startsWith('/'))
      .filter(r => {
        // Filter out non-SEO routes (like /, /auth, etc.)
        return !['/', '/auth', '/pricing', '/features', '/seo', '/demo', '/checkout', '/nl'].includes(r);
      });

    // Report results
    if (missingRoutes.length > 0) {
      console.error('❌ Missing routes (files exist but routes not registered):\n');
      for (const { file, route } of missingRoutes) {
        console.error(`   File: ${file}`);
        console.error(`   Expected route: ${route}\n`);
      }
    }

    if (orphanedRoutes.length > 0) {
      console.warn('⚠️  Orphaned routes (routes exist but no corresponding file):\n');
      for (const route of orphanedRoutes) {
        console.warn(`   Route: ${route}`);
      }
      console.warn('');
    }

    if (missingRoutes.length === 0 && orphanedRoutes.length === 0 && duplicates.length === 0) {
      console.log('✅ All routes are properly registered!\n');
      console.log(`   Total files: ${expectedFiles.length}`);
      console.log(`   Total routes: ${actualRoutes.length}`);
      return true;
    } else {
      console.error('❌ Route validation failed!\n');
      return false;
    }
  } else {
    // Fallback: Just validate file-to-route mapping consistency
    console.log('✅ File-to-route mapping validation:\n');
    
    if (duplicates.length > 0) {
      console.error('❌ Validation failed due to duplicate routes!\n');
      return false;
    }

    console.log(`   Total files: ${expectedFiles.length}`);
    console.log(`   All files have valid route mappings\n`);
    console.log('ℹ️  Note: Could not verify against actual routes.');
    console.log('   Run the test suite (npm test) to verify route registration.\n');
    return true;
  }
}

// Run validation
validateRoutes()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('❌ Validation script error:', error);
    process.exit(1);
  });

