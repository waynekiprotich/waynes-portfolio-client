import Header from '@/components/Header'
import Footer from '@/components/Footer'
import useLenis from '@/hooks/useLenis'

export default function RootLayout({ children }) {
  useLenis()

  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-full bg-amber px-5 py-3 font-semibold text-night"
      >
        Skip to content
      </a>
      <Header />
      {/* tabIndex lets the router move focus here after each navigation. */}
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  )
}
