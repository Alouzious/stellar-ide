import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-accent-blue text-white hover:bg-blue-500 active:bg-blue-600',
  ghost: 'bg-transparent text-text-secondary hover:bg-bg-hover hover:text-text-primary',
  danger: 'bg-accent-red text-white hover:bg-red-600 active:bg-red-700',
  success: 'bg-accent-green text-bg-primary hover:bg-green-400 active:bg-green-500',
  outline: 'border border-bg-border text-text-secondary hover:border-accent-blue hover:text-accent-blue',
}

const sizes = {
  xs: 'px-2 py-1 text-xs gap-1',
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  disabled = false,
  children,
  className,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded transition-colors duration-150 select-none',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        'focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-1 focus:ring-offset-bg-primary',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === 'xs' ? 10 : size === 'sm' ? 12 : 14} className="animate-spin" />
      ) : Icon ? (
        <Icon size={size === 'xs' ? 10 : size === 'sm' ? 12 : 14} />
      ) : null}
      {children && <span>{children}</span>}
    </button>
  )
}
