import { useSelector } from 'react-redux'
import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { NotificationPopover } from '../elements/NotificationPopover'
import { UserPopover } from '../elements/ProfilePopover'
import { RootState } from '../../../store'

export const Header = () => {
  // Retrieve the current user from Redux store
  const currentUser = useSelector((state: RootState) => state.auth.user)

  return (
    <header className='flex items-center justify-between px-4 py-2 border-b border-blue-500 bg-white'>
      {/* Left Side: Logo and Title */}
      <div className='flex items-center gap-2'>
        <BookOpen className='h-6 w-6 text-purple-600' /> {/* Random icon; you can change later */}
        <span className='text-lg font-semibold text-blue-800'>Title</span>
      </div>

      {/* Center: Navigation Links */}
      <nav className='flex gap-6'>
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
      <div className='flex items-center gap-3'>
        <NotificationPopover />
        {currentUser && <UserPopover user={currentUser} />}
      </div>
    </header>
  )
}
