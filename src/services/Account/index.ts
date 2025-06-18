import { User } from '../../store/slices/authSlice'
import { GeneralUserResponse, Page, User as AccountUser } from '../../store/slices/accountSlice'
import api from '../../utils/api'

export const profileApi = async (): Promise<User> => {
  const response = await api.get('/account/profile')
  return response.data.result
}

export interface GetAllUsersParams {
  page?: number
  size?: number
  role?: string
  search?: string
}

export const getGeneralDashboardApi = async (): Promise<GeneralUserResponse> => {
  const response = await api.get('/account/dashboard/general')
  return response.data.result
}

export const getAllUsersApi = async (params: GetAllUsersParams): Promise<Page<AccountUser>> => {
  const { page = 1, size = 15, role, search } = params

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString()
  })

  if (role) {
    queryParams.append('role', role)
  }

  if (search) {
    queryParams.append('search', search)
  }

  const response = await api.get(`/account/page?${queryParams.toString()}`)
  return response.data.result
}
