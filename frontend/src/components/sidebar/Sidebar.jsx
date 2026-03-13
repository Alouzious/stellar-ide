import { useState } from 'react'
import {
  FilePlus, TestTube2, Hammer, Rocket, Search, Shield,
  Package, Users, Settings, User
} from 'lucide-react'
import { clsx } from 'clsx'
import { SidebarIcon } from './SidebarIcon'
import { SidebarPanel } from './SidebarPanel'
import { CreatePanel } from '@/components/panels/CreatePanel'
import { TestPanel } from '@/components/panels/TestPanel'
import { BuildPanel } from '@/components/panels/BuildPanel'
import { DeployPanel } from '@/components/panels/DeployPanel'
import { ExplorePanel } from '@/components/panels/ExplorePanel'
import { AuditPanel } from '@/components/panels/AuditPanel'
import { ArtifactsPanel } from '@/components/panels/ArtifactsPanel'
import { CollabPanel } from '@/components/panels/CollabPanel'
import { SettingsPanel } from '@/components/panels/SettingsPanel'

const TOP_ICONS = [
  { id: 'create', icon: FilePlus, label: 'Create', panel: CreatePanel },
  { id: 'test', icon: TestTube2, label: 'Test', panel: TestPanel },
  { id: 'build', icon: Hammer, label: 'Build', panel: BuildPanel },
  { id: 'deploy', icon: Rocket, label: 'Deploy', panel: DeployPanel },
  { id: 'explore', icon: Search, label: 'Explore', panel: ExplorePanel },
  { id: 'audit', icon: Shield, label: 'Audit', panel: AuditPanel },
  { id: 'artifacts', icon: Package, label: 'Artifacts', panel: ArtifactsPanel },
  { id: 'collab', icon: Users, label: 'Collaborate', panel: CollabPanel },
]

const BOTTOM_ICONS = [
  { id: 'settings', icon: Settings, label: 'Settings', panel: SettingsPanel },
]

export function Sidebar() {
  const [activePanel, setActivePanel] = useState(null)

  const togglePanel = (id) => {
    setActivePanel((prev) => (prev === id ? null : id))
  }

  const allIcons = [...TOP_ICONS, ...BOTTOM_ICONS]
  const ActivePanel = allIcons.find((i) => i.id === activePanel)?.panel

  return (
    <div className="flex h-full flex-shrink-0">
      {/* Icon bar */}
      <div className="w-12 flex flex-col items-center bg-bg-secondary border-r border-bg-border py-2 flex-shrink-0">
        <div className="flex flex-col items-center gap-1 flex-1">
          {TOP_ICONS.map(({ id, icon, label }) => (
            <SidebarIcon
              key={id}
              icon={icon}
              label={label}
              active={activePanel === id}
              onClick={() => togglePanel(id)}
            />
          ))}
        </div>
        <div className="flex flex-col items-center gap-1">
          {BOTTOM_ICONS.map(({ id, icon, label }) => (
            <SidebarIcon
              key={id}
              icon={icon}
              label={label}
              active={activePanel === id}
              onClick={() => togglePanel(id)}
            />
          ))}
          <SidebarIcon
            icon={User}
            label="Profile"
            active={false}
            onClick={() => {}}
          />
        </div>
      </div>

      {/* Panel */}
      {ActivePanel && (
        <SidebarPanel
          title={allIcons.find((i) => i.id === activePanel)?.label}
          onClose={() => setActivePanel(null)}
        >
          <ActivePanel />
        </SidebarPanel>
      )}
    </div>
  )
}
