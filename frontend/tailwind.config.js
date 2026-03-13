/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0d0d0d',
          secondary: '#111111',
          tertiary: '#161616',
          panel: '#1a1a1a',
          hover: '#222222',
          border: '#2a2a2a',
        },
        accent: {
          blue: '#4f9eff',
          purple: '#9b6dff',
          green: '#3dd68c',
          yellow: '#f5c842',
          red: '#ff5f5f',
          orange: '#ff8c42',
        },
        text: {
          primary: '#e8e8e8',
          secondary: '#888888',
          muted: '#555555',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

