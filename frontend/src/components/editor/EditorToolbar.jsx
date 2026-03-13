import { Play, Hammer, TestTube, Shield, Save, Share2 } from 'lucide-react'
import { clsx } from 'clsx'
import { useEditorStore } from '@/store/editorStore'
import { useTerminalStore } from '@/store/terminalStore'
import { useCompile } from '@/hooks/useCompile'
import { useBuild } from '@/hooks/useBuild'
import { useTest } from '@/hooks/useTest'
import { useAudit } from '@/hooks/useAudit'
import { Tooltip } from '@/components/ui/Tooltip'
import { Spinner } from '@/components/ui/Spinner'

function ToolbarButton({ icon: Icon, label, onClick, active, shortcut }) {
  const { isRunning } = useTerminalStore()
  return (
    <Tooltip content={shortcut ? `${label} (${shortcut})` : label} side="bottom">
      <button
        onClick={onClick}
        disabled={isRunning}
        className={clsx(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs transition-colors duration-150',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          active
            ? 'bg-accent-blue/20 text-accent-blue'
            : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
        )}
      >
        <Icon size={13} />
        <span className="hidden sm:inline">{label}</span>
      </button>
    </Tooltip>
  )
}

export function EditorToolbar() {
  const { activeFile, isDirty, saveFile } = useEditorStore()
  const { isRunning } = useTerminalStore()
  const { run: compile } = useCompile()
  const { run: build } = useBuild()
  const { run: test } = useTest()
  const { run: audit } = useAudit()

  return (
    <div className="flex items-center justify-between px-3 py-1 bg-bg-secondary border-b border-bg-border flex-shrink-0 h-10">
      <div className="flex items-center gap-1 text-xs text-text-muted">
        <span className="text-accent-blue">{activeFile}</span>
        {isDirty && <span className="text-accent-yellow">●</span>}
      </div>
      <div className="flex items-center gap-0.5">
        {isRunning && <Spinner size="sm" className="mr-2" />}
        <ToolbarButton icon={Play} label="Compile" onClick={compile} shortcut="F5" />
        <ToolbarButton icon={Hammer} label="Build" onClick={build} shortcut="F6" />
        <ToolbarButton icon={TestTube} label="Test" onClick={test} shortcut="F7" />
        <ToolbarButton icon={Shield} label="Audit" onClick={audit} />
        <div className="w-px h-4 bg-bg-border mx-1" />
        <ToolbarButton icon={Save} label="Save" onClick={saveFile} shortcut="Ctrl+S" />
        <ToolbarButton icon={Share2} label="Share" onClick={() => {}} />
      </div>
    </div>
  )
}
