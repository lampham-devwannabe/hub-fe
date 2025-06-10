import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select'
import { Hash, LogIn, LogOut, Users, X, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '../../components/ui/button'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Header } from '../../components/common/layout/Header'
import { Input } from '../../components/ui/input'
import { cn } from '../../lib/utils'
import { AppDispatch, RootState } from '../../store'
import { getGeneralclass, createClassThunk } from '../../store/slices/classSlice'
import { generateClassCode } from '../../services/Class'

export const TeacherClassView = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const classes = useSelector((state: RootState) => state.class.generalClass)
  const loading = useSelector((state: RootState) => state.class.loading)
  const error = useSelector((state: RootState) => state.class.error)
  const tabs = ['currentClass', 'pendingClass']
  const [activeTab, setActiveTab] = useState('currentClass')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState<string | null>(null)
  const [className, setClassName] = useState('')
  const [classCode, setClassCode] = useState(generateClassCode())
  const [classPass, setClassPass] = useState('')

  useEffect(() => {
    dispatch(getGeneralclass())
  }, [dispatch])

  const handleLeaveClassClick = (classId: string) => {
    setShowLeaveConfirm(classId)
  }

  const handleConfirmLeave = (classId: string) => {
    console.log(`Leaving class: ${classId}`)
    alert(`Left class: ${classId}`)
    setShowLeaveConfirm(null)
  }

  const handleCancelLeave = () => {
    setShowLeaveConfirm(null)
  }

  const handleSubmit = () => {
    dispatch(
      createClassThunk({
        name: className,
        code: classCode,
        pass: classPass || undefined
      })
    )
    setDialogOpen(false)
    // Reset form
    setClassName('')
    setClassCode(generateClassCode())
    setClassPass('')
  }

  const handleGenerateNewCode = () => {
    setClassCode(generateClassCode())
  }

  return (
    <div className='flex flex-col h-screen'>
      {/* Header cố định phía trên */}
      <div className='w-full'>
        <Header />
      </div>

      <div className='flex flex-1 overflow-hidden'>
        {/* Main Content - Scrollable */}
        <div className='flex-1 overflow-y-auto p-4'>
          <div className='flex flex-col gap-4'>
            {/* Tabs */}
            <div className='flex items-center gap-2'>
              {tabs.map((tabKey) => (
                <Button
                  key={tabKey}
                  variant={activeTab === tabKey ? 'default' : 'ghost'}
                  className={cn(
                    activeTab === tabKey ? 'bg-blue-700 text-white' : 'bg-muted text-foreground hover:bg-muted/70',
                    'rounded-xl px-4 py-2 text-sm font-medium'
                  )}
                  onClick={() => setActiveTab(tabKey)}
                >
                  {t(`labels.${tabKey}`)}
                </Button>
              ))}
            </div>

            {/* Search & Actions */}
            <div className='flex flex-wrap items-center gap-2'>
              <Input placeholder={t('placeholders.search')} className='flex-1 min-w-[200px] max-w-[400px] rounded-md' />

              <Select>
                <SelectTrigger className='w-[150px]'>
                  <SelectValue placeholder={t('placeholders.sort')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='latest'>{t('labels.latest')}</SelectItem>
                  <SelectItem value='az'>{t('labels.az')}</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={() => setDialogOpen(true)} className='bg-blue-600 hover:bg-blue-700 text-white'>
                <Plus className='w-4 h-4 mr-2' />
                Create Class
              </Button>
            </div>
            {/* Class Cards Grid - Now properly inside main content */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4'>
              {loading ? (
                <div className='col-span-full text-center py-10'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto'></div>
                  <p className='mt-4 text-gray-600'>Loading classes...</p>
                </div>
              ) : error ? (
                <div className='col-span-full text-center py-10'>
                  <p className='text-red-600'>{error}</p>
                </div>
              ) : classes && classes.length > 0 ? (
                classes.map((classItem) => (
                  <div
                    key={classItem.classId}
                    className='bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-1'
                  >
                    {/* Header */}
                    <div className='flex justify-between items-start mb-4'>
                      <div className='flex-1 min-w-0'>
                        <h3
                          className='text-lg font-bold text-gray-800 mb-2 leading-tight truncate'
                          title={classItem.name}
                        >
                          {classItem.name}
                        </h3>
                        <div className='flex items-center text-gray-600 mb-2'>
                          <Hash className='w-3 h-3 mr-1 text-indigo-500 flex-shrink-0' />
                          <span className='text-xs font-semibold bg-indigo-50 px-2 py-1 rounded-full truncate'>
                            {classItem.code}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className='flex gap-1 ml-2 flex-shrink-0'>
                        {/* Enter Class Button */}
                        <button
                          onClick={() => navigate(`/class/${classItem.classId}`)}
                          className='p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all duration-200 hover:scale-105 shadow-sm'
                          title='Go to Class Details'
                        >
                          <LogIn className='w-4 h-4' />
                        </button>

                        {/* Leave Class Button */}
                        <button
                          onClick={() => handleLeaveClassClick(classItem.classId)}
                          className='p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-all duration-200 hover:scale-105 shadow-sm'
                          title='Leave Class'
                        >
                          <LogOut className='w-4 h-4' />
                        </button>
                      </div>
                    </div>

                    {/* Student Count */}
                    <div className='flex items-center text-gray-600 mb-4 bg-gray-50 p-2 rounded-md'>
                      <Users className='w-4 h-4 mr-2 text-green-500 flex-shrink-0' />
                      <span className='text-xs font-medium'>
                        {classItem.studentCount} {classItem.studentCount === 1 ? 'student' : 'students'}
                      </span>
                    </div>

                    {/* Class ID */}
                    <div className='flex justify-between items-center pt-3 border-t border-gray-100'>
                      <span className='text-xs text-gray-400 uppercase tracking-wide'>ID</span>
                      <span className='text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded truncate max-w-[100px]'>
                        {classItem.classId}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-center py-20'>
                  <div className='text-gray-400 mb-4'>
                    <Users className='w-16 h-16 mx-auto' />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-600 mb-2'>No Classes Found</h3>
                  <p className='text-gray-500'>You haven't enrolled in any classes yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Leave Confirmation Popup - Outside of scrollable content */}
      {showLeaveConfirm && classes && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl p-6 max-w-md w-full shadow-2xl'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-bold text-gray-800'>Leave Class</h3>
              <button
                onClick={handleCancelLeave}
                className='text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='mb-6'>
              <p className='text-gray-600 mb-4 leading-relaxed'>
                Are you sure you want to leave{' '}
                <strong className='text-gray-800'>{classes.find((c) => c.classId === showLeaveConfirm)?.name}</strong>?
              </p>
              <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
                <p className='text-red-700 text-sm'>
                  ⚠️ You will lose access to all class materials, assignments, and progress.
                </p>
              </div>
            </div>

            <div className='flex gap-3'>
              <button
                onClick={handleCancelLeave}
                className='flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200'
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmLeave(showLeaveConfirm)}
                className='flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors duration-200 shadow-lg'
              >
                Leave Class
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Class Dialog */}
      {dialogOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl p-6 max-w-md w-full shadow-2xl'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-bold text-gray-800'>Create Class</h3>
              <button
                onClick={() => setDialogOpen(false)}
                className='text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Class Name</label>
                <Input
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder='Enter class name'
                  className='w-full'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Class Code</label>
                <div className='flex gap-2'>
                  <Input value={classCode} readOnly className='w-full bg-gray-50' />
                  <Button onClick={handleGenerateNewCode} variant='outline'>
                    Regenerate
                  </Button>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Password (Optional)</label>
                <Input
                  type='password'
                  value={classPass}
                  onChange={(e) => setClassPass(e.target.value)}
                  placeholder='Enter class password'
                  className='w-full'
                />
              </div>
            </div>

            <div className='flex gap-3 mt-6'>
              <Button onClick={() => setDialogOpen(false)} variant='outline' className='flex-1'>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className='flex-1 bg-blue-600 hover:bg-blue-700 text-white'
                disabled={!className || !classCode}
              >
                Create Class
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
