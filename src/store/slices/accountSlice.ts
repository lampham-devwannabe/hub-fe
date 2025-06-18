import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { getGeneralDashboardApi, getAllUsersApi, GetAllUsersParams } from '../../services/Account'

export interface GeneralUserResponse {
  total: number
  totalStudents: number
  totalTeachers: number
  recentUsers: number
}

export interface User {
  id: string
  username: string
  role: 'STUDENT' | 'TEACHER' | 'ADMIN'
  dob: string
  // Add other user properties as needed
  city: string
  school: string
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

interface AccountState {
  generalInfo: GeneralUserResponse | null
  users: Page<User> | null
  loading: boolean
  error: string | null
}

const initialState: AccountState = {
  generalInfo: null,
  users: null,
  loading: false,
  error: null
}

// Async thunk for general dashboard info
export const fetchGeneralDashboard = createAsyncThunk(
  'account/fetchGeneralDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getGeneralDashboardApi()
      // Map the API response to our expected format
      const generalInfo: GeneralUserResponse = {
        total: response.total,
        totalStudents: response.totalStudents,
        totalTeachers: response.totalTeachers,
        recentUsers: response.recentUsers
      }
      return generalInfo
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
        (error as { message?: string }).message ||
        'Failed to fetch general dashboard info'
      return rejectWithValue(errorMessage)
    }
  }
)

// Async thunk for paginated users
export const fetchAllUsers = createAsyncThunk(
  'account/fetchAllUsers',
  async (params: GetAllUsersParams, { rejectWithValue }) => {
    try {
      const response = await getAllUsersApi(params)
      // Map the API response to our expected format
      const usersPage: Page<User> = {
        content: response.content.map(
          (user: { id: string; username: string; dob: string; role: string; city: string; school: string }) => ({
            id: user.id,
            username: user.username,
            role: user.role as 'STUDENT' | 'TEACHER' | 'ADMIN',
            dob: user.dob,
            city: user.city,
            school: user.school
          })
        ),
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        size: response.size,
        number: response.number,
        first: response.first,
        last: response.last
      }
      return usersPage
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
        (error as { message?: string }).message ||
        'Failed to fetch users'
      return rejectWithValue(errorMessage)
    }
  }
)

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetAccountState: (state) => {
      state.generalInfo = null
      state.users = null
      state.loading = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // General Dashboard
    builder
      .addCase(fetchGeneralDashboard.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGeneralDashboard.fulfilled, (state, action: PayloadAction<GeneralUserResponse>) => {
        state.loading = false
        state.generalInfo = action.payload
      })
      .addCase(fetchGeneralDashboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // All Users
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<Page<User>>) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { clearError, resetAccountState } = accountSlice.actions
export default accountSlice.reducer
