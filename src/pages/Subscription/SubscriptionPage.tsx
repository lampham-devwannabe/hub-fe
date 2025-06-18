import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Star, Rocket, ArrowRight, Loader } from 'lucide-react'
import { createPayment } from '../../store/slices/paymentSlice'
import { RootState, AppDispatch } from '../../store'
import { OrderRequest } from '../../services/Payment'

interface PricingPlan {
  id: 'STANDARD' | 'ADVANCED'
  name: string
  price: number
  priceDisplay: string
  period: string
  description: string
  perks: string[]
  icon: JSX.Element
  highlight: boolean
}

const plans: PricingPlan[] = [
  {
    id: 'STANDARD',
    name: 'STANDARD',
    price: 100000,
    priceDisplay: '100,000 VND',
    period: 'per month',
    description: 'Ideal for growing classrooms and personal tutors',
    perks: [
      'Up to 200 students',
      'AI-powered writing Task 2 feedback',
      'Student analytics dashboard',
      'Custom branding'
    ],
    icon: <Star className='w-8 h-8 text-yellow-500' />,
    highlight: false
  },
  {
    id: 'ADVANCED',
    name: 'ADVANCED',
    price: 200000,
    priceDisplay: '200,000 VND',
    period: 'per month',
    description: 'For professional tutors and institutes',
    perks: [
      'Up to 400 students',
      'Full personal resources access',
      'Access to all AI-powered gradings',
      'Advanced analytics & reporting',
      'Priority support',
      'Team collaboration tools',
      'API access',
      'Smart email notifications'
    ],
    icon: <Rocket className='w-8 h-8 text-blue-500' />,
    highlight: true
  }
]

// Generate random 6-digit number not starting with 0
const generateOrderCode = (): number => {
  // console.log('generateOrderCode' + Math.floor(100000 + Math.random() * 900000))
  return Math.floor(100000 + Math.random() * 900000)
}

export default function SubscriptionPage() {
  generateOrderCode()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { createLoading, createError } = useSelector((state: RootState) => state.payment)
  const { user } = useSelector((state: RootState) => state.auth)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleSelectPlan = async (plan: PricingPlan) => {
    setSelectedPlan(plan.id)

    const orderCode = generateOrderCode()

    // Since backend prepends BASE_URL, we only need relative paths
    const returnUrl = `/payment/success?orderCode=${orderCode}`
    const cancelUrl = `/payment/cancel?orderCode=${orderCode}`

    // Debug: Log the URLs being sent
    console.log('Payment URLs:', {
      returnUrl,
      cancelUrl,
      orderCode
    })

    const orderRequest: OrderRequest = {
      orderCode,
      amount: plan.price,
      description: `${plan.name} ${user?.name || 'Teacher'}`,
      returnUrl,
      cancelUrl
    }

    try {
      const result = await dispatch(createPayment(orderRequest))

      if (createPayment.fulfilled.match(result)) {
        // Add a small delay to ensure the payment is properly created before redirecting
        setTimeout(() => {
          window.location.href = result.payload.checkoutUrl
        }, 100)
      }
    } catch (error) {
      console.error('Payment creation failed:', error)
      setSelectedPlan(null)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='max-w-6xl mx-auto px-6 py-12'>
        {/* Header */}
        <div className='text-center space-y-6 mb-12'>
          <h1 className='text-4xl font-bold text-blue-800'>Choose Your Subscription Plan</h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Upgrade your teaching capabilities with our premium features. Choose the plan that best fits your needs.
          </p>
        </div>

        {/* Error Display */}
        {createError && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-8'>
            <p className='text-red-600 text-center'>Payment creation failed: {createError}</p>
          </div>
        )}

        {/* Pricing Plans */}
        <div className='grid md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all hover:shadow-2xl ${
                plan.highlight ? 'border-blue-500 transform scale-105' : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {plan.highlight && (
                <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
                  <div className='bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold'>
                    Most Popular
                  </div>
                </div>
              )}

              <div className='p-8 space-y-6'>
                {/* Plan Header */}
                <div className='flex items-center gap-3'>
                  {plan.icon}
                  <div>
                    <h3 className='text-2xl font-bold text-blue-800'>{plan.name}</h3>
                    <p className='text-sm text-gray-600'>{plan.description}</p>
                  </div>
                </div>

                {/* Pricing */}
                <div className='text-center'>
                  <div className='flex items-baseline justify-center gap-1'>
                    <span className='text-4xl font-bold text-blue-800'>{plan.priceDisplay}</span>
                    <span className='text-gray-600'>/{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className='space-y-3'>
                  {plan.perks.map((perk, i) => (
                    <li key={i} className='flex items-start gap-3 text-sm text-gray-700'>
                      <CheckCircle className='w-5 h-5 text-green-500 flex-shrink-0 mt-0.5' />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={createLoading && selectedPlan === plan.id}
                  className={`w-full py-4 px-8 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                    plan.highlight
                      ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400'
                      : 'border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:bg-gray-100 disabled:text-gray-400'
                  }`}
                >
                  {createLoading && selectedPlan === plan.id ? (
                    <>
                      <Loader className='w-5 h-5 animate-spin' />
                      Processing...
                    </>
                  ) : (
                    <>
                      Subscribe Now
                      <ArrowRight className='w-5 h-5' />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className='text-center mt-12 space-y-4'>
          <p className='text-sm text-gray-600'>
            ✓ Secure payment processing • ✓ 14-day money back guarantee • ✓ Cancel anytime
          </p>
          <div className='flex justify-center space-x-8 text-sm text-gray-500'>
            <span>Powered by PayOS</span>
            <span>•</span>
            <span>SSL Encrypted</span>
            <span>•</span>
            <span>Bank Grade Security</span>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className='text-center mt-8'>
          <button onClick={() => navigate('/class')} className='text-blue-600 hover:text-blue-800 transition-colors'>
            ← Back to Class
          </button>
        </div>
      </div>
    </div>
  )
}
