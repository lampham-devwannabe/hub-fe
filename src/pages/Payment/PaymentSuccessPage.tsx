import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, CreditCard, Calendar, DollarSign, FileText, Loader, ArrowRight, RefreshCw } from 'lucide-react'
import { getPayment, updatePayment } from '../../store/slices/paymentSlice'
import { RootState, AppDispatch } from '../../store'

export default function PaymentSuccessPage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orderCode = searchParams.get('orderCode')

  const { currentPayment, getLoading, updateLoading, getError } = useSelector((state: RootState) => state.payment)

  const [updateCompleted, setUpdateCompleted] = useState(false)

  const updateCalledRef = useRef(false)

  useEffect(() => {
    if (orderCode && !updateCalledRef.current) {
      updateCalledRef.current = true

      const orderCodeNum = parseInt(orderCode)

      dispatch(getPayment(orderCodeNum))
      dispatch(updatePayment(orderCodeNum)).then(() => {
        setUpdateCompleted(true)
      })
    }
  }, [dispatch, orderCode])

  const handleRefreshPayment = () => {
    if (orderCode) {
      // Only refresh payment details, don't update payment status again
      dispatch(getPayment(parseInt(orderCode)))
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!orderCode) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center'>
        <div className='bg-white rounded-lg shadow-lg p-8 max-w-md text-center'>
          <div className='text-red-500 mb-4'>
            <FileText className='w-12 h-12 mx-auto' />
          </div>
          <h1 className='text-xl font-semibold text-gray-900 mb-2'>Invalid Payment Link</h1>
          <p className='text-gray-600 mb-6'>No order code found in the URL.</p>
          <button
            onClick={() => navigate('/class')}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
          >
            Go to Class
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50'>
      <div className='max-w-4xl mx-auto px-6 py-12'>
        {/* Success Header */}
        <div className='text-center mb-12'>
          <div className='w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'>
            <CheckCircle className='w-12 h-12 text-green-600' />
          </div>
          <h1 className='text-4xl font-bold text-green-600 mb-4'>Payment Successful!</h1>
          <p className='text-lg text-gray-600'>
            Thank you for your subscription. Your account has been upgraded successfully.
          </p>
        </div>

        {/* Loading State */}
        {getLoading && (
          <div className='bg-white rounded-lg shadow-lg p-8 text-center'>
            <Loader className='w-8 h-8 animate-spin mx-auto text-blue-600 mb-4' />
            <p className='text-gray-600'>Loading payment details...</p>
          </div>
        )}

        {/* Error State */}
        {getError && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 mb-8'>
            <p className='text-red-600 text-center mb-4'>Failed to load payment details: {getError}</p>
            <div className='text-center'>
              <button
                onClick={handleRefreshPayment}
                className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto'
              >
                <RefreshCw className='w-4 h-4' />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Payment Details */}
        {currentPayment && (
          <div className='space-y-8'>
            {/* Order Summary */}
            <div className='bg-white rounded-lg shadow-lg p-8'>
              <h2 className='text-2xl font-semibold text-gray-900 mb-6'>Order Summary</h2>

              <div className='grid md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-3'>
                    <FileText className='w-5 h-5 text-blue-600' />
                    <div>
                      <p className='text-sm text-gray-500'>Order Code</p>
                      <p className='font-semibold text-gray-900'>{currentPayment.orderCode}</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <DollarSign className='w-5 h-5 text-green-600' />
                    <div>
                      <p className='text-sm text-gray-500'>Total Amount</p>
                      <p className='font-semibold text-gray-900'>{formatCurrency(currentPayment.amount)}</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <Calendar className='w-5 h-5 text-purple-600' />
                    <div>
                      <p className='text-sm text-gray-500'>Payment Date</p>
                      <p className='font-semibold text-gray-900'>{formatDate(currentPayment.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='flex items-center gap-3'>
                    <CreditCard className='w-5 h-5 text-orange-600' />
                    <div>
                      <p className='text-sm text-gray-500'>Payment Status</p>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          currentPayment.status === 'PAID'
                            ? 'bg-green-100 text-green-800'
                            : currentPayment.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {currentPayment.status}
                      </span>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <DollarSign className='w-5 h-5 text-blue-600' />
                    <div>
                      <p className='text-sm text-gray-500'>Amount Paid</p>
                      <p className='font-semibold text-gray-900'>{formatCurrency(currentPayment.amountPaid)}</p>
                    </div>
                  </div>

                  {currentPayment.amountRemaining > 0 && (
                    <div className='flex items-center gap-3'>
                      <DollarSign className='w-5 h-5 text-red-600' />
                      <div>
                        <p className='text-sm text-gray-500'>Remaining Amount</p>
                        <p className='font-semibold text-gray-900'>{formatCurrency(currentPayment.amountRemaining)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            {currentPayment.transactions && currentPayment.transactions.length > 0 && (
              <div className='bg-white rounded-lg shadow-lg p-8'>
                <h2 className='text-2xl font-semibold text-gray-900 mb-6'>Transaction Details</h2>

                <div className='space-y-4'>
                  {currentPayment.transactions.map((transaction, index) => (
                    <div key={transaction.id} className='border border-gray-200 rounded-lg p-4'>
                      <div className='grid md:grid-cols-3 gap-4'>
                        <div>
                          <p className='text-sm text-gray-500'>Transaction #{index + 1}</p>
                          <p className='font-semibold text-gray-900'>{transaction.id}</p>
                        </div>
                        <div>
                          <p className='text-sm text-gray-500'>Amount</p>
                          <p className='font-semibold text-gray-900'>{formatCurrency(transaction.amount)}</p>
                        </div>
                        <div>
                          <p className='text-sm text-gray-500'>Date & Time</p>
                          <p className='font-semibold text-gray-900'>{formatDate(transaction.transactionDateTime)}</p>
                        </div>
                      </div>

                      {transaction.description && (
                        <div className='mt-4'>
                          <p className='text-sm text-gray-500'>Description</p>
                          <p className='text-gray-900'>{transaction.description}</p>
                        </div>
                      )}

                      {transaction.reference && (
                        <div className='mt-2'>
                          <p className='text-sm text-gray-500'>Reference</p>
                          <p className='text-gray-900 font-mono text-sm'>{transaction.reference}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Update Indicator */}
            <div className='bg-white rounded-lg shadow-lg p-6'>
              <div className='flex items-center gap-3'>
                {updateLoading ? (
                  <Loader className='w-5 h-5 animate-spin text-blue-600' />
                ) : updateCompleted ? (
                  <CheckCircle className='w-5 h-5 text-green-600' />
                ) : (
                  <RefreshCw className='w-5 h-5 text-gray-400' />
                )}
                <div>
                  <p className='font-semibold text-gray-900'>
                    {updateLoading
                      ? 'Updating payment status...'
                      : updateCompleted
                        ? 'Payment status updated successfully'
                        : 'Payment status update pending'}
                  </p>
                  <p className='text-sm text-gray-600'>
                    {updateCompleted
                      ? 'Your subscription is now active and ready to use.'
                      : 'Please wait while we confirm your payment.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center mt-12'>
          <button
            onClick={() => navigate('/class')}
            className='bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center'
          >
            Go to Class
            <ArrowRight className='w-5 h-5' />
          </button>

          <button
            onClick={handleRefreshPayment}
            disabled={getLoading}
            className='border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center disabled:opacity-50'
          >
            <RefreshCw className={`w-5 h-5 ${getLoading ? 'animate-spin' : ''}`} />
            Refresh Details
          </button>
        </div>
      </div>
    </div>
  )
}
