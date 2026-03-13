import client from './client'

export const generateArtifacts = (deploymentId) => client.post(`/artifacts/${deploymentId}/generate`)
export const downloadArtifacts = (artifactId) =>
  client.get(`/artifacts/${artifactId}/download`, { responseType: 'blob' })
