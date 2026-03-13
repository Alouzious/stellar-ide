import { Shield, AlertTriangle, AlertCircle, Info, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useAudit } from '@/hooks/useAudit'
import { useTerminalStore } from '@/store/terminalStore'
import { clsx } from 'clsx'

const SEVERITY_CONFIG = {
  critical: { color: 'red', icon: AlertCircle },
  high: { color: 'red', icon: AlertTriangle },
  medium: { color: 'yellow', icon: AlertTriangle },
  low: { color: 'blue', icon: Info },
}

export function AuditPanel() {
  const { run } = useAudit()
  const { isRunning, lines } = useTerminalStore()

  // Parse audit findings from terminal output
  const findings = lines
    .filter(l => l.type === 'output' && l.text)
    .reduce((acc, line) => {
      const text = line.text.toLowerCase()
      if (text.includes('critical')) acc.push({ severity: 'critical', message: line.text })
      else if (text.includes('high')) acc.push({ severity: 'high', message: line.text })
      else if (text.includes('medium')) acc.push({ severity: 'medium', message: line.text })
      else if (text.includes('low')) acc.push({ severity: 'low', message: line.text })
      return acc
    }, [])

  const counts = { critical: 0, high: 0, medium: 0, low: 0 }
  findings.forEach(f => counts[f.severity]++)

  return (
    <div className="space-y-4">
      <Button
        variant="primary"
        size="sm"
        icon={Shield}
        loading={isRunning}
        onClick={run}
        className="w-full justify-center"
      >
        {isRunning ? 'Auditing...' : 'Run Security Audit'}
      </Button>

      {findings.length > 0 && (
        <>
          {/* Summary */}
          <div>
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Summary</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(counts).map(([sev, count]) => (
                <div key={sev} className={clsx(
                  'flex items-center justify-between px-2.5 py-2 rounded border text-xs',
                  sev === 'critical' && 'bg-accent-red/10 border-accent-red/30',
                  sev === 'high' && 'bg-accent-red/5 border-accent-red/20',
                  sev === 'medium' && 'bg-accent-yellow/10 border-accent-yellow/30',
                  sev === 'low' && 'bg-accent-blue/10 border-accent-blue/30',
                )}>
                  <span className="capitalize text-text-secondary">{sev}</span>
                  <Badge color={SEVERITY_CONFIG[sev].color}>{count}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Findings list */}
          <div>
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Findings</h3>
            <div className="space-y-1.5">
              {findings.map((f, i) => {
                const { color, icon: Icon } = SEVERITY_CONFIG[f.severity]
                return (
                  <div key={i} className="flex items-start gap-2 px-2 py-2 bg-bg-tertiary rounded border border-bg-border">
                    <Icon size={12} className={clsx(
                      'mt-0.5 flex-shrink-0',
                      color === 'red' && 'text-accent-red',
                      color === 'yellow' && 'text-accent-yellow',
                      color === 'blue' && 'text-accent-blue',
                    )} />
                    <p className="text-xs text-text-secondary leading-relaxed">{f.message}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <Button variant="outline" size="sm" icon={Download} className="w-full justify-center">
            Export Report
          </Button>
        </>
      )}
    </div>
  )
}
