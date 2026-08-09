/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'Microsoft YaHei', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 18px 50px rgba(18, 78, 127, 0.10)',
        lift: '0 16px 32px rgba(19, 99, 168, 0.20)',
      },
      animation: {
        scan: 'scan 2.2s ease-in-out infinite',
        breathe: 'breathe 2.4s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.65' },
          '50%': { transform: 'translateY(206px)', opacity: '1' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.45' },
          '50%': { transform: 'scale(1.08)', opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
