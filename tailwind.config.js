/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-quicksand)', 'system-ui', 'sans-serif'],
        script: ['var(--font-corinthia)', 'cursive'],
      },
      height: {
        'screen-safe': ['100vh', '100dvh'],
        'screen-small': ['100vh', '100svh'],
        'screen-large': ['100vh', '100lvh'],
      },
      minHeight: {
        'screen-safe': ['100vh', '100dvh'],
        'screen-small': ['100vh', '100svh'],
        'screen-large': ['100vh', '100lvh'],
      },
      maxHeight: {
        'screen-safe': ['100vh', '100dvh'],
        'screen-small': ['100vh', '100svh'],
        'screen-large': ['100vh', '100lvh'],
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [],
}

