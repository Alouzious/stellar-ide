import { Wallet, LogOut, RefreshCw, ChevronDown } from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { truncateAddress, formatXLM } from '@/lib/utils'
import { WalletSelector } from './WalletSelector'

export function WalletConnect() {
  const {
    address, balance, network, connected, connecting,
    connect, disconnect, showSelector, setShowSelector,
  } = useWallet()

  if (connected && address) {
    return (
      <div className="flex items-center gap-2">
        <Badge color={network === 'MAINNET' ? 'green' : 'blue'}>{network}</Badge>
        <div className="flex items-center gap-1.5 bg-bg-tertiary border border-bg-border rounded px-2.5 py-1.5">
          <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          <span className="text-xs font-mono text-text-primary">{truncateAddress(address)}</span>
          {balance !== null && (
            <span className="text-xs text-text-muted">{formatXLM(balance)}</span>
          )}
          <button
            onClick={disconnect}
            className="ml-1 text-text-muted hover:text-accent-red transition-colors"
            title="Disconnect wallet"
          >
            <LogOut size={11} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        icon={Wallet}
        loading={connecting}
        onClick={() => setShowSelector(true)}
      >
        Connect Wallet
      </Button>
      <WalletSelector
        open={showSelector}
        onClose={() => setShowSelector(false)}
        onSelect={connect}
      />
    </>
  )
}
