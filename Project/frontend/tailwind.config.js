/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#edf5ff',
          100: '#d9e9ff',
          500: '#1672ff',
          600: '#0866f5',
          700: '#0754d3',
          900: '#073b8c',
        },
        resolve: { green: '#15c93c' },
      },
    },
  },
  plugins: [],
};

