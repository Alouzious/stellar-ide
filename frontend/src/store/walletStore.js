import { create } from 'zustand'

export const useWalletStore = create((set) => ({
  address: null,
  balance: null,
  network: 'TESTNET',
  connected: false,
  connecting: false,

  setWallet: (address, balance) => set({ address, balance, connected: true, connecting: false }),
  setConnecting: (v) => set({ connecting: v }),
  setNetwork: (network) => set({ network }),
  disconnect: () => set({ address: null, balance: null, connected: false, connecting: false }),
}))
