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
        // Brand green palette (agriculture-inspired)
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#1a7a4a',   // primary brand green
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          // Convenience aliases
          primary: '#1a7a4a',
          accent:  '#f59e0b',
        },
        // CSS-variable-backed semantic tokens (auto-switch light/dark)
        background: 'var(--background)',
        surface:    'var(--surface)',
        border:     'var(--border)',
        text: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
        },
        // Severity palette used in badges
        severity: {
          critical: '#dc2626',
          high:     '#ea580c',
          medium:   '#ca8a04',
          low:      '#2563eb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

