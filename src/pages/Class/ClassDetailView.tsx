import { ClassLeftSideBar } from '../../components/common/layout/ClassLeftSidebar'
import { SidebarProvider } from '../../components/ui/sidebar'

export const ClassDetailView = () => {
  return (
    <SidebarProvider>
      <ClassLeftSideBar />
    </SidebarProvider>
  )
}
