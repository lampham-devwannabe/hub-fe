/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { checkAuthApi, loginApi, logoutApi } from '../../services/Auth/index' // API call defined later
import { profileApi } from '../../services/Account'

export interface User {
  id: string
  role: 'Teacher' | 'Student'
  name: string
  email: string
}

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
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // const credentials = {email, password}
      await loginApi(credentials) // Assume API returns user data
      const profileResponse = await profileApi()

      // Map the profile data to User interface
      const user: User = {
        id: profileResponse.id,
        role: profileResponse.role,
        name: profileResponse.name,
        email: profileResponse.email
      }

      return user
    } catch (_error) {
      return rejectWithValue('Login failed')
    }
  }
)

// Async thunk for logout
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    // Assume backend handles logout via API (e.g., invalidate session)
    const response = await logoutApi()
    return response // No need to return user data on logout
  } catch (error) {
    return rejectWithValue('Logout failed')
  }
})

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    await checkAuthApi()
    const profile = await profileApi()
    const user: User = {
      id: profile.id,
      role: profile.role,
      name: profile.name,
      email: profile.email
    }

    return user
  } catch (err) {
    return rejectWithValue('Auth check failed')
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

    // Check Auth
    builder
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<User>) => {
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false
        state.user = null
      })
  }
})

export const { resetAuth } = authSlice.actions
export default authSlice.reducer
