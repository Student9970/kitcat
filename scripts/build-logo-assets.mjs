import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import toIco from "to-ico";

const root = process.cwd();
const pawPath = path.join(root, "public/images/paw-print.png");
const b64 = fs.readFileSync(pawPath).toString("base64");
const paw = `data:image/png;base64,${b64}`;

/** Inner SVG for CatLogo-style mark (gradient tile + white paw). Used for logo.svg only. */
function logoMarkInner(size, id) {
  const radius = Math.round(size * 0.3);
  const pawSize = Math.round(size * 0.52);
  const offset = Math.round((size - pawSize) / 2);
  const ring = Math.max(1, Math.round(size / 32));

  return `<defs>
    <linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#efb0c4"/>
      <stop offset="0.5" stop-color="#e879a9"/>
      <stop offset="1" stop-color="#db5f90"/>
    </linearGradient>
    <mask id="paw-${id}">
      <image href="${paw}" x="${offset}" y="${offset}" width="${pawSize}" height="${pawSize}" preserveAspectRatio="xMidYMid meet"/>
    </mask>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" fill="url(#bg-${id})" stroke="white" stroke-opacity="0.45" stroke-width="${ring}"/>
  <rect x="${offset}" y="${offset}" width="${pawSize}" height="${pawSize}" fill="white" mask="url(#paw-${id})"/>`;
}

function logoWordmark() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="240" height="44" viewBox="0 0 240 44" fill="none">
  <svg x="2" y="2" width="40" height="40" viewBox="0 0 40 40">
    ${logoMarkInner(40, "wordmark")}
  </svg>
  <text x="52" y="28" font-family="Georgia, 'Times New Roman', serif" font-size="19" font-weight="700" fill="#9d4a6a">KitCat</text>
  <text x="118" y="28" font-family="Georgia, 'Times New Roman', serif" font-size="19" font-weight="400" fill="#b85c7a">Journal</text>
</svg>`;
}

function gradientTileSvg(size) {
  const radius = Math.round(size * 0.3);
  const ring = Math.max(1, Math.round(size / 32));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#efb0c4"/>
      <stop offset="50%" stop-color="#e879a9"/>
      <stop offset="100%" stop-color="#db5f90"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" fill="url(#bg)" stroke="white" stroke-opacity="0.45" stroke-width="${ring}"/>
</svg>`;
}

async function whitePawPng(size) {
  const { data, info } = await sharp(pawPath)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = Buffer.from(data);
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] > 0) {
      pixels[i] = 255;
      pixels[i + 1] = 255;
      pixels[i + 2] = 255;
    }
  }

  return sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png().toBuffer();
}

async function logoMarkPng(size) {
  const pawSize = Math.round(size * 0.52);
  const offset = Math.round((size - pawSize) / 2);
  const background = await sharp(Buffer.from(gradientTileSvg(size))).png().toBuffer();
  const paw = await whitePawPng(pawSize);

  return sharp(background)
    .composite([{ input: paw, top: offset, left: offset }])
    .png()
    .toBuffer();
}

async function writeLogoAssets() {
  const icon32 = await logoMarkPng(32);
  const icon192 = await logoMarkPng(192);
  const apple180 = await logoMarkPng(180);
  const faviconIco = await toIco([icon32]);

  const pngOutputs = [
    [path.join(root, "src/app/icon.png"), icon32],
    [path.join(root, "src/app/apple-icon.png"), apple180],
    [path.join(root, "public/icon.png"), icon32],
    [path.join(root, "public/apple-icon.png"), apple180],
    [path.join(root, "public/icon-192.png"), icon192],
    [path.join(root, "public/favicon.ico"), faviconIco],
  ];

  for (const [file, buffer] of pngOutputs) {
    fs.writeFileSync(file, buffer);
  }

  fs.writeFileSync(path.join(root, "public/images/logo.svg"), logoWordmark());

  const stale = [
    path.join(root, "src/app/icon.svg"),
    path.join(root, "src/app/apple-icon.svg"),
    path.join(root, "public/icon.svg"),
    path.join(root, "public/apple-icon.svg"),
  ];
  for (const file of stale) {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }

  console.log("Wrote favicon + logo assets");
}

writeLogoAssets().catch((error) => {
  console.error(error);
  process.exit(1);
});
