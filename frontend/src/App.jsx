import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { LandingPage } from './pages/LandingPage'
import { IDEPage } from './pages/IDEPage'
import { DashboardPage } from './pages/DashboardPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { AuthGuard } from './components/auth/AuthGuard'
import { ToastContainer } from './components/ui/Toast'
import { useAuthStore } from './store/authStore'

function AuthCallback() {
  const [searchParams] = useSearchParams()
  const { setAuth } = useAuthStore()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      setAuth(null, token)
      window.location.href = '/dashboard'
    }
  }, [])

  return <div style={{color:'white',padding:'2rem'}}>Signing you in...</div>
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={
          <AuthGuard>
            <DashboardPage />
          </AuthGuard>
        } />
        <Route path="/ide" element={<IDEPage />} />
        <Route path="/ide/:id" element={<IDEPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer />
    </>
  )
}
