import { FileText, FolderOpen, LucideIcon, SquareArrowLeft, Users } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
} from '../../ui/sidebar'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { useParams } from 'react-router-dom'
import { ClassSwitcher } from '../../class/ClassSwitcher'

interface MenuItem {
  id: string
  icon: LucideIcon
  labelKey: string
  className?: string
  path: string
}

const menuItems: MenuItem[] = [
  // {
  //   id: 'news',
  //   icon: MessageSquare,
  //   labelKey: 'labels.news',
  //   path: 'news'
  // },
  {
    id: 'members',
    icon: Users,
    labelKey: 'labels.members',
    path: 'members'
  },
  {
    id: 'tests',
    icon: FileText,
    labelKey: 'labels.tests',
    path: 'tests'
  },
  {
    id: 'materials',
    icon: FolderOpen,
    labelKey: 'labels.materials',
    path: 'materials'
  }
]

const exitClassItem: MenuItem = {
  id: 'exitClass',
  icon: SquareArrowLeft,
  labelKey: 'labels.exitClass',
  className: 'text-red-600 hover:text-red-700 hover:bg-red-50',
  path: '#'
}

export const ClassLeftSideBar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { classId } = useParams()
  const classes = useSelector((state: RootState) => state.class.generalClass)
  const currentClass = classes?.find((c) => c.classId === classId)
  const activeSection = location.pathname.split('/').pop() || 'tests'

  if (!currentClass || !classes) {
    return null
  }

  const handleExitClass = () => {
    navigate('/class')
  }

  return (
    <Sidebar className='border-r-0 w-[240px] h-[calc(100vh-64px)] flex flex-col' {...props}>
      <SidebarHeader className='flex-shrink-0'>
        <ClassSwitcher classes={classes} currentClass={currentClass} />
      </SidebarHeader>

      <SidebarContent className='flex-1 overflow-y-auto'>
        <SidebarGroup className='flex-shrink-0'>
          <div className='px-4 py-3'>
            <h2 className='text-lg font-medium'>{currentClass.name}</h2>
            <p className='text-sm text-gray-600'>
              {t('labels.classCode')}: {currentClass.code}
            </p>
          </div>
        </SidebarGroup>

        {/* Menu Items */}
        <SidebarGroup className='flex-1'>
          <SidebarGroupLabel>{t('labels.menu')}</SidebarGroupLabel>
          <div className='space-y-1'>
            {menuItems.map((item) => (
              <div key={item.id} className='list-none'>
                <SidebarMenuButton asChild isActive={activeSection === item.id}>
                  <Link
                    to={`/class/${classId}/${item.path}`}
                    className='flex items-center gap-3 px-3 py-2 rounded-md no-underline'
                  >
                    <item.icon size={20} />
                    <span>{t(item.labelKey)}</span>
                  </Link>
                </SidebarMenuButton>
              </div>
            ))}
          </div>
        </SidebarGroup>

        {/* Exit Class */}
        <SidebarGroup className='flex-shrink-0 mt-auto'>
          <div className='list-none'>
            <SidebarMenuButton
              onClick={handleExitClass}
              className={`${exitClassItem.className} flex items-center gap-3 px-3 py-2 rounded-md`}
            >
              <exitClassItem.icon size={20} />
              <span>{t(exitClassItem.labelKey)}</span>
            </SidebarMenuButton>
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
