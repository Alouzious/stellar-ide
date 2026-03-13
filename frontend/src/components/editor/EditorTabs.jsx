import { X, FileCode, FileText, Settings, FilePlus } from 'lucide-react'
import { clsx } from 'clsx'
import { useEditorStore } from '@/store/editorStore'

function getFileIcon(filename) {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext === 'rs') return FileCode
  if (ext === 'toml' || ext === 'json') return Settings
  if (ext === 'md') return FileText
  return FileText
}

export function EditorTabs() {
  const { files, activeFile, isDirty, setActiveFile, removeFile, addFile } = useEditorStore()
  const fileList = Object.keys(files)

  const handleNewFile = () => {
    const name = prompt('File name (e.g. utils.rs):')
    if (name && !files[name]) {
      addFile(name, '')
      setActiveFile(name)
    }
  }

  const handleClose = (e, filename) => {
    e.stopPropagation()
    if (fileList.length <= 1) return
    removeFile(filename)
  }

  return (
    <div className="flex items-stretch bg-bg-secondary border-b border-bg-border overflow-x-auto flex-shrink-0 min-h-[36px]">
      {fileList.map((filename) => {
        const isActive = filename === activeFile
        const Icon = getFileIcon(filename)
        return (
          <button
            key={filename}
            onClick={() => setActiveFile(filename)}
            className={clsx(
              'group flex items-center gap-1.5 px-4 py-0 text-xs border-r border-bg-border whitespace-nowrap transition-colors duration-100 relative min-w-[80px] max-w-[180px] h-full',
              isActive
                ? 'bg-bg-primary text-text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-accent-blue'
                : 'bg-bg-secondary text-text-muted hover:bg-bg-tertiary hover:text-text-secondary'
            )}
          >
            <Icon size={12} className="flex-shrink-0" />
            <span className="truncate">{filename}</span>
            {isActive && isDirty && (
              <span className="w-1.5 h-1.5 rounded-full bg-accent-blue flex-shrink-0" />
            )}
            {fileList.length > 1 && (
              <span
                onClick={(e) => handleClose(e, filename)}
                className="opacity-0 group-hover:opacity-100 ml-auto flex-shrink-0 hover:text-text-primary cursor-pointer"
              >
                <X size={10} />
              </span>
            )}
          </button>
        )
      })}
      <button
        onClick={handleNewFile}
        className="px-3 text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors flex items-center"
        title="New file"
      >
        <FilePlus size={12} />
      </button>
    </div>
  )
}
