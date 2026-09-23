import { Writable } from 'node:stream'
import { renderToPipeableStream } from 'react-dom/server'
import App from './App'

/**
 * Renders one route to HTML at build time (see scripts/prerender-meta.mjs).
 * Waits for every lazy page to resolve, so the markup is the full page rather
 * than the Suspense fallback. Returns the Helmet data so the script can bake
 * the same title and description into the document head.
 */
export function render(url) {
  const helmetContext = {}

  return new Promise((resolve, reject) => {
    let html = ''
    const sink = new Writable({
      write(chunk, _encoding, callback) {
        html += chunk
        callback()
      },
    })
    sink.on('finish', () => resolve({ html, helmet: helmetContext.helmet }))

    const { pipe } = renderToPipeableStream(<App url={url} helmetContext={helmetContext} />, {
      onAllReady() {
        pipe(sink)
      },
      onShellError: reject,
      onError: reject,
    })
  })
}
