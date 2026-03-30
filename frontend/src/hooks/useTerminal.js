import { useTerminalStore } from '@/store/terminalStore'

export function useTerminal() {
  const { lines, isOpen, height, isRunning, addLine, clear, setOpen, setHeight, setRunning } = useTerminalStore()

  const info = (text) => addLine({ type: 'info', text })
  const success = (text) => addLine({ type: 'success', text })
  const error = (text) => addLine({ type: 'error', text })
  const warn = (text) => addLine({ type: 'warn', text })
  const cmd = (text) => addLine({ type: 'cmd', text })
  const output = (text) => addLine({ type: 'output', text })

  return {
    lines, isOpen, height, isRunning,
    addLine, clear, setOpen, setHeight, setRunning,
    info, success, error, warn, cmd, output,
  }
}
