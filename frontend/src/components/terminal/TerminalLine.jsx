import { clsx } from 'clsx'

const TYPE_STYLES = {
  cmd: 'text-accent-blue',
  success: 'text-accent-green',
  error: 'text-accent-red',
  warn: 'text-accent-yellow',
  info: 'text-text-secondary',
  output: 'text-text-primary',
}

const TYPE_PREFIX = {
  cmd: '$ ',
  success: '',
  error: '',
  warn: '',
  info: '',
  output: '',
}

export function TerminalLine({ type = 'output', text }) {
  return (
    <div className={clsx('flex text-xs font-mono leading-5 whitespace-pre-wrap break-all', TYPE_STYLES[type] || TYPE_STYLES.output)}>
      {TYPE_PREFIX[type] && (
        <span className="text-text-muted mr-1 flex-shrink-0">{TYPE_PREFIX[type]}</span>
      )}
      <span>{text}</span>
    </div>
  )
}
