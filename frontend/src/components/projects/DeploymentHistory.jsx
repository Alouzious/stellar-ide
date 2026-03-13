import { ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatDate, truncateAddress } from '@/lib/utils'
import { getExplorerUrl } from '@/lib/stellar'

export function DeploymentHistory({ deployments = [] }) {
  if (deployments.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-text-muted">
        No deployments yet
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-bg-border">
            <th className="text-left py-2 px-3 text-text-muted font-medium">Date</th>
            <th className="text-left py-2 px-3 text-text-muted font-medium">Network</th>
            <th className="text-left py-2 px-3 text-text-muted font-medium">Contract ID</th>
            <th className="text-left py-2 px-3 text-text-muted font-medium">Status</th>
            <th className="text-left py-2 px-3 text-text-muted font-medium">Tx</th>
          </tr>
        </thead>
        <tbody>
          {deployments.map((d) => (
            <tr key={d.id} className="border-b border-bg-border hover:bg-bg-hover transition-colors">
              <td className="py-2 px-3 text-text-secondary">{formatDate(d.deployedAt)}</td>
              <td className="py-2 px-3">
                <Badge color={d.network === 'MAINNET' ? 'green' : 'blue'}>{d.network}</Badge>
              </td>
              <td className="py-2 px-3 font-mono text-accent-blue">{truncateAddress(d.contractId, 8)}</td>
              <td className="py-2 px-3">
                <Badge color={d.status === 'success' ? 'green' : d.status === 'pending' ? 'yellow' : 'red'}>
                  {d.status}
                </Badge>
              </td>
              <td className="py-2 px-3">
                {d.txHash && (
                  <a
                    href={getExplorerUrl(d.network, d.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-accent-blue transition-colors"
                  >
                    <ExternalLink size={11} />
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
