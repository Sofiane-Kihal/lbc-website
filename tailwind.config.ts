import type { Config } from 'tailwindcss';
import { SAGE_SCALE } from './lib/colors';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: SAGE_SCALE,
        cream: {
          DEFAULT: '#FAF1E6',
          50: '#FFFCF8',
          100: '#FAF1E6',
          200: '#F2E2C8',
          300: '#EAD2AB',
        },
        stone: {
          DEFAULT: '#C7C0AE',
          light: '#D8D2C2',
          dark: '#A8A08D',
        },
        moss: {
          DEFAULT: '#010101',
          light: '#1F1F1F',
          dark: '#000000',
        },
        // Energetic accent — complementary of indigo on the color wheel.
        // Reserved for high-attention elements: primary CTAs, featured
        // pricing badges, key stats. Use sparingly to preserve impact.
        accent: {
          DEFAULT: '#FF6B35',
          50: '#FFF1EB',
          100: '#FFE0D2',
          200: '#FFC1A5',
          300: '#FFA178',
          400: '#FF824C',
          500: '#FF6B35',
          600: '#E85420',
          700: '#B33F19',
          800: '#7E2C12',
          900: '#4A1A0A',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'gradient': 'gradient 15s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
