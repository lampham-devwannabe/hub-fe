import {
  SaveProgressRequest,
  SaveQuestionRequest,
  TestAttempt,
  EditWritingRequest,
  TestMonitorResponse,
  StudentEssayResponse,
  GeneralStudentEssayResponse
} from '../../store/slices/attemptSlice'
import api, { ApiResponse } from '../../utils/api'

export const startExam = async (testId: string): Promise<ApiResponse<TestAttempt>> => {
  const response = await api.get(`/exam/start?testId=${testId}`)
  return response.data
}

export const reportLostFocus = async (attemptId: string) => {
  const response = await api.post(`/exam/lost-focus?attemptId=${attemptId}`)
  return response.data
}

export const saveQuestionTime = async (request: SaveQuestionRequest): Promise<ApiResponse<void>> => {
  const response = await api.post('/exam/question-time', request)
  return response.data
}

export const saveProgress = async (request: SaveProgressRequest): Promise<ApiResponse<void>> => {
  const response = await api.post('/exam/save', request)
  return response.data
}

export const submitExam = async (attemptId: string): Promise<ApiResponse<void>> => {
  const response = await api.post(`/exam/submit?attemptId=${attemptId}`)
  return response.data
}

export const submitWritingFeedbacks = async (requests: EditWritingRequest[]): Promise<ApiResponse<void>> => {
  const response = await api.post('/exam/essay/grading', requests)
  return response.data
}

export const getTestAttempts = async (testId: string): Promise<ApiResponse<TestMonitorResponse[]>> => {
  const response = await api.get(`/exam/monitor?testId=${testId}`)
  return response.data
}

export const getStudentEssayResponse = async (attemptId: string): Promise<ApiResponse<StudentEssayResponse>> => {
  const response = await api.get(`/exam/essay/feedback?attemptId=${attemptId}`)
  return response.data
}

export const getStudentsByTestId = async (testId: string): Promise<ApiResponse<GeneralStudentEssayResponse[]>> => {
  const response = await api.get(`/exam/essay/students?testId=${testId}`)
  return response.data
}
