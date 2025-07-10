import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const files = await imagemin([path.join(__dirname, '../public/*.{jpg,jpeg,png}')], {
    destination: path.join(__dirname, '../public/optimized'),
    plugins: [
      imageminMozjpeg({ quality: 75 }),
      imageminPngquant({ quality: [0.6, 0.8] })
    ]
  });
  console.log('Geoptimaliseerde afbeeldingen:', files.map(f => path.basename(f.destinationPath)));
})(); 