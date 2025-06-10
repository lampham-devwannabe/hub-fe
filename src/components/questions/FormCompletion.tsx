import React from 'react'
import { SupportingText } from '../../store/slices/testSlice'
import { AnswerInput } from './AnswerInput'
import { CommonQuestionProps } from '../../pages/Test/TestView'

export const FormCompletion: React.FC<CommonQuestionProps> = ({ element, mode, selectedAnswers, handleChange }) => {
  const sortedQuestions = [...(element.questions ?? [])].sort((a, b) => a.questionNumber - b.questionNumber)

  const supportMap = new Map<number, SupportingText>()
  element.supportingTexts?.forEach((text) => {
    supportMap.set(text.startQuestionNumber, text)
  })

  return (
    <div className='mb-8'>
      <h3 className='font-semibold mb-2'>{element.title}</h3>
      <div className='border border-gray-300 p-4 rounded-md bg-white'>
        {sortedQuestions.map((question) => {
          const supporting = supportMap.get(question.questionNumber)
          const selectedAnswer = selectedAnswers[question.questionId] || ''

          return (
            <React.Fragment key={question.questionNumber}>
              {/* Supporting Text if available */}
              {supporting && (
                <div className='mb-4 p-3 bg-gray-50 border-l-4 border-gray-300 rounded text-sm text-gray-700'>
                  {supporting.title && <h4 className='font-bold mb-1'>{supporting.title}</h4>}
                  <div>{supporting.content}</div>
                </div>
              )}

              {/* Question block */}
              <div className='mb-3 flex flex-wrap items-center'>
                <div className='flex items-center flex-grow'>
                  {question.prefix && <span className='mr-2 font-semibold'>{question.prefix}</span>}
                  <div className='flex items-center gap-2 flex-grow'>
                    <AnswerInput
                      question={question}
                      mode={mode}
                      selectedAnswer={selectedAnswer}
                      handleChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Explanation (only in edit mode) */}
              {mode === 'edit' && question.answer?.explanation && (
                <div className='ml-[150px] mb-4 text-sm bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded'>
                  <strong>Explanation:</strong> {question.answer.explanation}
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
