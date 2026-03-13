import { Copy, CheckCircle, Package } from 'lucide-react'
import { useState } from 'react'
import { copyToClipboard, truncateAddress } from '@/lib/utils'
import { notify } from '@/components/ui/Toast'

export function ArtifactsCard({ contractId, abi }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await copyToClipboard(contractId)
    setCopied(true)
    notify.success('Contract ID copied')
    setTimeout(() => setCopied(false), 2000)
  }

  const fnCount = abi?.functions?.length || 0

  return (
    <div className="bg-bg-secondary border border-bg-border rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Package size={16} className="text-accent-purple" />
        <span className="text-sm font-semibold text-text-primary">Contract Artifact</span>
      </div>

      <div>
        <div className="text-xs text-text-muted mb-1">Contract ID</div>
        <div className="flex items-center gap-2 bg-bg-tertiary rounded px-3 py-2">
          <code className="text-xs font-mono text-accent-blue flex-1 truncate">{contractId}</code>
          <button onClick={handleCopy} className="text-text-muted hover:text-text-primary flex-shrink-0">
            {copied ? <CheckCircle size={12} className="text-accent-green" /> : <Copy size={12} />}
          </button>
        </div>
      </div>

      <div className="text-xs text-text-muted">
        {fnCount} function{fnCount !== 1 ? 's' : ''} in ABI
      </div>
    </div>
  )
}
