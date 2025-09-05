import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#166534', // emerald-800
          hover: '#115e35',   // emerald-900 hover
          focus: '#14532d',   // darker focus
        },
        accent: {
          mint: '#34D399',
          gold: '#FACC15',
        },
        neutral: {
          light: '#F9FAFB',
          dark: '#1F2937',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
