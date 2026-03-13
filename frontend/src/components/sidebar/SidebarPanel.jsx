import { X } from 'lucide-react'
import { clsx } from 'clsx'

export function SidebarPanel({ title, children, onClose, className }) {
  return (
    <div
      className={clsx(
        'flex flex-col h-full bg-bg-secondary border-r border-bg-border w-[280px] flex-shrink-0',
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-bg-border flex-shrink-0">
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{title}</h2>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          <X size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {children}
      </div>
    </div>
  )
}
