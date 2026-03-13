const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

async function streamRequest(endpoint, payload, token, onLine) {
  const response = await fetch(`${API_URL}/api/v1${endpoint}`, {
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

export const compileCode = (code, token, onLine) =>
  streamRequest('/sandbox/compile', { code }, token, onLine)

export const buildCode = (code, token, onLine) =>
  streamRequest('/sandbox/build', { code }, token, onLine)

export const testCode = (code, token, onLine) =>
  streamRequest('/sandbox/test', { code }, token, onLine)

export const auditCode = (code, token, onLine) =>
  streamRequest('/sandbox/audit', { code }, token, onLine)
