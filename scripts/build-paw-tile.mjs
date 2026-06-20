import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const pawPath = path.join(root, "public/images/paw-print.png");
const outPath = path.join(root, "public/images/paw-pattern-tile.svg");

const b64 = fs.readFileSync(pawPath).toString("base64");

const tile = 112;
const paw = 48;
const offset = (tile - paw) / 2;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${tile}" height="${tile}" viewBox="0 0 ${tile} ${tile}">
  <image href="data:image/png;base64,${b64}" x="${offset}" y="${offset}" width="${paw}" height="${paw}" preserveAspectRatio="xMidYMid meet"/>
</svg>
`;

fs.writeFileSync(outPath, svg);
console.log("Wrote", outPath);
