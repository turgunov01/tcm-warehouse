import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cera Pro', 'Cera Round Pro', 'Montserrat', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif']
      }
    }
  }
} satisfies Config
