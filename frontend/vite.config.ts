import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from 'vite-plugin-svgr'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    svgr(),
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
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@app/styles/core" as *;`,
        loadPaths: [path.resolve(__dirname, 'src')],
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@app/store': path.resolve(__dirname, 'src/app/store/index.ts'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@i18n': path.resolve(__dirname, 'src/i18n'),
      '@cardMenu': path.resolve(__dirname, 'src/features/cardMenu'),
      '@cardEditorMenu': path.resolve(__dirname, 'src/features/cardEditorMenu'),
      '@cardSectionToolbar': path.resolve(
        __dirname,
        'src/features/cardSectionToolbar',
      ),
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
      '@cardPanel': path.resolve(__dirname, 'src/features/cardPanel'),
      '@cardphoto': path.resolve(__dirname, 'src/features/cardphoto'),
      '@cardtext': path.resolve(__dirname, 'src/features/cardtext'),
      '@envelope': path.resolve(__dirname, 'src/features/envelope'),
      '@aroma': path.resolve(__dirname, 'src/features/aroma'),
      '@date': path.resolve(__dirname, 'src/features/date'),
      '@history': path.resolve(__dirname, 'src/features/history'),
      '@toolbar': path.resolve(__dirname, 'src/features/toolbar'),
      '@preview': path.resolve(__dirname, 'src/features/preview'),
      '@header': path.resolve(__dirname, 'src/features/header'),
      '@headerActions': path.resolve(__dirname, 'src/features/headerActions'),
      '@cart': path.resolve(__dirname, 'src/features/cart'),
      '@drafts': path.resolve(__dirname, 'src/features/drafts'),
      '@sent': path.resolve(__dirname, 'src/features/sent'),
      '@layout': path.resolve(__dirname, 'src/features/layout'),
      '@layoutNav': path.resolve(__dirname, 'src/features/layoutNav'),
      '@styles': path.resolve(__dirname, 'src/styles'),
    },
  },
})
