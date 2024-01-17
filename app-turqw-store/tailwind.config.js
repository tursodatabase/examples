/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f4f62',
          50: '#e9f7fc',
          100: '#bde8f5',
          200: '#90d9ee',
          300: '#64c9e7',
          400: '#38bae1',
          500: '#1ea0c7',
          600: '#187d9b',
          700: '#11596f',
          800: '#0a3542',
          900: '#031216',
        },
        secondary: {
          DEFAULT: '#4ff8d2',
          50: '#e6fef9',
          100: '#b5fcec',
          200: '#84fae0',
          300: '#53f8d3',
          400: '#22f6c7',
          500: '#09ddad',
          600: '#07ac87',
          700: '#057b60',
          800: '#034a3a',
          900: '#011913',
        },
        tertiary: {
          DEFAULT: '#293945',
          50: '#eff3f5',
          100: '#cfdae2',
          200: '#afc2cf',
          300: '#8fa9bc',
          400: '#6f90a9',
          500: '#567790',
          600: '#435c70',
          700: '#304250',
          800: '#1d2830',
          900: '#0a0d10',
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
