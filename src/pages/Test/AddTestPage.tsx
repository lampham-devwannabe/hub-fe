import { useState, useEffect } from 'react'
import { Upload, BookOpen, FileText, Headphones, PenTool, Plus, Search } from 'lucide-react'
import { TestType } from '../../store/slices/testSlice'
import { useDispatch, useSelector } from 'react-redux'
import { fetchExistingTests } from '../../store/slices/testSlice'
import { AppDispatch, RootState } from '../../store'

const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0]
  if (file && file.type === 'application/pdf') {
    console.log('PDF uploaded:', file.name)
    // Handle PDF upload logic here
  }
}

const ExamCreator = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { existingTests = [], loading, error } = useSelector((state: RootState) => state.test)
  const [selectedTestType, setSelectedTestType] = useState<TestType>(TestType.LISTENING)
  const [activeTab, setActiveTab] = useState<'import' | 'existing'>('import')
  const [selectedExam, setSelectedExam] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    dispatch(fetchExistingTests())
  }, [dispatch])

  const filteredExams =
    existingTests?.filter((exam) => exam.title.toLowerCase().includes(searchQuery.toLowerCase())) || []
  const testTypes = [
    { value: TestType.LISTENING, label: 'Listening', icon: Headphones, color: 'bg-blue-500' },
    { value: TestType.READING, label: 'Reading', icon: BookOpen, color: 'bg-green-500' },
    { value: TestType.WRITING, label: 'Writing', icon: PenTool, color: 'bg-purple-500' }
  ]

  const handleCreateExam = () => {
    if (activeTab === 'import') {
      handleCreateFromPDF()
    } else {
      handleCreateFromExisting()
    }
  }

  const handleCreateFromPDF = () => {
    console.log('Creating exam from PDF import')
    console.log('Test Type:', selectedTestType)
    // Add your PDF import exam creation logic here
    // This could include:
    // - Processing the uploaded PDF
    // - Extracting content based on test type
    // - Creating exam structure
    // - Navigating to exam builder
  }

  const handleCreateFromExisting = () => {
    console.log('Creating exam from existing template')
    console.log('Selected Exam ID:', selectedExam)
    console.log('Test Type from existing exam:', existingTests.find((exam) => exam.testId === selectedExam)?.testType)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-6xl mx-auto px-6 py-6'>
          <div className='flex items-center space-x-3'>
            <div className='w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center'>
              <BookOpen className='w-7 h-7 text-white' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>Exam Creator</h1>
              <p className='text-gray-600'>Create and manage your educational assessments</p>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-6 py-8'>
        {/* Hero Section */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6 shadow-lg'>
            <Plus className='w-10 h-10 text-white' />
          </div>
          <h2 className='text-4xl font-bold text-gray-900 mb-4'>Create Your Exam</h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Build comprehensive assessments by importing PDF materials or selecting from our curated exam library
          </p>
        </div>

        {/* Tab Navigation */}
        <div className='flex justify-center mb-8'>
          <div className='bg-white rounded-xl p-2 shadow-lg border'>
            <div className='flex space-x-2'>
              <button
                onClick={() => setActiveTab('import')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'import'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Upload className='w-5 h-5 inline-block mr-2' />
                Import PDF
              </button>
              <button
                onClick={() => setActiveTab('existing')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'existing'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <BookOpen className='w-5 h-5 inline-block mr-2' />
                Choose Existing
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className='bg-white rounded-2xl shadow-xl border overflow-hidden'>
          {activeTab === 'import' ? (
            <div className='p-8'>
              {/* Test Type Selection */}
              <div className='mb-8'>
                <label className='block text-lg font-semibold text-gray-900 mb-4'>Select Test Type</label>
                <div className='grid grid-cols-3 gap-4'>
                  {testTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedTestType(type.value)}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                        selectedTestType === type.value
                          ? 'border-indigo-500 bg-indigo-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className='flex items-center space-x-4'>
                        <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center`}>
                          <type.icon className='w-6 h-6 text-white' />
                        </div>
                        <div className='text-left'>
                          <h3 className='font-semibold text-gray-900'>{type.label}</h3>
                          <p className='text-sm text-gray-600'>
                            {type.value === TestType.LISTENING
                              ? 'Audio-based assessments'
                              : type.value === TestType.READING
                                ? 'Text comprehension tests'
                                : 'Essay & composition tasks'}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* PDF Upload */}
              <div className='relative'>
                <input
                  type='file'
                  accept='.pdf'
                  onChange={handleFileUpload}
                  className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                  id='pdf-upload'
                />
                <label
                  htmlFor='pdf-upload'
                  className='flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 cursor-pointer group'
                >
                  <div className='w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200'>
                    <FileText className='w-8 h-8 text-white' />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-900 mb-2'>Upload PDF Document</h3>
                  <p className='text-gray-600 text-center max-w-md'>
                    Drop your PDF file here or click to browse. We'll extract the content to create your{' '}
                    {selectedTestType} exam.
                  </p>
                  <div className='mt-4 px-6 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium'>Choose File</div>
                </label>
              </div>
            </div>
          ) : (
            <div className='p-8'>
              {/* Search Bar */}
              <div className='mb-8'>
                <div className='relative max-w-md mx-auto'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <input
                    type='text'
                    placeholder='Search existing exams...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                  />
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className='text-center py-8'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto'></div>
                  <p className='mt-4 text-gray-600'>Loading exams...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className='text-center py-8'>
                  <p className='text-red-600'>{error}</p>
                </div>
              )}

              {/* Exam Grid */}
              {!loading && !error && (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {filteredExams.map((exam) => (
                    <div
                      key={exam.testId}
                      onClick={() => setSelectedExam(exam.testId)}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedExam === exam.testId
                          ? 'border-indigo-500 bg-indigo-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div className='flex items-start justify-between mb-4'>
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            exam.testType === TestType.LISTENING
                              ? 'bg-blue-100'
                              : exam.testType === TestType.READING
                                ? 'bg-green-100'
                                : 'bg-purple-100'
                          }`}
                        >
                          {exam.testType === TestType.LISTENING ? (
                            <Headphones className='w-6 h-6 text-blue-600' />
                          ) : exam.testType === TestType.READING ? (
                            <BookOpen className='w-6 h-6 text-green-600' />
                          ) : (
                            <PenTool className='w-6 h-6 text-purple-600' />
                          )}
                        </div>
                      </div>
                      <h3 className='font-semibold text-gray-900 mb-2'>{exam.title}</h3>
                      <p className='text-gray-600 text-sm mb-3 capitalize'>{exam.testType.toLowerCase()} Assessment</p>
                      <div className='flex items-center justify-between text-sm text-gray-500'>
                        <span>{exam.totalQuestions} Questions</span>
                        <span className='text-indigo-600 font-medium'>Select</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && filteredExams.length === 0 && (
                <div className='text-center py-8'>
                  <p className='text-gray-600'>No exams found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className='flex justify-center mt-8 space-x-4'>
          <button className='px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200'>
            Cancel
          </button>
          <button
            onClick={handleCreateExam}
            className='px-8 py-3 bg-blue-800 hover:bg-blue-900 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl font-medium'
          >
            Create Exam
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExamCreator
