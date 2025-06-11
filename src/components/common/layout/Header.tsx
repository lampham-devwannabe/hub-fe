import { useDispatch, useSelector } from 'react-redux'
import { BookOpen, GlobeIcon, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { NotificationPopover } from '../elements/NotificationPopover'
import { UserPopover } from '../elements/ProfilePopover'
import { AppDispatch, RootState } from '../../../store'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu'
import { Progress } from '../../ui/progress'
import { setLanguage } from '../../../store/slices/localeSlice'
import { useTranslation } from 'react-i18next'

export const Header = () => {
  // Retrieve the current user and language from Redux store
  const currentUser = useSelector((state: RootState) => state.auth.user)
  const language = useSelector((state: RootState) => state.locale.language)
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()

  // Get student count from teacher user data
  const currentStudentCount = currentUser?.role === 'TEACHER' ? currentUser.studentCount : 0

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
        <BookOpen className='h-6 w-6 text-purple-600' /> {/* Random icon; you can change later */}
        <span className='text-lg font-semibold text-blue-800'>Title</span>
      </div>

      {/* Center: Navigation Links */}
      <nav className='flex gap-20'>
        <Link to='/general' className='text-gray-600 hover:text-blue-600 transition-colors'>
          General
        </Link>
        <Link to='/class' className='text-gray-600 hover:text-blue-600 transition-colors'>
          Class
        </Link>
        <Link to='/instruction' className='text-gray-600 hover:text-blue-600 transition-colors'>
          Instruction
        </Link>
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
