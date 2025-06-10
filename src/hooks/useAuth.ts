import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store'
import { refreshAuth, login, logout } from '../store/slices/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth)

  const signIn = (credentials: { email: string; password: string }) => {
    // Convert email to username for the login API
    dispatch(login({ username: credentials.email, password: credentials.password }))
  }

  const signOut = () => {
    dispatch(logout())
  }

  const refreshSession = () => {
    // Refresh authentication state when cookie is about to expire
    dispatch(refreshAuth())
  }

  return { user, isAuthenticated, loading, error, signIn, signOut, refreshSession }
}
