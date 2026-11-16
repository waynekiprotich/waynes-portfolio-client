/**
 * Generates the responsive image set the site serves, from the originals in
 * assets-source/ (kept out of public/, so they are never deployed). Run it
 * after adding or replacing a screenshot:
 *
 *   node scripts/images.mjs
 *
 * Output goes to public/img/<name>-<width>.<avif|webp>. The <Picture>
 * component builds srcset strings from the `image.widths` listed for each
 * project in src/data/projects.js, so keep the two in step.
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const OUT = 'public/img'

const SOURCES = [
  { name: 'kenya-quest', file: 'assets-source/projects/kenya-quest.jpg', widths: [640, 768, 960, 1600] },
  { name: 'kingdom-collection', file: 'assets-source/projects/kingdom-collection.jpg', widths: [640, 768, 960, 1600] },
  { name: 'apexgrid', file: 'assets-source/projects/apexgrid.jpg', widths: [640, 768, 960, 1600] },
  { name: 'kcode', file: 'assets-source/projects/kcode.jpg', widths: [640, 768, 960, 1600] },
  { name: 'stackbattle-ke', file: 'assets-source/projects/stackbattle-ke.webp', widths: [640, 800] },
  // Cropped to the 4:5 frame it is shown in, from the top, so no pixels are
  // sent only to be cut off by object-fit.
  { name: 'portrait', file: 'assets-source/pfp-original.png', widths: [480, 720, 1080], ratio: 1.25 },
]

await mkdir(OUT, { recursive: true })

for (const { name, file, widths, ratio } of SOURCES) {
  for (const width of widths) {
    const base = path.join(OUT, `${name}-${width}`)
    const image = sharp(file).resize(
      ratio
        ? { width, height: Math.round(width * ratio), fit: 'cover', position: 'north' }
        : { width, withoutEnlargement: true }
    )
    await image.clone().avif({ quality: 48, effort: 8 }).toFile(`${base}.avif`)
    await image.clone().webp({ quality: 74, effort: 6 }).toFile(`${base}.webp`)
  }
  console.log(`${name}: ${widths.join(', ')}`)
}
