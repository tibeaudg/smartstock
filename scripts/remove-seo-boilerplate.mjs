import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seoDir = path.join(__dirname, '..', 'src', 'pages', 'SEO');

// Patterns to remove
const patterns = [
  // Generic "Why StockFlow Makes X Stick" section
  {
    regex: /<section id="stockflow-advantage"[^>]*>[\s\S]*?<\/section>/g,
    description: 'Remove generic "Why StockFlow Makes X Stick" section'
  },
  // Generic "Why it matters now" box
  {
    regex: /<div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-blue-900">\s*<h3 className="text-xl font-semibold">Why it matters now<\/h3>\s*<p className="mt-3 text-base text-blue-900\/90">\s*Every economic cycle pressures teams to do more with less\.[\s\S]*?<\/div>/g,
    description: 'Remove generic "Why it matters now" box'
  },
  // Generic statistics in text (more comprehensive)
  {
    regex: /\b99% inventory accuracy\b|\b35% reduction\b|\b15\+ hours saved\b|\b15 hours per week\b|\b20-30% improvement\b|\b20-30% reduction\b|\b95% reduction\b|\b10\+ hours per week\b/g,
    description: 'Remove generic statistics from text'
  },
  // Generic "Key Statistics" boxes
  {
    regex: /<div[^>]*>\s*<p[^>]*>\s*<strong>Key Statistics:<\/strong>[\s\S]*?<\/ul>\s*<\/div>/g,
    description: 'Remove generic Key Statistics boxes'
  },
  // Generic "Proven Results" sections
  {
    regex: /<p[^>]*>\s*<strong>Proven Results:<\/strong>[\s\S]*?99% inventory accuracy[\s\S]*?<\/p>/g,
    description: 'Remove generic Proven Results sections'
  },
  // Generic statistics in meta descriptions
  {
    regex: /Save 35% costs & 15 hours\/week|Save 35%|Reduce costs 20-30%|save 15\+ hours\/week/gi,
    description: 'Remove generic statistics from meta descriptions'
  },
  // Generic "Quick Stats" boxes
  {
    regex: /<p[^>]*>\s*<strong>Quick Stats:<\/strong>[\s\S]*?99% accuracy[\s\S]*?<\/p>/g,
    description: 'Remove generic Quick Stats boxes'
  }
];

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    patterns.forEach(({ regex, description }) => {
      const matches = content.match(regex);
      if (matches && matches.length > 0) {
        content = content.replace(regex, '');
        modified = true;
        console.log(`  - Removed: ${description}`);
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  let processed = 0;
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processed += walkDirectory(filePath);
    } else if (file.endsWith('.tsx')) {
      console.log(`Processing: ${filePath}`);
      if (processFile(filePath)) {
        processed++;
      }
    }
  });
  
  return processed;
}

console.log('Removing boilerplate from SEO pages...');
const processed = walkDirectory(seoDir);
console.log(`\nProcessed ${processed} files.`);

