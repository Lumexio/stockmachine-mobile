/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--theme-primary, #F44336)',
          light: 'var(--theme-primary-light, #EF5350)',
          dark: 'var(--theme-primary-dark, #B71C1C)',
        },
        theme: {
          background: 'var(--theme-background)',
          surface: 'var(--theme-surface)',
          card: 'var(--theme-card)',
          text: 'var(--theme-text)',
          textSecondary: 'var(--theme-text-secondary)',
          border: 'var(--theme-border)',
          icon: 'var(--theme-icon)',
        }
      },
      minHeight: {
        touchable: '44px',
      },
      minWidth: {
        touchable: '44px',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0,0,0,0.06)',
      }
    },
  },
  plugins: [],
};
