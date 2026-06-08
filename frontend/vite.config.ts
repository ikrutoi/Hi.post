import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from 'vite-plugin-svgr'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiProxyTarget =
    env.VITE_DEV_API_PROXY ?? 'http://127.0.0.1:8000'

  return {
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
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
        },
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
        '@app': path.resolve(__dirname, 'src/app'),
        '@cardSectionToolbar': path.resolve(
          __dirname,
          'src/features/cardSectionToolbar',
        ),
        '@data': path.resolve(__dirname, 'src/data'),
        '@db': path.resolve(__dirname, 'src/db'),
        '@entities': path.resolve(__dirname, 'src/entities'),
        '@features': path.resolve(__dirname, 'src/features'),
        '@i18n': path.resolve(__dirname, 'src/i18n'),
        '@middleware': path.resolve(__dirname, 'src/middleware'),
        '@schemas': path.resolve(__dirname, 'src/schemas'),
        '@shared': path.resolve(__dirname, 'src/shared'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@cardPanel': path.resolve(__dirname, 'src/features/cardPanel'),
        '@cardphoto': path.resolve(__dirname, 'src/features/cardphoto'),
        '@cardtext': path.resolve(__dirname, 'src/features/cardtext'),
        '@envelope': path.resolve(__dirname, 'src/features/envelope'),
        '@aroma': path.resolve(__dirname, 'src/features/aroma'),
        '@date': path.resolve(__dirname, 'src/features/date'),
        '@toolbar': path.resolve(__dirname, 'src/features/toolbar'),
        '@cart': path.resolve(__dirname, 'src/features/cart'),
        '@drafts': path.resolve(__dirname, 'src/features/drafts'),
        '@sent': path.resolve(__dirname, 'src/features/sent'),
        '@layout': path.resolve(__dirname, 'src/features/layout'),
        '@layoutNav': path.resolve(__dirname, 'src/features/layoutNav'),
      },
    },
  }
})
