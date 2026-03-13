import { FolderOpen, Trash2, ExternalLink, Clock } from 'lucide-react'
import { clsx } from 'clsx'
import { Badge } from '@/components/ui/Badge'
import { formatRelativeDate } from '@/lib/utils'

export function ProjectCard({ project, onOpen, onDelete }) {
  return (
    <div className="group relative bg-bg-secondary border border-bg-border rounded-lg p-4 hover:border-accent-blue/50 transition-colors duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text-primary truncate">{project.name}</h3>
          {project.description && (
            <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{project.description}</p>
          )}
        </div>
        <Badge color="purple" className="ml-2 flex-shrink-0">{project.language || 'Rust'}</Badge>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-text-muted">
          <Clock size={11} />
          <span>{formatRelativeDate(project.updatedAt)}</span>
        </div>
        {project.lastDeployStatus && (
          <Badge color={project.lastDeployStatus === 'success' ? 'green' : 'red'}>
            {project.lastDeployStatus}
          </Badge>
        )}
      </div>

      {/* Hover actions */}
      <div className="absolute inset-0 bg-bg-primary/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
        <button
          onClick={() => onOpen?.(project)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-blue text-white rounded text-xs font-medium hover:bg-blue-500 transition-colors"
        >
          <FolderOpen size={12} />
          Open IDE
        </button>
        <button
          onClick={() => onDelete?.(project.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-red/20 text-accent-red border border-accent-red/30 rounded text-xs font-medium hover:bg-accent-red/30 transition-colors"
        >
          <Trash2 size={12} />
          Delete
        </button>
      </div>
    </div>
  )
}
