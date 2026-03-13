import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export function AuthGuard({ children }) {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}
