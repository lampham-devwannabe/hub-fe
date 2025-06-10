import { CheckCircle, XCircle } from 'lucide-react'
import { CommonQuestionProps } from '../../pages/Test/TestView'

interface TfNotGivenProps extends CommonQuestionProps {
  options?: string[] // optional override if using Yes/No/Not Given instead
}

export function TfNotGiven({
  element,
  mode,
  handleChange,
  selectedAnswers,
  options = ['True', 'False', 'Not Given'] // default set
}: TfNotGivenProps) {
  // Normalize answer for comparison (case insensitive)
  const normalizeAnswer = (answer: string) => {
    if (!answer) return ''
    const normalized = answer.toLowerCase().trim()

    // Handle common variations and map to the actual option values
    const mappings: { [key: string]: string } = {
      true: options.find((opt) => opt.toLowerCase() === 'true') || 'True',
      false: options.find((opt) => opt.toLowerCase() === 'false') || 'False',
      'not given': options.find((opt) => opt.toLowerCase() === 'not given') || 'Not Given',
      notgiven: options.find((opt) => opt.toLowerCase() === 'not given') || 'Not Given',
      ng: options.find((opt) => opt.toLowerCase() === 'not given') || 'Not Given',
      yes: options.find((opt) => opt.toLowerCase() === 'yes') || 'Yes',
      no: options.find((opt) => opt.toLowerCase() === 'no') || 'No',
      not_given: options.find((opt) => opt.toLowerCase() === 'not given') || 'Not Given'
    }

    return mappings[normalized] || answer
  }
  return (
    <div className='mb-8'>
      {element.instructions && <h3 className='font-semibold mb-3'>{element.instructions}</h3>}
      <div className='space-y-4'>
        {element.questions?.map((question) => {
          const selected = selectedAnswers[question.questionId]
          const correct = normalizeAnswer(question.answer?.correctAnswer || '')
          const explanation = question.answer?.explanation

          const showIcon = mode === 'edit' && correct != null && selected != null

          const isCorrect = selected === correct

          // In edit mode, pre-select the correct answer if no answer is selected yet
          const displaySelected = mode === 'edit' && !selected ? correct : selected

          return (
            <div key={question.questionNumber} className='bg-white border border-gray-300 rounded-md p-4 relative'>
              {/* Question Number + Text */}
              <div className='mb-3'>
                <span className='inline-flex items-center justify-center bg-gray-100 text-xs font-medium text-gray-700 rounded-full h-5 min-w-5 px-1 mr-2'>
                  {question.questionNumber}
                </span>
                <span>{question.questionText}</span>
              </div>

              {/* Options */}
              <div className='flex space-x-6 pl-6'>
                {options.map((option) => (
                  <label key={option} className='flex items-center space-x-2 cursor-pointer'>
                    <input
                      type='radio'
                      name={`question-${question.questionId}`}
                      id={`q${question.questionId}-${option}`}
                      value={option}
                      className='h-4 w-4 text-blue-600 focus:ring-blue-500'
                      checked={displaySelected === option}
                      onChange={() => handleChange(question.questionId, option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>

              {/* ✅ / ❌ */}
              {showIcon && (
                <div className='absolute top-4 right-4'>
                  {isCorrect ? (
                    <CheckCircle className='text-green-500 w-5 h-5' />
                  ) : (
                    <XCircle className='text-red-500 w-5 h-5' />
                  )}
                </div>
              )}

              {/* Explanation */}
              {explanation && (
                <div className='mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 text-sm text-gray-800 rounded'>
                  <span className='font-semibold'>Explanation:</span> {explanation}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
