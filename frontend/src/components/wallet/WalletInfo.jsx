import { Copy, CheckCircle, Droplets, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useWalletStore } from '@/store/walletStore'
import { copyToClipboard, formatXLM } from '@/lib/utils'
import { friendbotFund } from '@/lib/stellar'
import { notify } from '@/components/ui/Toast'

export function WalletInfo() {
  const { address, balance, network } = useWalletStore()
  const [copied, setCopied] = useState(false)
  const [funding, setFunding] = useState(false)

  const handleCopy = async () => {
    await copyToClipboard(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFriendbot = async () => {
    setFunding(true)
    try {
      await friendbotFund(address)
      notify.success('Account funded with test XLM!')
    } catch (e) {
      notify.error(e.message || 'Funding failed')
    } finally {
      setFunding(false)
    }
  }

  if (!address) return null

  return (
    <div className="space-y-3 p-3 bg-bg-tertiary rounded border border-bg-border">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted">Address</span>
        <Badge color={network === 'MAINNET' ? 'green' : 'blue'}>{network}</Badge>
      </div>
      <div className="flex items-center gap-2">
        <code className="text-xs font-mono text-text-primary flex-1 break-all">{address}</code>
        <button onClick={handleCopy} className="text-text-muted hover:text-text-primary flex-shrink-0">
          {copied ? <CheckCircle size={12} className="text-accent-green" /> : <Copy size={12} />}
        </button>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-text-primary">{formatXLM(balance)}</span>
        {network === 'TESTNET' && (
          <Button
            variant="ghost"
            size="xs"
            icon={Droplets}
            loading={funding}
            onClick={handleFriendbot}
          >
            Fund
          </Button>
        )}
      </div>
    </div>
  )
}
