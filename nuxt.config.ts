import { NuxtConfig } from '@nuxt/types'

const config: NuxtConfig = {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Disable server rendering
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'InvoiceKit',
    titleTemplate: '%s | InvoiceKit',
    htmlAttrs: {
      lang: 'fr',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['boxicons/css/boxicons.min.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/notification.ts', '~/plugins/dialog.ts'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/composition-api',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: 'AIzaSyAcSX6hQoAUOy3_msOBLPUnDwrrHsBM8PQ',
          authDomain: 'invoicekit01.firebaseapp.com',
          databaseURL: 'https://invoicekit01.firebaseio.com',
          projectId: 'invoicekit01',
          storageBucket: 'invoicekit01.appspot.com',
          messagingSenderId: '457758151352',
          appId: '1:457758151352:web:d22eb03c9eee56b64c5a4d',
          measurementId: 'G-MSHNV4CNP5',
        },
        services: {
          auth: {
            initialize: {
              onAuthStateChangedAction: 'auth/onAuthStateChanged',
            },
            emulatorPort:
              process.env.NODE_ENV === 'development' ? 9099 : undefined,
            emulatorHost: 'http://localhost',
            disableEmulatorWarnings: true,
          },
          firestore: {
            emulatorPort:
              process.env.NODE_ENV === 'development' ? 8080 : undefined,
            emulatorHost: 'localhost',
          },
          functions: {
            location: 'europe-west1',
            emulatorPort:
              process.env.NODE_ENV === 'development' ? 5001 : undefined,
            emulatorHost: 'http://localhost',
          },
          storage: true,
        },
      },
    ],
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  // TailwindCSS
  tailwindcss: {
    jit: true,
  },
}

export default config
