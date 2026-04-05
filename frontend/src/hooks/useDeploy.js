import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useEditorStore } from '@/store/editorStore'
import { useWalletStore } from '@/store/walletStore'
import { useTerminalStore } from '@/store/terminalStore'
import { deployContract, confirmDeploy } from '@/api/deploy'
import { uploadAndDeployWasm } from '@/lib/stellar'
import { signTransaction } from '@/lib/walletkit'
import { notify } from '@/components/ui/Toast'

export function useDeploy() {
  const { token } = useAuthStore()
  const { code } = useEditorStore()
  const { address, network } = useWalletStore()
  const { addLine, clear } = useTerminalStore()
  const [deploying, setDeploying] = useState(false)
  const [result, setResult] = useState(null)

  const deploy = async (params) => {
    if (!address) {
      notify.error('Please connect your wallet first')
      return
    }

    setDeploying(true)
    clear()
    const net = params.network || network || 'TESTNET'
    addLine({ type: 'cmd', text: `stellar contract deploy --network ${net.toLowerCase()}` })

    try {
      // Step 1 — Build WASM (backend)
      addLine({ type: 'info', text: 'Building WASM...' })
      const projectId = window.location.pathname.split('/ide/')[1]
      const { data } = await deployContract({
        ...params,
        source_code: code,
        project_id: projectId,
        source_account: address,
        network: net,
        token,
      })

      addLine({ type: 'info', text: 'WASM built successfully' })

      // Step 2 — Upload + deploy on Stellar (frontend signs with Freighter)
      addLine({ type: 'info', text: 'Uploading WASM to Stellar...' })
      const { contractId, txHash } = await uploadAndDeployWasm(
        data.wasm_hash,
        address,
        net,
        async (xdr) => {
          addLine({ type: 'info', text: 'Waiting for Freighter signature...' })
          return await signTransaction(xdr, net)
        }
      )

      // Step 3 — Confirm with backend
      await confirmDeploy({
        deployment_id: data.deployment_id,
        contract_id: contractId || '',
        tx_hash: txHash,
        network: net,
        token,
      })

      setResult({ contractId, txHash, network: net })
      addLine({ type: 'success', text: `Contract deployed: ${contractId}` })
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
