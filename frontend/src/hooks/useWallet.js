import { useState } from 'react'
import { useWalletStore } from '@/store/walletStore'
import { connectWallet } from '@/lib/walletkit'
import { getBalance } from '@/lib/stellar'
import { notify } from '@/components/ui/Toast'

export function useWallet() {
  const { address, balance, network, connected, connecting, setWallet, setConnecting, disconnect } = useWalletStore()
  const [showSelector, setShowSelector] = useState(false)

  const connect = async (walletId) => {
    setConnecting(true)
    try {
      const addr = await connectWallet(walletId, network)
      const bal = await getBalance(addr, network)
      setWallet(addr, bal)
      notify.success('Wallet connected')
      setShowSelector(false)
    } catch (e) {
      notify.error(e.message || 'Failed to connect wallet')
      setConnecting(false)
    }
  }

  const disconnectWallet = () => {
    disconnect()
    notify.info('Wallet disconnected')
  }

  const refreshBalance = async () => {
    if (!address) return
    const bal = await getBalance(address, network)
    setWallet(address, bal)
  }

  return {
    address,
    balance,
    network,
    connected,
    connecting,
    connect,
    disconnect: disconnectWallet,
    refreshBalance,
    showSelector,
    setShowSelector,
  }
}
