import {
  Mail,
  CheckCircle,
  Star,
  Rocket,
  ArrowRight,
  Award,
  BarChart3,
  Clock,
  Globe,
  Menu,
  Play,
  Shield,
  Users,
  X
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import DemoSchedulePopup from '../../components/DemoSchedulePopup'

type Language = 'en' | 'vi'

interface Translations {
  [key: string]: {
    features: {
      title: string
      subtitle: string
      aiGrading: {
        title: string
        description: string
      }
      liveProgress: {
        title: string
        description: string
      }
      testBuilder: {
        title: string
        description: string
      }
      speakingTest: {
        title: string
        description: string
      }
      notifications: {
        title: string
        description: string
      }
      multiLanguage: {
        title: string
        description: string
      }
    }
    plans: {
      title: string
      subtitle: string
      free: {
        name: string
        price: string
        period: string
        description: string
        perks: string[]
      }
      standard: {
        name: string
        price: string
        period: string
        description: string
        perks: string[]
      }
      advanced: {
        name: string
        price: string
        period: string
        description: string
        perks: string[]
      }
    }
    nav: {
      features: string
      pricing: string
      reviews: string
      contact: string
      signIn: string
      signUp: string
    }
    hero: {
      title: string
      subtitle: string
      joinNow: string
      watchDemo: string
    }
  }
}

const translations: Translations = {
  en: {
    features: {
      title: 'Features Teachers Love',
      subtitle: 'Everything you need to deliver exceptional IELTS instruction and track student success.',
      aiGrading: {
        title: 'AI Essay Grading',
        description: 'Instant feedback and band score prediction for Writing Task 1 & 2 with detailed rubric analysis.'
      },
      liveProgress: {
        title: 'Live Student Progress',
        description: 'Real-time analytics dashboard to monitor individual and class-wide performance trends.'
      },
      testBuilder: {
        title: 'Drag-and-Drop Test Builder',
        description: 'Create custom IELTS tests with our intuitive interface and extensive question bank.'
      },
      speakingTest: {
        title: 'Speaking Test Management',
        description: 'Record, evaluate and provide detailed feedback on student speaking performances.'
      },
      notifications: {
        title: 'Smart Notifications',
        description: 'Automated reminders for assignments, deadlines, and progress reports.'
      },
      multiLanguage: {
        title: 'Multi-Language Support',
        description: 'Platform available in multiple languages to serve diverse teaching environments.'
      }
    },
    plans: {
      title: 'Choose Your Perfect Plan',
      subtitle: 'Start free and scale as you grow. All plans include our core IELTS teaching tools.',
      free: {
        name: 'Free',
        price: '0 VND',
        period: 'forever',
        description: 'Perfect for individual teachers getting started',
        perks: [
          'Up to 10 students',
          'Access to basic test templates',
          'Limited AI-powered grading',
          'Community support'
        ]
      },
      standard: {
        name: 'Standard',
        price: '100,000 VND',
        period: 'per month',
        description: 'Ideal for growing classrooms and personal tutors',
        perks: [
          'Up to 200 students',
          'AI-powered writing Task 1 feedback',
          'Student analytics dashboard',
          'Custom branding'
        ]
      },
      advanced: {
        name: 'Advanced',
        price: '200,000 VND',
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
        ]
      }
    },
    nav: {
      features: 'Features',
      pricing: 'Pricing',
      reviews: 'Reviews',
      contact: 'Contact',
      signIn: 'Sign In',
      signUp: 'Sign Up'
    },
    hero: {
      title: 'Supercharge your IELTS Teaching with',
      subtitle:
        'The AI-powered platform that helps teachers track, grade, and accelerate student performance. Join thousands of educators worldwide who trust IeltsHub.',
      joinNow: 'Join Us Now!',
      watchDemo: 'Watch Demo'
    }
  },
  vi: {
    features: {
      title: 'Tính Năng Được Giáo Viên Yêu Thích',
      subtitle: 'Mọi thứ bạn cần để cung cấp hướng dẫn IELTS xuất sắc và theo dõi thành công của học viên.',
      aiGrading: {
        title: 'Chấm Điểm Bài Luận AI',
        description: 'Phản hồi tức thì và dự đoán điểm cho Writing Task 1 & 2 với phân tích rubric chi tiết.'
      },
      liveProgress: {
        title: 'Theo Dõi Tiến Độ Học Viên',
        description: 'Bảng điều khiển phân tích thời gian thực để theo dõi xu hướng hiệu suất cá nhân và toàn lớp.'
      },
      testBuilder: {
        title: 'Tạo Bài Kiểm Tra Kéo Thả',
        description: 'Tạo bài kiểm tra IELTS tùy chỉnh với giao diện trực quan và ngân hàng câu hỏi phong phú.'
      },
      speakingTest: {
        title: 'Quản Lý Bài Thi Nói',
        description: 'Ghi âm, đánh giá và cung cấp phản hồi chi tiết về hiệu suất nói của học viên.'
      },
      notifications: {
        title: 'Thông Báo Thông Minh',
        description: 'Nhắc nhở tự động cho bài tập, thời hạn và báo cáo tiến độ.'
      },
      multiLanguage: {
        title: 'Hỗ Trợ Đa Ngôn Ngữ',
        description: 'Nền tảng có sẵn bằng nhiều ngôn ngữ để phục vụ môi trường giảng dạy đa dạng.'
      }
    },
    plans: {
      title: 'Chọn Gói Phù Hợp Với Bạn',
      subtitle:
        'Bắt đầu miễn phí và mở rộng khi phát triển. Tất cả các gói đều bao gồm công cụ giảng dạy IELTS cốt lõi.',
      free: {
        name: 'Miễn Phí',
        price: '0 VND',
        period: 'vĩnh viễn',
        description: 'Hoàn hảo cho giáo viên cá nhân mới bắt đầu',
        perks: ['Tối đa 10 học viên', 'Truy cập mẫu bài kiểm tra cơ bản', 'Chấm điểm AI giới hạn', 'Hỗ trợ cộng đồng']
      },
      standard: {
        name: 'Tiêu Chuẩn',
        price: '100,000 VND',
        period: 'mỗi tháng',
        description: 'Lý tưởng cho lớp học đang phát triển và gia sư cá nhân',
        perks: [
          'Tối đa 200 học viên',
          'Phản hồi Writing Task 2 bằng AI',
          'Bảng điều khiển phân tích học viên',
          'Tùy chỉnh thương hiệu'
        ]
      },
      advanced: {
        name: 'Nâng Cao',
        price: '200,000 VND',
        period: 'mỗi tháng',
        description: 'Dành cho gia sư và tổ chức chuyên nghiệp',
        perks: [
          'Tối đa 400 học viên',
          'Truy cập đầy đủ tài nguyên cá nhân',
          'Truy cập tất cả chấm điểm AI',
          'Phân tích & báo cáo nâng cao',
          'Hỗ trợ ưu tiên',
          'Công cụ hợp tác nhóm',
          'Truy cập API',
          'Thông báo email thông minh'
        ]
      }
    },
    nav: {
      features: 'Tính Năng',
      pricing: 'Giá Cả',
      reviews: 'Đánh Giá',
      contact: 'Liên Hệ',
      signIn: 'Đăng Nhập',
      signUp: 'Đăng Ký'
    },
    hero: {
      title: 'Nâng Cao Chất Lượng Giảng Dạy IELTS với',
      subtitle:
        'Nền tảng tích hợp AI giúp giáo viên theo dõi, chấm điểm và thúc đẩy hiệu suất học viên. Tham gia cùng hàng trăm nhà giáo dục tin tưởng IeltsHub.',
      joinNow: 'Tham Gia Ngay!',
      watchDemo: 'Xem Demo'
    }
  }
}

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'IELTS Instructor, Language Academy',
    content:
      "IeltsHub has transformed how I track my students' progress. The AI grading is incredibly accurate and saves me hours every week.",
    avatar: 'SC'
  },
  {
    name: 'Michael Rodriguez',
    role: 'Director, Global English Center',
    content:
      "We've seen a 40% improvement in student pass rates since implementing IeltsHub. The analytics help us identify exactly where students need support.",
    avatar: 'MR'
  },
  {
    name: 'Emma Thompson',
    role: 'Freelance IELTS Tutor',
    content:
      'As a solo tutor, IeltsHub gives me the tools of a large institution. My students love the instant feedback feature.',
    avatar: 'ET'
  }
]

const stats = [
  { number: '100+', label: 'Teachers Worldwide' },
  { number: '1000+', label: 'Students Assessed' },
  { number: '96%', label: 'Accuracy Rate' },
  { number: '24/7', label: 'Platform Uptime' }
]

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [language, setLanguage] = useState<Language>('en')
  const [isDemoPopupOpen, setIsDemoPopupOpen] = useState(false)
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const t = translations[language]

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      {/* Header */}
      <header className='bg-white shadow-md sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <div className='w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-xl'>IH</span>
              </div>
              <span className='text-2xl font-bold text-blue-800'>IeltsHub</span>
            </div>

            {/* Desktop Navigation */}
            <nav className='hidden md:flex items-center space-x-8'>
              <a href='#features' className='text-gray-700 hover:text-blue-600 transition-colors'>
                {t.nav.features}
              </a>
              <a href='#pricing' className='text-gray-700 hover:text-blue-600 transition-colors'>
                {t.nav.pricing}
              </a>
              <a href='#testimonials' className='text-gray-700 hover:text-blue-600 transition-colors'>
                {t.nav.reviews}
              </a>
              <a href='#contact' className='text-gray-700 hover:text-blue-600 transition-colors'>
                {t.nav.contact}
              </a>
              <button
                onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
                className='text-gray-700 hover:text-blue-600 transition-colors'
              >
                {language === 'en' ? 'VI' : 'EN'}
              </button>
              {isAuthenticated ? (
                <>
                  <Link
                    to='/class'
                    className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-md font-semibold'
                  >
                    Enter Class
                  </Link>
                  {user?.role === 'TEACHER' && (
                    <Link
                      to='/subscription'
                      className='bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors text-md font-semibold'
                    >
                      Subscription
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link
                    to='/login'
                    className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-md font-semibold'
                  >
                    {t.nav.signIn}
                  </Link>
                  <Link
                    to='/register'
                    className='bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors text-md font-semibold'
                  >
                    {t.nav.signUp}
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button className='md:hidden p-2' onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className='md:hidden mt-4 pb-4 border-t border-gray-200'>
              <div className='flex flex-col space-y-4 mt-4'>
                <a href='#features' className='text-gray-700 hover:text-blue-600'>
                  {t.nav.features}
                </a>
                <a href='#pricing' className='text-gray-700 hover:text-blue-600'>
                  {t.nav.pricing}
                </a>
                <a href='#testimonials' className='text-gray-700 hover:text-blue-600'>
                  {t.nav.reviews}
                </a>
                <a href='#contact' className='text-gray-700 hover:text-blue-600'>
                  {t.nav.contact}
                </a>
                <button
                  onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
                  className='text-gray-700 hover:text-blue-600'
                >
                  {language === 'en' ? 'VI' : 'EN'}
                </button>
                <div className='flex flex-col space-y-2 pt-4 border-t border-gray-200'>
                  {isAuthenticated ? (
                    <>
                      <Link
                        to='/class'
                        className='bg-blue-600 text-white px-6 py-3 rounded-lg text-center text-lg font-semibold'
                      >
                        Enter Class
                      </Link>
                      {user?.role === 'TEACHER' && (
                        <Link
                          to='/subscription'
                          className='bg-blue-800 text-white px-6 py-3 rounded-lg text-center text-lg font-semibold'
                        >
                          Subscription
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      <Link
                        to='/login'
                        className='bg-blue-600 text-white px-6 py-3 rounded-lg text-center text-lg font-semibold'
                      >
                        {t.nav.signIn}
                      </Link>
                      <Link
                        to='/register'
                        className='bg-blue-800 text-white px-6 py-3 rounded-lg text-center text-lg font-semibold'
                      >
                        {t.nav.signUp}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      <div className='space-y-20 px-6 py-12 max-w-7xl mx-auto'>
        {/* Hero Section */}
        <section className='text-center space-y-8'>
          <div className='space-y-4'>
            <h3 className='text-6xl font-bold text-blue-800 leading-tight'>
              {t.hero.title}
              <span className='text-blue-600'> IeltsHub</span>
            </h3>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>{t.hero.subtitle}</p>
          </div>

          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            {isAuthenticated ? (
              <Link
                to='/class'
                className='bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2'
              >
                Enter Class
                <ArrowRight className='w-5 h-5' />
              </Link>
            ) : (
              <Link
                to='/login'
                className='bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2'
              >
                {t.hero.joinNow}
                <ArrowRight className='w-5 h-5' />
              </Link>
            )}
            <button
              onClick={() => setIsDemoPopupOpen(true)}
              className='border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2'
            >
              <Play className='w-5 h-5' /> {t.hero.watchDemo}
            </button>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 mt-16'>
            {stats.map((stat, idx) => (
              <div key={idx} className='text-center'>
                <div className='text-3xl font-bold text-blue-800'>{stat.number}</div>
                <div className='text-gray-600 text-sm'>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id='features' className='grid md:grid-cols-2 gap-16 items-center'>
          <div className='space-y-8'>
            <div className='space-y-4'>
              <h2 className='text-4xl font-bold text-blue-800'>{t.features.title}</h2>
              <p className='text-lg text-gray-600'>{t.features.subtitle}</p>
            </div>
            <div className='grid gap-6'>
              {[
                { icon: <Award className='w-6 h-6 text-blue-600' />, ...t.features.aiGrading },
                { icon: <BarChart3 className='w-6 h-6 text-green-600' />, ...t.features.liveProgress },
                { icon: <Clock className='w-6 h-6 text-purple-600' />, ...t.features.testBuilder },
                { icon: <Users className='w-6 h-6 text-orange-600' />, ...t.features.speakingTest },
                { icon: <Shield className='w-6 h-6 text-red-600' />, ...t.features.notifications },
                { icon: <Globe className='w-6 h-6 text-indigo-600' />, ...t.features.multiLanguage }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className='bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100'
                >
                  <div className='flex items-start gap-4'>
                    <div className='flex-shrink-0 p-2 bg-gray-50 rounded-lg'>{feature.icon}</div>
                    <div>
                      <h3 className='font-semibold text-xl text-blue-900 mb-2'>{feature.title}</h3>
                      <p className='text-gray-600 text-sm leading-relaxed'>{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='relative'>
            <div className='bg-white p-6 rounded-2xl shadow-xl'>
              <iframe
                className='w-full aspect-video rounded-xl border border-gray-200'
                src='https://www.youtube.com/embed/dQw4w9WgXcQ'
                title='Platform Overview'
                allowFullScreen
              />
            </div>
            <div className='absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-xl shadow-lg'>
              <div className='text-sm font-semibold'>Live Demo Available</div>
              <div className='text-xs opacity-90'>Schedule your personal walkthrough</div>
            </div>
          </div>
        </section>

        {/* Advanced Plan Key Feature */}
        <section className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 max-w-3xl mx-auto'>
          <div className='flex items-center gap-6'>
            <div className='p-4 bg-blue-100 rounded-xl'>
              <Mail className='w-10 h-10 text-blue-600' />
            </div>
            <div>
              <h3 className='text-xl font-semibold text-blue-800 mb-2'>
                Advanced Plan Exclusive: Smart Email Notifications
              </h3>
              <p className='text-gray-600'>
                Keep students and parents informed with automated email updates about progress, upcoming tests, and
                important announcements.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id='pricing' className='space-y-12'>
          <div className='text-center space-y-4'>
            <h2 className='text-4xl font-bold text-blue-800'>{t.plans.title}</h2>
            <p className='text-lg text-gray-600 max-w-xl mx-auto'>{t.plans.subtitle}</p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            {[
              { ...t.plans.free, icon: <CheckCircle className='w-8 h-8 text-green-500' />, highlight: false },
              { ...t.plans.standard, icon: <Star className='w-8 h-8 text-yellow-500' />, highlight: false },
              { ...t.plans.advanced, icon: <Rocket className='w-8 h-8 text-blue-500' />, highlight: true }
            ].map((plan, idx) => (
              <div
                key={idx}
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
                  <div className='flex items-center gap-3'>
                    {plan.icon}
                    <div>
                      <h3 className='text-2xl font-bold text-blue-800'>{plan.name}</h3>
                      <p className='text-sm text-gray-600'>{plan.description}</p>
                    </div>
                  </div>

                  <div className='text-center'>
                    <div className='flex items-baseline justify-center gap-1'>
                      <span className='text-4xl font-bold text-blue-800'>{plan.price}</span>
                      <span className='text-gray-600'>/{plan.period}</span>
                    </div>
                  </div>

                  <ul className='space-y-3'>
                    {plan.perks.map((perk, i) => (
                      <li key={i} className='flex items-start gap-3 text-sm text-gray-700'>
                        <CheckCircle className='w-5 h-5 text-green-500 flex-shrink-0 mt-0.5' />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={plan.highlight ? '/login?plan=advanced' : '/login?plan=free'}
                    className={`w-full py-4 px-8 rounded-lg font-semibold text-lg transition-colors ${
                      plan.highlight
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {plan.highlight ? 'Start Now' : 'Start Free'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section id='testimonials' className='space-y-12 bg-white rounded-3xl p-12 shadow-lg'>
          <div className='text-center space-y-4'>
            <h2 className='text-4xl font-bold text-blue-800'>Trusted by Educators Worldwide</h2>
            <p className='text-lg text-gray-600'>See what teachers are saying about IeltsHub</p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className='bg-gray-50 p-6 rounded-xl border border-gray-200'>
                <div className='space-y-4'>
                  <div className='flex gap-1'>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className='w-5 h-5 fill-yellow-400 text-yellow-400' />
                    ))}
                  </div>
                  <p className='text-gray-700 italic'>"{testimonial.content}"</p>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold'>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className='font-semibold text-gray-900'>{testimonial.name}</div>
                      <div className='text-sm text-gray-600'>{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section
          id='contact'
          className='bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-12 text-center text-white space-y-6'
        >
          <h2 className='text-3xl font-bold'>Ready to Transform Your IELTS Teaching?</h2>
          <p className='text-xl opacity-90 max-w-2xl mx-auto'>
            Join thousands of educators who have already revolutionized their classrooms with IeltsHub.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button className='bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors'>
              Start Free Trial
            </button>
            <button
              onClick={() =>
                window.open(
                  'https://docs.google.com/forms/d/16wFHcvd4ahbNloYkcPfL7gSYQMEHN-lIYuTWAFZvIkU/viewform?edit_requested=true',
                  '_blank'
                )
              }
              className='border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center gap-2 justify-center'
            >
              <Mail className='w-5 h-5' />
              Schedule Demo
            </button>
          </div>
          <p className='text-sm opacity-75'>Questions? Email us at contact@ieltshub.ai or call +1 (555) 123-4567</p>
        </section>

        <footer className='text-center text-sm text-gray-500 pt-10 border-t border-gray-200'>
          <div className='space-y-4'>
            <div className='flex justify-center space-x-8'>
              <a href='#' className='hover:text-blue-600'>
                Privacy Policy
              </a>
              <a href='#' className='hover:text-blue-600'>
                Terms of Service
              </a>
              <a href='#' className='hover:text-blue-600'>
                Support
              </a>
              <a href='#' className='hover:text-blue-600'>
                Blog
              </a>
            </div>
            <p>© 2025 IeltsHub. Built for teachers, with love. 🚀</p>
          </div>
        </footer>
      </div>

      {/* Demo Schedule Popup */}
      <DemoSchedulePopup isOpen={isDemoPopupOpen} onClose={() => setIsDemoPopupOpen(false)} language={language} />
    </div>
  )
}
