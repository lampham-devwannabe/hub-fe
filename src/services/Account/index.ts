import { User } from '../../store/slices/authSlice'
import api from '../../utils/api'

export const profileApi = async (): Promise<User> => {
  const response = await api.get('/profile')
  return response.data
}
