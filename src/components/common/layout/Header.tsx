import { useDispatch, useSelector } from 'react-redux'
import { BookOpen, GlobeIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { NotificationPopover } from '../elements/NotificationPopover'
import { UserPopover } from '../elements/ProfilePopover'
import { AppDispatch, RootState } from '../../../store'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu'
import { setLanguage } from '../../../store/slices/localeSlice'
import { useTranslation } from 'react-i18next'

export const Header = () => {
  // Retrieve the current user and language from Redux store
  const currentUser = useSelector((state: RootState) => state.auth.user)
  const language = useSelector((state: RootState) => state.locale.language)
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()

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

      {/* Right Side: Notification and User Popovers */}
      <div className='flex items-center gap-8'>
        <NotificationPopover />
        <DropdownMenu >
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
    </header>
  )
}
