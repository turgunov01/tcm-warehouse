import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: {
        lang: 'ru'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'theme-color', content: '#080b12' }
      ]
    }
  },
  modules: ['@nuxt/ui', '@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@nuxtjs/google-fonts'],
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'dark',
    fallback: 'dark'
  },
  typescript: {
    strict: true,
    typeCheck: false
  },
  runtimeConfig: {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
    }
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/login',
      include: ['/', '/admin/**', '/tenant/**', '/guard/**'],
      exclude: ['/api/**']
    }
  },
  googleFonts: {
    families: {
      Montserrat: [400, 500, 600, 700]
    },
    display: 'swap',
    preload: true,
    prefetch: true,
    download: false,
    useStylesheet: true
  },
  nitro: {
    preset: 'netlify'
  }
})
