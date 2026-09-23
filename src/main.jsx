import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { preloadRoute } from '@/lib/pages'
import './styles/index.css'

// The root already holds this route's prerendered HTML. Load the route's
// chunk before rendering, so that HTML is replaced by the live page directly
// rather than flashing the Suspense fallback in between.
preloadRoute(window.location.pathname)
  .catch(() => {})
  .then(() => {
    // Scoped hidden state for scroll reveals; see styles/index.css. Added only
    // now, so prerendered content is never hidden before React takes over.
    document.documentElement.classList.add('reveal-ready')

    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <App />
      </StrictMode>
    )
  })
