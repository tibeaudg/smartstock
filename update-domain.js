const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

// Find all files that need updating
const files = globSync('**/*.{tsx,ts,js,mjs,html,xml}', {
  ignore: ['node_modules/**', 'dist/**', '.git/**']
});

let updatedCount = 0;
let totalReplacements = 0;

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    
    // Replace the domain URL (but not email addresses)
    // Match https://www.stockflow.be but not @stockflow.be
    const regex = /https:\/\/www\.stockflow\.be/g;
    const matches = content.match(regex);
    
    if (matches) {
      content = content.replace(regex, 'https://www.stockflowsystems.com');
      fs.writeFileSync(file, content, 'utf8');
      updatedCount++;
      totalReplacements += matches.length;
      console.log(`Updated ${file} (${matches.length} replacements)`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\nCompleted! Updated ${updatedCount} files with ${totalReplacements} total replacements.`);

