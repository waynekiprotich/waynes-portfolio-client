/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Palette taken from the CV (navy sidebar, amber headings) so the site
      // and the PDF read as one identity. Values live in styles/index.css.
      colors: {
        night: 'rgb(var(--night) / <alpha-value>)',
        deep: 'rgb(var(--deep) / <alpha-value>)',
        raised: 'rgb(var(--raised) / <alpha-value>)',
        chalk: 'rgb(var(--chalk) / <alpha-value>)',
        haze: 'rgb(var(--haze) / <alpha-value>)',
        faint: 'rgb(var(--faint) / <alpha-value>)',
        amber: 'rgb(var(--amber) / <alpha-value>)',
        signal: 'rgb(var(--signal) / <alpha-value>)',
        line: 'rgb(var(--chalk) / 0.12)',
        lineStrong: 'rgb(var(--chalk) / 0.24)',
      },
      fontFamily: {
        display: ['Anybody', 'Anybody Fallback', 'system-ui', 'sans-serif'],
        sans: ['Instrument Sans', 'Instrument Fallback', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      // A classic typographic scale (12 14 17 21 24 36 48 72 …), with the
      // display steps fluid so the name fills a phone and a 27" screen alike.
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.4' }],
        sm: ['0.875rem', { lineHeight: '1.5' }],
        base: ['1.0625rem', { lineHeight: '1.65' }],
        lede: ['clamp(1.125rem, 0.9rem + 0.7vw, 1.3125rem)', { lineHeight: '1.55' }],
        h3: ['1.5rem', { lineHeight: '1.2' }],
        h2: ['clamp(2.25rem, 1.2rem + 3.6vw, 4.5rem)', { lineHeight: '0.98' }],
        h1: ['clamp(2.75rem, 1.4rem + 5.2vw, 6.5rem)', { lineHeight: '0.94' }],
        name: ['clamp(2.75rem, 0.4rem + 9.2vw, 9.5rem)', { lineHeight: '0.84' }],
      },
      maxWidth: { shell: '90rem', measure: '38rem' },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
