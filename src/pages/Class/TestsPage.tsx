import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { Search, Filter, BookOpen, Eye, Play } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { GeneralTestAttemptResponse, getGeneralTestAttempt, getGeneralclass } from '../../store/slices/classSlice'
import { Card, CardHeader, CardContent } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import TestCard, { TestMode } from '../../components/test/TestCard'
import { Separator } from '../../components/ui/separator'
import { Badge } from '../../components/ui/badge'
import { useParams, useNavigate } from 'react-router-dom'
import { startTestAttempt } from '../../store/slices/attemptSlice'

export function TestsPage() {
  const { classId } = useParams<{ classId: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { generalTestAttempt, generalClass, loading } = useSelector((state: RootState) => state.class)
  const { currentAttempt, loading: attemptLoading } = useSelector((state: RootState) => state.attempt)
  const [selectedTest, setSelectedTest] = useState<GeneralTestAttemptResponse | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isStartingTest, setIsStartingTest] = useState(false)
  const mode: TestMode = user?.role === 'STUDENT' ? 'student' : 'teacher'

  useEffect(() => {
    if (classId) {
      dispatch(getGeneralTestAttempt(classId))
      dispatch(getGeneralclass())
    }
  }, [classId, dispatch])

  useEffect(() => {
    // If test attempt was started successfully and we're actually starting a test, navigate to test view
    if (currentAttempt && selectedTest && isStartingTest) {
      navigate(`/class/${classId}/test/${selectedTest.testId}/take`)
      setIsStartingTest(false) // Reset the flag
    }
  }, [currentAttempt, selectedTest, navigate, classId, isStartingTest])

  const handleEditTest = (id: string) => {
    navigate(`/class/${classId}/test/${id}/edit`)
  }

  const handleTakeTest = async (test: GeneralTestAttemptResponse) => {
    if (test.attemptNumber && test.attemptNumber > 0) return // Already completed

    try {
      setIsStartingTest(true) // Set flag to indicate we're starting a test
      await dispatch(startTestAttempt(test.testId)).unwrap()
      // Navigation will happen in useEffect above
    } catch (error) {
      console.error('Failed to start test:', error)
      setIsStartingTest(false) // Reset flag on error
      // TODO: Show error toast/notification
    }
  }

  const handleReviewTest = (test: GeneralTestAttemptResponse) => {
    // Navigate to test view in review mode
    navigate(`/test/${test.testId}/review`)
  }

  const filteredTests =
    generalTestAttempt?.filter((test) => test.title.toLowerCase().includes(searchQuery.toLowerCase())) || []

  // Find current class to get student count
  const currentClass = generalClass?.find((cls) => cls.classId === classId)
  const studentCount = currentClass?.studentCount || 0

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className='h-screen bg-background'>
      <div className='flex h-full'>
        {/* Left Panel */}
        <div className='w-3/5 p-6 border-r'>
          <div className='space-y-4 mb-6'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
              <Input
                placeholder='Search for anything ...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10'
              />
            </div>
            <div className='flex justify-between items-center'>
              <h2 className='text-lg font-semibold'>{mode === 'student' ? 'My Tests' : 'Class Tests'}</h2>
              <Button variant='outline' size='sm'>
                <Filter className='w-4 h-4 mr-2' />
                Latest
              </Button>
            </div>
          </div>

          <div className='space-y-3'>
            {filteredTests.map((test) => (
              <TestCard
                key={test.testId}
                test={test}
                mode={mode}
                isSelected={selectedTest?.testId === test.testId}
                onClick={() => setSelectedTest(test)}
                studentCount={studentCount}
              />
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className='w-2/5 p-6'>
          {selectedTest ? (
            <Card>
              <CardHeader className='pb-4'>
                <div className='flex items-start justify-between'>
                  <h3 className='text-xl font-semibold'>Test Details</h3>
                  {mode === 'student' && (
                    <Badge
                      variant={selectedTest.attemptNumber && selectedTest.attemptNumber > 0 ? 'default' : 'destructive'}
                      className='ml-4'
                    >
                      {selectedTest.attemptNumber && selectedTest.attemptNumber > 0 ? 'Completed' : 'Not Started'}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Basic Metadata */}
                <div className='space-y-3'>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>Test Name</label>
                    <p className='text-sm mt-1'>{selectedTest.title}</p>
                  </div>

                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>Test Type</label>
                    <p className='text-sm mt-1 capitalize'>{selectedTest.testType.toLowerCase()}</p>
                  </div>

                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>Duration</label>
                    <p className='text-sm mt-1'>{selectedTest.durationMinutes} minutes</p>
                  </div>

                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>Created</label>
                    <p className='text-sm mt-1'>
                      {new Date(selectedTest.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {/* Student-specific metadata */}
                  {mode === 'student' && (
                    <>
                      {selectedTest.attemptNumber && selectedTest.attemptNumber > 0 && (
                        <>
                          <div>
                            <label className='text-sm font-medium text-muted-foreground'>Score</label>
                            <p className='text-sm mt-1'>
                              {selectedTest.score !== undefined ? `${selectedTest.score}/100` : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <label className='text-sm font-medium text-muted-foreground'>Time Spent</label>
                            <p className='text-sm mt-1'>
                              {selectedTest.totalTimeSpent
                                ? `${Math.round(selectedTest.totalTimeSpent / 60)} minutes`
                                : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <label className='text-sm font-medium text-muted-foreground'>Attempt Number</label>
                            <p className='text-sm mt-1'>#{selectedTest.attemptNumber}</p>
                          </div>
                        </>
                      )}
                      <div>
                        <label className='text-sm font-medium text-muted-foreground'>Permission</label>
                        <p className='text-sm mt-1 text-muted-foreground'>
                          {selectedTest.attemptNumber && selectedTest.attemptNumber > 0
                            ? 'Test completed - View results only'
                            : 'Available for attempt'}
                        </p>
                      </div>
                    </>
                  )}

                  {/* Teacher-specific metadata */}
                  {mode === 'teacher' && (
                    <>
                      <div>
                        <label className='text-sm font-medium text-muted-foreground'>Student Attempts</label>
                        <p className='text-sm mt-1'>
                          {selectedTest.numberOfAttempts || 0} / {studentCount} students
                        </p>
                      </div>
                      <div>
                        <label className='text-sm font-medium text-muted-foreground'>Average Score</label>
                        <p className='text-sm mt-1'>
                          {selectedTest.averageScore !== undefined
                            ? `${selectedTest.averageScore.toFixed(1)}/100`
                            : 'No submissions yet'}
                        </p>
                      </div>
                      {selectedTest.latestSubmission && (
                        <div>
                          <label className='text-sm font-medium text-muted-foreground'>Latest Submission</label>
                          <p className='text-sm mt-1'>
                            {new Date(selectedTest.latestSubmission).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Student Actions */}
                {mode === 'student' && (
                  <>
                    <Separator />
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-muted-foreground'>Actions</label>
                      <div className='flex flex-wrap gap-2'>
                        <Button
                          variant='default'
                          size='sm'
                          onClick={() => handleTakeTest(selectedTest)}
                          disabled={(selectedTest.attemptNumber && selectedTest.attemptNumber > 0) || attemptLoading}
                          className='flex items-center gap-2'
                        >
                          <Play className='w-4 h-4' />
                          {attemptLoading ? 'Starting...' : 'Take Test'}
                        </Button>

                        {selectedTest.attemptNumber && selectedTest.attemptNumber > 0 && (
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleReviewTest(selectedTest)}
                            className='flex items-center gap-2'
                          >
                            <Eye className='w-4 h-4' />
                            Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Teacher Actions */}
                {mode === 'teacher' && (
                  <>
                    <Separator />
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-muted-foreground'>Actions</label>
                      <div className='flex flex-wrap gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => selectedTest && handleEditTest(selectedTest.testId)}
                        >
                          Edit
                        </Button>
                        <Button variant='outline' size='sm' className='text-destructive hover:text-destructive'>
                          Delete
                        </Button>
                        {selectedTest.testType === 'WRITING' && (
                          <Button variant='outline' size='sm'>
                            Grading
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className='flex items-center justify-center h-full text-muted-foreground'>
              <div className='text-center'>
                <BookOpen className='w-12 h-12 mx-auto mb-4 opacity-50' />
                <p>Select a test to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
