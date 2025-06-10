import api, { ApiResponse } from '../../utils/api'

// TypeScript interfaces based on Java classes
export interface OrderRequest {
  orderCode: number
  amount: number
  description: string
  returnUrl: string
  cancelUrl: string
}

export interface CheckoutResponseData {
  bin: string
  accountNumber: string
  accountName: string
  amount: number
  description: string
  orderCode: number
  currency: string
  paymentLinkId: string
  status: string
  checkoutUrl: string
  qrCode: string
}

export interface Transaction {
  id: string
  amount: number
  description: string
  accountNumber: string
  reference: string
  transactionDateTime: string
  virtualAccountName?: string
  virtualAccountNumber?: string
  counterAccountBankId?: string
  counterAccountBankName?: string
  counterAccountName?: string
  counterAccountNumber?: string
}

export interface PaymentLinkData {
  id: string
  orderCode: number
  amount: number
  amountPaid: number
  amountRemaining: number
  status: string
  createdAt: string
  transactions: Transaction[]
  cancellationReason?: string
  canceledAt?: string
}

// Simple API functions - similar to auth/index.ts pattern
export const createPaymentApi = async (orderRequest: OrderRequest): Promise<CheckoutResponseData> => {
  const response = await api.post<ApiResponse<CheckoutResponseData>>('/payments', orderRequest)
  return response.data.result
}

export const getPaymentApi = async (orderCode: number): Promise<PaymentLinkData> => {
  const response = await api.get<ApiResponse<PaymentLinkData>>(`/payments?orderCode=${orderCode}`)
  return response.data.result
}

export const updatePaymentApi = async (orderCode: number): Promise<void> => {
  await api.put<ApiResponse<void>>(`/payments?orderCode=${orderCode}`)
}

// Export individual functions for convenience
export const createPayment = createPaymentApi
export const getPayment = getPaymentApi
export const updatePayment = updatePaymentApi

export default { createPayment, getPayment, updatePayment }

/*
USAGE EXAMPLE IN COMPONENT:

import { useDispatch, useSelector } from 'react-redux'
import { createPayment, getPayment, updatePayment } from '../store/slices/paymentSlice'
import { RootState, AppDispatch } from '../store'

function PaymentComponent() {
  const dispatch = useDispatch<AppDispatch>()
  const { 
    checkoutData, 
    currentPayment, 
    createLoading, 
    getLoading, 
    createError 
  } = useSelector((state: RootState) => state.payment)

  const handleCreatePayment = async () => {
    const orderRequest = {
      orderCode: 12345,
      amount: 100000,
      description: "Payment for order #12345",
      returnUrl: "https://yourapp.com/success",
      cancelUrl: "https://yourapp.com/cancel"
    }
    
    dispatch(createPayment(orderRequest))
  }

  const handleGetPayment = () => {
    dispatch(getPayment(12345))
  }

  const handleUpdatePayment = () => {
    dispatch(updatePayment(12345))
  }

  return (
    <div>
      <button onClick={handleCreatePayment} disabled={createLoading}>
        {createLoading ? 'Creating...' : 'Create Payment'}
      </button>
      
      {createError && <p>Error: {createError}</p>}
      {checkoutData && <p>Payment URL: {checkoutData.checkoutUrl}</p>}
    </div>
  )
}
*/
