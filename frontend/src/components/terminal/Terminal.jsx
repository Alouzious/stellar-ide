import { useEffect, useRef } from 'react'
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, Trash2 } from 'lucide-react'
import { clsx } from 'clsx'
import { useTerminalStore } from '@/store/terminalStore'
import { TerminalLine } from './TerminalLine'
import { TerminalResizer } from './TerminalResizer'

export function Terminal() {
  const { lines, isOpen, height, isRunning, clear, setOpen } = useTerminalStore()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  if (!isOpen) {
    return (
      <div className="flex items-center bg-bg-secondary border-t border-bg-border px-3 py-1 flex-shrink-0">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          <TerminalIcon size={12} />
          <span>Terminal</span>
          {lines.length > 0 && <span className="text-text-muted">({lines.length} lines)</span>}
        </button>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col bg-bg-primary border-t border-bg-border flex-shrink-0"
      style={{ height: `${height}px` }}
    >
      <TerminalResizer />

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-bg-secondary border-b border-bg-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <TerminalIcon size={12} className="text-text-muted" />
          <span className="text-xs text-text-secondary font-medium">Terminal</span>
          {lines.length > 0 && (
            <span className="text-xs text-text-muted">({lines.length} lines)</span>
          )}
          {isRunning && (
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
              <span className="text-xs text-accent-green">Running</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clear}
            className="text-text-muted hover:text-text-primary transition-colors p-1"
            title="Clear terminal"
          >
            <Trash2 size={11} />
          </button>
          <button
            onClick={() => setOpen(false)}
            className="text-text-muted hover:text-text-primary transition-colors p-1"
            title="Minimize"
          >
            <Minimize2 size={11} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {lines.length === 0 ? (
          <p className="text-xs text-text-muted font-mono">Ready. Run compile, build or test to see output here.</p>
        ) : (
          lines.map((line) => (
            <TerminalLine key={line.id} type={line.type} text={line.text} />
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
