import { CheckCircle, XCircle } from 'lucide-react'
import { CommonQuestionProps } from '../../pages/Test/TestView'
import { Card } from '../ui/card'

export function Matching({ element, mode, selectedAnswers, handleChange }: CommonQuestionProps) {
  const options = element.options || []

  return (
    <div className='mb-8'>
      <h3 className='font-semibold mb-3'>{element.title}</h3>

      {/* Option Table */}
      <Card className='mb-6 p-4'>
        <h4 className='font-medium mb-2'>Options</h4>
        <ul className='list-disc list-inside text-sm text-gray-700'>
          {options.map((option) => (
            <li key={option.optionKey}>
              <span className='font-semibold'>{option.optionKey}.</span> {option.optionText}
            </li>
          ))}
        </ul>
      </Card>

      {/* Questions */}
      <div className='space-y-4'>
        {element.questions.map((question) => {
          const selected = selectedAnswers[question.questionId]
          const correct = question.answer?.correctAnswer
          const showIcon = mode === 'edit' && selected
          const isCorrect = selected === correct

          return (
            <div key={question.questionId} className='bg-white border border-gray-300 rounded-md p-4'>
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center space-x-3'>
                  <div className='w-6 h-6 rounded-full bg-gray-200 text-xs flex items-center justify-center font-semibold text-gray-700'>
                    {question.questionNumber}
                  </div>
                  <span>{question.questionText}</span>
                </div>

                {showIcon &&
                  (isCorrect ? (
                    <CheckCircle className='text-green-500 w-5 h-5' />
                  ) : (
                    <XCircle className='text-red-500 w-5 h-5' />
                  ))}
              </div>

              <div className='pl-9'>
                <select
                  className='border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring focus:ring-blue-300'
                  value={selected || ''}
                  onChange={(e) => handleChange(question.questionId, e.target.value)}
                >
                  <option value='' disabled>
                    Select an option
                  </option>
                  {options.map((option) => (
                    <option key={option.optionKey} value={option.optionKey}>
                      {option.optionKey}
                    </option>
                  ))}
                </select>
              </div>

              {mode === 'edit' && question.answer?.explanation && (
                <div className='mt-3 bg-gray-50 border-l-4 border-blue-400 px-4 py-2 text-sm text-gray-700'>
                  <strong>Explanation:</strong> {question.answer.explanation}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
