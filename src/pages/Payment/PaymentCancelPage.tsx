import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { X, AlertTriangle, RefreshCw, ArrowLeft, CreditCard, FileText, Calendar, DollarSign } from 'lucide-react'
import { getPayment } from '../../store/slices/paymentSlice'
import { RootState, AppDispatch } from '../../store'

export default function PaymentCancelPage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orderCode = searchParams.get('orderCode')

  const { currentPayment, getLoading, getError } = useSelector((state: RootState) => state.payment)

  useEffect(() => {
    if (orderCode) {
      // Try to fetch payment details to show what was attempted
      dispatch(getPayment(parseInt(orderCode)))
    }
  }, [dispatch, orderCode])

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

  const handleRetryPayment = () => {
    navigate('/subscription')
  }

  const handleRefreshPayment = () => {
    if (orderCode) {
      dispatch(getPayment(parseInt(orderCode)))
    }
  }

  if (!orderCode) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center'>
        <div className='bg-white rounded-lg shadow-lg p-8 max-w-md text-center'>
          <div className='text-red-500 mb-4'>
            <FileText className='w-12 h-12 mx-auto' />
          </div>
          <h1 className='text-xl font-semibold text-gray-900 mb-2'>Invalid Payment Link</h1>
          <p className='text-gray-600 mb-6'>No order code found in the URL.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 to-orange-50'>
      <div className='max-w-4xl mx-auto px-6 py-12'>
        {/* Cancel Header */}
        <div className='text-center mb-12'>
          <div className='w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'>
            <X className='w-12 h-12 text-red-600' />
          </div>
          <h1 className='text-4xl font-bold text-red-600 mb-4'>Payment Cancelled</h1>
          <p className='text-lg text-gray-600'>
            Your payment was cancelled or failed to process. Don't worry, no charges were made to your account.
          </p>
        </div>

        {/* Error Display */}
        {getError && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 mb-8'>
            <div className='flex items-start gap-3'>
              <AlertTriangle className='w-5 h-5 text-red-600 flex-shrink-0 mt-0.5' />
              <div>
                <p className='text-red-600 font-semibold mb-1'>Failed to load payment details</p>
                <p className='text-red-600 text-sm'>{getError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Details (if available) */}
        {currentPayment && (
          <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-6'>Attempted Order Details</h2>

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
                    <p className='text-sm text-gray-500'>Amount</p>
                    <p className='font-semibold text-gray-900'>{formatCurrency(currentPayment.amount)}</p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Calendar className='w-5 h-5 text-purple-600' />
                  <div>
                    <p className='text-sm text-gray-500'>Created Date</p>
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
                        currentPayment.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : currentPayment.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {currentPayment.status}
                    </span>
                  </div>
                </div>

                {currentPayment.cancellationReason && (
                  <div className='flex items-start gap-3'>
                    <AlertTriangle className='w-5 h-5 text-red-600 flex-shrink-0 mt-0.5' />
                    <div>
                      <p className='text-sm text-gray-500'>Cancellation Reason</p>
                      <p className='text-gray-900'>{currentPayment.cancellationReason}</p>
                    </div>
                  </div>
                )}

                {currentPayment.canceledAt && (
                  <div className='flex items-center gap-3'>
                    <Calendar className='w-5 h-5 text-red-600' />
                    <div>
                      <p className='text-sm text-gray-500'>Cancelled At</p>
                      <p className='font-semibold text-gray-900'>{formatDate(currentPayment.canceledAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* What Happened Section */}
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8'>
          <div className='flex items-start gap-3'>
            <AlertTriangle className='w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5' />
            <div>
              <h3 className='font-semibold text-yellow-800 mb-2'>What happened?</h3>
              <ul className='text-yellow-700 text-sm space-y-1'>
                <li>• You may have cancelled the payment process</li>
                <li>• The payment gateway encountered an error</li>
                <li>• Your bank declined the transaction</li>
                <li>• The session may have timed out</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8'>
          <h3 className='font-semibold text-blue-800 mb-4'>What can you do next?</h3>
          <div className='grid md:grid-cols-2 gap-4 text-sm text-blue-700'>
            <div>
              <h4 className='font-medium mb-2'>Try Again</h4>
              <p>
                Return to the subscription page and attempt the payment again with the same or different payment method.
              </p>
            </div>
            <div>
              <h4 className='font-medium mb-2'>Contact Support</h4>
              <p>If you continue experiencing issues, please contact our support team for assistance.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <button
            onClick={handleRetryPayment}
            className='bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center'
          >
            <CreditCard className='w-5 h-5' />
            Try Payment Again
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className='border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center'
          >
            <ArrowLeft className='w-5 h-5' />
            Back to Dashboard
          </button>

          {currentPayment && (
            <button
              onClick={handleRefreshPayment}
              disabled={getLoading}
              className='border border-blue-300 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2 justify-center disabled:opacity-50'
            >
              <RefreshCw className={`w-5 h-5 ${getLoading ? 'animate-spin' : ''}`} />
              Refresh Status
            </button>
          )}
        </div>

        {/* Support Information */}
        <div className='text-center mt-12 p-6 bg-white rounded-lg shadow'>
          <h3 className='font-semibold text-gray-900 mb-2'>Need Help?</h3>
          <p className='text-gray-600 text-sm mb-4'>
            If you're experiencing persistent payment issues, our support team is here to help.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center text-sm'>
            <a href='mailto:support@ieltshub.com' className='text-blue-600 hover:text-blue-800'>
              📧 support@ieltshub.com
            </a>
            <span className='hidden sm:inline text-gray-400'>•</span>
            <span className='text-gray-600'>📞 +1 (555) 123-4567</span>
          </div>
        </div>
      </div>
    </div>
  )
}
