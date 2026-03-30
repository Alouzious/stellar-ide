import { clsx } from 'clsx'

const colorMap = {
  blue: 'bg-accent-blue/15 text-accent-blue border-accent-blue/30',
  green: 'bg-accent-green/15 text-accent-green border-accent-green/30',
  red: 'bg-accent-red/15 text-accent-red border-accent-red/30',
  yellow: 'bg-accent-yellow/15 text-accent-yellow border-accent-yellow/30',
  purple: 'bg-accent-purple/15 text-accent-purple border-accent-purple/30',
  orange: 'bg-accent-orange/15 text-accent-orange border-accent-orange/30',
  gray: 'bg-bg-hover text-text-secondary border-bg-border',
}

export function Badge({ color = 'gray', children, className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
        colorMap[color] || colorMap.gray,
        className
      )}
    >
      {children}
    </span>
  )
}
