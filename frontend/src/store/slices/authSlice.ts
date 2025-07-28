import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type User = {
  id: string
  name: string
  email: string
  // добавь другие поля по необходимости
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
  },
})

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions

export default authSlice.reducer
