import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { saveQuestionTimeAction, submitExamAction, handleLostFocus } from '../../store/slices/attemptSlice'
import { Test } from '../../store/slices/testSlice'
import { showToast } from '../../components/common/toast/Toast'

const WritingTestPage = ({ testData }: { testData: Test }) => {
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
    saveCurrentQuestionTime()

    if (currentAttempt?.attemptId) {
      try {
        await dispatch(submitExamAction(currentAttempt.attemptId)).unwrap()
        console.log('Exam submitted successfully')
      } catch (error) {
        console.error('Failed to submit exam:', error)
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
  const currentQuestionGroup = currentSection?.questionGroups?.[0]

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
          {/* Left Panel - Question Content */}
          <div className='w-1/2 border-r overflow-y-auto'>
            {currentSection && currentQuestionGroup ? (
              <div className='p-6 h-full bg-blue-50'>
                {/* Section Title and Description */}
                <div className='mb-6 p-4 bg-blue-100 rounded-lg shadow-sm'>
                  <h2 className='text-xl font-bold text-blue-900 mb-2'>{currentSection.title}</h2>
                  {currentSection.description && (
                    <p className='text-blue-700 font-medium'>{currentSection.description}</p>
                  )}
                </div>

                {/* Question Group Instructions */}
                {currentQuestionGroup.instructions && (
                  <div className='mb-6 p-4 bg-white rounded-lg shadow-sm border-l-4 border-blue-500'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-2'>Instructions</h3>
                    <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>
                      {currentQuestionGroup.instructions}
                    </p>
                  </div>
                )}

                {/* Questions */}
                {currentQuestionGroup.questions?.map((question) => (
                  <div key={question.questionId} className='mb-6 p-4 bg-white rounded-lg shadow-sm'>
                    <div className='flex items-center justify-between mb-3'>
                      <h3 className='text-lg font-semibold text-gray-800'>
                        {currentQuestionGroup.title || `Question ${question.questionNumber}`}
                      </h3>
                      {question.maxWords && (
                        <span className='text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded'>
                          Min {question.maxWords > 150 ? '250' : '150'} words
                        </span>
                      )}
                    </div>
                    {question.prefix && <p className='text-gray-700 leading-relaxed mb-3'>{question.prefix}</p>}
                    {question.questionText && <p className='text-gray-700 leading-relaxed'>{question.questionText}</p>}
                  </div>
                ))}

                {/* Image/Chart if available */}
                {currentQuestionGroup.imageUrl && (
                  <div className='mb-6 p-4 bg-white rounded-lg shadow-sm'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-3'>Reference Image</h3>
                    <img
                      src={currentQuestionGroup.imageUrl}
                      alt='Writing task reference'
                      className='w-full rounded border border-gray-200'
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className='p-6 h-full bg-blue-50'>
                <div className='p-4 bg-blue-100 rounded-lg shadow-sm'>
                  <p className='text-blue-700'>No writing task found</p>
                  <p className='text-blue-600 text-sm'>Debug: sections length = {testData.sections?.length || 0}</p>
                  <p className='text-blue-600 text-sm'>Debug: currentSectionIndex = {currentSectionIndex}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Writing Area */}
          <div className='w-1/2 overflow-y-auto'>
            <div className='p-6 h-full'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-800'>Your Response</h3>
                {currentQuestionGroup?.questions?.[0] && (
                  <div className='text-sm text-gray-600'>
                    <span className='mr-4'>
                      Words:{' '}
                      <span className='font-medium'>
                        {
                          (selectedAnswers[currentQuestionGroup.questions[0].questionId] || '')
                            .split(/\s+/)
                            .filter((word) => word.length > 0).length
                        }
                      </span>
                    </span>
                    {currentQuestionGroup.questions[0].maxWords && (
                      <span className='text-blue-600'>
                        Target: {currentQuestionGroup.questions[0].maxWords > 150 ? '250+' : '150+'} words
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className='h-full pb-4'>
                {currentQuestionGroup?.questions?.[0] ? (
                  <textarea
                    className='w-full h-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm leading-relaxed'
                    placeholder={`Write your response here...\n\nRemember to:\n• Address all parts of the task\n• Organize your ideas clearly\n• Use appropriate vocabulary and grammar\n• Write at least ${currentQuestionGroup.questions?.[0]?.maxWords && currentQuestionGroup.questions[0].maxWords > 150 ? '250' : '150'} words`}
                    value={selectedAnswers[currentQuestionGroup.questions[0].questionId] || ''}
                    onChange={(e) => handleChange(currentQuestionGroup.questions[0].questionId, e.target.value)}
                    onFocus={() => {
                      if (currentQuestionId !== currentQuestionGroup.questions[0].questionId) {
                        setCurrentQuestionId(currentQuestionGroup.questions[0].questionId)
                        setQuestionStartTime(Date.now())
                      }
                    }}
                  />
                ) : (
                  <textarea
                    className='w-full h-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm leading-relaxed'
                    placeholder='Write your response here...'
                    value={selectedAnswers[1] || ''}
                    onChange={(e) => handleChange(1, e.target.value)}
                    onFocus={() => {
                      if (currentQuestionId !== 1) {
                        setCurrentQuestionId(1)
                        setQuestionStartTime(Date.now())
                      }
                    }}
                  />
                )}
              </div>
            </div>
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
              Previous Task
            </button>

            <span className='text-sm text-gray-600'>
              Task {currentSectionIndex + 1} of {testData.sections?.length || 0}
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
              Next Task
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WritingTestPage
