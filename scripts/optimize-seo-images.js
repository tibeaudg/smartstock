const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Find all SEO pages
const seoPages = glob.sync('src/pages/SEO/*.tsx');

console.log(`Found ${seoPages.length} SEO pages to optimize`);

seoPages.forEach(pagePath => {
  console.log(`\nProcessing: ${pagePath}`);
  
  let content = fs.readFileSync(pagePath, 'utf8');
  let modified = false;
  
  // Add OptimizedImage import if not present
  if (!content.includes('import OptimizedImage')) {
    const importMatch = content.match(/import.*from.*react-router-dom.*;\n/);
    if (importMatch) {
      const newImport = importMatch[0] + "import OptimizedImage from '../../components/OptimizedImage';\n";
      content = content.replace(importMatch[0], newImport);
      modified = true;
    }
  }
  
  // Replace <img> tags with <OptimizedImage>
  const imgRegex = /<img\s+([^>]*?)>/g;
  content = content.replace(imgRegex, (match, attributes) => {
    // Extract src and alt attributes
    const srcMatch = attributes.match(/src=["']([^"']+)["']/);
    const altMatch = attributes.match(/alt=["']([^"']*)["']/);
    const classNameMatch = attributes.match(/className=["']([^"']*)["']/);
    
    if (!srcMatch) return match; // Skip if no src attribute
    
    const src = srcMatch[1];
    const alt = altMatch ? altMatch[1] : '';
    const className = classNameMatch ? classNameMatch[1] : '';
    
    // Determine appropriate width/height based on className
    let width, height, sizes;
    
    if (className.includes('h-10') || className.includes('h-12')) {
      // Logo images
      width = 120;
      height = 48;
      sizes = '(max-width: 768px) 100px, 120px';
    } else if (className.includes('h-96')) {
      // Large images
      width = 800;
      height = 400;
      sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 66vw';
    } else if (className.includes('h-64') || className.includes('h-80')) {
      // Medium images
      width = 400;
      height = 300;
      sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
    } else {
      // Default
      width = 400;
      height = 300;
      sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
    }
    
    const optimizedImage = `<OptimizedImage 
                  src="${src}" 
                  alt="${alt}" 
                  className="${className}"
                  width={${width}}
                  height={${height}}
                  useModernFormats={true}
                  responsive={true}
                  sizes="${sizes}"`;
    
    return optimizedImage;
  });
  
  if (modified) {
    fs.writeFileSync(pagePath, content, 'utf8');
    console.log(`✅ Optimized: ${path.basename(pagePath)}`);
  } else {
    console.log(`⏭️  No changes needed: ${path.basename(pagePath)}`);
  }
});

console.log('\n🎉 SEO image optimization complete!');
