import { createAsyncThunk } from '@reduxjs/toolkit'
import { z } from 'zod'
import type { RootState } from '@app/state'
import { userSchema } from '@schemas/userSchema'
import type { AuthResponse, LoginPayload } from '../domain/types/auth.types'
import { getAuthRepository } from '../infrastructure/authRepository'

export type RegisterPayload = z.infer<typeof userSchema>

export const loginThunk = createAsyncThunk<
  AuthResponse,
  LoginPayload,
  { rejectValue: string }
>('auth/login', async (payload, thunkAPI) => {
  try {
    return await getAuthRepository().login(payload)
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Login failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const registerThunk = createAsyncThunk<
  AuthResponse,
  RegisterPayload,
  { rejectValue: string }
>('auth/register', async (payload, thunkAPI) => {
  try {
    userSchema.parse(payload)
    return await getAuthRepository().register({
      name: payload.username,
      email: payload.email,
      password: payload.password,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      const emailIssue = err.issues.find(
        (e) => e.path[0] === 'email' && typeof e.message === 'string',
      )
      const message = emailIssue?.message || 'Invalid input'
      return thunkAPI.rejectWithValue(message)
    }

    const message =
      err instanceof Error ? err.message : 'Registration failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const updateAvatarThunk = createAsyncThunk<
  string | null,
  string | null,
  { rejectValue: string; state: RootState }
>('auth/updateAvatar', async (avatarUrl, thunkAPI) => {
  const userId = thunkAPI.getState().auth.user?.id
  if (!userId) {
    return thunkAPI.rejectWithValue('Not signed in')
  }

  try {
    await getAuthRepository().updateAvatar(userId, avatarUrl)
    return avatarUrl
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to update avatar'
    return thunkAPI.rejectWithValue(message)
  }
})
