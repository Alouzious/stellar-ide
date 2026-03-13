import { useRef, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { useEditorStore } from '@/store/editorStore'
import { STELLAR_DARK_THEME, EDITOR_OPTIONS } from '@/lib/monaco-config'
import { getFileLanguage } from '@/lib/utils'
import '@/styles/monaco-theme.css'

export function MonacoEditor({ onChange }) {
  const { code, activeFile, setCode } = useEditorStore()
  const editorRef = useRef(null)

  const handleBeforeMount = useCallback((monaco) => {
    monaco.editor.defineTheme('stellar-dark', STELLAR_DARK_THEME)
  }, [])

  const handleMount = useCallback((editor) => {
    editorRef.current = editor
    editor.focus()
  }, [])

  const handleChange = useCallback((value) => {
    setCode(value || '')
    onChange?.(value || '')
  }, [setCode, onChange])

  const language = getFileLanguage(activeFile)

  return (
    <div className="flex-1 overflow-hidden">
      <Editor
        value={code}
        language={language}
        theme="stellar-dark"
        beforeMount={handleBeforeMount}
        onMount={handleMount}
        onChange={handleChange}
        options={EDITOR_OPTIONS}
        loading={
          <div className="flex items-center justify-center h-full bg-bg-primary">
            <div className="w-6 h-6 border-2 border-bg-border border-t-accent-blue rounded-full animate-spin" />
          </div>
        }
      />
    </div>
  )
}
