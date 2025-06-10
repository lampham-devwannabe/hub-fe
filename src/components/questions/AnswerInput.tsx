import { CheckCircle, XCircle } from 'lucide-react'
import { Question } from '../../store/slices/testSlice'

interface AnswerInputProps {
  question: Question
  mode: 'exam' | 'edit'
  selectedAnswer: string
  handleChange: (questionId: number, value: string) => void
}

export const AnswerInput = ({ question, mode, selectedAnswer, handleChange }: AnswerInputProps) => {
  const correctAnswer = question.answer?.correctAnswer
  const displayValue = mode === 'edit' ? selectedAnswer || correctAnswer : selectedAnswer
  const showIcon =
    mode === 'edit' && correctAnswer != null && (selectedAnswer?.length > 0 || displayValue === correctAnswer)

  const isCorrect =
    selectedAnswer === correctAnswer || (mode === 'edit' && !selectedAnswer && displayValue === correctAnswer)

  return (
    <span className='inline-flex items-center gap-1'>
      <div className='flex-shrink-0 w-4 h-5 rounded-full bg-gray-200 flex items-center justify-center'>
        <span className='text-xs font-medium text-gray-700'>{question.questionNumber}</span>
      </div>
      <div className='relative flex-shrink-0'>
        <input
          type='text'
          className='border-b-2 border-gray-400 w-40 text-center focus:outline-none focus:border-blue-500'
          value={displayValue}
          onChange={(e) => handleChange(question.questionId, e.target.value)}
        />
        {showIcon && (
          <div className='absolute right-[-20px] top-1'>
            {isCorrect ? (
              <CheckCircle className='text-green-500 w-4 h-4' />
            ) : (
              <XCircle className='text-red-500 w-4 h-4' />
            )}
          </div>
        )}
      </div>
    </span>
  )
}
