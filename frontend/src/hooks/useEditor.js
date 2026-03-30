import { useEffect, useCallback } from 'react'
import { useEditorStore } from '@/store/editorStore'

export function useEditor() {
  const store = useEditorStore()

  // Keyboard shortcut: Ctrl+S / Cmd+S
  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      store.saveFile()
    }
  }, [store])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return store
}
