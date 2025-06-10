import { Question, TableCell } from '../../store/slices/testSlice'
import { AnswerInput } from './AnswerInput'
import { CommonQuestionProps } from '../../pages/Test/TestView'

export const TableCompletion: React.FC<CommonQuestionProps> = ({ element, mode, selectedAnswers, handleChange }) => {
  const getQuestionsByCell = (cellId: number) => element.questions?.filter((q) => q.cellId === cellId)

  const renderQuestion = (question: Question) => {
    const selectedAnswer = selectedAnswers[question.questionId] || ''

    return (
      <div key={question.questionId} className='flex flex-col'>
        <div className='flex flex-wrap gap-2'>
          {question.prefix && <span className='whitespace-normal'>{question.prefix}</span>}
          <AnswerInput question={question} mode={mode} selectedAnswer={selectedAnswer} handleChange={handleChange} />
          {question.suffix && <span className='whitespace-normal'>{question.suffix}</span>}
        </div>
        {mode === 'edit' && question.answer?.explanation && (
          <div className='mt-1 text-sm text-gray-600 border-l-2 border-blue-400 pl-2'>
            {question.answer.explanation}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className='mb-8'>
      {element.title && <h3 className='font-semibold mb-3'>{element.title}</h3>}

      <div className='overflow-x-auto border border-gray-300 rounded-md bg-white'>
        <table className='table-auto w-full text-left'>
          <thead className='bg-gray-100 text-sm'>
            <tr>
              {element.tableHeaders?.map((header) => (
                <th key={header.columnIndex} className='px-4 py-2 font-semibold border-b'>
                  {header.headerText}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {element.tableRows?.map((row) => (
              <tr key={row.rowId}>
                {row.cells?.map((cell: TableCell) => (
                  <td key={cell.cellId} className='px-4 py-3 border-t align-top'>
                    {cell.isQuestion ? (
                      getQuestionsByCell(cell.cellId)?.map(renderQuestion)
                    ) : (
                      <span>{cell.cellText}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
