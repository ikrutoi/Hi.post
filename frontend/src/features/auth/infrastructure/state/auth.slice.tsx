import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState, User } from '../../domain/types'
import { loginThunk, registerThunk } from '../../store/auth.thunks'

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initialized: false,
  userLoginPanelOpen: false,
}

export const authSlice = createSlice({
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
      state.error = null
    },
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
    },
    setUserLoginPanelOpen(state, action: PayloadAction<boolean>) {
      state.userLoginPanelOpen = action.payload
    },
    setAuthInitialized(state) {
      state.initialized = true
    },
    setAuth(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.loading = false
      state.error = null
    },
    setAuthError(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Registration failed'
      })

      .addCase(loginThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Login failed'
      })
  },
})

export const {
  logout,
  setAuth,
  loginStart,
  loginSuccess,
  setAuthInitialized,
  setAuthError,
  setUserLoginPanelOpen,
} = authSlice.actions
export const authReducer = authSlice.reducer
