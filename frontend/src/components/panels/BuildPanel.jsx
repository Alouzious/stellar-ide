import { Hammer, Copy, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useBuild } from '@/hooks/useBuild'
import { useTerminalStore } from '@/store/terminalStore'
import { copyToClipboard } from '@/lib/utils'
import { notify } from '@/components/ui/Toast'
import { clsx } from 'clsx'

export function BuildPanel() {
  const { run } = useBuild()
  const { isRunning, lines } = useTerminalStore()
  const [copied, setCopied] = useState(false)

  const buildCmd = 'cargo build --target wasm32-unknown-unknown --release'

  const handleCopy = async () => {
    await copyToClipboard(buildCmd)
    setCopied(true)
    notify.success('Command copied')
    setTimeout(() => setCopied(false), 2000)
  }

  const hasOutput = lines.length > 0
  const lastLine = lines[lines.length - 1]
  const status = isRunning ? 'building' : lastLine?.type === 'success' ? 'success' : lastLine?.type === 'error' ? 'error' : 'idle'

  return (
    <div className="space-y-4">
      <Button
        variant="primary"
        size="sm"
        icon={Hammer}
        loading={isRunning}
        onClick={run}
        className="w-full justify-center"
      >
        {isRunning ? 'Building...' : 'Build WASM'}
      </Button>

      {/* Status */}
      <div className={clsx(
        'flex items-center gap-2 px-3 py-2 rounded text-xs border',
        status === 'idle' && 'bg-bg-hover border-bg-border text-text-secondary',
        status === 'building' && 'bg-accent-blue/10 border-accent-blue/30 text-accent-blue',
        status === 'success' && 'bg-accent-green/10 border-accent-green/30 text-accent-green',
        status === 'error' && 'bg-accent-red/10 border-accent-red/30 text-accent-red',
      )}>
        {status === 'idle' && <Clock size={12} />}
        {status === 'building' && <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />}
        {status === 'success' && <CheckCircle size={12} />}
        {status === 'error' && <XCircle size={12} />}
        <span>
          {status === 'idle' && 'Ready to build'}
          {status === 'building' && 'Building WASM...'}
          {status === 'success' && 'Build successful'}
          {status === 'error' && 'Build failed'}
        </span>
      </div>

      {/* Command copy */}
      <div>
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Build Command</h3>
        <div className="flex items-center gap-2 bg-bg-tertiary rounded px-3 py-2 border border-bg-border">
          <code className="text-xs text-accent-blue font-mono flex-1 truncate">{buildCmd}</code>
          <button onClick={handleCopy} className="text-text-muted hover:text-text-primary transition-colors flex-shrink-0">
            {copied ? <CheckCircle size={12} className="text-accent-green" /> : <Copy size={12} />}
          </button>
        </div>
      </div>

      {/* Output preview */}
      {hasOutput && (
        <div>
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Output</h3>
          <div className="bg-bg-primary rounded border border-bg-border p-2 max-h-40 overflow-y-auto">
            {lines.slice(-10).map((line) => (
              <div
                key={line.id}
                className={clsx(
                  'text-xs font-mono',
                  line.type === 'success' && 'text-accent-green',
                  line.type === 'error' && 'text-accent-red',
                  line.type === 'cmd' && 'text-accent-blue',
                  !['success', 'error', 'cmd'].includes(line.type) && 'text-text-secondary',
                )}
              >
                {line.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
