import { useEditorStore } from '@/store/editorStore'
import { useAuthStore } from '@/store/authStore'
import { useTerminalStore } from '@/store/terminalStore'
import { buildCode } from '@/api/compile'
import { notify } from '@/components/ui/Toast'

export function useBuild() {
  const { code } = useEditorStore()
  const { token } = useAuthStore()
  const { addLine, setRunning, clear } = useTerminalStore()

  const run = async () => {
    clear()
    setRunning(true)
    addLine({ type: 'cmd', text: 'cargo build --target wasm32-unknown-unknown --release' })
    try {
      await buildCode(code, token, (line) => addLine({ type: 'output', text: line }))
      addLine({ type: 'success', text: 'Build successful — WASM artifact generated' })
      notify.success('Build successful')
    } catch (e) {
      addLine({ type: 'error', text: e.message })
      notify.error('Build failed')
    } finally {
      setRunning(false)
    }
  }

  return { run }
}
