/**
 * Persists PDF tool state across Next.js App Router remounts.
 * `/`, `/compress`, and `/compress/result` each mount a fresh `HomePageClient`, so
 * React state is not preserved (unlike react-router in compressedPDF-react).
 *
 * Compression math (pdfjs, jsPDF, DPI, grayscale) is identical to `compressedPDF-react`
 * src/pages/HomePage.jsx — only routing/session differs.
 */

let sessionFiles = []
/** @type {Array<{ blob: Blob, fileName: string, originalSize: number, newSize: number, percentageSaved: number }> | null} */
let sessionResults = null

export function setSessionFiles(f) {
  sessionFiles = f && f.length ? [...f] : []
}

export function setSessionResults(r) {
  sessionResults = r && r.length ? [...r] : null
}

export function getSessionFiles() {
  return sessionFiles
}

export function getSessionResults() {
  return sessionResults
}

export function clearCompressionSession() {
  sessionFiles = []
  sessionResults = null
}
