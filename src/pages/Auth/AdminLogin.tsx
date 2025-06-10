import { setLanguage } from '../../store/slices/localeSlice'
import { zodResolver } from '@hookform/resolvers/zod'

import { login } from '../../store/slices/authSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store'
import { useTranslation } from 'react-i18next'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useNavigate } from 'react-router-dom'

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
})

export const AdminLogin = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
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
        navigate('/admin/dashboard')
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

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='flex w-full max-w-4xl shadow-lg rounded-lg overflow-hidden'>
        {/* Left Side: Login Form */}
        <div className='w-1/2 p-8 bg-white flex flex-col justify-center'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6'>{t('labels.login')}</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className='space-y-6'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder='Enter your email' className='w-full' {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='Enter your password' className='w-full' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full'>
                Login
              </Button>
            </form>
          </Form>
          <div className='mt-6 flex gap-4'>
            <Button variant='outline' onClick={() => dispatch(setLanguage('vi'))} className='flex-1'>
              Switch to Vietnamese
            </Button>
            <Button variant='outline' onClick={() => dispatch(setLanguage('en'))} className='flex-1'>
              Switch to English
            </Button>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className='w-1/2'>
          <img
            src='https://ps.w.org/login-customizer/assets/icon-256x256.png?rev=2455454'
            alt='Login Illustration'
            className='object-cover w-full h-full'
          />
        </div>
      </div>
    </div>
  )
}
