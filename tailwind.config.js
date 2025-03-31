/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f9f5ff',
          100: '#f0e7ff',
          200: '#e2d2ff',
          300: '#caaeff',
          400: '#ac7fff',
          500: '#9155fd',
          600: '#8133fd',
          700: '#6d25e8',
          800: '#5a20c5',
          900: '#4b1e9e',
          950: '#2e115e',
        },
        secondary: '#f7a08d',
        accent: '#ff8fc8',
        background: {
          DEFAULT: '#9d977b',
          primary: '#131920',
          secondary: '#2a3646',
        },
        dashboard: {
          dark: '#131920',
          light: '#f9f9f9',
          text: '#e4e4e4',
          accent: '#f7a08d',
          success: '#4caf50',
          danger: '#f44336',
          warning: '#ff9800',
          info: '#2196f3',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },
      fontFamily: {
        sans: ['Verdana', 'Geneva', 'Tahoma', 'sans-serif'],
      },
      spacing: {
        'header': '70px',
        'sidebar': '260px',
        'sidebar-collapsed': '70px',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      boxShadow: {
        'dashboard': '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
  important: true,
  corePlugins: {
    preflight: false,
  },
}
