/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      }
    },
  },
  plugins: [],
  safelist: [
    'bg-primary-50',
    'bg-primary-100',
    'bg-primary-200',
    'bg-primary-300',
    'bg-primary-400',
    'bg-primary-500',
    'bg-primary-600',
    'bg-primary-700',
    'bg-primary-800',
    'bg-primary-900',
    'text-primary-600',
    'text-primary-800',
    'text-primary-700',
    'bg-secondary-600',
    'bg-secondary-700',
    'text-secondary-600',
    'text-secondary-800',
    'border-primary-600',
    'border-primary-400',
    'border-primary-100',
    'border-secondary-600',
    'border-secondary-100',
    'hover:bg-primary-700',
    'hover:bg-primary-600',
    'hover:bg-primary-50',
    'hover:border-primary-400',
    'hover:border-primary-600',
    'hover:text-white',
    'hover:text-gray-200',
    'hover:scale-105',
  ]
} 