/**
 * Subsets the two variable fonts to the characters the site actually uses,
 * keeping every variation axis, and writes them to public/fonts:
 *
 *   node scripts/subset-fonts.mjs
 *
 * Both files are preloaded on every page, so each kilobyte here is on the
 * critical path. If new copy needs a character outside CHARS (an accented
 * name, a new symbol), add it below and re-run.
 */
import subsetFont from 'subset-font'
import { readFile, writeFile } from 'node:fs/promises'

const ascii = Array.from({ length: 0x7e - 0x20 + 1 }, (_, i) => String.fromCharCode(0x20 + i)).join('')
const CHARS = `${ascii} ©’‘“”…–—•·×éèêëàâäôöüçñ`

// Anybody is display-only, always at one width and weight, so it is pinned
// to that single instance: 7 kB instead of 38 kB on every page's critical
// path. Change the pin here and the @font-face in src/styles/index.css
// together. Instrument Sans keeps its weight axis (400 to 700).
const FONTS = [
  [
    'node_modules/@fontsource-variable/anybody/files/anybody-latin-standard-normal.woff2',
    'public/fonts/anybody.woff2',
    { wdth: 115, wght: 800 },
  ],
  [
    'node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2',
    'public/fonts/instrument-sans.woff2',
    undefined,
  ],
]

for (const [src, out, variationAxes] of FONTS) {
  const input = await readFile(src)
  const output = await subsetFont(input, CHARS, { targetFormat: 'woff2', variationAxes })
  await writeFile(out, output)
  console.log(`${out}: ${(input.length / 1024).toFixed(1)} kB -> ${(output.length / 1024).toFixed(1)} kB`)
}
