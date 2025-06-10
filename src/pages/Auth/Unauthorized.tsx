import { useNavigate } from 'react-router-dom'

export const Unauthorized = () => {
  const navigate = useNavigate()

  return (
    <div className='flex flex-col items-center justify-center min-h-[80vh] p-4'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-red-600 mb-4'>401 Unauthorized</h1>
        <p className='text-lg text-gray-600 mb-8'>Sorry, you don't have permission to access this page.</p>
        <button
          onClick={() => navigate('/login')}
          className='px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors'
        >
          Return to Login
        </button>
      </div>
    </div>
  )
}
