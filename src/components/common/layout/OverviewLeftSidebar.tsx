import { FolderMinus, BookText, ChartColumn } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider
} from '../../ui/sidebar'

const data = {
  items: [
    {
      title: 'Undone Assignments',
      url: '#',
      icon: BookText
    },
    {
      title: 'Unread Resources',
      url: '#',
      icon: FolderMinus
    },
    {
      title: 'Achievements',
      url: '#',
      icon: ChartColumn
    }
  ]
}

export const LeftSideBar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <SidebarProvider>
      <Sidebar {...props}>
        <SidebarHeader className='bg-background' />
        <SidebarContent className='bg-background'>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
