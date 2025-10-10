import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SEO_DIR = path.join(__dirname, '../src/pages/SEO');
let filesProcessed = 0;
let filesUpdated = 0;
let filesSkipped = 0;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  const fileName = path.relative(SEO_DIR, filePath);
  
  // Skip if already fixed
  if (content.includes('StructuredData')) {
    console.log(`⏭️  Already fixed: ${fileName}`);
    filesSkipped++;
    return;
  }
  
  // Skip if no structured data
  if (!content.includes('type="application/ld+json"')) {
    console.log(`⏭️  No structured data: ${fileName}`);
    filesSkipped++;
    return;
  }
  
  // Add import
  const importMatch = content.match(/(import[^;]+from[^;]+;[\r\n]+)+/);
  if (importMatch && !content.includes("import { StructuredData }")) {
    const lastImportEnd = importMatch[0].length + importMatch.index;
    content = content.slice(0, lastImportEnd) + 
              "import { StructuredData } from '../../components/StructuredData';\n" +
              content.slice(lastImportEnd);
  }
  
  // Pattern 1: Template literal JSON-LD
  const templatePattern = /<script\s+type="application\/ld\+json"\s+dangerouslySetInnerHTML=\{\{\s*__html:\s*`\{([^`]*?)\}`\s*\}\}\s*\/>/gs;
  
  // Pattern 2: JSON.stringify
  const jsonifyPattern = /<script\s+type="application\/ld\+json"\s+dangerouslySetInnerHTML=\{\{\s*__html:\s*JSON\.stringify\(([^)]+)\)\s*\}\}\s*\/>/gs;
  
  let structuredDataItems = [];
  let match;
  
  // Extract JSON.stringify patterns (these are easiest)
  while ((match = jsonifyPattern.exec(content)) !== null) {
    structuredDataItems.push({
      fullMatch: match[0],
      code: match[1].trim()
    });
  }
  
  // Extract template literal patterns and convert them
  content = content.replace(templatePattern, (fullMatch, jsonContent) => {
    const trimmed = jsonContent.trim();
    
    // Check if it contains faqData.map
    if (trimmed.includes('${faqData.map')) {
      const converted = `{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqData.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        }`;
      structuredDataItems.push({ fullMatch, code: converted });
      return '___STRUCTURED_DATA_PLACEHOLDER___';
    }
    
    // For other patterns, try to convert template literals to object notation
    try {
      // Remove template literal ${...} and convert to proper object
      let objectCode = '{' + trimmed;
      
      // Replace ${...} with actual JS expressions
      objectCode = objectCode.replace(/\$\{([^}]+)\}/g, (_, expr) => {
        return expr;
      });
      
      structuredDataItems.push({ fullMatch, code: objectCode });
      return '___STRUCTURED_DATA_PLACEHOLDER___';
    } catch (e) {
      console.warn(`⚠️  Could not parse template in ${fileName}`);
      return fullMatch;
    }
  });
  
  // If we found structured data, replace the placeholders and JSON.stringify patterns
  if (structuredDataItems.length > 0) {
    // Remove comment if present
    content = content.replace(/\{\/\*\s*Schema\.org Structured Data\s*\*\/\}\s*\n/g, '');
    
    // Remove JSON.stringify script tags
    content = content.replace(jsonifyPattern, '');
    
    // Create the StructuredData component code
    let structuredDataCode = '{/* Schema.org Structured Data */}\n      <StructuredData data={[\n';
    structuredDataItems.forEach((item, index) => {
      const indentedCode = item.code.split('\n').map(line => '        ' + line).join('\n');
      structuredDataCode += indentedCode;
      if (index < structuredDataItems.length - 1) {
        structuredDataCode += ',\n';
      }
    });
    structuredDataCode += '\n      ]} />';
    
    // Replace placeholder or add before closing tag
    if (content.includes('___STRUCTURED_DATA_PLACEHOLDER___')) {
      content = content.replace(/\s*___STRUCTURED_DATA_PLACEHOLDER___\s*/g, '');
      content = content.replace(/(\s*)<\/SeoPageLayout>/, '\n\n      ' + structuredDataCode + '\n    </SeoPageLayout>');
    } else {
      content = content.replace(/(\s*)<\/SeoPageLayout>/, '\n\n      ' + structuredDataCode + '\n    </SeoPageLayout>');
    }
    
    // Clean up extra whitespace
    content = content.replace(/\n\n\n+/g, '\n\n');
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Updated: ${fileName}`);
    filesUpdated++;
  } else {
    console.log(`⏭️  No changes: ${fileName}`);
    filesSkipped++;
  }
  
  filesProcessed++;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.tsx')) {
      try {
        processFile(filePath);
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
      }
    }
  });
}

console.log('🔧 Fixing all SEO pages...\n');
walkDir(SEO_DIR);

console.log('\n📊 Summary:');
console.log(`   Processed: ${filesProcessed}`);
console.log(`   Updated: ${filesUpdated}`);
console.log(`   Skipped: ${filesSkipped}`);
console.log('\n✨ Done!');

