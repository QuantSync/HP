import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
        },
        rosegold: {
          400: '#c99a6b',
          500: '#b8860b',
        },
        champagne: {
          50: '#fef9e7',
          100: '#fdf3cf',
          400: '#d4a853',
        },
        plum: {
          600: '#4f3160',
          700: '#3d2545',
          800: '#2d1b33',
          900: '#1a0a1e',
        },
        midnight: {
          DEFAULT: '#0a0612',
          700: '#1e1430',
          800: '#130d1f',
          900: '#0a0612',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'balloon-rise': 'balloon-rise 4s ease-in-out infinite',
        'letter-reveal': 'letter-reveal 0.5s ease forwards',
        'spin-slow': 'spin 20s linear infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
        'fall': 'fall linear infinite',
        'sway': 'sway ease-in-out infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.3', transform: 'scale(0.8)' },
        },
        'balloon-rise': {
          '0%, 100%': { transform: 'translateY(0) rotate(-3deg)' },
          '50%': { transform: 'translateY(-15px) rotate(3deg)' },
        },
        'letter-reveal': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fall: {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0.3' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-aurora': 'linear-gradient(135deg, #1a0a1e 0%, #0a0612 25%, #2d1b33 50%, #130d1f 75%, #1a0a1e 100%)',
        'gradient-rose-gold': 'linear-gradient(135deg, #ec4899, #c99a6b, #d4a853)',
        'gradient-celebration': 'linear-gradient(135deg, #2d1b33, #1a0a1e, #0a0612)',
      },
      boxShadow: {
        'glow-rose': '0 0 30px rgba(236, 72, 153, 0.3)',
        'glow-gold': '0 0 30px rgba(212, 168, 83, 0.3)',
        'glow-plum': '0 0 40px rgba(45, 27, 51, 0.8)',
      },
    },
  },
  plugins: [],
};

export default config;
