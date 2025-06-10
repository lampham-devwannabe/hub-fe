import api from '../../utils/api'

export interface AddAccountRequest {
  username: string // Email format
  password: string // Min 6 characters
  name?: string
  dob?: string // LocalDate as ISO string (YYYY-MM-DD)
  city?: string
  school?: string
  role: 'STUDENT' | 'TEACHER'
}

export const loginApi = async (credentials: { username: string; password: string }): Promise<void> => {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

export const logoutApi = async (): Promise<void> => {
  const response = await api.get('auth/logout')
  return response.data
}

export const refreshAuthApi = async (): Promise<AuthenticationResponse> => {
  const response = await api.get('/auth/refresh')
  return response.data
}

export const registerApi = async (request: AddAccountRequest): Promise<void> => {
  const response = await api.post('/auth/register', request)
  return response.data
}

export interface AuthenticationResponse {
  token: string
  authenticated: boolean
}

export const outboundAuthenticateApi = async (code: string, role: string): Promise<AuthenticationResponse> => {
  const response = await api.post('/auth/outbound/authentication', null, {
    params: {
      code,
      role
    }
  })
  return response.data.result
}
