import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ReactNode } from 'react'

interface ProtectedRouteProps {
  teacherView: ReactNode
  studentView: ReactNode
}

export const ProtectedRoute = ({ teacherView, studentView }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  if (user?.role === 'Teacher') {
    return <>{teacherView}</>
  }

  if (user?.role === 'Student') {
    return <>{studentView}</>
  }

  return <Navigate to='/unauthorized' replace />
}
