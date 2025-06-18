import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getWeeklyRevenueApi,
  getGeneralSubscriptionDataApi,
  getSubscriptionsApi,
  WeeklyRevenueResponse,
  GeneralSubscriptionResponse,
  SubscriptionResponse,
  GetSubscriptionsParams
} from '../../services/Subscription'
import { Page } from './accountSlice'

interface SubscriptionState {
  // Data states
  weeklyRevenue: WeeklyRevenueResponse[] | null
  generalData: GeneralSubscriptionResponse | null
  subscriptions: Page<SubscriptionResponse> | null

  // Loading states for different operations
  weeklyLoading: boolean
  generalLoading: boolean
  subscriptionsLoading: boolean

  // Error states
  weeklyError: string | null
  generalError: string | null
  subscriptionsError: string | null
}

const initialState: SubscriptionState = {
  weeklyRevenue: null,
  generalData: null,
  subscriptions: null,
  weeklyLoading: false,
  generalLoading: false,
  subscriptionsLoading: false,
  weeklyError: null,
  generalError: null,
  subscriptionsError: null
}

// Async thunk for weekly revenue
export const fetchWeeklyRevenue = createAsyncThunk(
  'subscription/fetchWeeklyRevenue',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getWeeklyRevenueApi()
      // Map the API response to our expected format
      const weeklyRevenue: WeeklyRevenueResponse[] = response.map(
        (item: { weekStart: string; totalAmount: number }) => ({
          weekStart: item.weekStart,
          totalAmount: item.totalAmount
        })
      )
      return weeklyRevenue
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
        (error as { message?: string }).message ||
        'Failed to fetch weekly revenue'
      return rejectWithValue(errorMessage)
    }
  }
)

// Async thunk for general subscription data
export const fetchGeneralSubscriptionData = createAsyncThunk(
  'subscription/fetchGeneralSubscriptionData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getGeneralSubscriptionDataApi()
      // Map the API response to our expected format
      const generalData: GeneralSubscriptionResponse = {
        totalPlans: response.totalPlans,
        totalStandard: response.totalStandard,
        totalAdvanced: response.totalAdvanced,
        totalAmount: response.totalAmount
      }
      return generalData
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
        (error as { message?: string }).message ||
        'Failed to fetch general subscription data'
      return rejectWithValue(errorMessage)
    }
  }
)

// Async thunk for paginated subscriptions
export const fetchSubscriptions = createAsyncThunk(
  'subscription/fetchSubscriptions',
  async (params: GetSubscriptionsParams, { rejectWithValue }) => {
    try {
      const response = await getSubscriptionsApi(params)
      // Map the API response to our expected format
      const subscriptionsPage: Page<SubscriptionResponse> = {
        content: response.content.map(
          (subscription: {
            id: number
            userId: string
            plan: string
            transactionId: string
            amount: number
            status: string
            startDate: string
            endDate: string
          }) => ({
            id: subscription.id,
            userId: subscription.userId,
            plan: subscription.plan,
            transactionId: subscription.transactionId,
            amount: subscription.amount,
            status: subscription.status,
            startDate: subscription.startDate,
            endDate: subscription.endDate
          })
        ),
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        size: response.size,
        number: response.number,
        first: response.first,
        last: response.last
      }
      return subscriptionsPage
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
        (error as { message?: string }).message ||
        'Failed to fetch subscriptions'
      return rejectWithValue(errorMessage)
    }
  }
)

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    // Clear weekly revenue data
    clearWeeklyRevenue(state) {
      state.weeklyRevenue = null
      state.weeklyError = null
    },

    // Clear general data
    clearGeneralData(state) {
      state.generalData = null
      state.generalError = null
    },

    // Clear subscriptions data
    clearSubscriptions(state) {
      state.subscriptions = null
      state.subscriptionsError = null
    },

    // Clear all errors
    clearErrors(state) {
      state.weeklyError = null
      state.generalError = null
      state.subscriptionsError = null
    },

    // Reset entire state
    resetSubscriptionState() {
      return initialState
    }
  },
  extraReducers: (builder) => {
    // Weekly Revenue
    builder
      .addCase(fetchWeeklyRevenue.pending, (state) => {
        state.weeklyLoading = true
        state.weeklyError = null
      })
      .addCase(fetchWeeklyRevenue.fulfilled, (state, action: PayloadAction<WeeklyRevenueResponse[]>) => {
        state.weeklyLoading = false
        state.weeklyRevenue = action.payload
      })
      .addCase(fetchWeeklyRevenue.rejected, (state, action) => {
        state.weeklyLoading = false
        state.weeklyError = action.payload as string
      })

    // General Subscription Data
    builder
      .addCase(fetchGeneralSubscriptionData.pending, (state) => {
        state.generalLoading = true
        state.generalError = null
      })
      .addCase(fetchGeneralSubscriptionData.fulfilled, (state, action: PayloadAction<GeneralSubscriptionResponse>) => {
        state.generalLoading = false
        state.generalData = action.payload
      })
      .addCase(fetchGeneralSubscriptionData.rejected, (state, action) => {
        state.generalLoading = false
        state.generalError = action.payload as string
      })

    // Subscriptions
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.subscriptionsLoading = true
        state.subscriptionsError = null
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action: PayloadAction<Page<SubscriptionResponse>>) => {
        state.subscriptionsLoading = false
        state.subscriptions = action.payload
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.subscriptionsLoading = false
        state.subscriptionsError = action.payload as string
      })
  }
})

export const { clearWeeklyRevenue, clearGeneralData, clearSubscriptions, clearErrors, resetSubscriptionState } =
  subscriptionSlice.actions

export default subscriptionSlice.reducer
