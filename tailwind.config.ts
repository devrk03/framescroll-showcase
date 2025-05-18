import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        crimson: ['var(--font-crimson-text)'],
        sans: ['var(--font-inter)'],
      },
      colors: {
        darkOverlay: 'rgba(0, 0, 0, 0.8)',
      },
      keyframes: {
        'scroll-arrow': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(10px)', opacity: '0' },
        },
         'glow-border': {
          '0%': { boxShadow: '0 0 5px rgba(255, 255, 255, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)' },
          '100%': { boxShadow: '0 0 5px rgba(255, 255, 255, 0.5)' },
        },
      },
      animation: {
        'scroll-arrow': 'scroll-arrow 1.5s infinite',
        'glow-border': 'glow-border 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
