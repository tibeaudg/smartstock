import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIR = path.join(__dirname, 'src/pages/SEO');

function processFiles(dir) {
    if (!fs.existsSync(dir)) {
        console.error(`Directory not found: ${dir}`);
        return;
    }

    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            processFiles(filePath);
        } else if (file.match(/\.(jsx|tsx|js|ts)$/)) {
            let content = fs.readFileSync(filePath, 'utf8');

            const hasH1 = /<h1[>\s]/i.test(content);

            if (!hasH1) {
                const newContent = content.replace(/<h2([\s>])([\s\S]*?)<\/h2>/i, '<h1$1$2</h1>');

                if (content !== newContent) {
                    fs.writeFileSync(filePath, newContent, 'utf8');
                    console.log(`Updated: ${filePath}`);
                } else {
                    console.log(`No H1 or H2 found: ${filePath}`);
                }
            }
        }
    });
}

processFiles(TARGET_DIR);