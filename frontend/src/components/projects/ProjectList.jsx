import { FolderPlus } from 'lucide-react'
import { ProjectCard } from './ProjectCard'
import { Button } from '@/components/ui/Button'

export function ProjectList({ projects = [], onOpen, onDelete, onNew }) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-bg-secondary border border-bg-border flex items-center justify-center mb-4">
          <FolderPlus size={28} className="text-text-muted" />
        </div>
        <h3 className="text-base font-semibold text-text-primary mb-2">No projects yet</h3>
        <p className="text-sm text-text-muted mb-6 max-w-xs">
          Create your first Soroban smart contract project to get started
        </p>
        <Button variant="primary" size="sm" icon={FolderPlus} onClick={onNew}>
          Create First Project
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onOpen={onOpen}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
