import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Standard ES module way to get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Update this path to match your folder structure: src/pages/SEO
const targetDir = path.join(__dirname, 'src', 'pages', 'SEO');
const outputFile = 'extracted_files.txt';

/**
 * Recursively retrieves all files
 */
function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return fileList;
  }

  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      getFiles(fullPath, fileList);
    } else {
      // Push the filename (or change to fullPath if you want the full path)
      fileList.push(item);
    }
  });

  return fileList;
}

try {
  console.log('Scanning folder...');
  const allFiles = getFiles(targetDir);
  
  if (allFiles.length > 0) {
    fs.writeFileSync(outputFile, allFiles.join('\n'), 'utf8');
    console.log(`✅ Success! ${allFiles.length} files saved to ${outputFile}`);
  } else {
    console.log('❌ No files found. Check if the path is correct.');
  }
} catch (err) {
  console.error('An error occurred:', err.message);
}