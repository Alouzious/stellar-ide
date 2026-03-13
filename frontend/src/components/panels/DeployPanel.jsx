import { Rocket, ExternalLink, Copy, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useDeploy } from '@/hooks/useDeploy'
import { copyToClipboard } from '@/lib/utils'
import { getExplorerUrl } from '@/lib/stellar'
import { notify } from '@/components/ui/Toast'
import { clsx } from 'clsx'

export function DeployPanel() {
  const { deploy, deploying, result } = useDeploy()
  const [network, setNetwork] = useState('TESTNET')
  const [rpcUrl, setRpcUrl] = useState('')
  const [progress, setProgress] = useState(0)
  const [copiedId, setCopiedId] = useState(null)

  const handleDeploy = async () => {
    setProgress(10)
    await deploy({ network, rpcUrl: rpcUrl || undefined })
    setProgress(100)
  }

  const handleCopy = async (text, id) => {
    await copyToClipboard(text)
    setCopiedId(id)
    notify.success('Copied to clipboard')
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Network selector */}
      <div>
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Network</h3>
        <div className="flex gap-3">
          {['TESTNET', 'MAINNET'].map((n) => (
            <label key={n} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="network"
                value={n}
                checked={network === n}
                onChange={() => setNetwork(n)}
                className="accent-accent-blue"
              />
              <span className="text-xs text-text-secondary">{n}</span>
            </label>
          ))}
        </div>
      </div>

      {/* RPC URL */}
      <div>
        <label className="text-xs text-text-muted uppercase tracking-wider">RPC URL (optional)</label>
        <input
          type="text"
          value={rpcUrl}
          onChange={(e) => setRpcUrl(e.target.value)}
          placeholder={network === 'MAINNET' ? 'https://soroban-mainnet.stellar.org' : 'https://soroban-testnet.stellar.org'}
          className="mt-1.5 w-full bg-bg-tertiary border border-bg-border rounded px-2.5 py-1.5 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue"
        />
      </div>

      <Button
        variant="primary"
        size="sm"
        icon={Rocket}
        loading={deploying}
        onClick={handleDeploy}
        className="w-full justify-center"
      >
        {deploying ? 'Deploying...' : 'Deploy Contract'}
      </Button>

      {deploying && <ProgressBar value={progress} label="Deploying..." color="blue" />}

      {/* Result */}
      {result && (
        <div className="space-y-2 p-3 bg-bg-tertiary rounded border border-accent-green/30">
          <div className="flex items-center gap-2">
            <CheckCircle size={12} className="text-accent-green" />
            <span className="text-xs text-accent-green font-medium">Deployed successfully</span>
            <Badge color="green">{network}</Badge>
          </div>

          {result.contractId && (
            <div>
              <div className="text-xs text-text-muted mb-1">Contract ID</div>
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono text-accent-blue flex-1 truncate">{result.contractId}</code>
                <button onClick={() => handleCopy(result.contractId, 'contract')} className="text-text-muted hover:text-text-primary transition-colors">
                  {copiedId === 'contract' ? <CheckCircle size={11} className="text-accent-green" /> : <Copy size={11} />}
                </button>
              </div>
            </div>
          )}

          {result.txHash && (
            <div>
              <div className="text-xs text-text-muted mb-1">Transaction</div>
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono text-text-secondary flex-1 truncate">{result.txHash.slice(0, 20)}...</code>
                <a
                  href={getExplorerUrl(network, result.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-accent-blue transition-colors"
                >
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
