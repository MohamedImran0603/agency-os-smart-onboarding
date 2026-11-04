import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ── Brand colour palette (Neirah Tech / Agency OS) ─────────────────────
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6fe',
          300: '#a4b8fd',
          400: '#7a91fa',
          500: '#5a6af6',  // primary
          600: '#4248eb',
          700: '#3737d1',
          800: '#2e2fa9',
          900: '#2a2d85',
          950: '#1a1a52',
        },
        surface: {
          DEFAULT: '#0f0f18',
          card:    '#16162a',
          border:  '#2a2a45',
          muted:   '#1e1e35',
        },
        accent: {
          purple: '#8b5cf6',
          cyan:   '#06b6d4',
          amber:  '#f59e0b',
          rose:   '#f43f5e',
        },
      },
      // ── Typography ──────────────────────────────────────────────────────────
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      // ── Animations ──────────────────────────────────────────────────────────
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'fade-up':  'fade-up 0.4s ease-out both',
        'fade-in':  'fade-in 0.3s ease-out both',
        shimmer:    'shimmer 1.4s ease-in-out infinite',
      },
      // ── Backdrop blur ───────────────────────────────────────────────────────
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
