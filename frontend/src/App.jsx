import { Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { IDEPage } from './pages/IDEPage'
import { DashboardPage } from './pages/DashboardPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { AuthGuard } from './components/auth/AuthGuard'
import { ToastContainer } from './components/ui/Toast'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
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
