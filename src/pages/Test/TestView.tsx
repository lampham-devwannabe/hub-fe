import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { QuestionGroup, fetchTestById } from '../../store/slices/testSlice'
import { RootState, AppDispatch } from '../../store'
import ListeningTestPage from './ListeningTestPage'
import ReadingTestPage from './ReadingTestPage'
import WritingTestPage from './WritingTestPage'

export interface CommonQuestionProps {
  element: QuestionGroup
  mode: 'exam' | 'edit'
  handleChange: (questionId: number, value: string) => void
  selectedAnswers: Record<number, string>
}

export const TestView = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const { currentTest: test, loading, error } = useSelector((state: RootState) => state.test)
  const { currentAttempt } = useSelector((state: RootState) => state.attempt)

  // Use test data from currentAttempt if available (when taking a test)
  // Otherwise fetch the test data (when viewing/editing)
  const testData = currentAttempt?.test || test

  useEffect(() => {
    // Only fetch test data if not already available from currentAttempt
    if (id && !currentAttempt?.test) {
      dispatch(fetchTestById(id))
    }
  }, [dispatch, id, currentAttempt?.test])

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
      </div>
    )
  }

  if (error || !testData) {
    return <div className='flex items-center justify-center min-h-screen text-red-600'>{error || 'Test not found'}</div>
  }

  switch (testData.testType) {
    case 'LISTENING':
      return <ListeningTestPage testData={testData} />
    case 'READING':
      return <ReadingTestPage testData={testData} />
    case 'WRITING':
      return <WritingTestPage testData={testData} />
    default:
      return <div>Test type not supported</div>
  }
}
