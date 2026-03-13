import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { getMe } from '@/api/auth'
import { notify } from '@/components/ui/Toast'

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    // Handle OAuth callback: ?token=xxx
    const callbackToken = searchParams.get('token')
    if (callbackToken) {
      fetchMe(callbackToken)
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    } else if (token && !user) {
      fetchMe(token)
    }
  }, [])

  const fetchMe = async (authToken) => {
    try {
      const { data } = await getMe()
      setAuth(data, authToken)
    } catch {
      clearAuth()
    }
  }

  const logout = async () => {
    clearAuth()
    navigate('/')
    notify.success('Signed out successfully')
  }

  return { user, token, isAuthenticated, logout }
}
