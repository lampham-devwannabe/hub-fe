import { useDispatch, useSelector } from 'react-redux'
import { GlobeIcon, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { NotificationPopover } from '../elements/NotificationPopover'
import { UserPopover } from '../elements/ProfilePopover'
import { AppDispatch, RootState } from '../../../store'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu'
import { Progress } from '../../ui/progress'
import { setLanguage } from '../../../store/slices/localeSlice'
import { useTranslation } from 'react-i18next'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '../../ui/navigation-menu'

export const Header = () => {
  // Retrieve the current user and language from Redux store
  const currentUser = useSelector((state: RootState) => state.auth.user)
  const language = useSelector((state: RootState) => state.locale.language)
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()

  // Get student count from teacher user data
  const currentStudentCount = currentUser?.role === 'TEACHER' ? currentUser.studentCount : 0

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

  const getStudentLimit = (priceClass: string | number) => {
    const priceClassStr = String(priceClass)?.toLowerCase()
    switch (priceClassStr) {
      case 'free':
        return 80
      case 'standard':
        return 150
      case 'advanced':
        return 300
      default:
        return 80
    }
  }

  const renderTeacherInfo = () => {
    if (!currentUser || currentUser.role !== 'TEACHER') return null

    const limit = getStudentLimit(currentUser.priceClass)
    const progressValue = (currentStudentCount / limit) * 100
    const isFree = String(currentUser.priceClass)?.toLowerCase() === 'free'

    return (
      <div className='flex items-center gap-3'>
        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-2'>
            <Users className='w-4 h-4 text-blue-600' />
            <span className='text-sm font-medium text-gray-700'>
              {currentStudentCount}/{limit} students
            </span>
            <span className='text-xs text-blue-600 font-medium'>{currentUser.priceClass}</span>
          </div>
          <div className='flex items-center gap-2'>
            <Progress value={progressValue} className='w-24 h-1.5' />
            {isFree && (
              <Link to='/subscription' className='text-xs text-purple-600 hover:text-purple-800 font-medium underline'>
                Upgrade
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <header className='flex items-center justify-between px-4 py-2 border-b border-gray-300 bg-white'>
      {/* Left Side: Logo and Title */}
      <div className='flex items-center gap-2'>
        <img
          src='https://res.cloudinary.com/du3922jvf/image/upload/v1750825320/53a82377-9484-4c08-b9b9-baca20617a2f.png'
          alt='IeltsHub Logo'
          className='h-6 w-6 rounded'
        />
        <span className='text-lg font-semibold text-blue-800'>IETLSHUB</span>
      </div>

      {/* Center: Navigation Links */}
      <nav className='flex gap-20 items-center'>
        <Link to='/class' className='text-gray-600 hover:text-blue-600 transition-colors'>
          Class
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className='text-gray-600 hover:text-blue-600 transition-colors bg-transparent h-auto p-0 font-normal text-base'>
                Instructions
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
                        <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>{item.description}</p>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      {/* Right Side: Teacher Info, Notification and User Popovers */}
      <div className='flex items-center gap-6'>
        {renderTeacherInfo()}

        <div className='flex items-center gap-4'>
          <NotificationPopover />

          <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center gap-2 px-3 py-2 bg-[#f3f0f0] rounded-md hover:bg-accent'>
              <GlobeIcon className='w-4 h-4' />
              <span>{language === 'en' ? 'en' : 'vi'}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => dispatch(setLanguage('en'))}>{t('labels.english')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => dispatch(setLanguage('vi'))}>{t('labels.vietnamese')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {currentUser && <UserPopover user={currentUser} />}
        </div>
      </div>
    </header>
  )
}
