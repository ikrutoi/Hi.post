import axios from 'axios'
import type { AxiosResponse } from '@features/auth/types/axios'
import type { RegisterPayload } from '@features/auth/types/auth.types'
import { AuthResponse } from '@features/auth/types/auth.types'

export interface LoginPayload {
  email: string
  password: string
}

export const registerUser = (data: RegisterPayload) =>
  axios.post<AuthResponse>('/api/register', data)

export const loginUser = (data: LoginPayload) =>
  axios.post<AuthResponse>('/api/login', data)

export const registerUserApi = async (
  data: RegisterPayload
): Promise<AxiosResponse<AuthResponse>> => {
  const response = await axios.post<AuthResponse>('/api/register', data)
  return response
}
