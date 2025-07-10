const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg').default;
const imageminPngquant = require('imagemin-pngquant').default;
const path = require('path');

(async () => {
  const files = await imagemin(['public/*.{jpg,jpeg,png}'], {
    destination: 'public/optimized',
    plugins: [
      imageminMozjpeg({ quality: 75 }),
      imageminPngquant({ quality: [0.6, 0.8] })
    ]
  });
  console.log('Geoptimaliseerde afbeeldingen:', files.map(f => path.basename(f.destinationPath)));
})(); 