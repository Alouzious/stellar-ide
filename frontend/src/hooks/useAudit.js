import { useEditorStore } from '@/store/editorStore'
import { useAuthStore } from '@/store/authStore'
import { useTerminalStore } from '@/store/terminalStore'
import { auditCode } from '@/api/compile'
import { notify } from '@/components/ui/Toast'

export function useAudit() {
  const { code } = useEditorStore()
  const { token } = useAuthStore()
  const { addLine, setRunning, clear } = useTerminalStore()

  const run = async () => {
    clear()
    setRunning(true)
    addLine({ type: 'cmd', text: 'scout-soroban audit --output json' })
    try {
      await auditCode(code, token, (line) => addLine({ type: 'output', text: line }))
      addLine({ type: 'success', text: 'Audit complete' })
      notify.success('Audit complete')
    } catch (e) {
      addLine({ type: 'error', text: e.message })
      notify.error('Audit failed')
    } finally {
      setRunning(false)
    }
  }

  return { run }
}
