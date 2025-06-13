import { useState } from 'react'
import { Calendar, Mail, CheckCircle, X } from 'lucide-react'

type Language = 'en' | 'vi'

interface DemoSchedulePopupProps {
  isOpen: boolean
  onClose: () => void
  language: Language
}

interface Translations {
  [key: string]: {
    demoPopup: {
      title: string
      subtitle: string
      emailLabel: string
      emailPlaceholder: string
      noteLabel: string
      notePlaceholder: string
      submitButton: string
      submittingButton: string
      successTitle: string
      successMessage: string
      scheduleAnother: string
      terms: string
      invalidEmail: string
      emailRequired: string
      close: string
    }
  }
}

const translations: Translations = {
  en: {
    demoPopup: {
      title: 'Schedule Demo',
      subtitle: 'Enter your email to schedule a product demo',
      emailLabel: 'Customer Email *',
      emailPlaceholder: 'email@example.com',
      noteLabel: 'Note',
      notePlaceholder: 'Add notes about your demo request...',
      submitButton: 'Schedule Demo',
      submittingButton: 'Sending...',
      successTitle: 'Registration Successful!',
      successMessage: 'We have received your demo request. Our team will contact you soon.',
      scheduleAnother: 'Schedule Another Demo',
      terms: 'By registering, you agree to our terms of service',
      invalidEmail: 'Invalid email address',
      emailRequired: 'Please enter your email',
      close: 'Close'
    }
  },
  vi: {
    demoPopup: {
      title: 'Đăng ký Demo',
      subtitle: 'Nhập email để đăng ký demo sản phẩm',
      emailLabel: 'Email khách hàng *',
      emailPlaceholder: 'email@example.com',
      noteLabel: 'Ghi chú',
      notePlaceholder: 'Thêm ghi chú về yêu cầu demo...',
      submitButton: 'Đăng ký Demo',
      submittingButton: 'Đang gửi...',
      successTitle: 'Đăng ký thành công!',
      successMessage: 'Chúng tôi đã nhận được yêu cầu demo của bạn. Đội ngũ sẽ liên hệ với bạn sớm nhất.',
      scheduleAnother: 'Đăng ký demo khác',
      terms: 'Bằng cách đăng ký, bạn đồng ý với các điều khoản sử dụng của chúng tôi',
      invalidEmail: 'Email không hợp lệ',
      emailRequired: 'Vui lòng nhập email',
      close: 'Đóng'
    }
  }
}

export default function DemoSchedulePopup({ isOpen, onClose, language }: DemoSchedulePopupProps) {
  const [formData, setFormData] = useState({
    email: '',
    note: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const t = translations[language].demoPopup

  // URL của Google Apps Script Web App (bạn cần thay thế bằng URL thực tế)
  // const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Kiểm tra email hợp lệ
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error(t.invalidEmail)
      }

      if (!formData.email.trim()) {
        throw new Error(t.emailRequired)
      }

      // Tạo timestamp hiện tại
      const currentTime = new Date().toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US', {
        timeZone: language === 'vi' ? 'Asia/Ho_Chi_Minh' : 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
      const GOOGLE_SCRIPT_URL =
        'https://script.google.com/macros/s/AKfycbyH8jqELNh2UD0S9V4x3WtpzhcL4ts8CF6YhuVSIWOcNBgARC6edd7N3-foFuVU1X04/exec'
      //   Gửi data đến Google Sheets (trong môi trường thực tế)
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
          email: formData.email,
          time: currentTime,
          sent: 'Chưa',
          note: formData.note
        })
      })

      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      //   console.log('Demo request data:', {
      //     email: formData.email,
      //     time: currentTime,
      //     sent: 'Pending',
      //     note: formData.note
      //   })

      setSubmitted(true)
      setFormData({ email: '', note: '' })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSubmitted(false)
    setError('')
  }

  const handleClose = () => {
    setSubmitted(false)
    setError('')
    setFormData({ email: '', note: '' })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50'>
      <div className='bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto'>
        {/* Header with close button */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-xl font-bold text-blue-800'>{t.title}</h2>
          <button
            onClick={handleClose}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
            aria-label={t.close}
          >
            <X className='w-5 h-5 text-gray-500' />
          </button>
        </div>

        <div className='p-6'>
          {submitted ? (
            /* Success State */
            <div className='text-center space-y-6'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto'>
                <CheckCircle className='w-8 h-8 text-green-600' />
              </div>
              <div>
                <h3 className='text-xl font-bold text-blue-800 mb-2'>{t.successTitle}</h3>
                <p className='text-gray-600'>{t.successMessage}</p>
              </div>
              <div className='flex flex-col sm:flex-row gap-3'>
                <button
                  onClick={resetForm}
                  className='flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors'
                >
                  {t.scheduleAnother}
                </button>
                <button
                  onClick={handleClose}
                  className='flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors'
                >
                  {t.close}
                </button>
              </div>
            </div>
          ) : (
            /* Form State */
            <>
              <div className='text-center mb-6'>
                <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <Calendar className='w-6 h-6 text-blue-600' />
                </div>
                <p className='text-gray-600'>{t.subtitle}</p>
              </div>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                    {t.emailLabel}
                  </label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                    <input
                      type='email'
                      id='email'
                      name='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                      placeholder={t.emailPlaceholder}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor='note' className='block text-sm font-medium text-gray-700 mb-2'>
                    {t.noteLabel}
                  </label>
                  <textarea
                    id='note'
                    name='note'
                    value={formData.note}
                    onChange={handleInputChange}
                    rows={3}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none'
                    placeholder={t.notePlaceholder}
                  />
                </div>

                {error && (
                  <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
                    <p className='text-red-600 text-sm'>{error}</p>
                  </div>
                )}

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isSubmitting ? (
                    <div className='flex items-center justify-center'>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
                      {t.submittingButton}
                    </div>
                  ) : (
                    t.submitButton
                  )}
                </button>

                <p className='text-xs text-gray-500 text-center mt-4'>{t.terms}</p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
