import { create } from 'zustand'

export const useTerminalStore = create((set, get) => ({
  lines: [],
  isOpen: true,
  height: 220,
  isRunning: false,

  addLine: (line) => {
    const { lines } = get()
    set({ lines: [...lines, { ...line, id: Date.now() + Math.random() }] })
  },

  clear: () => set({ lines: [] }),
  setOpen: (v) => set({ isOpen: v }),
  setHeight: (h) => set({ height: Math.max(100, Math.min(600, h)) }),
  setRunning: (v) => set({ isRunning: v }),
}))
