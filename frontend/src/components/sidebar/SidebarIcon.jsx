import { clsx } from 'clsx'
import { Tooltip } from '@/components/ui/Tooltip'

export function SidebarIcon({ icon: Icon, label, active, onClick, badge }) {
  return (
    <Tooltip content={label} side="right">
      <button
        onClick={onClick}
        className={clsx(
          'relative w-10 h-10 flex items-center justify-center rounded transition-colors duration-150',
          active
            ? 'bg-accent-blue/20 text-accent-blue'
            : 'text-text-muted hover:text-text-secondary hover:bg-bg-hover'
        )}
        aria-label={label}
      >
        <Icon size={18} />
        {badge > 0 && (
          <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-accent-red rounded-full text-white text-[9px] flex items-center justify-center font-bold">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </button>
    </Tooltip>
  )
}
