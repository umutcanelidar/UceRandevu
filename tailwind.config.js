/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FDF2F4',
          100: '#FCE7EB',
          200: '#F8D0D9',
          300: '#F2A8B8',
          400: '#E7748F',
          500: '#D6456B',
          600: '#9B1D3D', // Canlı Asil Bordo (ALA Beauté / BAGE)
          700: '#800020', // Derin Bordo (Imperial Burgundy)
          800: '#6B001B',
          900: '#4D0013',
          950: '#2E000B',
        },
        bordeaux: {
          50: '#FDF2F4',
          100: '#FCE7EB',
          200: '#F8D0D9',
          300: '#F2A8B8',
          400: '#E7748F',
          500: '#D6456B',
          600: '#9B1D3D',
          700: '#800020',
          800: '#6B001B',
          900: '#4D0013',
          950: '#2E000B',
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.07)',
        'dropdown': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
