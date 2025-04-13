import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store'
import { checkAuth, login, logout } from '../store/slices/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth)
  // Restore session from cookie on mount
  const signIn = (credentials: { email: string; password: string }) => {
    dispatch(login(credentials)) // Dispatch the thunk
  }

  const signOut = () => {
    dispatch(logout())
  }

  const checkSession = () => {
    // Check if the user is already authenticated
    dispatch(checkAuth())
  }

  return { user, isAuthenticated, loading, error, signIn, signOut, checkSession }
}
