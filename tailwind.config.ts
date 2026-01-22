import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fefef9',
          100: '#fefdf2',
          200: '#fefce5',
          300: '#fefcd8',
          400: '#f5e8c0',
          500: '#fefdd7',
          600: '#e8d9b8',
          700: '#d2b599',
          800: '#bc917a',
          900: '#a66d5b',
        },
        dark: {
          DEFAULT: '#000000',
          light: '#0a0a0a',
          lighter: '#1a1a1a',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cormorant Garamond', 'serif'],
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(254, 253, 215, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(254, 253, 215, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
export default config

