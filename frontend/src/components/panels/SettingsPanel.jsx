import { Settings, Globe, Type, Keyboard } from 'lucide-react'
import { useState } from 'react'
import { useWalletStore } from '@/store/walletStore'

const KEYBINDINGS = [
  { action: 'Compile', keys: 'F5' },
  { action: 'Build', keys: 'F6' },
  { action: 'Test', keys: 'F7' },
  { action: 'Save', keys: 'Ctrl+S' },
  { action: 'Find', keys: 'Ctrl+F' },
  { action: 'Format', keys: 'Shift+Alt+F' },
  { action: 'Comment', keys: 'Ctrl+/' },
]

export function SettingsPanel() {
  const { network, setNetwork } = useWalletStore()
  const [rpcUrl, setRpcUrl] = useState('')
  const [fontSize, setFontSize] = useState(13)

  return (
    <div className="space-y-5">
      {/* Network */}
      <div>
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
          <Globe size={11} /> Network
        </h3>
        <div className="space-y-2">
          {['TESTNET', 'MAINNET'].map((n) => (
            <label key={n} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="settings-network"
                value={n}
                checked={network === n}
                onChange={() => setNetwork(n)}
                className="accent-accent-blue"
              />
              <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">{n}</span>
            </label>
          ))}
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="radio" name="settings-network" value="CUSTOM" className="accent-accent-blue" onChange={() => setNetwork('CUSTOM')} />
            <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">Custom RPC</span>
          </label>
        </div>
        {network === 'CUSTOM' && (
          <input
            type="text"
            value={rpcUrl}
            onChange={(e) => setRpcUrl(e.target.value)}
            placeholder="https://..."
            className="mt-2 w-full bg-bg-tertiary border border-bg-border rounded px-2.5 py-1.5 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue"
          />
        )}
      </div>

      {/* Editor */}
      <div>
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
          <Type size={11} /> Editor
        </h3>
        <div>
          <label className="text-xs text-text-muted mb-1 block">Font Size: {fontSize}px</label>
          <input
            type="range"
            min="10"
            max="20"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full accent-accent-blue"
          />
        </div>
      </div>

      {/* Keybindings */}
      <div>
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
          <Keyboard size={11} /> Keybindings
        </h3>
        <div className="space-y-1.5">
          {KEYBINDINGS.map(({ action, keys }) => (
            <div key={action} className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-bg-hover">
              <span className="text-xs text-text-secondary">{action}</span>
              <kbd className="text-xs bg-bg-tertiary border border-bg-border rounded px-1.5 py-0.5 font-mono text-text-muted">{keys}</kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
