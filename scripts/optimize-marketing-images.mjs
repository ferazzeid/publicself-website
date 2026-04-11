/**
 * Resize & compress raw screenshots for the marketing site.
 * Keeps repo assets fast to load (no multi‑MB originals in /public).
 *
 * Usage:
 *   node scripts/optimize-marketing-images.mjs path/to/raw-hero.jpg
 *
 * Adding more slides later:
 *   node scripts/optimize-marketing-images.mjs path/to/raw-hero.jpg path/to/slide-02.jpg ...
 * First argument → public/marketing/hero-main.jpg
 * All arguments → public/marketing/slides/slide-01.jpg, slide-02.jpg, ...
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const inputs = process.argv.slice(2).filter(Boolean);
if (inputs.length === 0) {
  console.error("Usage: node scripts/optimize-marketing-images.mjs <image.jpg> [more.jpg ...]");
  process.exit(1);
}

const root = path.resolve(import.meta.dirname, "..");
const outHero = path.join(root, "public", "marketing", "hero-main.jpg");
const slidesDir = path.join(root, "public", "marketing", "slides");

await mkdir(path.dirname(outHero), { recursive: true });
await mkdir(slidesDir, { recursive: true });

const [heroInput, ...slideInputs] = inputs;

async function writeHero(filePath) {
  await sharp(filePath)
    .rotate()
    .resize({ width: 2560, height: 2560, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(outHero);
  console.log("Wrote", path.relative(root, outHero));
}

async function writeSlide(filePath, index) {
  const n = String(index + 1).padStart(2, "0");
  const dest = path.join(slidesDir, `slide-${n}.jpg`);
  await sharp(filePath)
    .rotate()
    .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(dest);
  console.log("Wrote", path.relative(root, dest));
}

await writeHero(heroInput);
const allSlides = slideInputs.length > 0 ? slideInputs : [heroInput];
for (let i = 0; i < allSlides.length; i += 1) {
  await writeSlide(allSlides[i], i);
}
