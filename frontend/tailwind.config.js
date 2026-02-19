/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cod: {
          dark: '#1a1a2e',
          darkGray: '#16213e',
          mediumGray: '#0f3460',
          lightGray: '#1e2749',
          orange: '#FF6B00',
          lightOrange: '#FF8534',
          yellow: '#FFA500',
          gold: '#FFD700',
          darkOrange: '#CC5500',
          accent: '#00ff88',
        },
      },
      fontFamily: {
        rajdhani: ['Rajdhani', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { 
            boxShadow: '0 0 5px rgba(255, 107, 0, 0.5), 0 0 10px rgba(255, 107, 0, 0.3)',
          },
          '100%': { 
            boxShadow: '0 0 10px rgba(255, 107, 0, 0.8), 0 0 20px rgba(255, 107, 0, 0.5)',
          },
        },
      },
    },
  },
  plugins: [],
}
