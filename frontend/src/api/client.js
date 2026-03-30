import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

// In docker-compose mode the app is typically served behind nginx (same origin).
// Defaulting to same-origin avoids hard-coding localhost:8080 which breaks when
// the browser is accessing nginx on :80.
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : '/api/v1'

const client = axios.create({
  baseURL,
  timeout: 30000,
})

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth()
    }
    return Promise.reject(error)
  }
)

export default client
