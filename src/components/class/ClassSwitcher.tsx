import React from 'react'
import { Check, ChevronsUpDown, GalleryVerticalEnd } from 'lucide-react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from '../ui/dropdown-menu'
import { useNavigate } from 'react-router-dom'
import { GeneralClassInfo } from '../../store/slices/classSlice'

export function ClassSwitcher({
  classes,
  currentClass
}: {
  classes: GeneralClassInfo[]
  currentClass: GeneralClassInfo
}) {
  const [selectedClass, setSelectedClass] = React.useState(currentClass)
  const navigate = useNavigate()

  const handleClassChange = (classItem: GeneralClassInfo) => {
    setSelectedClass(classItem)
    navigate(`/class/${classItem.classId}`)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                <GalleryVerticalEnd className='size-4' />
              </div>
              <div className='flex flex-col gap-0.5 leading-none'>
                <span className='font-semibold'>Current Class</span>
                <span className=''>{selectedClass.name}</span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-[--radix-dropdown-menu-trigger-width]' align='start'>
            {classes.map((classItem) => (
              <DropdownMenuItem key={classItem.classId} onSelect={() => handleClassChange(classItem)}>
                {classItem.name} {classItem.classId === selectedClass.classId && <Check className='ml-auto' />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
