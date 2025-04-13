import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import { BellIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '../../../lib/utils'

interface Notification {
  id: string
  title: string
  message: string
  time: string
}

interface NotificationPopoverProps {
  className?: string
}

export const NotificationPopover = ({ className }: NotificationPopoverProps) => {
  const { t } = useTranslation()

  // Sample notifications (replace with dynamic data if needed)
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'New Message',
      message: 'You have a new message from John Doe.',
      time: '2 hours ago'
    },
    {
      id: '2',
      title: 'System Update',
      message: 'The system will undergo maintenance tonight.',
      time: '1 day ago'
    },
    {
      id: '3',
      title: 'Profile Updated',
      message: 'Your profile information has been successfully updated.',
      time: '3 days ago'
    }
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full bg-[#f3f0f0] text-gray-700',
            'hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500',
            className
          )}
        >
          <BellIcon className='w-6 h-6' aria-hidden='true' />
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <p className='text-lg font-semibold text-gray-800'>{t('labels.notification.title')}</p>
        <div className='mt-4 space-y-4'>
          {notifications.length === 0 ? (
            <p className='text-sm text-gray-500'>{t('labels.notification.empty', 'No notifications')}</p>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className='border-b border-gray-100 pb-2 last:border-b-0'>
                <h4 className='text-sm font-medium text-gray-700'>{notification.title}</h4>
                <p className='text-sm text-gray-500'>{notification.message}</p>
                <span className='text-xs text-gray-400'>{notification.time}</span>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
