import { zodResolver } from '@hookform/resolvers/zod'
import { login } from '../../store/slices/authSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store'
import { outboundAuthenticateApi } from '../../services/Auth'
import { useTranslation } from 'react-i18next'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
})

export const Login = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT')

  // Initialize form with react-hook-form and zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    try {
      const resultAction = await dispatch(login({ username: values.email, password: values.password }))
      if (login.fulfilled.match(resultAction)) {
        const plan = searchParams.get('plan')
        const userRole = resultAction.payload?.role
        if (plan === 'advanced' && userRole === 'TEACHER') {
          navigate('/subscription')
        } else {
          navigate('/class')
        }
      }

      if (login.rejected.match(resultAction)) {
        form.setError('email', {
          type: 'server',
          message: resultAction.payload as string
        })
      }
    } catch (error) {
      form.setError('email', {
        type: 'server',
        message: t('messages.unknownError')
      })
      console.error('Login failed:', error)
    }
  }

  const handleGoogleSuccess = async (credentialResponse: { code?: string; credential?: string }) => {
    try {
      console.log('Google login success:', credentialResponse)

      // For authorization code flow, you'll get a 'code' property
      // For credential flow, you'll get a 'credential' property
      const code = credentialResponse.code || credentialResponse.credential

      if (!code) {
        console.error('No authorization code received from Google')
        return
      }

      // Use the selected role from state
      const role = selectedRole

      // Call your backend API
      const authResult = await outboundAuthenticateApi(code, role)
      console.log('Authentication successful:', authResult)

      // Handle successful authentication - store token, redirect, etc.
      // You might want to store the token and update auth state here
      localStorage.setItem('token', authResult.token)

      // Check for plan parameter and redirect accordingly
      const plan = searchParams.get('plan')

      if (plan === 'advanced' && selectedRole === 'TEACHER') {
        navigate('/subscription')
      } else {
        navigate('/class')
      }
    } catch (error) {
      console.error('Google authentication error:', error)
    }
  }

  const handleGoogleFailure = () => {
    console.log('Google login failed')
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600'>
      <div className='w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>Sign In</h1>
          <p className='text-gray-500'>Welcome back to your account</p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className='space-y-6'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700 font-medium'>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='Enter your email'
                      className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700 font-medium'>Password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Enter your password'
                        className='w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        {...field}
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
                      >
                        {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Social Sign In */}
            <div className='space-y-4'>
              <div className='text-center text-gray-500'>Or with</div>

              {/* Role Selection for Google Login */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>Sign in as:</label>
                <Select value={selectedRole} onValueChange={(value: 'STUDENT' | 'TEACHER') => setSelectedRole(value)}>
                  <SelectTrigger className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='STUDENT'>Student</SelectItem>
                    <SelectItem value='TEACHER'>Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex gap-3'>
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
              </div>
            </div>

            <Button
              type='submit'
              className='w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors'
            >
              Sign In
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className='mt-6 text-center'>
          <p className='text-gray-600'>
            Don't have an account?{' '}
            <Link to='/register' className='text-blue-600 hover:text-blue-700 font-medium'>
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom Links */}
      <div className='absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-6 text-white/80'>
        <div className='flex items-center gap-2'>
          <img src='https://flagcdn.com/16x12/us.png' alt='English' className='w-4 h-3' />
          <span className='text-sm'>English</span>
        </div>
        <Link to='/terms' className='text-sm hover:text-white'>
          Terms
        </Link>
        <Link to='/plans' className='text-sm hover:text-white'>
          Plans
        </Link>
        <Link to='/contact' className='text-sm hover:text-white'>
          Contact Us
        </Link>
      </div>
    </div>
  )
}
