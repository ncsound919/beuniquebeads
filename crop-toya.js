const sharp = require('sharp');
const path = require('path');

const inputPath = path.join(__dirname, 'img', 'toya.jpg');
const outputPath = path.join(__dirname, 'img', 'toya-face.jpg');

(async () => {
  const metadata = await sharp(inputPath).metadata();
  const { width, height } = metadata;
  console.log(`Original: ${width}x${height}`);

  // Crop to face - square from the top-center (upper 45% of image)
  // For a portrait, face is typically in the upper portion
  const cropSize = Math.min(width, Math.round(height * 0.55));
  const left = Math.round((width - cropSize) / 2);
  const top = 0;

  console.log(`Cropping to: ${cropSize}x${cropSize} from (${left}, ${top})`);

  await sharp(inputPath)
    .extract({ left, top, width: cropSize, height: cropSize })
    .resize(600, 600, { fit: 'cover' })
    .jpeg({ quality: 85 })
    .toFile(outputPath);

  console.log('Saved:', outputPath);
})();
