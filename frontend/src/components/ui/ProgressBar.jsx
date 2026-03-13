import { clsx } from 'clsx'

export function ProgressBar({ value = 0, max = 100, label, showPercent = true, color = 'blue', className }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  const colorMap = {
    blue: 'bg-accent-blue',
    green: 'bg-accent-green',
    red: 'bg-accent-red',
    yellow: 'bg-accent-yellow',
    purple: 'bg-accent-purple',
  }

  return (
    <div className={clsx('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-text-secondary">{label}</span>}
          {showPercent && <span className="text-xs text-text-muted">{Math.round(percent)}%</span>}
        </div>
      )}
      <div className="w-full h-1.5 bg-bg-hover rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-300', colorMap[color] || colorMap.blue)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
