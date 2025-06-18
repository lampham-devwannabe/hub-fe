import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store'
import { fetchGeneralDashboard, fetchAllUsers, clearError, resetAccountState } from '../store/slices/accountSlice'
import { GetAllUsersParams } from '../services/Account'

export const useAccount = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { generalInfo, users, loading, error } = useSelector((state: RootState) => state.account)

  const getGeneralDashboard = () => {
    dispatch(fetchGeneralDashboard())
  }

  const getAllUsers = (params: GetAllUsersParams) => {
    dispatch(fetchAllUsers(params))
  }

  const clearAccountError = () => {
    dispatch(clearError())
  }

  const resetAccount = () => {
    dispatch(resetAccountState())
  }

  return {
    // State
    generalInfo,
    users,
    loading,
    error,
    // Actions
    getGeneralDashboard,
    getAllUsers,
    clearAccountError,
    resetAccount
  }
}
