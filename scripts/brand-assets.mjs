/**
 * Builds the favicon set from one SVG of the WK monogram:
 *
 *   node scripts/brand-assets.mjs
 *
 * Writes public/favicon.svg, PNGs at 16–512px, a maskable icon, the Apple
 * touch icon and a multi-size favicon.ico (PNG-in-ICO). The Open Graph image
 * is rendered separately from scripts/og-image.html (see README).
 */
import sharp from 'sharp'
import { writeFile } from 'node:fs/promises'

const NIGHT = '#0A0A0A'
const CHALK = '#F0ECE2'

// Same geometry as src/components/WKMark.jsx.
const WK_PATH = 'M3 8L6.8 24L10 12L13.2 24L17 8M21.5 8V24M28.5 8L21.5 16.5M21.5 16.5L28.5 24'

/** The monogram, off-white on a near-black tile. `pad` shrinks it for maskable safe zones. */
const svg = (pad = 0) => {
  const s = 1 - pad * 2
  const o = 16 - 16 * s
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="${pad ? 0 : 7.2}" fill="${NIGHT}"/>
  <g transform="translate(${o} ${o}) scale(${s})" fill="none" stroke="${CHALK}" stroke-width="2.4" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="2.5">
    <path d="${WK_PATH}"/>
  </g>
</svg>
`
}

const png = (source, size) => sharp(Buffer.from(source), { density: 72 * (size / 32) * 2 }).resize(size, size).png().toBuffer()

await writeFile('public/favicon.svg', svg())

const sizes = { 16: 'favicon-16.png', 32: 'favicon-32.png', 48: 'favicon-48.png', 180: 'apple-touch-icon.png', 192: 'favicon-192.png', 512: 'favicon-512.png' }
const buffers = {}
for (const [size, file] of Object.entries(sizes)) {
  buffers[size] = await png(svg(), Number(size))
  await writeFile(`public/${file}`, buffers[size])
}
await writeFile('public/favicon-maskable-512.png', await png(svg(0.18), 512))

// favicon.ico holding the 16, 32 and 48px PNGs.
const icoSizes = [16, 32, 48]
const header = Buffer.alloc(6 + icoSizes.length * 16)
header.writeUInt16LE(0, 0)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(icoSizes.length, 4)
let offset = header.length
icoSizes.forEach((size, i) => {
  const entry = 6 + i * 16
  header.writeUInt8(size, entry)
  header.writeUInt8(size, entry + 1)
  header.writeUInt8(0, entry + 2)
  header.writeUInt8(0, entry + 3)
  header.writeUInt16LE(1, entry + 4)
  header.writeUInt16LE(32, entry + 6)
  header.writeUInt32LE(buffers[size].length, entry + 8)
  header.writeUInt32LE(offset, entry + 12)
  offset += buffers[size].length
})
await writeFile('public/favicon.ico', Buffer.concat([header, ...icoSizes.map((s) => buffers[s])]))

console.log('favicons written')
