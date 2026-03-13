import client from './client'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const githubLogin = () => {
  window.location.href = `${API_URL}/api/v1/auth/github`
}

export const logout = () => client.post('/auth/logout')

export const refreshToken = () => client.post('/auth/refresh')

export const getMe = () => client.get('/auth/me')
