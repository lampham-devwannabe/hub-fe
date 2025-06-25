import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Menu, X } from 'lucide-react'
import { RootState } from '../../../store'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '../../ui/navigation-menu'

interface Translations {
  nav: {
    features: string
    pricing: string
    reviews: string
    contact: string
    instructions: string
    signIn: string
    signUp: string
  }
}

interface HeaderProps {
  showInstructions?: boolean
  language?: 'en' | 'vi'
  onLanguageChange?: (lang: 'en' | 'vi') => void
  translations?: Translations
}

export default function Header({
  showInstructions = true,
  language = 'en',
  onLanguageChange,
  translations
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  const defaultTranslations = {
    nav: {
      features: language === 'en' ? 'Features' : 'Tính Năng',
      pricing: language === 'en' ? 'Pricing' : 'Giá Cả',
      reviews: language === 'en' ? 'Reviews' : 'Đánh Giá',
      contact: language === 'en' ? 'Contact' : 'Liên Hệ',
      instructions: language === 'en' ? 'Instructions' : 'Hướng Dẫn',
      signIn: language === 'en' ? 'Sign In' : 'Đăng Nhập',
      signUp: language === 'en' ? 'Sign Up' : 'Đăng Ký'
    }
  }

  const t = translations || defaultTranslations

  const instructionItems = [
    {
      title: language === 'en' ? 'For Teachers' : 'Dành cho Giáo viên',
      description: language === 'en' ? 'Complete guide for educators' : 'Hướng dẫn đầy đủ cho giáo viên',
      href: '/instructions/teacher'
    },
    {
      title: language === 'en' ? 'For Students' : 'Dành cho Học viên',
      description: language === 'en' ? 'Step-by-step student guide' : 'Hướng dẫn từng bước cho học viên',
      href: '/instructions/student'
    },
    {
      title: language === 'en' ? 'IELTS Tips' : 'Mẹo IELTS',
      description: language === 'en' ? 'Expert tips and strategies' : 'Mẹo và chiến lược từ chuyên gia',
      href: '/instructions/tips'
    }
  ]

  return (
    <header className='bg-white shadow-md sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-6 py-4'>
        <div className='flex items-center justify-between'>
          <Link to='/' className='flex items-center space-x-2'>
            <img
              src='https://res.cloudinary.com/du3922jvf/image/upload/v1750825895/6e2f7151-126b-4f0d-9e90-e16d71fe0e31.png'
              alt='IeltsHub Logo'
              className='w-16 h-16 rounded-lg'
            />
            <span className='text-2xl font-bold text-blue-800'>IELTSHUB</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-8'>
            <a href='/#features' className='text-gray-700 hover:text-blue-600 transition-colors'>
              {t.nav.features}
            </a>
            <a href='/#pricing' className='text-gray-700 hover:text-blue-600 transition-colors'>
              {t.nav.pricing}
            </a>
            <a href='/#testimonials' className='text-gray-700 hover:text-blue-600 transition-colors'>
              {t.nav.reviews}
            </a>

            {showInstructions && (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className='text-gray-700 hover:text-blue-600 transition-colors bg-transparent h-auto p-0 font-normal text-base'>
                      {t.nav.instructions}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className='grid w-[400px] gap-3 p-4'>
                        {instructionItems.map((item) => (
                          <NavigationMenuLink key={item.href} asChild>
                            <Link
                              to={item.href}
                              className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                            >
                              <div className='text-sm font-medium leading-none'>{item.title}</div>
                              <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            )}

            <a href='/#contact' className='text-gray-700 hover:text-blue-600 transition-colors'>
              {t.nav.contact}
            </a>

            {onLanguageChange && (
              <button
                onClick={() => onLanguageChange(language === 'en' ? 'vi' : 'en')}
                className='text-gray-700 hover:text-blue-600 transition-colors'
              >
                {language === 'en' ? 'VI' : 'EN'}
              </button>
            )}

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
              <a href='/#features' className='text-gray-700 hover:text-blue-600'>
                {t.nav.features}
              </a>
              <a href='/#pricing' className='text-gray-700 hover:text-blue-600'>
                {t.nav.pricing}
              </a>
              <a href='/#testimonials' className='text-gray-700 hover:text-blue-600'>
                {t.nav.reviews}
              </a>

              {showInstructions && (
                <div className='space-y-2'>
                  <div className='text-gray-700 font-medium'>{t.nav.instructions}</div>
                  <div className='pl-4 space-y-2'>
                    {instructionItems.map((item) => (
                      <Link key={item.href} to={item.href} className='block text-gray-600 hover:text-blue-600 text-sm'>
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <a href='/#contact' className='text-gray-700 hover:text-blue-600'>
                {t.nav.contact}
              </a>

              {onLanguageChange && (
                <button
                  onClick={() => onLanguageChange(language === 'en' ? 'vi' : 'en')}
                  className='text-gray-700 hover:text-blue-600 text-left'
                >
                  {language === 'en' ? 'VI' : 'EN'}
                </button>
              )}

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
  )
}
