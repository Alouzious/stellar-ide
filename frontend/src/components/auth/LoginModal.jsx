import { Rocket, Code2, Users, Shield, Zap } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { GithubOAuthButton } from './GithubOAuthButton'

const FEATURES = [
  { icon: Code2, text: 'Save your contracts to the cloud' },
  { icon: Rocket, text: 'One-click deploy to Testnet & Mainnet' },
  { icon: Users, text: 'Real-time collaboration' },
  { icon: Shield, text: 'Security audit history' },
]

export function LoginModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-accent-blue/20 flex items-center justify-center mx-auto mb-3">
          <Rocket size={24} className="text-accent-blue" />
        </div>
        <h2 className="text-lg font-bold text-text-primary">Welcome to StellarIDE</h2>
        <p className="text-sm text-text-muted mt-1">Sign in to save projects and deploy contracts</p>
      </div>

      <GithubOAuthButton className="w-full mb-4" />

      <div className="space-y-2">
        {FEATURES.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2.5 text-xs text-text-muted">
            <Icon size={13} className="text-accent-blue flex-shrink-0" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </Modal>
  )
}
