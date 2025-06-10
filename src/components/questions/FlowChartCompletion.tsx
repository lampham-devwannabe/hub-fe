import { CommonQuestionProps } from '../../pages/Test/TestView'
import { AnswerInput } from './AnswerInput'

export function FlowChartCompletion({ element, mode, selectedAnswers, handleChange }: CommonQuestionProps) {
  return (
    <div className='mb-8'>
      {element.title && <h3 className='font-semibold mb-2'>{element.title}</h3>}
      {element.instructions && <p className='text-sm text-gray-600 mb-4'>{element.instructions}</p>}

      <div className='grid md:grid-cols-2 gap-4'>
        {element.questions.map((question) => (
          <div key={question.questionId} className='bg-white border border-gray-300 rounded-lg p-4 shadow-sm'>
            <div className='mb-2 text-sm text-gray-600 font-medium'>Question {question.questionNumber}</div>
            <div className='flex items-center flex-wrap gap-2'>
              {question.prefix && <span>{question.prefix}</span>}
              <AnswerInput
                question={question}
                mode={mode}
                selectedAnswer={selectedAnswers[question.questionId] || ''}
                handleChange={handleChange}
              />
              {question.suffix && <span>{question.suffix}</span>}
            </div>
            {mode === 'exam' && question.answer?.explanation && (
              <div className='mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded'>{question.answer.explanation}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
