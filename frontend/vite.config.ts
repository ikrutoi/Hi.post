import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': 'http://php:8000',
    },
  },
  resolve: {
    alias: {
      '@app/store': path.resolve(__dirname, 'src/app/store/index.ts'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@i18n': path.resolve(__dirname, 'src/i18n'),
      '@db': path.resolve(__dirname, 'src/db'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@middleware': path.resolve(__dirname, 'src/middleware'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@schemas': path.resolve(__dirname, 'src/schemas'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@data': path.resolve(__dirname, 'src/data'),
      '@locales': path.resolve(__dirname, 'src/locales'),
      '@entities': path.resolve(__dirname, 'src/entities'),
      '@cardphoto': path.resolve(__dirname, 'src/features/cardphoto'),
      '@cardtext': path.resolve(__dirname, 'src/features/cardtext'),
      '@envelope': path.resolve(__dirname, 'src/features/envelope'),
      '@aroma': path.resolve(__dirname, 'src/features/aroma'),
      '@date': path.resolve(__dirname, 'src/features/date'),
      '@history': path.resolve(__dirname, 'src/features/history'),
      '@cart': path.resolve(__dirname, 'src/features/cart'),
      '@drafts': path.resolve(__dirname, 'src/features/drafts'),
      '@sent': path.resolve(__dirname, 'src/features/sent'),
      '@layout': path.resolve(__dirname, 'src/features/layout'),
    },
  },
})
