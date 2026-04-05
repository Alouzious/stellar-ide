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
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const parts = buffer.split('\n')

    // Keep the last incomplete part in the buffer
    buffer = parts.pop()

    for (const part of parts) {
      const trimmed = part.trim()
      if (!trimmed || !trimmed.startsWith('data:')) continue

      try {
        const json = JSON.parse(trimmed.slice(5).trim())
        const { type, data, exit_code } = json

        if (type === 'done') {
          if (exit_code !== 0) {
            throw new Error(`Process exited with code ${exit_code}`)
          }
          continue
        }

        // Split the data by newline and emit each line separately
        const lines = (data || '').split('\n')
        for (const line of lines) {
          if (line.trim()) {
            onLine({ type: type === 'stderr' ? 'warn' : 'output', text: line })
          }
        }
      } catch (e) {
        // Not valid JSON — skip
      }
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
