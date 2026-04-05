import client from './client'

export const deployContract = (data) => client.post('/deploy', data)
export const confirmDeploy = (data) => client.post('/deploy/confirm', data)
export const getDeployHistory = () => client.get('/deploy/history')
export const getContractInterface = (contractId) => client.get(`/contracts/${contractId}/interface`)
