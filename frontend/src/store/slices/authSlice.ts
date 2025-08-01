import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  registerUser,
  loginUser,
  RegisterPayload,
  LoginPayload,
  AuthResponse,
} from '../../api/authApi'

type User = {
  id: string
  name: string
  email: string
}

type AuthState = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

export const registerThunk = createAsyncThunk<AuthResponse, RegisterPayload>(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await registerUser(payload)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Registration failed')
    }
  }
)

export const loginThunk = createAsyncThunk<AuthResponse, LoginPayload>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await loginUser(payload)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Login failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true
      state.error = null
    },
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.loading = false
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
    setAuth(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.loading = false
      state.error = null
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, setAuth } =
  authSlice.actions

export default authSlice.reducer
