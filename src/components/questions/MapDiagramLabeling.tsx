import { useState } from 'react'
import { CommonQuestionProps } from '../../pages/Test/TestView'
import { CheckIcon, XIcon } from 'lucide-react'
import { Question } from '../../store/slices/testSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store'
import { uploadResource } from '../../store/slices/resourceSlice'
import { FileType } from '../../services/Resources'

export function MapDiagramLabeling({ element, mode, selectedAnswers, handleChange }: CommonQuestionProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { uploading, uploadError } = useSelector((state: RootState) => state.resource)
  const [imageUrl, setImageUrl] = useState(element.imageUrl || null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    const file = e.target.files[0]

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG, JPEG, and PNG files are supported.')
      return
    }

    if (!element.groupId) {
      alert('Group ID is required for upload.')
      return
    }

    try {
      const result = await dispatch(
        uploadResource({
          folder: 'test-stuff',
          fileType: FileType.IMAGE, // As specified by user, though this seems like it should be IMAGE
          targetId: element.groupId.toString(),
          file
        })
      ).unwrap()

      setImageUrl(result)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload image file.')
    }
  }

  const renderTextQuestions = (questions: Question[]) => {
    return questions
      .filter((q) => q.answerType === 'text')
      .map((q) => {
        const value = selectedAnswers[q.questionId] || ''
        const isCorrect = q.answer?.correctAnswer?.toLowerCase() === value.toLowerCase()
        return (
          <div key={q.questionId} className='flex items-center gap-2 border-b py-2 text-sm'>
            <span>{q.prefix}</span>
            <input
              type='text'
              className='border-b-2 border-gray-400 w-40 text-center focus:outline-none focus:border-blue-500'
              value={value}
              onChange={(e) => handleChange(q.questionId, e.target.value)}
              disabled={mode === 'exam' && !!q.answer}
            />
            <span>{q.suffix}</span>
            {mode === 'exam' && q.answer && (
              <span className='ml-2'>
                {isCorrect ? (
                  <CheckIcon className='w-4 h-4 text-green-500' />
                ) : (
                  <XIcon className='w-4 h-4 text-red-500' />
                )}
              </span>
            )}
          </div>
        )
      })
  }

  return (
    <div className='mb-8'>
      <h3 className='font-semibold mb-4'>{element.title}</h3>

      <div className='flex gap-6'>
        <div className='flex-1 border border-gray-300 rounded p-4 flex flex-col items-center justify-center'>
          {imageUrl ? (
            <img src={imageUrl} alt={element.title} className='max-w-full max-h-[400px] object-contain rounded' />
          ) : mode === 'edit' ? (
            <div className='flex flex-col items-center space-y-3'>
              <input
                type='file'
                accept='image/jpeg,image/jpg,image/png'
                onChange={handleUpload}
                disabled={uploading}
                className='cursor-pointer'
              />
              {uploading && <p className='text-sm text-blue-500'>Uploading...</p>}
              {uploadError && <p className='text-sm text-red-500'>{uploadError}</p>}
            </div>
          ) : (
            <p className='text-gray-500 italic'>No image available</p>
          )}
        </div>

        {element.options && element.options.length > 0 && (
          <div className='w-64 border border-gray-300 rounded p-4 overflow-auto max-h-[400px]'>
            <h4 className='font-semibold mb-2'>Options</h4>
            <ul className='text-sm text-gray-700'>
              {element.options.map((option) => (
                <li key={option.optionKey} className='mb-1'>
                  <span className='font-semibold'>{option.optionKey}.</span> {option.optionText}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Có thể thêm phần render câu hỏi dưới đây, nếu cần */}
      {renderTextQuestions(element.questions)}
    </div>
  )
}
