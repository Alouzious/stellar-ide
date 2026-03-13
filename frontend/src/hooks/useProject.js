import { useEffect } from 'react'
import { useProjectStore } from '@/store/projectStore'
import { getProjects, createProject, updateProject, deleteProject } from '@/api/projects'
import { notify } from '@/components/ui/Toast'

export function useProject() {
  const { projects, setProjects, addProject, updateProject: update, removeProject, currentProject, setCurrentProject } = useProjectStore()

  const fetchProjects = async () => {
    try {
      const { data } = await getProjects()
      setProjects(data)
    } catch {
      notify.error('Failed to load projects')
    }
  }

  const create = async (data) => {
    try {
      const { data: project } = await createProject(data)
      addProject(project)
      notify.success('Project created')
      return project
    } catch (e) {
      notify.error(e.message || 'Failed to create project')
      throw e
    }
  }

  const save = async (id, data) => {
    try {
      const { data: project } = await updateProject(id, data)
      update(project)
      notify.success('Project saved')
    } catch {
      notify.error('Failed to save project')
    }
  }

  const remove = async (id) => {
    try {
      await deleteProject(id)
      removeProject(id)
      notify.success('Project deleted')
    } catch {
      notify.error('Failed to delete project')
    }
  }

  return { projects, currentProject, setCurrentProject, fetchProjects, create, save, remove }
}
