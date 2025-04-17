import { FileText, FolderOpen, LucideIcon, MessageSquare, SquareArrowLeft, Users } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem
} from '../../ui/sidebar'
import { ClassSwitcher } from '../../class/ClassSwitcher'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Link } from 'react-router-dom'

// Define types
const data = {
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1']
}

interface ClassInfo {
  name: string
  code: string
  teacher: string
}

interface MenuItem {
  id: string
  icon: LucideIcon
  labelKey: string
  className?: string
}

const menuItems: MenuItem[] = [
  {
    id: 'news',
    icon: MessageSquare,
    labelKey: 'labels.news'
  },
  {
    id: 'members',
    icon: Users,
    labelKey: 'labels.members'
  },
  {
    id: 'assignments',
    icon: FileText,
    labelKey: 'labels.assignments'
  },
  {
    id: 'materials',
    icon: FolderOpen,
    labelKey: 'labels.materials'
  }
]

const exitClassItem: MenuItem = {
  id: 'exitClass',
  icon: SquareArrowLeft,
  labelKey: 'labels.exitClass',
  className: 'text-red-600 hover:text-red-700 hover:bg-red-50'
}

const classInfo: ClassInfo = {
  name: 'Lớp 12A9',
  code: 'CLNCS',
  teacher: 'Nguyễn Thị Thanh Ngọc'
}

export const ClassLeftSideBar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { t } = useTranslation()
  const [activeSection, setActiveSection] = useState('news')

  return (
    <Sidebar className='border-r-0' {...props}>
      <SidebarHeader>
        <ClassSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className='px-4 py-3'>
            <h2 className='text-lg font-medium'>{classInfo.name}</h2>
            <p className='text-sm text-gray-600'>
              {t('labels.classCode')}: {classInfo.code}
            </p>
          </div>
        </SidebarGroup>

        {/* Teacher Info */}
        <SidebarGroup>
          <SidebarGroupLabel>{t('labels.teacher')}</SidebarGroupLabel>
          <div className='px-4 py-2 flex items-center'>
            <div className='w-8 h-8 bg-gray-300 rounded-full mr-3'></div>
            <span>{classInfo.teacher}</span>
          </div>
        </SidebarGroup>

        {/* Menu Items */}
        <SidebarGroup>
          <SidebarGroupLabel>{t('labels.menu')}</SidebarGroupLabel>
          <div className='space-y-1'>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  isActive={activeSection === item.id}
                  onClick={() => setActiveSection(item.id)}
                >
                  <Link to={'#'}>
                    <item.icon size={20} />
                    <span>{t(item.labelKey)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </div>
        </SidebarGroup>

        {/* Exit Class */}
        <SidebarGroup className='mt-auto'>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => console.log('Exit class')}>
              <Link to={'#'}>
                <exitClassItem.icon size={20} />
                <span>{t(exitClassItem.labelKey)}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
