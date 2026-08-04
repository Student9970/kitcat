import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

import { slugify } from "@/lib/utils";

const ROOT = process.cwd();
const UPLOADS_DIR = path.join(ROOT, "public", "uploads");

const ALLOWED = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".avif",
]);
const MAX_BYTES = 12 * 1024 * 1024; // 12 MB
const OUTPUT_EXTENSION = ".webp";

export interface UploadedImage {
  name: string;
  url: string;
  size: number;
  modified: string;
}

function ensureDir() {
  if (!fs.existsSync(UPLOADS_DIR))
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export function listImages(): UploadedImage[] {
  ensureDir();
  return fs
    .readdirSync(UPLOADS_DIR)
    .filter((f) => ALLOWED.has(path.extname(f).toLowerCase()))
    .map((name) => {
      const stat = fs.statSync(path.join(UPLOADS_DIR, name));
      return {
        name,
        url: `/uploads/${name}`,
        size: stat.size,
        modified: stat.mtime.toISOString(),
      };
    })
    .sort((a, b) => (b.modified > a.modified ? 1 : -1));
}

export class ImageValidationError extends Error {}

function uniqueName(original: string, ext = OUTPUT_EXTENSION): string {
  const originalExt = path.extname(original).toLowerCase();
  const base = slugify(path.basename(original, originalExt)) || "image";
  let name = `${base}${ext}`;
  let i = 1;
  while (fs.existsSync(path.join(UPLOADS_DIR, name))) {
    name = `${base}-${i++}${ext}`;
  }
  return name;
}

export async function saveImage(file: File): Promise<UploadedImage> {
  ensureDir();
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED.has(ext)) {
    throw new ImageValidationError(`Unsupported file type: ${ext}`);
  }
  if (file.size > MAX_BYTES) {
    throw new ImageValidationError("File exceeds the 12 MB limit.");
  }

  const name = uniqueName(file.name);
  const buffer = Buffer.from(await file.arrayBuffer());
  const outputPath = path.join(UPLOADS_DIR, name);

  try {
    await sharp(buffer).webp({ quality: 82, effort: 6 }).toFile(outputPath);
  } catch {
    throw new ImageValidationError("Unable to process this image format.");
  }

  const stat = fs.statSync(outputPath);
  return {
    name,
    url: `/uploads/${name}`,
    size: stat.size,
    modified: stat.mtime.toISOString(),
  };
}

export function deleteImage(name: string): void {
  // Guard against path traversal.
  const safe = path.basename(name);
  const filePath = path.join(UPLOADS_DIR, safe);
  if (fs.existsSync(filePath)) fs.rmSync(filePath);
}
