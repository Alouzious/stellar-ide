import { Package, Copy, Download, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { copyToClipboard } from '@/lib/utils'
import { notify } from '@/components/ui/Toast'
import { useArtifacts } from '@/hooks/useArtifacts'

export function ArtifactsPanel() {
  const { artifacts, loading, download } = useArtifacts()
  const [abiExpanded, setAbiExpanded] = useState(false)
  const [copied, setCopied] = useState(null)

  const handleCopy = async (text, key) => {
    await copyToClipboard(text)
    setCopied(key)
    notify.success('Copied')
    setTimeout(() => setCopied(null), 2000)
  }

  if (!artifacts) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Package size={32} className="text-text-muted mb-3" />
        <p className="text-xs text-text-muted">Deploy a contract to generate artifacts</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Contract ID */}
      {artifacts.contractId && (
        <div>
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Contract ID</h3>
          <div className="flex items-center gap-2 bg-bg-tertiary rounded px-3 py-2 border border-bg-border">
            <code className="text-xs font-mono text-accent-blue flex-1 break-all">{artifacts.contractId}</code>
            <button onClick={() => handleCopy(artifacts.contractId, 'id')} className="text-text-muted hover:text-text-primary flex-shrink-0">
              {copied === 'id' ? <CheckCircle size={12} className="text-accent-green" /> : <Copy size={12} />}
            </button>
          </div>
        </div>
      )}

      {/* ABI */}
      {artifacts.abi && (
        <div>
          <button
            onClick={() => setAbiExpanded(!abiExpanded)}
            className="flex items-center justify-between w-full text-xs font-semibold text-text-muted uppercase tracking-wider mb-2"
          >
            <span>ABI JSON</span>
            {abiExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
          {abiExpanded && (
            <div className="relative">
              <pre className="bg-bg-primary border border-bg-border rounded p-2.5 text-xs font-mono text-text-secondary overflow-auto max-h-48">
                {JSON.stringify(artifacts.abi, null, 2)}
              </pre>
              <button
                onClick={() => handleCopy(JSON.stringify(artifacts.abi, null, 2), 'abi')}
                className="absolute top-2 right-2 text-text-muted hover:text-text-primary transition-colors"
              >
                {copied === 'abi' ? <CheckCircle size={11} className="text-accent-green" /> : <Copy size={11} />}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TS Client */}
      {artifacts.tsClient && (
        <div>
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">TypeScript Client</h3>
          <div className="relative">
            <pre className="bg-bg-primary border border-bg-border rounded p-2.5 text-xs font-mono text-text-secondary overflow-auto max-h-48">
              {artifacts.tsClient}
            </pre>
            <button
              onClick={() => handleCopy(artifacts.tsClient, 'ts')}
              className="absolute top-2 right-2 text-text-muted hover:text-text-primary transition-colors"
            >
              {copied === 'ts' ? <CheckCircle size={11} className="text-accent-green" /> : <Copy size={11} />}
            </button>
          </div>
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        icon={Download}
        loading={loading}
        onClick={() => download(artifacts.id)}
        className="w-full justify-center"
      >
        Download ZIP
      </Button>
    </div>
  )
}
