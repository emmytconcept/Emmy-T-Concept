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
        brand: {
          black: '#080808',           // Primary Luxury Black
          gold: '#d9a323',            // Metallic Gold Accent
          'gold-light': '#f3c658',    // Highlight Gold
          'gold-dark': '#b58210',     // Deep Shadow Gold
          silver: '#c6c8cc',          // Premium Silver
          'silver-light': '#e5e7eb',  // Bright Silver
          'silver-dark': '#8e9196',   // Muted Silver
          dark: '#111111',            // Secondary Dark Surface
          card: '#161616',            // Card Background
          border: 'rgba(217, 163, 35, 0.18)', // Subtle Gold Border
          'border-silver': 'rgba(198, 200, 204, 0.15)',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #d9a323 0%, #f5d061 50%, #b58210 100%)',
        'silver-gradient': 'linear-gradient(135deg, #c6c8cc 0%, #ffffff 50%, #8e9196 100%)',
        'dark-gradient': 'linear-gradient(180deg, #080808 0%, #141414 100%)',
        'luxury-radial': 'radial-gradient(circle at 50% 0%, rgba(217, 163, 35, 0.12) 0%, transparent 70%)',
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(217, 163, 35, 0.25)',
        'gold-glow-lg': '0 0 45px rgba(217, 163, 35, 0.35)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

