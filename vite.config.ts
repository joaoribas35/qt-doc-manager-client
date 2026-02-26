import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: 'src/app/routes',
    }),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Minimal service worker - just for installability
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // Disable aggressive caching since you don't need offline
        runtimeCaching: [],
      },
      manifest: {
        name: 'DocManager',
        short_name: 'DocManager',
        description: 'DocManager',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone', // This makes it feel like a native app
        start_url: '/',
        icons: [
          {
            src: 'ios/100.png',
            sizes: '100x100',
            type: 'image/png',
          },
          {
            src: 'ios/128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: 'ios/192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'ios/256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: 'ios/512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'android/android-launchericon-512-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'android/android-launchericon-192-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'android/android-launchericon-144-144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: 'android/android-launchericon-96-96.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve('src'),
    },
  },
});
