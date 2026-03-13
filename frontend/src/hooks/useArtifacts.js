import { useState } from 'react'
import { generateArtifacts, downloadArtifacts } from '@/api/artifacts'
import { notify } from '@/components/ui/Toast'

export function useArtifacts() {
  const [loading, setLoading] = useState(false)
  const [artifacts, setArtifacts] = useState(null)

  const generate = async (deploymentId) => {
    setLoading(true)
    try {
      const { data } = await generateArtifacts(deploymentId)
      setArtifacts(data)
      notify.success('Artifacts generated')
      return data
    } catch (e) {
      notify.error(e.message || 'Failed to generate artifacts')
      throw e
    } finally {
      setLoading(false)
    }
  }

  const download = async (artifactId, filename = 'artifacts.zip') => {
    try {
      const { data } = await downloadArtifacts(artifactId)
      const url = URL.createObjectURL(new Blob([data]))
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      notify.success('Download started')
    } catch (e) {
      notify.error(e.message || 'Failed to download artifacts')
    }
  }

  return { artifacts, loading, generate, download }
}
