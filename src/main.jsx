import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { preloadRoute } from '@/lib/pages'
import { isLowEnd } from '@/lib/device'
import './styles/index.css'

// The root already holds this route's prerendered HTML. Load the route's
// chunk before rendering, so that HTML is replaced by the live page directly
// rather than flashing the Suspense fallback in between.
if (isLowEnd()) document.documentElement.dataset.lite = 'true'

preloadRoute(window.location.pathname)
  .catch(() => {})
  .then(() => {
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <App />
      </StrictMode>
    )
  })
