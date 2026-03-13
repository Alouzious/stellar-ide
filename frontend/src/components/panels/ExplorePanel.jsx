import { Search, Play, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { getContractInterface } from '@/api/deploy'
import { notify } from '@/components/ui/Toast'
import { clsx } from 'clsx'

export function ExplorePanel() {
  const [contractId, setContractId] = useState('')
  const [loading, setLoading] = useState(false)
  const [iface, setIface] = useState(null)

  const loadInterface = async () => {
    if (!contractId.trim()) return
    setLoading(true)
    try {
      const { data } = await getContractInterface(contractId.trim())
      setIface(data)
    } catch {
      notify.error('Failed to load contract interface')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Contract ID</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadInterface()}
            placeholder="C..."
            className="flex-1 bg-bg-tertiary border border-bg-border rounded px-2.5 py-1.5 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue font-mono"
          />
          <Button
            variant="primary"
            size="sm"
            icon={Search}
            loading={loading}
            onClick={loadInterface}
          />
        </div>
      </div>

      {iface && (
        <div>
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Functions</h3>
          <div className="space-y-2">
            {(iface.functions || []).map((fn) => (
              <ContractFunction key={fn.name} fn={fn} contractId={contractId} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ContractFunction({ fn, contractId }) {
  const [expanded, setExpanded] = useState(false)
  const [args, setArgs] = useState({})
  const [result, setResult] = useState(null)

  const invoke = () => {
    // Placeholder for actual invocation
    notify.info(`Invoking ${fn.name} — connect wallet to invoke`)
  }

  return (
    <div className="border border-bg-border rounded bg-bg-tertiary">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 text-left"
      >
        <span className="text-xs font-mono text-accent-blue">{fn.name}</span>
        <ChevronDown size={12} className={clsx('text-text-muted transition-transform', expanded && 'rotate-180')} />
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-bg-border">
          {(fn.inputs || []).map((input) => (
            <div key={input.name}>
              <label className="text-xs text-text-muted">{input.name}: <span className="text-accent-purple">{input.type}</span></label>
              <input
                type="text"
                value={args[input.name] || ''}
                onChange={(e) => setArgs({ ...args, [input.name]: e.target.value })}
                placeholder={`Enter ${input.name}`}
                className="mt-1 w-full bg-bg-secondary border border-bg-border rounded px-2 py-1 text-xs font-mono text-text-primary focus:outline-none focus:border-accent-blue"
              />
            </div>
          ))}
          <Button variant="ghost" size="xs" icon={Play} onClick={invoke}>Invoke</Button>
          {result && (
            <pre className="text-xs font-mono text-accent-green bg-bg-primary rounded p-2">{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  )
}
