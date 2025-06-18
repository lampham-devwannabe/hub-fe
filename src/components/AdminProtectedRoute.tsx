import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ReactNode } from 'react'

interface AdminProtectedRouteProps {
  children: ReactNode
}

export const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to='/admin/login' replace />
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to='/admin/unauthorized' replace />
  }

  return <>{children}</>
}
