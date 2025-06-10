import React, { useState } from 'react'
import { CheckCircle, XCircle, Upload, Image as ImageIcon } from 'lucide-react'
import { CommonQuestionProps } from '../../pages/Test/TestView'

export const Writing: React.FC<CommonQuestionProps> = ({ element, mode, selectedAnswers, handleChange }) => {
  // Check if this is Task 1 (contains "20 minutes" in instructions)
  const isTask1 = element.instructions?.toLowerCase().includes('20 minutes')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  // Get the question (writing tasks typically have one question per group)
  const question = element.questions?.[0]

  if (!question) {
    return (
      <div className='mb-8 p-4 border border-red-200 bg-red-50 rounded-lg'>
        <p className='text-red-600'>No question found in this writing task.</p>
      </div>
    )
  }

  const selectedAnswer = selectedAnswers[question.questionId] || ''
  const correctAnswer = question.answer?.correctAnswer
  const explanation = question.answer?.explanation
  const showIcon = mode === 'edit' && correctAnswer != null && selectedAnswer.length > 0
  const isCorrect = selectedAnswer === correctAnswer

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setUploadedImage(imageUrl)
      // TODO: Here you would typically upload to your server and get back a URL
      console.log('Image uploaded:', file.name)
    }
  }

  // Edit Mode - Show questions and upload form
  if (mode === 'edit') {
    return (
      <div className='mb-8'>
        <h3 className='font-semibold mb-2 text-lg'>{element.title}</h3>

        {/* Instructions */}
        {element.instructions && (
          <div className='mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg'>
            <p className='text-blue-800 text-sm whitespace-pre-wrap'>{element.instructions}</p>
          </div>
        )}

        {/* Question Display */}
        <div className='mb-6 p-4 bg-white border border-gray-300 rounded-lg'>
          <div className='flex items-center justify-between mb-3'>
            <h4 className='font-medium text-gray-700'>Question {question.questionNumber}</h4>
            {showIcon && (
              <div className='flex items-center gap-1'>
                {isCorrect ? (
                  <CheckCircle className='text-green-500 w-5 h-5' />
                ) : (
                  <XCircle className='text-red-500 w-5 h-5' />
                )}
              </div>
            )}
          </div>

          <p className='text-gray-800 mb-4'>{question.questionText}</p>

          {/* Content/Supporting Text if available */}
          {element.content && (
            <div className='mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg'>
              <p className='text-sm text-gray-700 whitespace-pre-wrap'>{element.content}</p>
            </div>
          )}
        </div>

        {/* Image Upload Section for Task 1 */}
        {isTask1 && (
          <div className='mb-6 p-4 bg-gray-50 border border-gray-300 rounded-lg'>
            <h4 className='font-medium mb-3 text-gray-700 flex items-center gap-2'>
              <ImageIcon className='w-5 h-5' />
              Chart/Diagram Image
            </h4>

            {/* Current Image or Upload Area */}
            {element.imageUrl || uploadedImage ? (
              <div className='mb-4'>
                <img
                  src={uploadedImage || element.imageUrl}
                  alt='Writing Task 1 Chart/Diagram'
                  className='w-full max-w-md h-auto rounded border border-gray-200 shadow-sm'
                />
                <p className='text-xs text-gray-500 mt-2'>{uploadedImage ? 'Newly uploaded image' : 'Current image'}</p>
              </div>
            ) : (
              <div className='w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4'>
                <div className='text-center'>
                  <ImageIcon className='w-12 h-12 text-gray-400 mx-auto mb-2' />
                  <p className='text-gray-500 text-sm'>No image uploaded</p>
                </div>
              </div>
            )}

            {/* Upload Form */}
            <div className='flex items-center gap-4'>
              <label className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors'>
                <Upload className='w-4 h-4' />
                {element.imageUrl || uploadedImage ? 'Replace Image' : 'Upload Image'}
                <input type='file' accept='image/*' onChange={handleImageUpload} className='hidden' />
              </label>

              {(element.imageUrl || uploadedImage) && (
                <button
                  onClick={() => {
                    setUploadedImage(null)
                    // TODO: Here you would remove the image from the server
                  }}
                  className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
                >
                  Remove Image
                </button>
              )}
            </div>

            <p className='text-xs text-gray-600 mt-2'>Supported formats: JPG, PNG, GIF. Max size: 5MB</p>
          </div>
        )}

        {/* Explanation/Model Answer */}
        {explanation && (
          <div className='mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg'>
            <h5 className='font-semibold text-yellow-800 mb-1'>Model Answer/Explanation:</h5>
            <p className='text-sm text-yellow-700 whitespace-pre-wrap'>{explanation}</p>
          </div>
        )}
      </div>
    )
  }

  // Exam Mode - Show writing interface for students
  return (
    <div className='mb-8'>
      <h3 className='font-semibold mb-2 text-lg'>{element.title}</h3>

      {/* Instructions */}
      {element.instructions && (
        <div className='mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg'>
          <p className='text-blue-800 text-sm whitespace-pre-wrap'>{element.instructions}</p>
        </div>
      )}

      {/* Task 1 Layout: Image + Textarea */}
      {isTask1 ? (
        <div className='grid md:grid-cols-2 gap-6'>
          {/* Left side: Image */}
          <div className='bg-gray-50 border border-gray-300 rounded-lg p-4'>
            <h4 className='font-medium mb-3 text-gray-700'>Chart/Diagram</h4>
            {element.imageUrl ? (
              <img
                src={element.imageUrl}
                alt='Writing Task 1 Chart/Diagram'
                className='w-full h-auto rounded border border-gray-200 shadow-sm'
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const errorDiv = target.nextElementSibling as HTMLElement
                  if (errorDiv) errorDiv.style.display = 'block'
                }}
              />
            ) : null}
            {!element.imageUrl && (
              <div className='w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center'>
                <p className='text-gray-500 text-sm'>No available image</p>
              </div>
            )}
            {element.imageUrl && (
              <div
                style={{ display: 'none' }}
                className='w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center'
              >
                <p className='text-gray-500 text-sm'>Failed to load image</p>
              </div>
            )}
          </div>

          {/* Right side: Writing Area */}
          <div className='bg-white border border-gray-300 rounded-lg p-4'>
            <div className='flex items-center justify-between mb-3'>
              <h4 className='font-medium text-gray-700'>Your Response</h4>
            </div>

            <textarea
              className='w-full h-64 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Write your response here... (minimum 150 words)'
              value={selectedAnswer}
              onChange={(e) => handleChange(question.questionId, e.target.value)}
            />

            <div className='mt-2 flex justify-between text-xs text-gray-500'>
              <span>Question {question.questionNumber}</span>
              <span>
                {
                  selectedAnswer
                    .trim()
                    .split(/\s+/)
                    .filter((word) => word.length > 0).length
                }{' '}
                words
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Task 2 Layout: Full-width textarea */
        <div className='bg-white border border-gray-300 rounded-lg p-4'>
          <div className='flex items-center justify-between mb-3'>
            <h4 className='font-medium text-gray-700'>Your Essay Response</h4>
          </div>

          <textarea
            className='w-full h-80 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='Write your essay here... (minimum 250 words)'
            value={selectedAnswer}
            onChange={(e) => handleChange(question.questionId, e.target.value)}
          />

          <div className='mt-2 flex justify-between text-xs text-gray-500'>
            <span>Question {question.questionNumber}</span>
            <span>
              {
                selectedAnswer
                  .trim()
                  .split(/\s+/)
                  .filter((word) => word.length > 0).length
              }{' '}
              words
            </span>
          </div>
        </div>
      )}

      {/* Content/Supporting Text if available */}
      {element.content && (
        <div className='mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg'>
          <p className='text-sm text-gray-700 whitespace-pre-wrap'>{element.content}</p>
        </div>
      )}
    </div>
  )
}
