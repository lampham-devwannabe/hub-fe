import { useEffect } from 'react'
import './App.css'
import { Provider, useSelector } from 'react-redux'
import i18n from './utils/i18n'
import { persistor, RootState, store } from './store'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/Auth/Login'
import { StudentClassView } from './pages/Class/StudentClassView'
import { TeacherClassView } from './pages/Class/TeacherClassView'
import { PersistGate } from 'redux-persist/integration/react'

const LocaleSync = () => {
  const language = useSelector((state: RootState) => state.locale.language)
  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language])
  return null
}

export const App = () => {
  return (
    <div className='App min-h-screen bg-background p-1 md:p-2 lg:p-4'>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <I18nextProvider i18n={i18n}>
            <BrowserRouter>
              <LocaleSync />
              <Routes>
                <Route path='/login' element={<Login />} />
                <Route
                  path='/class'
                  element={<ProtectedRoute teacherView={<TeacherClassView />} studentView={<StudentClassView />} />}
                />
                {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
                <Route path='*' element={<div>404 Not Found</div>} />
              </Routes>
            </BrowserRouter>
          </I18nextProvider>
        </PersistGate>
      </Provider>
    </div>
  )
}

export default App
