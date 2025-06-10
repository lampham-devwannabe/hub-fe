import { CheckCircle, XCircle } from 'lucide-react' // you can swap icons if needed
import { CommonQuestionProps } from '../../pages/Test/TestView'

export function MultipleChoice({ element, mode, handleChange, selectedAnswers }: CommonQuestionProps) {
  return (
    <div className='mb-8'>
      <p className='mb-4 font-bold'>{element.instructions}</p>
      <div className='space-y-6'>
        {element.questions?.map((question) => {
          const selected = selectedAnswers[question.questionId]
          const correct = question.answer?.correctAnswer
          const explanation = question.answer?.explanation

          const showIcon = mode === 'edit' && correct != null && selected != null

          const isCorrect = selected === correct

          return (
            <div key={question.questionNumber} className='border border-gray-300 p-4 rounded-md bg-white'>
              {/* Question Number & Text */}
              <div className='mb-3 flex items-center'>
                <div className='flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-xs font-medium text-gray-700 mr-3'>
                  {question.questionNumber}
                </div>
                <span>{question.questionText}</span>
              </div>

              {/* Options */}
              <div className='space-y-2 pl-6 relative'>
                {question.options?.map((option) => (
                  <label key={option.optionKey} className='flex items-center space-x-2 cursor-pointer'>
                    <input
                      type='radio'
                      name={`question-${question.questionId}`}
                      value={option.optionKey}
                      checked={selected === option.optionKey}
                      onChange={() => handleChange(question.questionId, option.optionKey)}
                      className='h-4 w-4 text-blue-600 focus:ring-blue-500'
                    />
                    <span className='font-medium'>{option.optionKey}.</span>
                    <span>{option.optionText}</span>
                  </label>
                ))}

                {/* ✅ / ❌ */}
                {showIcon && (
                  <div className='absolute top-0 right-0'>
                    {isCorrect ? (
                      <CheckCircle className='text-green-500 w-5 h-5' />
                    ) : (
                      <XCircle className='text-red-500 w-5 h-5' />
                    )}
                  </div>
                )}
              </div>

              {/* Explanation (if available) */}
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
