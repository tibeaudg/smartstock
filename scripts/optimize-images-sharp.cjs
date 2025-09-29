const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../public');
const OPTIMIZED_DIR = path.join(PUBLIC_DIR, 'optimized');

// Ensure optimized directory exists
if (!fs.existsSync(OPTIMIZED_DIR)) {
  fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
}

// Image formats to convert
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

// Quality settings for different formats
const QUALITY_SETTINGS = {
  webp: 80,
  avif: 75,
  jpeg: 85,
  png: 90
};

// Responsive image sizes
const RESPONSIVE_SIZES = [320, 640, 768, 1024, 1280, 1920];

async function optimizeImage(inputPath, outputPath, format = 'webp', targetWidth = null) {
  try {
    const image = sharp(inputPath);
    
    // Get image metadata
    const metadata = await image.metadata();
    
    // Resize if target width is specified or if image is too large
    if (targetWidth) {
      image.resize(targetWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    } else if (metadata.width > 1920) {
      image.resize(1920, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }
    
    // Apply format-specific optimizations
    switch (format) {
      case 'webp':
        await image
          .webp({ quality: QUALITY_SETTINGS.webp })
          .toFile(outputPath);
        break;
      case 'avif':
        await image
          .avif({ quality: QUALITY_SETTINGS.avif })
          .toFile(outputPath);
        break;
      case 'jpeg':
        await image
          .jpeg({ quality: QUALITY_SETTINGS.jpeg, progressive: true })
          .toFile(outputPath);
        break;
      case 'png':
        await image
          .png({ quality: QUALITY_SETTINGS.png, compressionLevel: 9 })
          .toFile(outputPath);
        break;
      default:
        await image
          .webp({ quality: QUALITY_SETTINGS.webp })
          .toFile(outputPath);
    }
    
    console.log(`✅ Optimized: ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
  }
}

async function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and .git
      if (file !== 'node_modules' && file !== '.git' && file !== 'optimized') {
        await processDirectory(filePath);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        const fileName = path.basename(file, ext);
        const relativePath = path.relative(PUBLIC_DIR, filePath);
        const outputDir = path.dirname(path.join(OPTIMIZED_DIR, relativePath));
        
        // Ensure output directory exists
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // Create optimized versions
        const outputPathWebP = path.join(outputDir, `${fileName}.webp`);
        const outputPathAvif = path.join(outputDir, `${fileName}.avif`);
        
        // Convert to WebP (primary modern format)
        await optimizeImage(filePath, outputPathWebP, 'webp');
        
        // Convert to AVIF (next-gen format for browsers that support it)
        await optimizeImage(filePath, outputPathAvif, 'avif');
        
        // Create responsive versions for each format
        for (const size of RESPONSIVE_SIZES) {
          const responsiveWebPPath = path.join(outputDir, `w${size}-${fileName}.webp`);
          const responsiveAvifPath = path.join(outputDir, `w${size}-${fileName}.avif`);
          
          await optimizeImage(filePath, responsiveWebPPath, 'webp', size);
          await optimizeImage(filePath, responsiveAvifPath, 'avif', size);
        }
      }
    }
  }
}

async function main() {
  console.log('🚀 Starting image optimization...');
  console.log(`📁 Processing directory: ${PUBLIC_DIR}`);
  
  try {
    await processDirectory(PUBLIC_DIR);
    console.log('✅ Image optimization completed!');
    console.log(`📂 Optimized images saved to: ${OPTIMIZED_DIR}`);
  } catch (error) {
    console.error('❌ Error during optimization:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { optimizeImage, processDirectory }; 