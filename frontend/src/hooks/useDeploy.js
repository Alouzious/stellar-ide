import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useTerminalStore } from '@/store/terminalStore'
import { deployContract } from '@/api/deploy'
import { notify } from '@/components/ui/Toast'

export function useDeploy() {
  const { token } = useAuthStore()
  const { addLine, clear } = useTerminalStore()
  const [deploying, setDeploying] = useState(false)
  const [result, setResult] = useState(null)

  const deploy = async (params) => {
    setDeploying(true)
    clear()
    addLine({ type: 'cmd', text: `stellar contract deploy --network ${params.network?.toLowerCase() || 'testnet'}` })
    try {
      const { data } = await deployContract({ ...params, token })
      setResult(data)
      addLine({ type: 'success', text: `Contract deployed: ${data.contractId}` })
      notify.success('Contract deployed successfully')
    } catch (e) {
      addLine({ type: 'error', text: e.message })
      notify.error('Deployment failed')
    } finally {
      setDeploying(false)
    }
  }

  return { deploy, deploying, result }
}
