// Use same-origin by default so nginx can proxy /api/* to backend.
// Set VITE_API_URL only for non-nginx dev (e.g. VITE_API_URL=http://localhost:8080).
const API_ORIGIN = import.meta.env.VITE_API_URL || ''

async function streamRequest(endpoint, payload, token, onLine) {
  const response = await fetch(`${API_ORIGIN}/api/v1${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed with status ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n').filter(Boolean)
    for (const line of lines) {
      onLine(line)
    }
  }
}

const toPayload = (code) => ({ source_code: code, language: 'rust' })

export const compileCode = (code, token, onLine) =>
  streamRequest('/sandbox/compile', toPayload(code), token, onLine)

export const buildCode = (code, token, onLine) =>
  streamRequest('/sandbox/build', toPayload(code), token, onLine)

export const testCode = (code, token, onLine) =>
  streamRequest('/sandbox/test', toPayload(code), token, onLine)

export const auditCode = (code, token, onLine) =>
  streamRequest('/sandbox/audit', toPayload(code), token, onLine)
