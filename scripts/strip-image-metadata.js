import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminSvgo from 'imagemin-svgo';
import path from 'path';

(async () => {
  const files = [
    'public/*.png',
    'public/*.jpg',
    'public/*.jpeg',
  ];
  const outDir = 'public/optimized';
  const optimized = await imagemin(files, {
    destination: outDir,
    plugins: [
      imageminPngquant({ quality: [0.7, 0.9] }),
      imageminMozjpeg({ quality: 80 }),
      imageminSvgo(),
    ],
  });
  console.log(`Geoptimaliseerd: ${optimized.length} afbeeldingen opgeslagen in ${outDir}`);
})(); 