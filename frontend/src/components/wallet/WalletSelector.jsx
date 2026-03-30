import { Modal } from '@/components/ui/Modal'
import { Wallet } from 'lucide-react'
import { FREIGHTER_ID, LOBSTR_ID } from '@/lib/walletkit'

const WALLETS = [
  { id: FREIGHTER_ID, name: 'Freighter', description: 'Browser extension wallet' },
  { id: 'xbull', name: 'xBull', description: 'Feature-rich Stellar wallet' },
  { id: LOBSTR_ID, name: 'Lobstr', description: 'Simple Stellar wallet' },
]

export function WalletSelector({ open, onClose, onSelect }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Connect Wallet"
      description="Choose your Stellar wallet to connect"
      size="sm"
    >
      <div className="space-y-2">
        {WALLETS.map((wallet) => (
          <button
            key={wallet.id}
            onClick={() => onSelect(wallet.id)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded border border-bg-border hover:border-accent-blue hover:bg-accent-blue/5 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded bg-bg-hover flex items-center justify-center flex-shrink-0">
              <Wallet size={16} className="text-accent-blue" />
            </div>
            <div>
              <div className="text-sm font-medium text-text-primary">{wallet.name}</div>
              <div className="text-xs text-text-muted">{wallet.description}</div>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  )
}
