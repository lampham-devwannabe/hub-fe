import { CommonQuestionProps } from '../../pages/Test/TestView'
import { AnswerInput } from './AnswerInput'

export function ShortAnswer({ element, mode, selectedAnswers, handleChange }: CommonQuestionProps) {
  return (
    <div className='mb-8'>
      {element.title && <h3 className='font-semibold mb-2'>{element.title}</h3>}
      {element.instructions && <p className='text-sm text-gray-600 mb-4'>{element.instructions}</p>}

      <div className='space-y-4'>
        {element.questions.map((question) => (
          <div key={question.questionId} className='bg-white border border-gray-300 rounded-md p-4'>
            <div className='mb-2 text-sm font-medium text-gray-700'>
              {question.questionNumber}. {question.questionText}
            </div>
            <AnswerInput
              question={question}
              selectedAnswer={selectedAnswers[question.questionId] || ''}
              handleChange={handleChange}
              mode={mode}
            />
            {mode === 'exam' && question.answer?.explanation && (
              <div className='mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded'>{question.answer.explanation}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
