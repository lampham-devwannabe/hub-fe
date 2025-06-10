import { User } from '../../store/slices/authSlice'
import api from '../../utils/api'

export const profileApi = async (): Promise<User> => {
  const response = await api.get('/account/profile')
  return response.data.result
}
