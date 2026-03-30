import { Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function DownloadButton({ onClick, loading, filename = 'artifacts.zip' }) {
  return (
    <Button
      variant="outline"
      size="sm"
      icon={Download}
      loading={loading}
      onClick={onClick}
    >
      Download {filename}
    </Button>
  )
}
