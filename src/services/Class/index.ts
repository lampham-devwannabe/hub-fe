import { GeneralClassInfo, GeneralTestAttemptResponse } from '../../store/slices/classSlice'
import api, { ApiResponse } from '../../utils/api'

export interface JoinClassRequest {
  code: string
  pass?: string
}

export interface AddClassRequest {
  name: string
  code: string
  pass?: string
}

export interface ClassMemberResponse {
  studentId: string
  name: string
  school: string
  hasDone: string // e.g. "2 / 4"
}

export const generalClassApi = async (): Promise<ApiResponse<GeneralClassInfo[]>> => {
  const response = await api.get('/class/general/list')
  return response.data
}

export const getTestAttemptsInClass = async (classId: string): Promise<ApiResponse<GeneralTestAttemptResponse[]>> => {
  const response = await api.get(`/test/class/general?classId=${classId}`)
  return response.data
}

export const joinClass = async (request: JoinClassRequest): Promise<ApiResponse<void>> => {
  const response = await api.post('/class/join', request)
  return response.data
}

export const createClass = async (request: AddClassRequest): Promise<ApiResponse<void>> => {
  const response = await api.post('/class/create', request)
  return response.data
}

export const generateClassCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '123456789'
  let code = ''

  for (let i = 0; i < 6; i++) {
    if (Math.random() < 0.5) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    } else {
      code += numbers.charAt(Math.floor(Math.random() * numbers.length))
    }
  }

  return code
}

export const getClassMembers = async (classId: string): Promise<ApiResponse<ClassMemberResponse[]>> => {
  const response = await api.get(`/members?classId=${classId}`)
  return response.data
}

export const deleteMember = async (classId: string, studentId: string): Promise<ApiResponse<void>> => {
  const response = await api.delete(`/members?classId=${classId}&studentId=${studentId}`)
  return response.data
}
