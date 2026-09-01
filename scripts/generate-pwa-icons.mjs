import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
const iconsDir = path.join(publicDir, 'icons');
const svgPath = path.join(publicDir, 'icon.svg');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

async function generateIcons() {
  console.log('Generating PWA icons from public/icon.svg...');
  
  const svgBuffer = fs.readFileSync(svgPath);

  // 192x192 PNG
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(iconsDir, 'icon-192.png'));
  console.log('✔ Generated public/icons/icon-192.png');

  // 512x512 PNG
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-512.png'));
  console.log('✔ Generated public/icons/icon-512.png');

  // 180x180 Apple Touch Icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(iconsDir, 'apple-icon.png'));
  console.log('✔ Generated public/icons/apple-icon.png');

  // 512x512 Maskable PNG with padding background (#1a1a2e)
  const maskablePadding = 48;
  const innerSize = 512 - (maskablePadding * 2);
  const innerIcon = await sharp(svgBuffer)
    .resize(innerSize, innerSize)
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 26, g: 26, b: 46, alpha: 1 }
    }
  })
    .composite([{ input: innerIcon, top: maskablePadding, left: maskablePadding }])
    .png()
    .toFile(path.join(iconsDir, 'icon-512-maskable.png'));
  console.log('✔ Generated public/icons/icon-512-maskable.png');

  console.log('All PWA icons generated successfully!');
}

generateIcons().catch(err => {
  console.error('Failed to generate PWA icons:', err);
  process.exit(1);
});
