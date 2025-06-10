import { Navigate, Route, Routes } from 'react-router-dom'
import { TestsPage } from '../../pages/Class/TestsPage'
import AddTestPage from '../../pages/Test/AddTestPage'
import { ProtectedRoute } from '../ProtectedRoute'
import EditTestPage from '../../pages/Test/EditTestPage'
import { TestView } from '../../pages/Test/TestView'
import TestDetailPage from '../../pages/Test/TestDetailPage'

export function ClassRoutes() {
  return (
    <Routes>
      <Route path='tests' element={<TestsPage />} />
      <Route
        path='test/:id/take'
        element={<ProtectedRoute studentView={<TestView />} teacherView={<Navigate to='/unauthorized' />} />}
      />
      <Route
        path='add-test'
        element={<ProtectedRoute teacherView={<AddTestPage />} studentView={<Navigate to='/unauthorized' />} />}
      />
      <Route
        path='test/:id/edit'
        element={<ProtectedRoute teacherView={<EditTestPage />} studentView={<Navigate to='/unauthorized' />} />}
      />
      <Route
        path='test/:id/detail'
        element={<ProtectedRoute teacherView={<TestDetailPage />} studentView={<Navigate to='/unauthorized' />} />}
      />
    </Routes>
  )
}
