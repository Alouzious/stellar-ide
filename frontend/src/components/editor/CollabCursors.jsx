import { useCollabStore } from '@/store/collabStore'

export function CollabCursors() {
  const { peers } = useCollabStore()

  if (!peers.length) return null

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {peers.map((peer) => (
        peer.cursor && (
          <div
            key={peer.id}
            className="absolute flex items-center gap-1"
            style={{
              top: `${(peer.cursor.line - 1) * 20}px`,
              left: `${peer.cursor.column * 8}px`,
            }}
          >
            <div
              className="w-0.5 h-5"
              style={{ backgroundColor: peer.color || '#4f9eff' }}
            />
            <span
              className="text-xs px-1 py-0.5 rounded text-white whitespace-nowrap"
              style={{ backgroundColor: peer.color || '#4f9eff' }}
            >
              {peer.name}
            </span>
          </div>
        )
      ))}
    </div>
  )
}
