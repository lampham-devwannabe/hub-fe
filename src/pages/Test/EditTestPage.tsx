import { useState, useEffect } from 'react'
import { QuestionGroup, Test, fetchTestById, saveTest } from '../../store/slices/testSlice'
import { BookOpen, ChevronLeft, ChevronRight, Clock, Upload, Users } from 'lucide-react'
import { FormCompletion } from '../../components/questions/FormCompletion'
import { MapDiagramLabeling } from '../../components/questions/MapDiagramLabeling'
import { Matching } from '../../components/questions/Matching'
import { MultipleChoice } from '../../components/questions/MultipleChoice'
import { NoteCompletion } from '../../components/questions/NoteCompletion'
import { TableCompletion } from '../../components/questions/TableCompletion'
import { TfNotGiven } from '../../components/questions/TfNotGiven'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { useParams } from 'react-router-dom'
import { FlowChartCompletion } from '../../components/questions/FlowChartCompletion'
import { uploadResource } from '../../store/slices/resourceSlice'
import { FileType } from '../../services/Resources'
import { EditTestRequest, AnswerUpdate } from '../../services/Test'

const EditTestPage = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const currentTest = useSelector((state: RootState) => state.test.currentTest)
  const { uploading, uploadError } = useSelector((state: RootState) => state.resource)
  const { saving, saveSuccess } = useSelector((state: RootState) => state.test)
  const [testData, setTestData] = useState<Test | null>(currentTest)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [showParagraph, setShowParagraph] = useState(false)
  const [changedAnswers, setChangedAnswers] = useState<Set<number>>(new Set())
  const [originalAnswers, setOriginalAnswers] = useState<Record<number, string>>({})
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set())
  const currentSectionData = testData?.sections?.[currentSectionIndex]

  useEffect(() => {
    if (id) {
      dispatch(fetchTestById(id))
    }
  }, [id, dispatch])

  useEffect(() => {
    if (currentTest) {
      setTestData(currentTest)

      // Initialize original answers for tracking changes
      const initialAnswers: Record<number, string> = {}
      currentTest.sections?.forEach((section) => {
        section.questionGroups?.forEach((group) => {
          group.questions.forEach((question) => {
            if (question.answer?.correctAnswer) {
              initialAnswers[question.answer.answerId] = question.answer.correctAnswer
            }
          })
        })
      })
      setOriginalAnswers(initialAnswers)
      setChangedAnswers(new Set()) // Reset changed answers

      if (currentTest.sections?.[0]) {
        console.log('Second Section:', currentTest.sections[1])
        console.log('Question Groups:', currentTest.sections[0].questionGroups)
      }
    }
  }, [currentTest])

  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().slice(0, 16) // Format: "yyyy-MM-ddThh:mm"
  }

  const updateTestField = (field: keyof Test, value: string | number) => {
    if (!testData) return
    setTestData({
      ...testData,
      [field]: value
    })
  }

  const updateQuestionGroupImage = (groupId: string, imageUrl: string) => {
    if (!testData) return
    setTestData({
      ...testData,
      sections: testData.sections?.map((section) => ({
        ...section,
        questionGroups: section.questionGroups?.map((group) =>
          group.groupId === groupId ? { ...group, imageUrl } : group
        )
      }))
    })
  }

  const handleImageUpload = async (groupId: string, file: File) => {
    setUploadingImages((prev) => new Set(prev).add(groupId))

    try {
      const result = await dispatch(
        uploadResource({
          folder: 'test-images',
          fileType: FileType.IMAGE,
          targetId: groupId,
          file
        })
      ).unwrap()

      updateQuestionGroupImage(groupId, result)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload image file.')
    } finally {
      setUploadingImages((prev) => {
        const newSet = new Set(prev)
        newSet.delete(groupId)
        return newSet
      })
    }
  }

  if (!testData) {
    return <div>Loading...</div>
  }

  const handleSaveTest = async () => {
    if (!testData?.testId) {
      alert('Test ID is required')
      return
    }

    try {
      // Only collect changed answers - much more efficient!
      const answers: AnswerUpdate[] = []

      testData.sections?.forEach((section) => {
        section.questionGroups?.forEach((group) => {
          group.questions.forEach((question) => {
            if (
              question.answer?.answerId &&
              question.answer?.correctAnswer &&
              changedAnswers.has(question.answer.answerId)
            ) {
              answers.push({
                answerId: question.answer.answerId,
                correctAnswer: question.answer.correctAnswer
              })
            }
          })
        })
      })

      // If no changes were made, show a message and don't call the API
      if (answers.length === 0) {
        alert('No changes detected to save.')
        return
      }

      const editRequest: EditTestRequest = {
        testId: testData.testId,
        title: testData.title,
        durationMinutes: testData.durationMinutes,
        allowedAttempts: testData.allowedAttempts || 1,
        permissionId: testData.permissionId || 1,
        audioUrl: testData.audioUrl || '',
        answers
      }

      await dispatch(saveTest(editRequest)).unwrap()

      // Update original answers and clear changed answers after successful save
      const newOriginalAnswers = { ...originalAnswers }
      answers.forEach((answer) => {
        newOriginalAnswers[answer.answerId] = answer.correctAnswer
      })
      setOriginalAnswers(newOriginalAnswers)
      setChangedAnswers(new Set()) // Clear changed answers

      // saveSuccess state will be updated automatically by Redux
    } catch (error) {
      console.error('Failed to save test:', error)
      alert('Failed to save test. Please try again.')
    }
  }

  const handleCancel = () => {
    console.log('Cancel clicked')
    // TODO: restore original testData or navigate away
  }

  const handleChange = (questionId: number, value: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: value }))
    // Update the test data to reflect changes in the answer editor
    if (!testData) return
    const newTestData = {
      ...testData,
      sections: testData.sections?.map((section) => ({
        ...section,
        questionGroups: section.questionGroups?.map((group) => ({
          ...group,
          questions: group.questions.map((q) => {
            if (q.questionId !== questionId) return q
            return {
              ...q,
              answer: q.answer
                ? {
                    ...q.answer,
                    correctAnswer: value
                  }
                : {
                    answerId: 0,
                    correctAnswer: value
                  }
            }
          })
        }))
      }))
    }
    setTestData(newTestData)
  }

  function updateAnswer(questionId: number, newCorrectAnswer: string) {
    if (!testData) return

    // Find the answer ID for tracking changes
    let answerId: number | null = null
    testData.sections?.forEach((section) => {
      section.questionGroups?.forEach((group) => {
        group.questions.forEach((q) => {
          if (q.questionId === questionId && q.answer?.answerId) {
            answerId = q.answer.answerId
          }
        })
      })
    })

    // Track if this answer has changed from original
    if (answerId && originalAnswers[answerId] !== newCorrectAnswer) {
      setChangedAnswers((prev) => new Set(prev).add(answerId!))
    } else if (answerId && originalAnswers[answerId] === newCorrectAnswer) {
      // If changed back to original, remove from changed set
      setChangedAnswers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(answerId!)
        return newSet
      })
    }

    const newTestData = {
      ...testData,
      sections: testData.sections?.map((section) => ({
        ...section,
        questionGroups: section.questionGroups?.map((group) => ({
          ...group,
          questions: group.questions.map((q) => {
            if (q.questionId !== questionId) return q
            return {
              ...q,
              answer: q.answer
                ? {
                    ...q.answer,
                    correctAnswer: newCorrectAnswer
                  }
                : {
                    answerId: 0,
                    correctAnswer: newCorrectAnswer
                  }
            }
          })
        }))
      }))
    }
    setTestData(newTestData)
  }

  const handleUploadAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (file.type !== 'audio/mpeg' && !file.name.toLowerCase().endsWith('.mp3')) {
      alert('Only MP3 files are supported.')
      return
    }

    if (!testData?.testId) {
      alert('Test ID is required for upload.')
      return
    }

    try {
      const result = await dispatch(
        uploadResource({
          folder: 'test-audio',
          fileType: FileType.AUDIO,
          targetId: testData.testId.toString(),
          file
        })
      ).unwrap()

      // Update the test data with the uploaded audio URL
      updateTestField('audioUrl', result)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload audio file.')
    }
  }

  const renderWritingTask = (element: QuestionGroup) => {
    const isTask1 = element.questionType === 'task_1'
    const isUploading = uploadingImages.has(element.groupId)

    return (
      <div key={element.groupId} className='p-6 border border-gray-200 rounded-lg bg-white space-y-4'>
        <h3 className='text-lg font-semibold text-gray-800'>{element.title}</h3>

        {/* Instructions */}
        {element.instructions && (
          <div className='p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg'>
            <h4 className='font-medium text-blue-800 mb-2'>Instructions</h4>
            <p className='text-blue-700 text-sm whitespace-pre-wrap'>{element.instructions}</p>
          </div>
        )}

        {/* Image Upload for Task 1 */}
        {isTask1 && (
          <div className='space-y-3'>
            <h4 className='font-medium text-gray-700'>Reference Image</h4>
            <div className='border-2 border-dashed border-gray-300 rounded-lg p-4'>
              {element.imageUrl ? (
                <div className='space-y-3'>
                  <img
                    src={element.imageUrl}
                    alt='Task reference'
                    className='max-w-full max-h-64 object-contain rounded border'
                  />
                  <div className='text-center'>
                    <input
                      type='file'
                      accept='image/jpeg,image/jpg,image/png'
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(element.groupId, file)
                      }}
                      disabled={isUploading}
                      className='text-sm'
                    />
                    {isUploading && <p className='text-sm text-blue-500 mt-1'>Uploading...</p>}
                  </div>
                </div>
              ) : (
                <div className='text-center space-y-3'>
                  <Upload className='w-8 h-8 text-gray-400 mx-auto' />
                  <div>
                    <p className='text-sm text-gray-600 mb-2'>Upload reference image for Task 1</p>
                    <input
                      type='file'
                      accept='image/jpeg,image/jpg,image/png'
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(element.groupId, file)
                      }}
                      disabled={isUploading}
                      className='text-sm'
                    />
                    {isUploading && <p className='text-sm text-blue-500 mt-1'>Uploading...</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Questions */}
        {element.questions?.map((question) => (
          <div key={question.questionId} className='p-4 bg-gray-50 rounded-lg border'>
            <div className='flex items-center justify-between mb-2'>
              <h4 className='font-medium text-gray-700'>Question {question.questionNumber}</h4>
              {question.maxWords && (
                <span className='text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded'>
                  Min {question.maxWords > 150 ? '250' : '150'} words
                </span>
              )}
            </div>
            {question.prefix && <p className='text-gray-600 mb-2 leading-relaxed'>{question.prefix}</p>}
            {question.questionText && <p className='text-gray-600 leading-relaxed'>{question.questionText}</p>}
          </div>
        ))}
      </div>
    )
  }

  const renderComponent = (element: QuestionGroup) => {
    console.log('Rendering component for question type:', element.questionType)

    switch (element.questionType) {
      case 'task_1':
      case 'task_2':
        return renderWritingTask(element)
      case 'form_completion':
        return (
          <FormCompletion
            key={element.groupId}
            element={element}
            handleChange={handleChange}
            selectedAnswers={selectedAnswers}
            mode='edit'
          />
        )
      case 'note_completion':
      case 'summary_completion':
        return (
          <NoteCompletion
            key={element.groupId}
            element={element}
            handleChange={handleChange}
            selectedAnswers={selectedAnswers}
            mode='edit'
          />
        )
      case 'multiple_choice':
        return (
          <MultipleChoice
            key={element.groupId}
            element={element}
            handleChange={handleChange}
            selectedAnswers={selectedAnswers}
            mode='edit'
          />
        )
      case 'map_labelling':
        return (
          <MapDiagramLabeling
            key={element.groupId}
            element={element}
            handleChange={handleChange}
            selectedAnswers={selectedAnswers}
            mode='edit'
          />
        )
      case 'matching_headings':
      case 'matching_features':
      case 'list_selection':
        return (
          <Matching
            key={element.groupId}
            element={element}
            handleChange={handleChange}
            selectedAnswers={selectedAnswers}
            mode='edit'
          />
        )
      case 'table_completion':
        return (
          <TableCompletion
            key={element.groupId}
            element={element}
            handleChange={handleChange}
            selectedAnswers={selectedAnswers}
            mode='edit'
          />
        )
      case 'true_false_not_given':
        return (
          <TfNotGiven
            key={element.groupId}
            element={element}
            handleChange={handleChange}
            selectedAnswers={selectedAnswers}
            mode='edit'
          />
        )
      case 'selection_from_box':
        return (
          <Matching
            key={element.groupId}
            element={element}
            handleChange={handleChange}
            selectedAnswers={selectedAnswers}
            mode='edit'
          />
        )
      case 'diagram_labeling':
        return (
          <MapDiagramLabeling
            key={element.groupId}
            element={element}
            handleChange={handleChange}
            selectedAnswers={selectedAnswers}
            mode='edit'
          />
        )
      case 'flow_chart_completion':
        return (
          <FlowChartCompletion
            key={element.groupId}
            element={element}
            handleChange={handleChange}
            selectedAnswers={selectedAnswers}
            mode={'edit'}
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
  return (
    <div className='min-h-screen bg-gray-50 flex'>
      {/* Left Panel - 70% width */}
      <div className='w-[70%] bg-white border-r border-gray-200'>
        {/* Header */}
        <div className='border-b border-gray-200 p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h1 className='text-2xl font-bold text-gray-900'>{testData.title}</h1>
            <div className='flex items-center space-x-2'>
              {testData.testType === 'READING' && (
                <button
                  onClick={() => setShowParagraph(!showParagraph)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    showParagraph ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <BookOpen className='w-4 h-4 mr-2' />
                  Paragraph
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className='flex items-center space-x-4 p-4 border-b border-gray-200'>
          <button
            onClick={() => setCurrentSectionIndex(Math.max(0, currentSectionIndex - 1))}
            disabled={currentSectionIndex === 0}
            className='flex items-center px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <ChevronLeft className='w-4 h-4 mr-1' />
            Previous
          </button>
          <div className='flex space-x-2'>
            {testData.sections?.map((section, index) => (
              <button
                key={section.sectionId}
                onClick={() => setCurrentSectionIndex(index)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentSectionIndex === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {testData.testType === 'WRITING' ? `Task ${section.sectionNumber}` : `Section ${section.sectionNumber}`}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              setCurrentSectionIndex(Math.min((testData.sections?.length || 0) - 1, currentSectionIndex + 1))
            }
            disabled={currentSectionIndex === (testData.sections?.length || 0) - 1}
            className='flex items-center px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Next
            <ChevronRight className='w-4 h-4 ml-1' />
          </button>
        </div>

        {/* Section Content */}
        <div className='p-6'>
          {showParagraph && testData.testType === 'READING' && (
            <div className='mb-6 p-6 bg-blue-50 border border-blue-200 rounded-lg'>
              <h3 className='text-lg font-semibold text-blue-900 mb-3'>Reading Passage</h3>
              <div className='text-gray-700 leading-relaxed'>{currentSectionData?.description}</div>
            </div>
          )}

          <div className='mb-6'>
            <h2 className='text-xl font-semibold text-gray-900 mb-2'>{currentSectionData?.title}</h2>
            {currentSectionData?.description && testData.testType === 'WRITING' && (
              <p className='text-blue-700 font-medium mb-2'>{currentSectionData.description}</p>
            )}
            <p className='text-gray-600 mb-4'>{currentSectionData?.instructions}</p>
          </div>

          {/* Questions List */}
          <div className='space-y-6'>
            {[...(currentSectionData?.questionGroups || [])]
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
      </div>

      {/* Right Panel - Test Settings Sidebar */}
      <div className='w-[30%] bg-gray-50 overflow-y-auto'>
        <div className='p-6 space-y-6'>
          <h2 className='text-xl font-semibold text-gray-900'>Test Settings</h2>

          {/* Test Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Test Name</label>
            <input
              type='text'
              value={testData.title}
              onChange={(e) => updateTestField('title', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          {/* Time Settings */}
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <Clock className='w-4 h-4 inline mr-1' />
                Start Time
              </label>
              <input
                type='datetime-local'
                value={formatDateForInput(testData.createdAt)}
                onChange={(e) => updateTestField('createdAt', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>End Time</label>
              <input
                type='datetime-local'
                value={formatDateForInput(testData.modifiedBy)}
                onChange={(e) => updateTestField('modifiedBy', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
          </div>

          {/* Student Permissions */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              <Users className='w-4 h-4 inline mr-1' />
              Student Permissions
            </label>
            <select
              value={testData.permissionId || 1}
              onChange={(e) => updateTestField('permissionId', parseInt(e.target.value))}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            >
              <option value={1}>Only view point</option>
              <option value={2}>View point and answer</option>
              <option value={3}>View point, answer & explanation</option>
            </select>
          </div>

          {/* Audio Upload - Only show for LISTENING tests */}
          {testData.testType === 'LISTENING' && (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <Upload className='w-4 h-4 inline mr-1' />
                Audio Files / YouTube Links
              </label>
              <div className='border-2 border-dashed border-gray-300 rounded-lg p-4'>
                <div className='text-center space-y-3'>
                  <Upload className='w-8 h-8 text-gray-400 mx-auto' />
                  <div>
                    <p className='text-sm text-gray-600 mb-2'>Upload MP3 audio file</p>
                    <input
                      type='file'
                      accept='audio/mpeg'
                      onChange={handleUploadAudio}
                      disabled={uploading}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'
                    />
                    {uploading && <p className='text-sm text-blue-500 mt-1'>Uploading...</p>}
                    {uploadError && <p className='text-sm text-red-500 mt-1'>{uploadError}</p>}
                  </div>
                  <div className='border-t pt-3'>
                    <p className='text-sm text-gray-600 mb-2'>Or paste YouTube URL</p>
                    <input
                      type='text'
                      placeholder='https://youtube.com/watch?v=...'
                      value={testData.audioUrl || ''}
                      onChange={(e) => updateTestField('audioUrl', e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Duration */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              <Clock className='w-4 h-4 inline mr-1' />
              Duration (Minutes)
            </label>
            <input
              type='number'
              value={testData.durationMinutes}
              onChange={(e) => updateTestField('durationMinutes', parseInt(e.target.value) || 0)}
              min={1}
              max={300}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          {/* Total Questions */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Total Questions</label>
            <input
              type='number'
              value={testData.totalQuestions}
              readOnly
              className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed'
            />
          </div>

          {/* Answer Editor - Only show for non-WRITING tests */}
          {testData.testType !== 'WRITING' && (
            <div>
              <h3 className='text-sm font-medium text-gray-700 mb-3'>Answer Editor</h3>
              <div className='bg-white border border-gray-200 rounded-lg p-4 max-h-80 overflow-y-auto space-y-3 text-sm'>
                {testData.sections?.flatMap((section) =>
                  [...(section.questionGroups || [])]
                    .sort((a, b) => {
                      const firstQuestionA = a.questions[0]?.questionNumber || 0
                      const firstQuestionB = b.questions[0]?.questionNumber || 0
                      return firstQuestionA - firstQuestionB
                    })
                    .flatMap((group) =>
                      [...group.questions]
                        .sort((a, b) => a.questionNumber - b.questionNumber)
                        .map((question) => (
                          <div key={question.questionId} className='space-y-1'>
                            <label className='text-gray-700 font-medium'>Q{question.questionNumber}</label>
                            <input
                              type='text'
                              value={question.answer?.correctAnswer || ''}
                              onChange={(e) => updateAnswer(question.questionId, e.target.value)}
                              className='w-full px-2 py-1 border border-gray-300 rounded-md'
                            />
                          </div>
                        ))
                    )
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className='space-y-3 pt-4 border-t border-gray-200'>
            <button
              onClick={handleSaveTest}
              disabled={saving || (testData.testType !== 'WRITING' && changedAnswers.size === 0)}
              className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {saving
                ? 'Saving...'
                : testData.testType === 'WRITING'
                  ? 'Save Test'
                  : changedAnswers.size > 0
                    ? `Save Test (${changedAnswers.size} changes)`
                    : 'Save Test'}
            </button>
            {saveSuccess && <div className='text-green-600 text-sm text-center'>Test saved successfully!</div>}
            <button
              onClick={handleCancel}
              className='w-full border border-gray-400 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors font-medium'
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditTestPage
