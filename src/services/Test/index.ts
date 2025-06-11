import { Test } from '../../store/slices/testSlice'
import api, { ApiResponse } from '../../utils/api'

export interface AnswerUpdate {
  answerId: number
  correctAnswer: string
}

export interface EditTestRequest {
  testId: string
  title: string
  durationMinutes: number
  allowedAttempts: number
  permissionId: number
  audioUrl: string
  answers: AnswerUpdate[]
}

export const getTestById = async (testId: string): Promise<ApiResponse<Test>> => {
  const response = await api.get(`/test?id=${testId}`)
  return response.data
}

export const getExistingTests = async (): Promise<ApiResponse<Test[]>> => {
  const response = await api.get('/test/existing')
  return response.data
}

export const editTest = async (request: EditTestRequest): Promise<ApiResponse<string>> => {
  const response = await api.put('/test/edit', request)
  return response.data
}

export const importTest = async (file: File, testType: string): Promise<ApiResponse<Test>> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post(`/test/general/import?testType=${testType}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}
