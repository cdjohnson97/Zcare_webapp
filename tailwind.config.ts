import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bordeaux: {
          50: '#f9f0f2', 100: '#f3e1e5', 200: '#e7c2c9',
          300: '#d598a5', 400: '#be6578', 500: '#a73e54',
          600: '#8e2b40', 700: '#772033', 800: '#641d2d',
          900: '#551a28', 950: '#2e0a13',
        },
        cream: { 50: '#fdfcf7', 100: '#fbf8ed' }
      },
      keyframes: {
        scrollEcg: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-200px)' }, 
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '10%': { transform: 'scale(1.15)' },
          '20%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.15)' },
          '40%': { transform: 'scale(1)' },
        },
        drawEcg: {
          '0%': { strokeDashoffset: '1500' },
          '100%': { strokeDashoffset: '0' },
        },
        // Notre nouvelle animation d'apparition !
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'scroll-ecg': 'scrollEcg 2s linear infinite', 
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'draw-ecg': 'drawEcg 4s linear infinite', 
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
};
export default config;