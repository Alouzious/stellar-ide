import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Rocket, LogOut } from 'lucide-react'

import { Sidebar } from '@/components/sidebar/Sidebar'
import { MonacoEditor } from '@/components/editor/MonacoEditor'
import { EditorTabs } from '@/components/editor/EditorTabs'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { Terminal } from '@/components/terminal/Terminal'
import { WalletConnect } from '@/components/wallet/WalletConnect'
import { useAuthStore } from '@/store/authStore'
import { useProjectStore } from '@/store/projectStore'
import { useAuth } from '@/hooks/useAuth'

export function IDEPage() {
  useParams()
  const { user } = useAuthStore()
  const { currentProject } = useProjectStore()
  const { logout } = useAuth()

  useEffect(() => {
    document.title = currentProject?.name ? `${currentProject.name} — StellarIDE` : 'StellarIDE'
  }, [currentProject])

  return (
    <div className="flex flex-col h-full w-full bg-bg-primary overflow-hidden">
      {/* Topbar */}
      <header className="flex items-center justify-between bg-bg-secondary border-b border-bg-border px-4 py-2 flex-shrink-0 h-11">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Rocket size={16} className="text-accent-blue" />
            <span className="text-sm font-bold text-text-primary">StellarIDE</span>
          </div>
          {currentProject && (
            <>
              <span className="text-text-muted text-sm">/</span>
              <span className="text-sm text-text-secondary">{currentProject.name}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <WalletConnect />
          {user && (
            <button
              onClick={logout}
              className="text-text-muted hover:text-text-primary transition-colors"
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Editor area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Tabs */}
          <EditorTabs />
          {/* Toolbar */}
          <EditorToolbar />
          {/* Editor + Terminal */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-hidden relative">
              <MonacoEditor />
            </div>
            <Terminal />
          </div>
        </div>
      </div>
    </div>
  )
}
