import { Users, DollarSign } from 'lucide-react'
import { Button } from '../../ui/button'
import { useNavigate, useLocation } from 'react-router-dom'

interface AdminSidebarProps {
  className?: string
}

export const AdminSidebar = ({ className = '' }: AdminSidebarProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      label: 'User Management',
      icon: Users,
      path: '/admin/dashboard',
      isActive: location.pathname === '/admin/users'
    },
    {
      label: 'Subscriptions',
      icon: DollarSign,
      path: '/admin/subscriptions',
      isActive: location.pathname === '/admin/subscriptions'
    }
  ]

  return (
    <div className={`w-64 bg-white shadow-sm border-r ${className}`}>
      <div className='p-6'>
        <h2 className='text-xl font-semibold text-gray-900'>Admin Panel</h2>
      </div>
      <nav className='mt-6'>
        <div className='px-3'>
          <div className='space-y-1'>
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.path}
                  variant='ghost'
                  className={`w-full justify-start ${
                    item.isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className='mr-3 h-4 w-4' />
                  {item.label}
                </Button>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
