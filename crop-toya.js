const sharp = require('sharp');
const path = require('path');

async function cropToya() {
  const input = 'img/toya.jpg';
  const output = 'img/toya-face.jpg';
  
  const metadata = await sharp(input).metadata();
  console.log('Original:', metadata.width, 'x', metadata.height);
  
  // Calculate face region (center crop removing gray background)
  const size = Math.min(metadata.width, metadata.height);
  const left = Math.floor((metadata.width - size) / 2);
  const top = Math.floor((metadata.height - size) / 2);
  
  await sharp(input)
    .extract({ left, top, width: size, height: size })
    .resize(941, 941)
    .jpeg({ quality: 95 })
    .toFile(output);
  
  const outMeta = await sharp(output).metadata();
  console.log('Cropped:', outMeta.width, 'x', outMeta.height);
  console.log('Saved to:', output);
}

cropToya().catch(console.error);