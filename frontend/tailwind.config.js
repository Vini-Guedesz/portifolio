/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        tinta: '#17202a',
        folha: '#f6f3ee',
        cobre: '#b35b2a',
        musgo: '#3f6f56',
      },
      boxShadow: {
        painel: '0 18px 50px rgba(23, 32, 42, 0.12)',
      },
    },
  },
  plugins: [],
};
