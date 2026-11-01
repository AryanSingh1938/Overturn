/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FDF6F3',
          100: '#FDF1EC',
          200: '#FCDFD4',
          300: '#F8BBA7',
          400: '#F08564',
          500: '#E05638', // Primary warm terracotta from Photo 2
          600: '#CC482B',
          700: '#B0381F',
          800: '#8E2E1A',
          900: '#752818',
        },
        sand: {
          50: '#FAF8F5',  // Background from Photo 2
          100: '#F5F1EB',
          200: '#EFECE6',
          300: '#E5E0D6',
          400: '#D4CDC0',
          500: '#B8AFA0',
        },
        navy: {
          900: '#111827',
          800: '#1C1F26',
          700: '#2D323E',
          600: '#4B5563',
          500: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'card': '14px',
        'btn': '10px',
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(28, 31, 38, 0.04), 0 1px 4px -1px rgba(28, 31, 38, 0.02)',
        'card': '0 1px 3px rgba(28, 31, 38, 0.03), 0 4px 12px rgba(28, 31, 38, 0.03)',
        'brand': '0 4px 14px rgba(224, 86, 56, 0.25)',
      }
    },
  },
  plugins: [],
}
