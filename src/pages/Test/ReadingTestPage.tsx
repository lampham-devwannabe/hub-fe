import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import {
  saveQuestionTimeAction,
  saveProgressAction,
  submitExamAction,
  handleLostFocus
} from '../../store/slices/attemptSlice'
import { FormCompletion } from '../../components/questions/FormCompletion'
import { MapDiagramLabeling } from '../../components/questions/MapDiagramLabeling'
import { Matching } from '../../components/questions/Matching'
import { MultipleChoice } from '../../components/questions/MultipleChoice'
import { NoteCompletion } from '../../components/questions/NoteCompletion'
import { TableCompletion } from '../../components/questions/TableCompletion'
import { TfNotGiven } from '../../components/questions/TfNotGiven'
import { QuestionGroup, Test } from '../../store/slices/testSlice'
import { FlowChartCompletion } from '../../components/questions/FlowChartCompletion'
import { showToast } from '../../components/common/toast/Toast'

const ReadingTestPage = ({ testData }: { testData: Test }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { currentAttempt } = useSelector((state: RootState) => state.attempt)

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())
  const [hasLostFocus, setHasLostFocus] = useState(false)
  const [isFullscreenPromptVisible, setIsFullscreenPromptVisible] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const autosaveIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Calculate initial time left considering time already spent
  const totalTimeSpentSeconds = currentAttempt?.totalTimeSpent || 0
  const totalTimeAllowed = testData.durationMinutes * 60
  const initialTimeLeft = Math.max(0, totalTimeAllowed - totalTimeSpentSeconds)
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft)

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
      if (!document.fullscreenElement && !isFullscreenPromptVisible) {
        // User exited fullscreen, show warning
        showToast('Please remain in fullscreen mode during the exam', {
          variant: 'error',
          duration: 3000
        })
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [isFullscreenPromptVisible])

  // Handle entering fullscreen mode
  const handleEnterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen()
        setIsFullscreenPromptVisible(false)
        setIsFullscreen(true)
      }
    } catch (error) {
      console.error('Failed to enter fullscreen mode:', error)
      // Allow test to continue even if fullscreen fails
      setIsFullscreenPromptVisible(false)
    }
  }

  // Exit fullscreen when component unmounts
  useEffect(() => {
    return () => {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch((error) => {
          console.warn('Failed to exit fullscreen mode:', error)
        })
      }
    }
  }, [])

  // Handle window focus/blur events
  useEffect(() => {
    const handleFocus = () => {
      if (hasLostFocus && currentAttempt?.attemptId) {
        showToast('You just left the exam', {
          variant: 'error',
          description: 'Leaving the exam during the test is not allowed',
          duration: 3000
        })
        setHasLostFocus(false)
      }
    }

    const handleBlur = () => {
      console.log('Focus lost. hasLostFocus:', hasLostFocus, 'currentAttempt:', !!currentAttempt?.attemptId)
      if (currentAttempt?.attemptId && !hasLostFocus) {
        console.log('Setting hasLostFocus to true and calling handleLostFocus API')
        setHasLostFocus(true)
        dispatch(handleLostFocus(currentAttempt.attemptId))
      }
    }

    // Only add listeners if not showing fullscreen prompt
    if (!isFullscreenPromptVisible) {
      window.addEventListener('focus', handleFocus)
      window.addEventListener('blur', handleBlur)
    }

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [currentAttempt?.attemptId, hasLostFocus, dispatch, isFullscreenPromptVisible])

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Autosave every 30 seconds
  useEffect(() => {
    if (currentAttempt?.attemptId) {
      autosaveIntervalRef.current = setInterval(() => {
        dispatch(
          saveProgressAction({
            attemptId: currentAttempt.attemptId,
            delta: 30
          })
        )
      }, 30000)
    }

    return () => {
      if (autosaveIntervalRef.current) {
        clearInterval(autosaveIntervalRef.current)
      }
    }
  }, [currentAttempt?.attemptId, dispatch])

  // Save question time when moving to another question
  const saveCurrentQuestionTime = () => {
    if (currentQuestionId && currentAttempt?.attemptId) {
      const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)
      if (timeSpent > 0) {
        dispatch(
          saveQuestionTimeAction({
            attemptId: currentAttempt.attemptId,
            questionId: currentQuestionId,
            answer: selectedAnswers[currentQuestionId] || '',
            timeSpent
          })
        )
      }
    }
  }

  const handleChange = (questionId: number, value: string) => {
    // If switching to a different question, save time for previous question
    if (currentQuestionId && currentQuestionId !== questionId) {
      saveCurrentQuestionTime()
    }

    // Update current question tracking
    if (currentQuestionId !== questionId) {
      setCurrentQuestionId(questionId)
      setQuestionStartTime(Date.now())
    }

    setSelectedAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async () => {
    // Save current question time before submitting
    saveCurrentQuestionTime()

    if (currentAttempt?.attemptId) {
      try {
        await dispatch(submitExamAction(currentAttempt.attemptId)).unwrap()
        console.log('Exam submitted successfully')
        // TODO: Navigate to results page or show success message
      } catch (error) {
        console.error('Failed to submit exam:', error)
        // TODO: Show error message
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
  }

  const currentSection = testData.sections?.[currentSectionIndex]

  const renderComponent = (element: QuestionGroup) => {
    switch (element.questionType) {
      case 'form_completion':
        return (
          <FormCompletion
            key={element.groupId}
            element={element}
            handleChange={handleChange}
            selectedAnswers={selectedAnswers}
            mode='exam'
          />
        )
      case 'note_completion':
        return (
          <NoteCompletion
            key={element.groupId}
            element={element}
            handleChange={handleChange}
            selectedAnswers={selectedAnswers}
            mode='exam'
          />
        )
      case 'multiple_choice':
        return (
          <MultipleChoice
            key={element.groupId}
            element={element}
            handleChange={handleChange}
            selectedAnswers={selectedAnswers}
            mode='exam'
          />
        )
      case 'map_labelling':
        return (
          <MapDiagramLabeling
            key={element.groupId}
            element={element}
            handleChange={handleChange}
            selectedAnswers={selectedAnswers}
            mode='exam'
          />
        )
      case 'matching':
        return (
          <Matching
            key={element.groupId}
            element={element}
            handleChange={handleChange}
            selectedAnswers={selectedAnswers}
            mode='exam'
          />
        )
      case 'table_completion':
        return (
          <TableCompletion
            key={element.groupId}
            element={element}
            handleChange={handleChange}
            selectedAnswers={selectedAnswers}
            mode='exam'
          />
        )
      case 'true_false_not_given':
        return (
          <TfNotGiven
            key={element.groupId}
            element={element}
            handleChange={handleChange}
            selectedAnswers={selectedAnswers}
            mode='exam'
          />
        )
      case 'yes_no_not_given':
        return (
          <TfNotGiven
            key={element.groupId}
            element={element}
            handleChange={handleChange}
            selectedAnswers={selectedAnswers}
            mode='exam'
            options={['Yes', 'No', 'Not Given']}
          />
        )
      case 'selection_from_box':
        return (
          <Matching
            key={element.groupId}
            element={element}
            handleChange={handleChange}
            selectedAnswers={selectedAnswers}
            mode='exam'
          />
        )
      case 'diagram_labeling':
        return (
          <MapDiagramLabeling
            key={element.groupId}
            element={element}
            handleChange={handleChange}
            selectedAnswers={selectedAnswers}
            mode='exam'
          />
        )
      case 'flow_chart_completion':
        return (
          <FlowChartCompletion
            key={element.groupId}
            element={element}
            handleChange={handleChange}
            selectedAnswers={selectedAnswers}
            mode='exam'
          />
        )
      default:
        console.warn('Unknown question type:', element.questionType)
        return (
          <div key={element.groupId} className='p-4 border border-yellow-200 bg-yellow-50 rounded-lg'>
            <h3 className='text-lg font-semibold text-yellow-800 mb-2'>Unsupported Question Type</h3>
            <p className='text-yellow-700'>Question type "{element.questionType}" is not supported yet.</p>
            <pre className='mt-2 text-sm text-yellow-600 overflow-auto'>{JSON.stringify(element, null, 2)}</pre>
          </div>
        )
    }
  }

  // Save current question time when component unmounts
  useEffect(() => {
    return () => {
      saveCurrentQuestionTime()
      if (autosaveIntervalRef.current) {
        clearInterval(autosaveIntervalRef.current)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className='min-h-screen flex items-center justify-center bg-gray-100 p-6'>
      {/* Fullscreen Prompt Modal */}
      {isFullscreenPromptVisible && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center'>
            <h2 className='text-2xl font-bold mb-4'>Enter Fullscreen Mode</h2>
            <p className='text-gray-600 mb-6'>
              For security and focus purposes, this exam must be taken in fullscreen mode. Click the button below to
              enter fullscreen and start your exam.
            </p>
            <button
              onClick={handleEnterFullscreen}
              className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors'
            >
              Enter Fullscreen & Start Exam
            </button>
            <p className='text-sm text-gray-500 mt-4'>Status: {isFullscreen ? 'In Fullscreen' : 'Not in Fullscreen'}</p>
          </div>
        </div>
      )}

      <div className='bg-white shadow-lg rounded-lg max-w-7xl w-full h-[90vh] flex flex-col relative'>
        {/* Header */}
        <div className='p-4 border-b'>
          <h1 className='text-2xl font-bold text-center mb-4'>{testData.title}</h1>

          {/* Timer & Controls */}
          <div className='flex justify-between items-center text-sm'>
            <span className='font-semibold text-red-600'>Time Left: {formatTime(timeLeft)}</span>
            <button className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700' onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>

        {/* Main Content - Two Panel Layout */}
        <div className='flex-1 flex overflow-hidden'>
          {/* Left Panel - Reading Content */}
          <div className='w-1/2 border-r overflow-y-auto'>
            {currentSection ? (
              <div className='p-6 h-full bg-blue-50'>
                {/* Section Title */}
                <div className='mb-6 p-4 bg-blue-100 rounded-lg shadow-sm'>
                  <h2 className='text-xl font-bold text-blue-900 mb-2'>{currentSection.title}</h2>
                </div>

                {/* Instructions */}
                {currentSection.instructions && (
                  <div className='mb-6 p-4 bg-blue-100 rounded-lg shadow-sm'>
                    <h3 className='text-lg font-semibold text-blue-800 mb-2'>Instructions</h3>
                    <p className='text-blue-700 leading-relaxed'>{currentSection.instructions}</p>
                  </div>
                )}

                {/* Section Description/Content */}
                {currentSection.description && (
                  <div className='p-4 bg-blue-100 rounded-lg shadow-sm'>
                    <h3 className='text-lg font-semibold text-blue-800 mb-3'>Reading Passage</h3>
                    <div className='text-blue-900 leading-relaxed'>
                      {currentSection.description.split('\n').map((paragraph, index) => (
                        <p key={index} className='mb-4 last:mb-0'>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* If no description, show placeholder */}
                {!currentSection.description && (
                  <div className='p-4 bg-blue-100 rounded-lg shadow-sm'>
                    <h3 className='text-lg font-semibold text-blue-800 mb-3'>Reading Passage</h3>
                    <p className='text-blue-700 italic'>Reading passage content will be displayed here.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className='p-6 h-full bg-blue-50'>
                <div className='p-4 bg-blue-100 rounded-lg shadow-sm'>
                  <p className='text-blue-700'>No section found</p>
                  <p className='text-blue-600 text-sm'>Debug: sections length = {testData.sections?.length || 0}</p>
                  <p className='text-blue-600 text-sm'>Debug: currentSectionIndex = {currentSectionIndex}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Questions */}
          <div className='w-1/2 overflow-y-auto'>
            {currentSection ? (
              <div className='p-6 h-full'>
                <h3 className='text-lg font-semibold mb-4 text-gray-800'>Questions</h3>
                <div className='space-y-4'>
                  {[...(currentSection.questionGroups || [])]
                    .sort((a, b) => {
                      // Sort by the first question number in each group
                      const firstQuestionA = a.questions[0]?.questionNumber || 0
                      const firstQuestionB = b.questions[0]?.questionNumber || 0
                      return firstQuestionA - firstQuestionB
                    })
                    .map((element) => {
                      return renderComponent(element)
                    })}
                </div>
              </div>
            ) : (
              <div className='p-6 h-full'>
                <p className='text-gray-600'>No questions available</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className='p-4 border-t bg-gray-50'>
          <div className='flex justify-between items-center'>
            <button
              onClick={() => {
                saveCurrentQuestionTime()
                setCurrentSectionIndex((prev) => Math.max(0, prev - 1))
                setCurrentQuestionId(null)
              }}
              disabled={currentSectionIndex === 0}
              className='px-6 py-2 rounded-md bg-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors'
            >
              Previous Section
            </button>

            <span className='text-sm text-gray-600'>
              Section {currentSectionIndex + 1} of {testData.sections?.length || 0}
            </span>

            <button
              onClick={() => {
                saveCurrentQuestionTime()
                setCurrentSectionIndex((prev) => Math.min((testData.sections?.length || 1) - 1, prev + 1))
                setCurrentQuestionId(null)
              }}
              disabled={currentSectionIndex === (testData.sections?.length || 1) - 1}
              className='px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              Next Section
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReadingTestPage
