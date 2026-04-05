import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useEditorStore } from '@/store/editorStore'
import { useTerminalStore } from '@/store/terminalStore'
import { deployContract } from '@/api/deploy'
import { notify } from '@/components/ui/Toast'
import { useWalletStore } from '@/store/walletStore'

export function useDeploy() {
  const { token } = useAuthStore()
  const { address } = useWalletStore()
  const { code } = useEditorStore()
  const { addLine, clear } = useTerminalStore()
  const [deploying, setDeploying] = useState(false)
  const [result, setResult] = useState(null)

  const deploy = async (params) => {
    setDeploying(true)
    clear()
    addLine({ type: 'cmd', text: `stellar contract deploy --network ${params.network?.toLowerCase() || 'testnet'}` })
    try {
      const projectId = window.location.pathname.split('/ide/')[1]
      const { data } = await deployContract({
        ...params,
        source_code: code,
        project_id: projectId,
        source_account: address,
        token,
      })
      setResult(data)
      addLine({ type: 'success', text: `Contract deployed: ${data.contract_id}` })
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
