import { register } from '../../store/slices/authSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store'
import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

// Vietnamese cities/provinces
const vietnameseCities = [
  'An Giang',
  'Bà Rịa - Vũng Tàu',
  'Bắc Giang',
  'Bắc Kạn',
  'Bạc Liêu',
  'Bắc Ninh',
  'Bến Tre',
  'Bình Định',
  'Bình Dương',
  'Bình Phước',
  'Bình Thuận',
  'Cà Mau',
  'Cao Bằng',
  'Đắk Lắk',
  'Đắk Nông',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Giang',
  'Hà Nam',
  'Hà Tĩnh',
  'Hải Dương',
  'Hậu Giang',
  'Hòa Bình',
  'Hưng Yên',
  'Khánh Hòa',
  'Kiên Giang',
  'Kon Tum',
  'Lai Châu',
  'Lâm Đồng',
  'Lạng Sơn',
  'Lào Cai',
  'Long An',
  'Nam Định',
  'Nghệ An',
  'Ninh Bình',
  'Ninh Thuận',
  'Phú Thọ',
  'Phú Yên',
  'Quảng Bình',
  'Quảng Nam',
  'Quảng Ngãi',
  'Quảng Ninh',
  'Quảng Trị',
  'Sóc Trăng',
  'Sơn La',
  'Tây Ninh',
  'Thái Bình',
  'Thái Nguyên',
  'Thanh Hóa',
  'Thừa Thiên Huế',
  'Tiền Giang',
  'Trà Vinh',
  'Tuyên Quang',
  'Vĩnh Long',
  'Vĩnh Phúc',
  'Yên Bái',
  'Hà Nội',
  'TP Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ'
]

export const Register = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Form data state for the new layout
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    repeatPassword: '',
    name: '',
    dob: '',
    city: '',
    school: '',
    role: '',
    acceptTerms: false
  })

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)

      // Validate required fields
      if (
        !formData.username ||
        !formData.password ||
        !formData.repeatPassword ||
        !formData.role ||
        !formData.acceptTerms
      ) {
        alert('Please fill in all required fields')
        return
      }

      if (formData.password !== formData.repeatPassword) {
        alert('Passwords do not match')
        return
      }

      if (!formData.username.includes('@')) {
        alert('Please enter a valid email address')
        return
      }

      const registerData = {
        username: formData.username,
        password: formData.password,
        name: formData.name,
        dob: formData.dob,
        city: formData.city,
        school: formData.school,
        role: formData.role as 'STUDENT' | 'TEACHER'
      }

      const resultAction = await dispatch(register(registerData))
      if (register.fulfilled.match(resultAction)) {
        // Registration successful, redirect to login
        navigate('/login')
      }

      if (register.rejected.match(resultAction)) {
        alert(resultAction.payload as string)
      }
    } catch (error) {
      alert(t('messages.unknownError') || 'Registration failed')
      console.error('Registration failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600'>
      <div className='flex w-full max-w-6xl shadow-2xl rounded-3xl overflow-hidden bg-white'>
        {/* Left Side: Welcome Content */}
        <div className='w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-12 flex flex-col justify-center text-white'>
          <div className='space-y-6'>
            <h1 className='text-4xl font-bold leading-tight'>{t('labels.welcome')}</h1>
            <p className='text-xl opacity-90'>{t('labels.subtitle')}</p>
            <p className='text-lg opacity-80'>{t('labels.slogan')}</p>

            {/* Features list */}
            <div className='space-y-4 mt-8'>
              <div className='flex items-center space-x-3'>
                <div className='w-2 h-2 bg-white rounded-full'></div>
                <span>Interactive Learning Platform</span>
              </div>
              <div className='flex items-center space-x-3'>
                <div className='w-2 h-2 bg-white rounded-full'></div>
                <span>Real-time Collaboration</span>
              </div>
              <div className='flex items-center space-x-3'>
                <div className='w-2 h-2 bg-white rounded-full'></div>
                <span>Progress Tracking</span>
              </div>
              <div className='flex items-center space-x-3'>
                <div className='w-2 h-2 bg-white rounded-full'></div>
                <span>Multi-language Support</span>
              </div>
            </div>

            {/* Language Switcher */}
            <div className='flex items-center gap-4 mt-8 pt-8 border-t border-white/20'>
              <button
                onClick={() => changeLanguage('en')}
                className={`flex items-center gap-2 hover:text-blue-200 transition-colors ${
                  i18n.language === 'en' ? 'text-white font-medium' : 'text-white/70'
                }`}
              >
                <img src='https://flagcdn.com/16x12/us.png' alt='English' className='w-4 h-3' />
                <span>{t('labels.english')}</span>
              </button>
              <button
                onClick={() => changeLanguage('vi')}
                className={`flex items-center gap-2 hover:text-blue-200 transition-colors ${
                  i18n.language === 'vi' ? 'text-white font-medium' : 'text-white/70'
                }`}
              >
                <img src='https://flagcdn.com/16x12/vn.png' alt='Vietnamese' className='w-4 h-3' />
                <span>{t('labels.vietnamese')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className='w-1/2 p-12 overflow-y-auto max-h-screen'>
          <div className='max-w-md mx-auto'>
            {/* Header */}
            <div className='text-center mb-8'>
              <h2 className='text-3xl font-bold text-gray-900 mb-2'>{t('labels.signUp')}</h2>
              <p className='text-gray-600'>{t('labels.socialCampaigns')}</p>
            </div>

            {/* Form */}
            <div className='space-y-6'>
              {/* Email */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>{t('labels.email')} *</label>
                <input
                  type='email'
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder={t('placeholders.enterEmail')}
                  className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                />
              </div>

              {/* Password */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>{t('labels.password')} *</label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder={t('placeholders.enterPassword')}
                    className='w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
                  >
                    {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                  </button>
                </div>
              </div>

              {/* Repeat Password */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>{t('labels.repeatPassword')} *</label>
                <div className='relative'>
                  <input
                    type={showRepeatPassword ? 'text' : 'password'}
                    value={formData.repeatPassword}
                    onChange={(e) => handleInputChange('repeatPassword', e.target.value)}
                    placeholder={t('placeholders.repeatPassword')}
                    className='w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                  />
                  <button
                    type='button'
                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
                  >
                    {showRepeatPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>{t('labels.fullName')}</label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t('placeholders.enterFullName')}
                  className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                />
              </div>

              {/* Role */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>{t('labels.role')} *</label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                >
                  <option value=''>{t('placeholders.selectRole')}</option>
                  <option value='STUDENT'>{t('labels.student')}</option>
                  <option value='TEACHER'>{t('labels.teacher')}</option>
                </select>
              </div>

              {/* Date of Birth and City */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>{t('labels.dateOfBirth')}</label>
                  <input
                    type='date'
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>{t('labels.city')}</label>
                  <select
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                  >
                    <option value=''>{t('placeholders.selectCity')}</option>
                    {vietnameseCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* School */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>{t('labels.school')}</label>
                <input
                  type='text'
                  value={formData.school}
                  onChange={(e) => handleInputChange('school', e.target.value)}
                  placeholder={t('placeholders.enterSchool')}
                  className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                />
              </div>

              {/* Terms and Conditions */}
              <div className='flex items-start space-x-3'>
                <input
                  type='checkbox'
                  id='terms'
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                  className='mt-1'
                />
                <label htmlFor='terms' className='text-sm'>
                  {t('labels.acceptTerms')}{' '}
                  <Link to='/terms' className='text-blue-600 hover:text-blue-700'>
                    {t('labels.terms')}
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className='w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50'
              >
                {isLoading ? t('labels.creatingAccount') : t('labels.signUp')}
              </button>

              {/* Login Link */}
              <div className='text-center'>
                <p className='text-gray-600'>
                  {t('labels.alreadyHaveAccount')}{' '}
                  <Link to='/login' className='text-blue-600 hover:text-blue-700 font-medium'>
                    {t('labels.signIn')}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
