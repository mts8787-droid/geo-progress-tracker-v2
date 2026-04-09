import express from 'express'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync, writeFileSync, unlinkSync, existsSync, mkdirSync } from 'fs'
import { createProxyMiddleware } from 'http-proxy-middleware'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json({ limit: '50mb' }))

// ─── Data directory ─────────────────────────────────────────────────────────
const DATA_DIR = join(__dirname, 'data')
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })

const SNAP_FILE = join(DATA_DIR, 'tracker-v2-snapshot.json')
const META_FILE = join(DATA_DIR, 'tracker-v2-meta.json')

function readMetaFile(f) {
  try { return JSON.parse(readFileSync(f, 'utf-8')) } catch { return null }
}

// ─── Google Sheets Proxy ────────────────────────────────────────────────────
app.use('/gsheets-proxy', createProxyMiddleware({
  target: 'https://docs.google.com',
  changeOrigin: true,
  secure: true,
  pathRewrite: { '^/gsheets-proxy': '' },
  on: {
    proxyRes: (proxyRes) => {
      delete proxyRes.headers['cache-control']
      delete proxyRes.headers['expires']
      delete proxyRes.headers['etag']
      proxyRes.headers['cache-control'] = 'no-store, no-cache, must-revalidate'
    },
  },
}))

// ─── Font serving ───────────────────────────────────────────────────────────
app.use('/font', express.static(join(__dirname, 'font'), {
  maxAge: '365d',
  immutable: true,
}))

// ─── Publish API ────────────────────────────────────────────────────────────
app.post('/api/publish-tracker-v2', (req, res) => {
  const { data, dashboard, month } = req.body || {}
  if (!data) return res.status(400).json({ ok: false, error: 'data 필수' })
  try {
    const snap = { ...data, _dashboard: dashboard || null, _month: month || null }
    writeFileSync(SNAP_FILE, JSON.stringify(snap, null, 2))
    const meta = { title: 'GEO KPI Progress Tracker v2', ts: Date.now() }
    writeFileSync(META_FILE, JSON.stringify(meta, null, 2))
    console.log('[PUBLISH]', new Date().toISOString())
    res.json({ ok: true, ...meta, url: '/p/progress-tracker-v2/' })
  } catch (err) {
    console.error('[PUBLISH] Write error:', err.message)
    res.status(500).json({ ok: false, error: '파일 저장 실패: ' + err.message })
  }
})

app.get('/api/publish-tracker-v2', (req, res) => {
  const meta = readMetaFile(META_FILE)
  const hasData = existsSync(SNAP_FILE)
  res.json({ published: !!meta && hasData, ...(meta || {}), url: '/p/progress-tracker-v2/' })
})

app.delete('/api/publish-tracker-v2', (req, res) => {
  try { unlinkSync(SNAP_FILE) } catch (e) { if (e.code !== 'ENOENT') console.error(e.message) }
  try { unlinkSync(META_FILE) } catch (e) { if (e.code !== 'ENOENT') console.error(e.message) }
  res.json({ ok: true })
})

app.get('/api/tracker-snapshot-v2', (req, res) => {
  try {
    const data = JSON.parse(readFileSync(SNAP_FILE, 'utf-8'))
    res.json({ ok: true, data })
  } catch {
    res.json({ ok: false, data: null })
  }
})

// ─── Static serving ─────────────────────────────────────────────────────────
const DIST = join(__dirname, 'dist')
app.use(express.static(DIST))
app.get('*', (req, res) => {
  res.sendFile(join(DIST, 'tracker-v2.html'))
})

app.listen(PORT, () => {
  console.log(`Progress Tracker v2 running on http://localhost:${PORT}`)
})
