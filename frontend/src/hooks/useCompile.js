import { useEditorStore } from '@/store/editorStore'
import { useAuthStore } from '@/store/authStore'
import { useTerminalStore } from '@/store/terminalStore'
import { compileCode } from '@/api/compile'
import { notify } from '@/components/ui/Toast'

export function useCompile() {
  const { code } = useEditorStore()
  const { token } = useAuthStore()
  const { addLine, setRunning, clear } = useTerminalStore()

  const run = async () => {
    clear()
    setRunning(true)
    addLine({ type: 'cmd', text: 'cargo build --target wasm32-unknown-unknown --release' })
    try {
      await compileCode(code, token, (line) => addLine({ type: 'output', text: line }))
      addLine({ type: 'success', text: 'Compilation successful' })
      notify.success('Compilation successful')
    } catch (e) {
      addLine({ type: 'error', text: e.message })
      notify.error('Compilation failed')
    } finally {
      setRunning(false)
    }
  }

  return { run }
}
