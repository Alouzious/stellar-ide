import { useEffect, useRef } from 'react'
import { useCollabStore } from '@/store/collabStore'
import { useAuthStore } from '@/store/authStore'
import { createCollabSocket } from '@/api/websocket'

export function useCollaboration(projectId) {
  const wsRef = useRef(null)
  const { token } = useAuthStore()
  const { setPeers, setConnected, addPeer, removePeer, setRoomId } = useCollabStore()

  useEffect(() => {
    if (!projectId || !token) return

    setRoomId(projectId)

    const ws = createCollabSocket(projectId, token, {
      onOpen: () => setConnected(true),
      onClose: () => {
        setConnected(false)
        setPeers([])
      },
      onMessage: (data) => {
        if (data.type === 'peers') setPeers(data.peers || [])
        if (data.type === 'peer_joined') addPeer(data.peer)
        if (data.type === 'peer_left') removePeer(data.peerId)
      },
    })

    wsRef.current = ws
    return () => {
      ws.close()
      setConnected(false)
      setRoomId(null)
    }
  }, [projectId, token])

  const sendEdit = (delta) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'edit', delta }))
    }
  }

  return { sendEdit }
}
