import axios from 'axios'

export interface RegisterPayload {
  email: string
  password: string
  username?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    username: string
  }
}

export const registerUser = (data: RegisterPayload) =>
  axios.post<AuthResponse>('/api/register', data)

export const loginUser = (data: LoginPayload) =>
  axios.post<AuthResponse>('/api/login', data)
