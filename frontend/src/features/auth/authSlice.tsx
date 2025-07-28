// authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { AxiosError } from 'axios/index'
import { registerUserApi } from './api'
import { AuthState, RegisterPayload, UserData } from './types'

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
}

export const registerUser = createAsyncThunk<
  UserData,
  RegisterPayload,
  { rejectValue: string }
>('auth/registerUser', async (payload, thunkAPI) => {
  try {
    const response = await registerUserApi(payload)
    return response.data
  } catch (error) {
    const err = error as AxiosError
    return thunkAPI.rejectWithValue(err.message || 'Registration failed')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<UserData>) => {
          state.loading = false
          state.user = action.payload
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Unknown error'
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
