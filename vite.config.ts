import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        id: 'com.tea-timer',
        name: 'Tea Timer',
        short_name: 'Tea Timer',
        description: 'A feature-rich timer for tea sessions.',
        display: 'standalone',
        icons: [
          {
            'src': './image/icon/android-chrome-144x144.png',
            'sizes': '144x144',
            'type': 'image/png',
          },
        ],
        screenshots: [
          {
            'src': './image/screenshot/mobile.jpeg',
            'sizes': '375x667',
            'type': 'image/jpeg',
            'form_factor': 'narrow',
          },
          {
            'src': './image/screenshot/desktop.jpeg',
            'sizes': '1280x720',
            'type': 'image/jpeg',
            'form_factor': 'wide',
          },
        ],
      },
    }),
    VueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
