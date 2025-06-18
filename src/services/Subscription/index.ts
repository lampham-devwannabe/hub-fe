import api, { ApiResponse } from '../../utils/api'
import { Page } from '../../store/slices/accountSlice'

// TypeScript interfaces based on Java classes
export interface WeeklyRevenueResponse {
  weekStart: string // LocalDate as string
  totalAmount: number // BigDecimal as number
}

export interface GeneralSubscriptionResponse {
  totalPlans: number
  totalStandard: number
  totalAdvanced: number
  totalAmount: number // BigDecimal as number
}

export interface SubscriptionResponse {
  id: number
  userId: string
  plan: string
  transactionId: string
  amount: number // BigDecimal as number
  status: string
  startDate: string // LocalDate as string
  endDate: string // LocalDate as string
}

export interface GetSubscriptionsParams {
  plan?: string
  status?: string
  page?: number
  size?: number
}

// API functions
export const getWeeklyRevenueApi = async (): Promise<WeeklyRevenueResponse[]> => {
  const response = await api.get<ApiResponse<WeeklyRevenueResponse[]>>('/subscription/weekly')
  return response.data.result
}

export const getGeneralSubscriptionDataApi = async (): Promise<GeneralSubscriptionResponse> => {
  const response = await api.get<ApiResponse<GeneralSubscriptionResponse>>('/subscription/general')
  return response.data.result
}

export const getSubscriptionsApi = async (params: GetSubscriptionsParams): Promise<Page<SubscriptionResponse>> => {
  const queryParams = new URLSearchParams()

  if (params.plan) queryParams.append('plan', params.plan)
  if (params.status) queryParams.append('status', params.status)
  if (params.page !== undefined) queryParams.append('page', params.page.toString())
  if (params.size !== undefined) queryParams.append('size', params.size.toString())

  const response = await api.get<ApiResponse<Page<SubscriptionResponse>>>(`/subscription?${queryParams.toString()}`)
  return response.data.result
}

// Export individual functions for convenience
export const getWeeklyRevenue = getWeeklyRevenueApi
export const getGeneralSubscriptionData = getGeneralSubscriptionDataApi
export const getSubscriptions = getSubscriptionsApi

export default { getWeeklyRevenue, getGeneralSubscriptionData, getSubscriptions }
