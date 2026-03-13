const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080'

export function createCollabSocket(projectId, token, handlers = {}) {
  const url = `${WS_URL}/ws/collab/${projectId}?token=${token}`
  const ws = new WebSocket(url)

  ws.onopen = () => handlers.onOpen?.()
  ws.onclose = () => handlers.onClose?.()
  ws.onerror = (e) => handlers.onError?.(e)
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      handlers.onMessage?.(data)
    } catch {
      handlers.onMessage?.({ raw: event.data })
    }
  }

  return ws
}
