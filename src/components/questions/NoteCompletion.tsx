import React from 'react'
import { AnswerInput } from './AnswerInput'
import { CommonQuestionProps } from '../../pages/Test/TestView'

export function NoteCompletion({ element, mode, selectedAnswers, handleChange }: CommonQuestionProps) {
  return (
    <div className='mb-8'>
      <h3 className='font-semibold mb-2'>{element.title}</h3>
      <div className='border border-gray-300 p-4 rounded-md bg-white'>
        <div className='prose prose-sm max-w-none'>
          {element.questions?.map((question) => (
            <React.Fragment key={question.questionNumber}>
              {question.prefix}{' '}
              <AnswerInput
                question={question}
                mode={mode}
                selectedAnswer={selectedAnswers[question.questionId] || ''}
                handleChange={handleChange}
              />{' '}
              {question.suffix}{' '}
              {mode === 'edit' && question.answer?.explanation && (
                <div className='mt-2 text-sm bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded'>
                  <strong>Explanation:</strong> {question.answer.explanation}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
