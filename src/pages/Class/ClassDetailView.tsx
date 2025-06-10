import { ClassRoutes } from '../../components/class/ClassRoutes'
import { ClassLeftSideBar } from '../../components/common/layout/ClassLeftSidebar'
import { Header } from '../../components/common/layout/Header'
import { SidebarInset, SidebarProvider } from '../../components/ui/sidebar'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { useParams, useLocation } from 'react-router-dom'

export const ClassDetailView = () => {
  const { classId } = useParams()
  const location = useLocation()
  const classes = useSelector((state: RootState) => state.class.generalClass)
  const currentClass = classes?.find((c) => c.classId === classId)

  // Check if user is taking a test (distraction-free mode)
  const isTestTaking = location.pathname.includes('/test/') && location.pathname.includes('/take')

  if (!currentClass || !classes) {
    return null // or loading state
  }

  // Test-taking mode: No sidebars, minimal distractions
  if (isTestTaking) {
    return (
      <div className='flex flex-col h-screen'>
        <ClassRoutes />
      </div>
    )
  }

  // Normal class management mode: Full layout with sidebars
  return (
    <div className='flex flex-col h-screen'>
      <div className='w-full fixed top-0 left-0 z-50'>
        <Header />
      </div>
      <SidebarProvider>
        <div className='flex flex-1 pt-[64px] overflow-hidden'>
          <div className='fixed top-[64px] left-0 h-[calc(100vh-64px)] z-40'>
            <ClassLeftSideBar />
          </div>
          <div className='flex-1 ml-[240px] overflow-y-auto'>
            <SidebarInset>
              <ClassRoutes />
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}
