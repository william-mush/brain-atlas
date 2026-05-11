import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f6f5f1',
          100: '#eae6da',
          200: '#cfc7b1',
          300: '#a99e7e',
          400: '#7a6f52',
          500: '#574d36',
          600: '#3d3625',
          700: '#2a2519',
          800: '#1a1610',
          900: '#0e0c08',
        },
        neural: {
          rose: '#e89aa3',
          coral: '#f0a878',
          amber: '#e8b04a',
          moss: '#7a9461',
          teal: '#4f8a8b',
          slate: '#5a6b7a',
          violet: '#8a6fa3',
          plum: '#6b4869',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Iowan Old Style', 'Cambria', 'serif'],
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      typography: {
        DEFAULT: { css: { maxWidth: '70ch' } },
      },
    },
  },
  plugins: [],
};

export default config;
