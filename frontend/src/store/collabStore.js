import { create } from 'zustand'

export const useCollabStore = create((set, get) => ({
  peers: [],
  roomId: null,
  connected: false,

  setPeers: (peers) => set({ peers }),
  setRoomId: (roomId) => set({ roomId }),
  setConnected: (connected) => set({ connected }),
  addPeer: (peer) => set({ peers: [...get().peers, peer] }),
  removePeer: (id) => set({ peers: get().peers.filter((p) => p.id !== id) }),
}))
