/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1B3A5C',
          50:  '#EBF1F8',
          100: '#C2D5E9',
          200: '#99B9DA',
          300: '#709DCC',
          400: '#4781BD',
          500: '#1B3A5C',
          600: '#163050',
          700: '#112644',
          800: '#0C1C38',
          900: '#07122C',
        },
        sky: {
          DEFAULT: '#4A9FD4',
          50:  '#EAF4FB',
          100: '#BEE0F4',
          200: '#92CCED',
          300: '#66B8E6',
          400: '#4A9FD4',
          500: '#2E86C2',
          600: '#256DAE',
          700: '#1C5499',
          800: '#133B84',
          900: '#0A226F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card':       '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.09), 0 12px 40px rgba(0,0,0,0.06)',
        'btn-sky':    '0 2px 8px rgba(74,159,212,0.28), inset 0 1px 0 rgba(255,255,255,0.12)',
        'btn-sky-hover': '0 6px 20px rgba(74,159,212,0.38), inset 0 1px 0 rgba(255,255,255,0.12)',
        'btn-navy':   '0 2px 8px rgba(27,58,92,0.2), inset 0 1px 0 rgba(255,255,255,0.07)',
        'modal':      '0 20px 60px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
};
