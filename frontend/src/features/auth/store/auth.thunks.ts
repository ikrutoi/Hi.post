import { createAsyncThunk } from '@reduxjs/toolkit'
import { z } from 'zod'
import { userSchema } from '@schemas/userSchema'
import type { AuthResponse, LoginPayload } from '../types/auth.types'

export type RegisterPayload = z.infer<typeof userSchema>

export const loginThunk = createAsyncThunk<
  AuthResponse,
  LoginPayload,
  { rejectValue: string }
>('auth/login', async (payload, thunkAPI) => {
  try {
    const response = await axios.post<AuthResponse>('/api/login', payload)
    return response.data
  } catch (err) {
    return thunkAPI.rejectWithValue('Login failed')
  }
})

export const registerThunk = createAsyncThunk<
  AuthResponse,
  RegisterPayload,
  { rejectValue: string }
>('auth/register', async (payload, thunkAPI) => {
  try {
    userSchema.parse(payload)
    const response = await axios.post<AuthResponse>('/api/register', payload)
    return response.data
  } catch (err) {
    if (err instanceof z.ZodError) {
      const emailIssue = err.issues.find(
        (e) => e.path[0] === 'email' && typeof e.message === 'string'
      )
      const message = emailIssue?.message || 'Invalid input'
      return thunkAPI.rejectWithValue(message)
    }

    return thunkAPI.rejectWithValue('Registration failed')
  }
})
