// Frontend-Architektur: docs/architecture/03-frontend-architecture.md.
// routeRules sind die EINZIGE Stelle für Rendering-Modi (§2).
export default defineNuxtConfig({
  compatibilityDate: '2026-07-01',
  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],

  css: ['~/assets/css/main.css'],

  routeRules: {
    // Öffentliche Inhalte: SSR (SEO, FR-PLAT-004) — SWR-Caching folgt mit den Inhalten
    '/': { ssr: true },
    // Angemeldete Bereiche: SPA (docs/architecture/03 §2)
    '/app/**': { ssr: false },
    '/admin/**': { ssr: false },
    '/setup/**': { ssr: false },
  },

  i18n: {
    locales: [
      { code: 'de', language: 'de-DE', name: 'Deutsch', file: 'de.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'de',
    strategy: 'no_prefix',
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'lir_locale',
    },
  },

  app: {
    head: {
      htmlAttrs: {
        // TODO(E-14/US-14-02): FOUC-freie Theme-Erkennung via Inline-Head-Snippet
        'data-theme': 'light',
      },
      titleTemplate: '%s · Learn it right. Make it better.',
    },
  },

  nitro: {
    // BFF-Proxy in Dev: /api/** → Backend (Same-Origin-Cookies, docs/architecture/03 §4)
    devProxy: {
      '/api': { target: 'http://localhost:3001/api', changeOrigin: false },
    },
  },

  typescript: {
    strict: true,
  },
});
