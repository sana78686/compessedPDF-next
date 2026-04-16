import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const src = path.join(root, 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs')
const dest = path.join(root, 'public', 'pdf.worker.min.mjs')

if (fs.existsSync(src)) {
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(src, dest)
  console.log('[copy-pdf-worker] Copied to public/pdf.worker.min.mjs')
} else {
  console.warn('[copy-pdf-worker] pdf.worker.min.mjs not found — run npm install')
}
