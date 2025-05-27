/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['var(--font-montserrat)'],
        sora: ['var(--font-sora)'],
      },
      colors: {
        orange: {
          500: '#F97316',
          600: '#EA580C'
        },
        amber: {
          500: '#F59E0B'
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}; 