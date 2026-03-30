import { useEditorStore } from '@/store/editorStore'
import { useAuthStore } from '@/store/authStore'
import { useTerminalStore } from '@/store/terminalStore'
import { testCode } from '@/api/compile'
import { notify } from '@/components/ui/Toast'

export function useTest() {
  const { code } = useEditorStore()
  const { token } = useAuthStore()
  const { addLine, setRunning, clear } = useTerminalStore()

  const run = async (testName = null) => {
    clear()
    setRunning(true)
    const cmd = testName ? `cargo test ${testName}` : 'cargo test'
    addLine({ type: 'cmd', text: cmd })
    try {
      await testCode(code, token, (line) => addLine({ type: 'output', text: line }))
      addLine({ type: 'success', text: 'All tests passed' })
      notify.success('Tests passed')
    } catch (e) {
      addLine({ type: 'error', text: e.message })
      notify.error('Tests failed')
    } finally {
      setRunning(false)
    }
  }

  return { run }
}
