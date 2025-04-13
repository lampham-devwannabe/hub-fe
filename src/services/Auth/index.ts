import api from '../../utils/api'

export const loginApi = async (credentials: { email: string; password: string }): Promise<void> => {
  const response = await api.post('/login', credentials)
  return response.data
}

export const logoutApi = async (): Promise<void> => {
  const response = await api.post('/logout')
  return response.data
}

export const checkAuthApi = async (): Promise<void> => {
  const response = await api.get('/check')
  return response.data
}
