import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync, existsSync, createReadStream } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

function serveFontsPlugin() {
  return {
    name: 'serve-fonts',
    configureServer(server) {
      server.middlewares.use('/font', (req, res, next) => {
        const fontDir = resolve('font')
        const file = resolve('font', decodeURIComponent(req.url).replace(/^\//, '').split('?')[0])
        if (!file.startsWith(fontDir)) return res.writeHead(403).end('Forbidden')
        if (!existsSync(file)) return next()
        res.setHeader('Content-Type', 'font/ttf')
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
        createReadStream(file).pipe(res)
      })
    },
  }
}

export default defineConfig({
  base: '/',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    react(),
    serveFontsPlugin(),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'tracker-v2.html'),
    },
  },
  server: {
    port: 5180,
    proxy: {
      '/gsheets-proxy': {
        target: 'https://docs.google.com',
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/gsheets-proxy/, ''),
        configure: proxy => {
          proxy.on('proxyRes', proxyRes => {
            delete proxyRes.headers['cache-control']
            delete proxyRes.headers['expires']
            delete proxyRes.headers['etag']
            proxyRes.headers['cache-control'] = 'no-store, no-cache, must-revalidate'
          })
        },
      },
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
