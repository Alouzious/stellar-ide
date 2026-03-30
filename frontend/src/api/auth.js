import client from './client'

// Use same-origin by default so nginx can proxy /api/* to backend.
// Set VITE_API_URL only for non-nginx dev (e.g. VITE_API_URL=http://localhost:8080).
const API_ORIGIN = import.meta.env.VITE_API_URL || ''

export const githubLogin = () => {
  window.location.href = `${API_ORIGIN}/api/v1/auth/github`
}

export const logout = () => client.post('/auth/logout')

export const refreshToken = () => client.post('/auth/refresh')

export const getMe = () => client.get('/auth/me')
