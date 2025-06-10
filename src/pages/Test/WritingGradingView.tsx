import React, { useState } from 'react'
import { Copy, Eye, EyeOff } from 'lucide-react'
import { WritingResponse } from '../../store/slices/attemptSlice'
import { QuestionGroup, Section } from '../../store/slices/testSlice'

interface WritingGradingViewProps {
  section?: Section
  questionGroup: QuestionGroup
  writingResponses: WritingResponse[]
}

interface GradingCriteria {
  taskAchievement: number
  coherenceCohesion: number
  lexicalResource: number
  grammaticalRange: number
  overall: number
}

export const WritingGradingView: React.FC<WritingGradingViewProps> = ({ section, questionGroup, writingResponses }) => {
  const [showDiff, setShowDiff] = useState<{ [key: string]: boolean }>({})
  const [teacherGrades, setTeacherGrades] = useState<{ [key: string]: GradingCriteria }>({})

  const questionGroupToUse = questionGroup
  const responsesToUse = writingResponses

  const renderDiff = (diffJson: string) => {
    try {
      const diffArray: [string, string][] = JSON.parse(diffJson)
      return diffArray.map(([type, text], index) => {
        if (type === 'EQUAL') return <span key={index}>{text}</span>
        if (type === 'DELETE')
          return (
            <del key={index} className='text-red-600 bg-red-100'>
              {text}
            </del>
          )
        if (type === 'INSERT')
          return (
            <ins key={index} className='text-green-600 bg-green-100'>
              {text}
            </ins>
          )
        return null
      })
    } catch (error) {
      console.log('Error' + error)
      return <span className='text-red-500'>Error parsing diff</span>
    }
  }

  const parseGrades = (gradesJson: string): GradingCriteria => {
    try {
      const grades = JSON.parse(gradesJson)
      return {
        taskAchievement: grades[0] || 0,
        coherenceCohesion: grades[1] || 0,
        lexicalResource: grades[2] || 0,
        grammaticalRange: grades[3] || 0,
        overall: grades[4] || 0
      }
    } catch {
      return { taskAchievement: 0, coherenceCohesion: 0, lexicalResource: 0, grammaticalRange: 0, overall: 0 }
    }
  }

  const updateTeacherGrade = (responseId: string, criteria: keyof GradingCriteria, value: number) => {
    setTeacherGrades((prev) => ({
      ...prev,
      [responseId]: {
        ...prev[responseId],
        [criteria]: value
      }
    }))
  }

  const applyAIGrades = (response: WritingResponse) => {
    const aiGrades = parseGrades(response.aiGraded)
    setTeacherGrades((prev) => ({
      ...prev,
      [response.responseId]: aiGrades
    }))
  }

  const toggleDiff = (responseId: string) => {
    setShowDiff((prev) => ({
      ...prev,
      [responseId]: !prev[responseId]
    }))
  }

  const getWordCount = (text: string) => {
    return text.split(/\s+/).filter((word) => word.length > 0).length
  }

  const getMinWordRequirement = (questionGroup: QuestionGroup) => {
    const question = questionGroup.questions?.[0]
    if (question?.maxWords && question.maxWords > 150) {
      return 250
    }
    return 150
  }

  return (
    <div className='max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen'>
      <h1 className='text-2xl font-bold mb-6 text-gray-800'>Writing Task Grading</h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Panel - Task Information */}
        <div className='lg:col-span-1'>
          <div className='bg-white rounded-lg shadow-sm border p-6 sticky top-6'>
            {/* Section Information */}
            <div className='mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500'>
              <h2 className='text-lg font-semibold text-blue-900 mb-2'>{section?.title || 'Writing Assessment'}</h2>
              {section?.description && <p className='text-blue-700 font-medium text-sm'>{section.description}</p>}
            </div>

            {/* Instructions */}
            {questionGroupToUse.instructions && (
              <div className='mb-4 p-3 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg'>
                <h3 className='font-medium text-orange-800 mb-2'>Instructions</h3>
                <p className='text-orange-700 text-sm whitespace-pre-wrap'>{questionGroupToUse.instructions}</p>
              </div>
            )}

            {/* Question Content */}
            {questionGroupToUse.questions?.map((question) => (
              <div key={question.questionId} className='mb-4 p-4 bg-gray-50 rounded-lg border'>
                <h3 className='font-medium text-gray-700 mb-2'>
                  {questionGroupToUse.title || `Question ${question.questionNumber}`}
                </h3>
                {question.prefix && <p className='text-gray-600 mb-2 leading-relaxed'>{question.prefix}</p>}
                {question.questionText && <p className='text-gray-600 leading-relaxed'>{question.questionText}</p>}
                {question.maxWords && (
                  <div className='mt-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded inline-block'>
                    Minimum: {getMinWordRequirement(questionGroupToUse)} words
                  </div>
                )}
              </div>
            ))}

            {/* Reference Image */}
            {questionGroupToUse.imageUrl && (
              <div className='mt-4'>
                <h4 className='font-medium text-gray-700 mb-2'>Reference Image</h4>
                <img
                  src={questionGroupToUse.imageUrl}
                  alt='Writing task reference'
                  className='w-full rounded border border-gray-200'
                />
              </div>
            )}

            {/* Additional Content */}
            {questionGroupToUse.content && (
              <div className='mt-4 p-3 bg-gray-50 border border-gray-200 rounded'>
                <h4 className='font-medium text-gray-700 mb-2'>Additional Information</h4>
                <p className='text-sm text-gray-700 whitespace-pre-wrap'>{questionGroupToUse.content}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Student Responses */}
        <div className='lg:col-span-2 space-y-6'>
          {responsesToUse.map((response) => {
            const aiGrades = parseGrades(response.aiGraded)
            const currentTeacherGrades = teacherGrades[response.responseId] || parseGrades(response.teacherGraded)
            const wordCount = getWordCount(response.originalText)
            const minWords = getMinWordRequirement(questionGroupToUse)
            const meetsWordCount = wordCount >= minWords

            return (
              <div key={response.responseId} className='bg-white rounded-lg shadow-sm border'>
                {/* Header */}
                <div className='p-4 border-b border-gray-200'>
                  <div className='flex justify-between items-center'>
                    <div>
                      <h3 className='text-lg font-semibold text-gray-700'>Student Response</h3>
                      <div className='flex items-center gap-4 mt-1'>
                        <span className='text-sm text-gray-500'>
                          Submitted: {new Date(response.submittedAt).toLocaleString()}
                        </span>
                        <span
                          className={`text-sm px-2 py-1 rounded ${
                            meetsWordCount ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {wordCount} words {meetsWordCount ? '✓' : `(min: ${minWords})`}
                        </span>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => toggleDiff(response.responseId)}
                        className='flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors'
                      >
                        {showDiff[response.responseId] ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                        {showDiff[response.responseId] ? 'Hide Diff' : 'Show Diff'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className='p-6'>
                  {/* Writing Areas */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                    {/* Student Original Text */}
                    <div>
                      <h4 className='font-medium text-gray-700 mb-2'>Student Answer</h4>
                      <div className='bg-gray-50 border border-gray-300 rounded-lg p-4 h-64 overflow-y-auto'>
                        <p className='text-gray-800 whitespace-pre-wrap font-mono text-sm leading-relaxed'>
                          {response.originalText}
                        </p>
                      </div>
                    </div>

                    {/* Teacher Edit Area */}
                    <div>
                      <h4 className='font-medium text-gray-700 mb-2'>Teacher Edit</h4>
                      {showDiff[response.responseId] ? (
                        <div className='bg-white border border-gray-300 rounded-lg p-4 h-64 overflow-y-auto'>
                          <div className='whitespace-pre-wrap font-mono text-sm leading-relaxed'>
                            {renderDiff(response.diffJson)}
                          </div>
                        </div>
                      ) : (
                        <textarea
                          className='w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm leading-relaxed'
                          placeholder='Edit student response here...'
                          defaultValue={response.finalText}
                        />
                      )}
                    </div>
                  </div>

                  {/* Grading Section */}
                  <div className='border-t border-gray-200 pt-6'>
                    <div className='flex justify-between items-center mb-4'>
                      <h4 className='font-semibold text-gray-700'>IELTS Writing Assessment</h4>
                      <button
                        onClick={() => applyAIGrades(response)}
                        className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                      >
                        <Copy className='w-4 h-4' />
                        Apply AI Results
                      </button>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      {/* AI Grades */}
                      <div>
                        <h5 className='font-medium text-gray-600 mb-3'>AI Suggested Grades</h5>
                        <div className='space-y-3'>
                          {[
                            { key: 'taskAchievement', label: 'Task Achievement', value: aiGrades.taskAchievement },
                            {
                              key: 'coherenceCohesion',
                              label: 'Coherence & Cohesion',
                              value: aiGrades.coherenceCohesion
                            },
                            { key: 'lexicalResource', label: 'Lexical Resource', value: aiGrades.lexicalResource },
                            {
                              key: 'grammaticalRange',
                              label: 'Grammatical Range & Accuracy',
                              value: aiGrades.grammaticalRange
                            },
                            { key: 'overall', label: 'Overall Band Score', value: aiGrades.overall }
                          ].map((criteria) => (
                            <div key={criteria.key} className='flex items-center justify-between'>
                              <label className='text-sm font-medium text-gray-600'>{criteria.label}:</label>
                              <input
                                type='number'
                                value={criteria.value}
                                readOnly
                                className='w-16 px-2 py-1 text-center border border-gray-300 rounded bg-gray-100 text-gray-600'
                                step='0.5'
                                min='0'
                                max='9'
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Teacher Grades */}
                      <div>
                        <h5 className='font-medium text-gray-600 mb-3'>Teacher Assessment</h5>
                        <div className='space-y-3'>
                          {[
                            { key: 'taskAchievement' as keyof GradingCriteria, label: 'Task Achievement' },
                            { key: 'coherenceCohesion' as keyof GradingCriteria, label: 'Coherence & Cohesion' },
                            { key: 'lexicalResource' as keyof GradingCriteria, label: 'Lexical Resource' },
                            { key: 'grammaticalRange' as keyof GradingCriteria, label: 'Grammatical Range & Accuracy' },
                            { key: 'overall' as keyof GradingCriteria, label: 'Overall Band Score' }
                          ].map((criteria) => (
                            <div key={criteria.key} className='flex items-center justify-between'>
                              <label className='text-sm font-medium text-gray-700'>{criteria.label}:</label>
                              <input
                                type='number'
                                value={currentTeacherGrades[criteria.key] || 0}
                                onChange={(e) =>
                                  updateTeacherGrade(response.responseId, criteria.key, parseFloat(e.target.value) || 0)
                                }
                                className='w-16 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                                step='0.5'
                                min='0'
                                max='9'
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Final Score & Assessment Summary */}
                    <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
                      <div className='flex justify-between items-center mb-2'>
                        <span className='font-medium text-gray-700'>Overall Band Score:</span>
                        <span className='text-lg font-bold text-blue-600'>
                          {currentTeacherGrades.overall || response.finalScore || 0}/9
                        </span>
                      </div>
                      <div className='text-sm text-gray-600'>
                        <div className='flex justify-between'>
                          <span>Word Count:</span>
                          <span className={meetsWordCount ? 'text-green-600' : 'text-red-600'}>
                            {wordCount} / {minWords} minimum
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
