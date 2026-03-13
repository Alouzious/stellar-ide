import { Users, Copy, CheckCircle, UserPlus, Circle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useCollabStore } from '@/store/collabStore'
import { copyToClipboard } from '@/lib/utils'
import { notify } from '@/components/ui/Toast'
import { clsx } from 'clsx'

const PEER_COLORS = ['#4f9eff', '#9b6dff', '#3dd68c', '#f5c842', '#ff8c42', '#ff5f5f']

export function CollabPanel() {
  const { peers, roomId, connected } = useCollabStore()
  const [copied, setCopied] = useState(false)

  const shareUrl = roomId ? `${window.location.origin}/ide?room=${roomId}` : null

  const handleCopy = async () => {
    if (!shareUrl) return
    await copyToClipboard(shareUrl)
    setCopied(true)
    notify.success('Share link copied')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Connection status */}
      <div className={clsx(
        'flex items-center gap-2 px-3 py-2 rounded border text-xs',
        connected
          ? 'bg-accent-green/10 border-accent-green/30 text-accent-green'
          : 'bg-bg-hover border-bg-border text-text-secondary'
      )}>
        <div className={clsx(
          'w-2 h-2 rounded-full',
          connected ? 'bg-accent-green animate-pulse' : 'bg-text-muted'
        )} />
        {connected ? 'Live session active' : 'Not in a session'}
      </div>

      {/* Share link */}
      {shareUrl && (
        <div>
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Share Link</h3>
          <div className="flex gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 bg-bg-tertiary border border-bg-border rounded px-2.5 py-1.5 text-xs text-text-secondary focus:outline-none font-mono truncate"
            />
            <button
              onClick={handleCopy}
              className="px-2.5 py-1.5 bg-bg-hover border border-bg-border rounded text-text-muted hover:text-text-primary transition-colors"
            >
              {copied ? <CheckCircle size={12} className="text-accent-green" /> : <Copy size={12} />}
            </button>
          </div>
        </div>
      )}

      {/* Peers */}
      <div>
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
          Collaborators ({peers.length})
        </h3>
        {peers.length === 0 ? (
          <p className="text-xs text-text-muted text-center py-4">No collaborators online</p>
        ) : (
          <div className="space-y-2">
            {peers.map((peer, i) => (
              <div key={peer.id} className="flex items-center gap-3 px-3 py-2 bg-bg-tertiary rounded border border-bg-border">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: peer.color || PEER_COLORS[i % PEER_COLORS.length] }}
                >
                  {peer.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-text-primary truncate">{peer.name || 'Anonymous'}</div>
                </div>
                <Circle
                  size={8}
                  className={clsx('fill-current flex-shrink-0', peer.online ? 'text-accent-green' : 'text-text-muted')}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Button variant="outline" size="sm" icon={UserPlus} className="w-full justify-center">
        Invite Collaborator
      </Button>
    </div>
  )
}
