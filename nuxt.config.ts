import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },
  app: {
    head: {
      title: 'TCM Warehouse',
      htmlAttrs: {
        lang: 'ru'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'TCM Warehouse booking and operations management platform.' },
        { name: 'application-name', content: 'TCM Warehouse' },
        { name: 'apple-mobile-web-app-title', content: 'TCM Warehouse' },
        { property: 'og:title', content: 'TCM Warehouse' },
        { property: 'og:description', content: 'Warehouse booking and operations management.' },
        { property: 'og:type', content: 'website' },
        { name: 'theme-color', content: '#f8fafc', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#080b12', media: '(prefers-color-scheme: dark)' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon-light.svg', media: '(prefers-color-scheme: light)' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon-dark.svg', media: '(prefers-color-scheme: dark)' },
        { rel: 'shortcut icon', type: 'image/svg+xml', href: '/favicon-dark.svg' }
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
