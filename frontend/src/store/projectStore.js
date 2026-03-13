import { create } from 'zustand'

export const useProjectStore = create((set, get) => ({
  currentProject: null,
  projects: [],

  setCurrentProject: (p) => set({ currentProject: p }),
  setProjects: (ps) => set({ projects: ps }),
  addProject: (p) => set({ projects: [...get().projects, p] }),
  updateProject: (p) => set({
    projects: get().projects.map((proj) => proj.id === p.id ? p : proj),
    currentProject: get().currentProject?.id === p.id ? p : get().currentProject,
  }),
  removeProject: (id) => set({
    projects: get().projects.filter((p) => p.id !== id),
    currentProject: get().currentProject?.id === id ? null : get().currentProject,
  }),
}))
