import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  generalClassApi,
  getTestAttemptsInClass,
  joinClass,
  createClass,
  getClassMembers,
  deleteMember,
  JoinClassRequest,
  AddClassRequest,
  ClassMemberResponse
} from '../../services/Class'

export interface GeneralClassInfo {
  classId: string
  name: string
  code: string
  studentCount: number
  teacher: string
}

interface GeneralClassInfoState {
  generalClass: GeneralClassInfo[] | null
  generalTestAttempt: GeneralTestAttemptResponse[] | null
  classMembers: ClassMemberResponse[] | null
  loading: boolean
  error: string | null
}

export interface GeneralTestAttemptResponse {
  testId: string
  title: string
  testType: 'LISTENING' | 'READING' | 'WRITING'
  durationMinutes: number
  createdAt: string
  status: 'COMPLETED' | 'NOT_STARTED' | 'IN_PROGRESS'
  attemptNumber?: number // only student
  score?: number // only student
  totalTimeSpent?: number // only student
  // Optional teacher-only fields
  numberOfAttempts?: number
  averageScore?: number
  latestSubmission?: string
}

const initialState: GeneralClassInfoState = {
  generalClass: null,
  generalTestAttempt: null,
  classMembers: null,
  loading: false,
  error: null
}

export const getGeneralTestAttempt = createAsyncThunk(
  'class/testAttempt',
  async (classId: string, { rejectWithValue }) => {
    try {
      const response = await getTestAttemptsInClass(classId)

      const mappedResult: GeneralTestAttemptResponse[] = response.result.map(
        (testAttempt: GeneralTestAttemptResponse) => ({
          testId: testAttempt.testId,
          title: testAttempt.title,
          testType: testAttempt.testType,
          durationMinutes: testAttempt.durationMinutes,
          createdAt: testAttempt.createdAt,
          status: testAttempt.status,
          attemptNumber: testAttempt.attemptNumber,
          score: testAttempt.score,
          totalTimeSpent: testAttempt.totalTimeSpent,
          numberOfAttempts: testAttempt.numberOfAttempts,
          averageScore: testAttempt.averageScore,
          latestSubmission: testAttempt.latestSubmission
        })
      )
      return mappedResult
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
        (error as { message?: string }).message ||
        'Failed to fetch test attempt'
      return rejectWithValue(errorMessage)
    }
  }
)
export const getGeneralclass = createAsyncThunk('class/general', async (_, { rejectWithValue }) => {
  try {
    const response = await generalClassApi()

    const mappedResult: GeneralClassInfo[] = response.result.map((classData: GeneralClassInfo) => ({
      classId: classData.classId,
      name: classData.name,
      code: classData.code,
      studentCount: classData.studentCount,
      teacher: classData.teacher
    }))

    return mappedResult
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
      (error as { message?: string }).message ||
      'You are not in this class'
    return rejectWithValue(errorMessage)
  }
})

export const joinClassThunk = createAsyncThunk(
  'class/join',
  async (request: JoinClassRequest, { rejectWithValue, dispatch }) => {
    try {
      await joinClass(request)
      // Refresh the class list after joining
      dispatch(getGeneralclass())
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
        (error as { message?: string }).message ||
        'Failed to join class'
      return rejectWithValue(errorMessage)
    }
  }
)

export const createClassThunk = createAsyncThunk(
  'class/create',
  async (request: AddClassRequest, { rejectWithValue, dispatch }) => {
    try {
      await createClass(request)
      // Refresh the class list after creating
      dispatch(getGeneralclass())
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
        (error as { message?: string }).message ||
        'Failed to create class'
      return rejectWithValue(errorMessage)
    }
  }
)

export const getClassMembersThunk = createAsyncThunk('class/members', async (classId: string, { rejectWithValue }) => {
  try {
    const response = await getClassMembers(classId)
    return response.result
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
      (error as { message?: string }).message ||
      'Failed to fetch class members'
    return rejectWithValue(errorMessage)
  }
})

export const deleteMemberThunk = createAsyncThunk(
  'class/deleteMember',
  async ({ classId, studentId }: { classId: string; studentId: string }, { rejectWithValue, dispatch }) => {
    try {
      await deleteMember(classId, studentId)
      // Refresh the class members list after deletion
      dispatch(getClassMembersThunk(classId))
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
        (error as { message?: string }).message ||
        'Failed to delete member'
      return rejectWithValue(errorMessage)
    }
  }
)

const classSlice = createSlice({
  name: 'class',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getGeneralclass.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(getGeneralclass.fulfilled, (state, action) => {
      state.loading = false
      state.generalClass = action.payload
    })
    builder.addCase(getGeneralclass.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
    builder.addCase(getGeneralTestAttempt.fulfilled, (state, action) => {
      state.generalTestAttempt = action.payload
    })
    builder.addCase(getGeneralTestAttempt.rejected, (state, action) => {
      state.error = action.payload as string
    })
    builder.addCase(joinClassThunk.rejected, (state, action) => {
      state.error = action.payload as string
    })
    builder.addCase(createClassThunk.rejected, (state, action) => {
      state.error = action.payload as string
    })
    builder.addCase(getClassMembersThunk.fulfilled, (state, action) => {
      state.classMembers = action.payload
    })
    builder.addCase(getClassMembersThunk.rejected, (state, action) => {
      state.error = action.payload as string
    })
    builder.addCase(deleteMemberThunk.rejected, (state, action) => {
      state.error = action.payload as string
    })
  }
})

export default classSlice.reducer
