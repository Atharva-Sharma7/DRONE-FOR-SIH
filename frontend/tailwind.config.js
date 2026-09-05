/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Soil-derived palette ───────────────────────────
        vertisol:  '#17160F',  // deep black cotton soil
        tilth:     '#242318',  // freshly turned soil (cards)
        'tilth-2': '#2E2D22',  // borders
        'rabi-gold': '#E8C84A', // ripe soybean / cotton boll
        canopy:    '#4A7C42',  // healthy crop canopy
        rust:      '#C4531A',  // iron-oxide subsoil (alerts)
        overcast:  '#8B9EB5',  // monsoon cloud (secondary text)
        straw:     '#F5F1EA',  // dried straw (light bg)
        // ── CSS-var-backed semantic tokens ─────────────────
        bg:        'var(--bg)',
        surface:   'var(--surface)',
        'surface-2': 'var(--surface-2)',
        border:    'var(--border)',
        // ── Functional ─────────────────────────────────────
        accent:    'var(--accent)',
        green:     'var(--green)',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
        data: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Data-specific sizes
        'data-sm':  ['11px', { lineHeight: '1.4', letterSpacing: '0.02em' }],
        'data-md':  ['14px', { lineHeight: '1.4', fontVariantNumeric: 'tabular-nums' }],
        'data-lg':  ['22px', { lineHeight: '1.2', fontVariantNumeric: 'tabular-nums' }],
        'data-xl':  ['36px', { lineHeight: '1', fontVariantNumeric: 'tabular-nums' }],
        'hero':     ['96px', { lineHeight: '1', letterSpacing: '-0.03em' }],
      },
      animation: {
        // Only 2 purposeful animations — no scatter effects
        'rotor-cw':    'rotor-cw 0.18s linear infinite',
        'rotor-ccw':   'rotor-ccw 0.18s linear infinite',
        'radar-ping':  'radar-ping 2s ease-out infinite',
        'score-reveal':'score-reveal 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        'rotor-cw':  { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        'rotor-ccw': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(-360deg)' } },
        'radar-ping': {
          '0%':   { transform: 'scale(0.3)', opacity: '0.8' },
          '70%':  { transform: 'scale(1)',   opacity: '0.3' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        },
        'score-reveal': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
