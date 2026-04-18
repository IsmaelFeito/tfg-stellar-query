import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LoginPage       from './pages/LoginPage'
import RegisterPage    from './pages/RegisterPage'
import HubPage         from './pages/HubPage'
import GamePage        from './pages/GamePage'
import DocsPage        from './pages/DocsPage'
import GuideDetailPage from './pages/GuideDetailPage'
import NotFoundPage    from './pages/NotFoundPage'

// Guard: redirige a login si no hay sesión
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore(s => s.token)
  return token ? <>{children}</> : <Navigate to="/" replace />
}

// Guard: redirige al hub si ya hay sesión
function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore(s => s.token)
  return token ? <Navigate to="/hub" replace /> : <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        <Route path="/hub"  element={<PrivateRoute><HubPage /></PrivateRoute>} />
        <Route path="/game" element={<PrivateRoute><GamePage /></PrivateRoute>} />
        <Route path="/docs" element={<PrivateRoute><DocsPage /></PrivateRoute>} />
        <Route path="/docs/:slug" element={<PrivateRoute><GuideDetailPage /></PrivateRoute>} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}