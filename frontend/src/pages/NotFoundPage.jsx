import { useNavigate } from 'react-router-dom'
import { FileQuestion, Code2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center text-center px-4">
      <FileQuestion size={64} className="text-text-muted mb-4" />
      <h1 className="text-4xl font-bold text-text-primary mb-2">404</h1>
      <p className="text-text-secondary mb-8">Page not found</p>
      <Button variant="primary" icon={Code2} onClick={() => navigate('/ide')}>
        Open IDE
      </Button>
    </div>
  )
}
