import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover'
import { BookOpenText, ChevronDownIcon, HelpCircle, LogOut, User as UserIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Avatar from 'react-avatar'
import { cn } from '../../../lib/utils'
import { User } from '../../../store/slices/authSlice'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'

interface UserPopoverProps {
  user: User
  className?: string
}

export const UserPopover = ({ user, className }: UserPopoverProps) => {
  const { t } = useTranslation()
  const userRole = user.role

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'flex items-center justify-center gap-1 h-10 px-3 rounded-md bg-gray-200 text-gray-700',
            'hover:bg-gray-300',
            className
          )}
        >
          <Avatar name={user.name} size='32' round={true} textSizeRatio={2} />
          <span className='hidden sm:inline'>{user.name.split(' ').slice(-1)[0]}</span>
          <ChevronDownIcon className='w-4 h-4' />
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-80 p-4'>
        <div className='flex items-center gap-4 mb-4'>
          <div className='w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center'>
            <UserIcon className='w-6 h-6 text-gray-600' />
          </div>
          <div className='flex-1'>
            <div className='flex items-center gap-2'>
              <Badge variant='secondary' className='text-xs'>
                {t(`labels.${userRole.toLowerCase()}`)}
              </Badge>
              <span className='text-sm font-semibold'>{user.name}</span>
            </div>
            <p className='text-sm text-gray-500 leading-tight'>{user.email}</p>
          </div>
        </div>

        <div className='border-t my-4' />

        {/* Action list */}
        <div className='space-y-2'>
          <Button variant='ghost' className='w-full justify-start text-gray-800 hover:bg-gray-100'>
            <UserIcon className='w-5 h-5 mr-3 text-gray-500' />
            {t('labels.personalInfo')}
          </Button>
          <Button variant='ghost' className='w-full justify-start text-gray-800 hover:bg-gray-100'>
            <BookOpenText className='w-5 h-5 mr-3 text-gray-500' />
            {t('labels.userGuide')}
          </Button>
          <Button variant='ghost' className='w-full justify-start text-gray-800 hover:bg-gray-100'>
            <HelpCircle className='w-5 h-5 mr-3 text-gray-500' />
            {t('labels.support')}
          </Button>
        </div>

        <div className='border-t my-4' />

        {/* Logout */}
        <Button variant='ghost' className='w-full justify-start text-red-500 hover:bg-red-50'>
          <LogOut className='w-5 h-5 mr-3 text-red-500' />
          {t('labels.logout')}
        </Button>
      </PopoverContent>
    </Popover>
  )
}
