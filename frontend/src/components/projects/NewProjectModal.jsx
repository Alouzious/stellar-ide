import { useState } from 'react'
import { FolderPlus } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

const TEMPLATES = ['Hello World', 'Token', 'Storage', 'Escrow', 'NFT', 'Voting', 'DAO']

export function NewProjectModal({ open, onClose, onCreate }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [template, setTemplate] = useState('Hello World')
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) return
    setLoading(true)
    try {
      await onCreate?.({ name: name.trim(), description: description.trim(), template })
      setName('')
      setDescription('')
      setTemplate('Hello World')
      onClose?.()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Project"
      description="Create a new Soroban smart contract project"
      size="sm"
    >
      <div className="space-y-4">
        <div>
          <label className="text-xs text-text-muted block mb-1.5">Project Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="my-contract"
            autoFocus
            className="w-full bg-bg-tertiary border border-bg-border rounded px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue"
          />
        </div>
        <div>
          <label className="text-xs text-text-muted block mb-1.5">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this contract do?"
            rows={2}
            className="w-full bg-bg-tertiary border border-bg-border rounded px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue resize-none"
          />
        </div>
        <div>
          <label className="text-xs text-text-muted block mb-1.5">Template</label>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full bg-bg-tertiary border border-bg-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-blue"
          >
            {TEMPLATES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <Button
          variant="primary"
          icon={FolderPlus}
          loading={loading}
          onClick={handleCreate}
          disabled={!name.trim()}
          className="w-full justify-center"
        >
          Create Project
        </Button>
      </div>
    </Modal>
  )
}
