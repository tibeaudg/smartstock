import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIR = path.join(__dirname, 'src/pages/SEO');

function processFiles(dir) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            processFiles(filePath);
        } else if (file.match(/\.(jsx|tsx|js|ts)$/)) {
            let content = fs.readFileSync(filePath, 'utf8');

            // 1. Extract existing Title and Description from the code
            const titleMatch = content.match(/title=["'](.+?)["']/);
            const descMatch = content.match(/description=["'](.+?)["']/);

            const title = titleMatch ? titleMatch[1] : '';
            const description = descMatch ? descMatch[1] : '';

            // 2. Logic to ensure <SeoPageLayout> has the title if it's missing
            if (title && content.includes('<SeoPageLayout')) {
                // Ensure SeoPageLayout has the title prop
                if (!content.includes(`title="${title}"`)) {
                    content = content.replace('<SeoPageLayout', `<SeoPageLayout\n      title="${title}"`);
                }
            }

            // 3. Ensure the <SEO /> component has the description
            if (description && content.includes('<SEO')) {
                if (!content.includes(`description="${description}"`)) {
                    content = content.replace('<SEO', `<SEO\n        description="${description}"`);
                }
            }

            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Processed SEO data for: ${file}`);
        }
    });
}

processFiles(TARGET_DIR);