/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { refreshAuthApi, loginApi, logoutApi, registerApi, AddAccountRequest } from '../../services/Auth/index' // API call defined later
import { profileApi } from '../../services/Account'

interface BaseUser {
  id: string
  name: string
  email: string
}

interface Teacher extends BaseUser {
  role: 'TEACHER'
  priceClass: number
  studentCount: number
}

interface Student extends BaseUser {
  role: 'STUDENT'
}

export type User = Teacher | Student

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
}

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      // const credentials = {email, password}
      await loginApi(credentials) // Assume API returns user data
      const profileResponse = await profileApi()
      let user: User
      // Map the profile data to User interface
      if (profileResponse.role === 'TEACHER') {
        user = {
          id: profileResponse.id,
          role: 'TEACHER',
          name: profileResponse.name,
          email: profileResponse.email,
          priceClass: profileResponse.priceClass,
          studentCount: profileResponse.studentCount
        }
      } else {
        user = {
          id: profileResponse.id,
          role: 'STUDENT',
          name: profileResponse.name,
          email: profileResponse.email
        }
      }

      return user
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
        (error as { message?: string }).message ||
        'Login failed'
      return rejectWithValue(errorMessage)
    }
  }
)

// Async thunk for register
export const register = createAsyncThunk('auth/register', async (request: AddAccountRequest, { rejectWithValue }) => {
  try {
    await registerApi(request)
    return { message: 'Registration successful' }
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
      (error as { message?: string }).message ||
      'Registration failed'
    return rejectWithValue(errorMessage)
  }
})

// Async thunk for logout
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    // Assume backend handles logout via API (e.g., invalidate session)
    const response = await logoutApi()
    return response // No need to return user data on logout
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
      (error as { message?: string }).message ||
      'Logout failed'
    return rejectWithValue(errorMessage)
  }
})

export const refreshAuth = createAsyncThunk('auth/refreshAuth', async (_, { rejectWithValue }) => {
  try {
    const authResponse = await refreshAuthApi()

    if (!authResponse.authenticated) {
      return rejectWithValue('Not authenticated')
    }

    const profileResponse = await profileApi()
    let user: User
    // Map the profile data to User interface
    if (profileResponse.role === 'TEACHER') {
      user = {
        id: profileResponse.id,
        role: 'TEACHER',
        name: profileResponse.name,
        email: profileResponse.email,
        priceClass: profileResponse.priceClass,
        studentCount: profileResponse.studentCount
      }
    } else {
      user = {
        id: profileResponse.id,
        role: 'STUDENT',
        name: profileResponse.name,
        email: profileResponse.email
      }
    }
    return user
  } catch (err) {
    return rejectWithValue('Auth refresh failed')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload
      state.isAuthenticated = true
    },
    // Optional: Manual state reset if needed
    resetAuth(state) {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false
        // Don't auto-login after registration
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.isAuthenticated = false
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Refresh Auth
    builder
      .addCase(refreshAuth.fulfilled, (state, action: PayloadAction<User>) => {
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(refreshAuth.rejected, (state) => {
        state.isAuthenticated = false
        state.user = null
      })
  }
})

export const { resetAuth } = authSlice.actions
export default authSlice.reducer
