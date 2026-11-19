#!/usr/bin/env node
/**
 * scripts/build-gallery.mjs
 *
 * Run with: npm run photos
 *
 * Reads source-photos/ and converts all images to WebP in public/gallery/.
 * Writes src/data/gallery.json with album metadata, dimensions, and blur placeholders.
 *
 * NEVER hooked to build — source-photos won't exist on Vercel.
 * Commit public/gallery/ and src/data/gallery.json after running.
 */

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import sharp from 'sharp';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const SOURCE = join(ROOT, 'source-photos');
const DEST = join(ROOT, 'public', 'gallery');
const DATA_OUT = join(ROOT, 'src', 'data', 'gallery.json');

const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const MAX_WIDTH = 1600;
const WEBP_QUALITY = 80;

/** Warn size threshold in bytes (300 KB per image, alert at ~80 MB total) */
const SIZE_WARN_PER_IMAGE = 300 * 1024;
const SIZE_WARN_TOTAL = 80 * 1024 * 1024;

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\s+and\s+/gi, '-and-')
    .replace(/[&+_]/g, '-and-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function titleCase(str) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

function parsePeople(folderName) {
  // Split on common separators
  const parts = folderName
    .split(/\s+and\s+|[&+_]|\s*-\s*/i)
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);

  return parts.map((p) => {
    if (/^mum$/i.test(p)) return 'mum';
    if (/^sweetu$/i.test(p)) return 'sweetu';
    if (/^cutu$/i.test(p)) return 'cutu';
    return p;
  });
}

function friendlyTitle(folderName) {
  const parts = folderName.split(/\s+and\s+|[&+_]|\s*-\s*/i).map((p) => p.trim()).filter(Boolean);
  return parts.map(titleCase).join(' & ');
}

async function getBlurDataURL(sharpInstance) {
  const buf = await sharpInstance.clone().resize(10, 10, { fit: 'cover' }).webp({ quality: 50 }).toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

async function processImage(srcPath, destPath) {
  const img = sharp(srcPath).rotate(); // auto-rotate by EXIF
  const meta = await img.metadata();

  let pipeline = img;
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  const { data, info } = await pipeline.webp({ quality: WEBP_QUALITY }).toBuffer({ resolveWithObject: true });
  const blur = await getBlurDataURL(sharp(data));
  await writeFile(destPath, data);

  const sizeKB = (data.length / 1024).toFixed(0);
  if (data.length > SIZE_WARN_PER_IMAGE) {
    console.warn(`  ⚠️  Large output: ${sizeKB} KB for ${basename(destPath)}`);
  }

  return { width: info.width, height: info.height, blur, bytes: data.length };
}

async function run() {
  if (!existsSync(SOURCE)) {
    console.error(`❌  source-photos not found at ${SOURCE}`);
    console.error('    Place your photos there and re-run.');
    process.exit(1);
  }

  await mkdir(DEST, { recursive: true });
  await mkdir(join(ROOT, 'src', 'data'), { recursive: true });

  const folderEntries = await readdir(SOURCE, { withFileTypes: true });
  const folders = folderEntries.filter((e) => e.isDirectory()).map((e) => e.name);

  if (folders.length === 0) {
    console.error('❌  No sub-folders found in source-photos/');
    process.exit(1);
  }

  const albums = [];
  let totalBytes = 0;
  let totalImages = 0;

  for (const folder of folders) {
    const folderPath = join(SOURCE, folder);
    const slug = slugify(folder);
    const people = parsePeople(folder);
    const title = friendlyTitle(folder);

    const files = (await readdir(folderPath, { withFileTypes: true }))
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .sort();

    const photos = [];
    let idx = 1;

    for (const file of files) {
      const ext = extname(file).toLowerCase();
      if (!SUPPORTED.has(ext)) {
        console.warn(`  ⚠️  Skipping unsupported file: ${folder}/${file}`);
        continue;
      }

      const srcPath = join(folderPath, file);
      const outName = `${slug}-${idx}.webp`;
      const outPath = join(DEST, outName);

      try {
        const { width, height, blur, bytes } = await processImage(srcPath, outPath);
        photos.push({ src: `/gallery/${outName}`, width, height, blur });
        totalBytes += bytes;
        totalImages++;
        idx++;
        console.log(`  ✓  ${outName}  ${width}×${height}`);
      } catch (err) {
        console.warn(`  ⚠️  Skipped ${folder}/${file}: ${err.message}`);
      }
    }

    if (photos.length > 0) {
      albums.push({ slug, title, people, cover: photos[0].src, photos });
      console.log(`📁  ${folder}  →  ${slug}  (${photos.length} photos)`);
    }
  }

  await writeFile(DATA_OUT, JSON.stringify({ albums }, null, 2));

  const totalMB = (totalBytes / 1024 / 1024).toFixed(1);
  console.log(`\n✅  Done! ${totalImages} photos in ${albums.length} albums → ${totalMB} MB`);
  if (totalBytes > SIZE_WARN_TOTAL) {
    console.warn(`⚠️  Total gallery size (${totalMB} MB) exceeds recommended ~80 MB. Consider reducing image count or quality.`);
  }
  console.log(`\nNext steps:`);
  console.log(`  git add public/gallery src/data/gallery.json`);
  console.log(`  git commit -m "chore: add processed gallery images"`);
}

run().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
