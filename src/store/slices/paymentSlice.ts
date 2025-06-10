import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import {
  createPaymentApi,
  getPaymentApi,
  updatePaymentApi,
  OrderRequest,
  CheckoutResponseData,
  PaymentLinkData
} from '../../services/Payment'

interface PaymentState {
  // Current payment data
  currentPayment: PaymentLinkData | null
  checkoutData: CheckoutResponseData | null

  // Loading states for different operations
  createLoading: boolean
  getLoading: boolean
  updateLoading: boolean

  // Error states
  createError: string | null
  getError: string | null
  updateError: string | null
}

const initialState: PaymentState = {
  currentPayment: null,
  checkoutData: null,
  createLoading: false,
  getLoading: false,
  updateLoading: false,
  createError: null,
  getError: null,
  updateError: null
}

// Async thunk for creating payment
export const createPayment = createAsyncThunk(
  'payment/createPayment',
  async (orderRequest: OrderRequest, { rejectWithValue }) => {
    try {
      const response = await createPaymentApi(orderRequest)
      return response
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
        (error as { message?: string }).message ||
        'Payment creation failed'
      return rejectWithValue(errorMessage)
    }
  }
)

// Async thunk for getting payment details
export const getPayment = createAsyncThunk('payment/getPayment', async (orderCode: number, { rejectWithValue }) => {
  try {
    const response = await getPaymentApi(orderCode)
    return response
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
      (error as { message?: string }).message ||
      'Failed to fetch payment details'
    return rejectWithValue(errorMessage)
  }
})

// Async thunk for updating payment
export const updatePayment = createAsyncThunk(
  'payment/updatePayment',
  async (orderCode: number, { rejectWithValue }) => {
    try {
      await updatePaymentApi(orderCode)
      return orderCode // Return orderCode to identify which payment was updated
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
        (error as { message?: string }).message ||
        'Payment update failed'
      return rejectWithValue(errorMessage)
    }
  }
)

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    // Clear checkout data
    clearCheckoutData(state) {
      state.checkoutData = null
      state.createError = null
    },

    // Clear current payment
    clearCurrentPayment(state) {
      state.currentPayment = null
      state.getError = null
    },

    // Clear all errors
    clearErrors(state) {
      state.createError = null
      state.getError = null
      state.updateError = null
    },

    // Reset entire state
    resetPaymentState() {
      return initialState
    }
  },
  extraReducers: (builder) => {
    // Create Payment
    builder
      .addCase(createPayment.pending, (state) => {
        state.createLoading = true
        state.createError = null
      })
      .addCase(createPayment.fulfilled, (state, action: PayloadAction<CheckoutResponseData>) => {
        state.createLoading = false
        state.checkoutData = action.payload
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.createLoading = false
        state.createError = action.payload as string
      })

    // Get Payment
    builder
      .addCase(getPayment.pending, (state) => {
        state.getLoading = true
        state.getError = null
      })
      .addCase(getPayment.fulfilled, (state, action: PayloadAction<PaymentLinkData>) => {
        state.getLoading = false
        state.currentPayment = action.payload
      })
      .addCase(getPayment.rejected, (state, action) => {
        state.getLoading = false
        state.getError = action.payload as string
      })

    // Update Payment
    builder
      .addCase(updatePayment.pending, (state) => {
        state.updateLoading = true
        state.updateError = null
      })
      .addCase(updatePayment.fulfilled, (state) => {
        state.updateLoading = false
        // Optionally refresh current payment data after update
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.updateLoading = false
        state.updateError = action.payload as string
      })
  }
})

export const { clearCheckoutData, clearCurrentPayment, clearErrors, resetPaymentState } = paymentSlice.actions

export default paymentSlice.reducer
