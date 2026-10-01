/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0d0d0d',     
        paper: '#f0f0f0',   
        accent: '#ff6b6b',  
      },
      fontFamily: {
        mono: ['"Space Mono"', '"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [],
};