import { httpClient } from '@shared/api/httpClient'
import type {
  LoginPayload,
  RegisterPayload,
  User,
} from '../domain/types/auth.types'

export type AuthApiResponse = {
  user: User
  token: string
}

export const registerUserApi = (payload: RegisterPayload) =>
  httpClient.post<AuthApiResponse>('/api/register', payload)

export const loginUserApi = (payload: LoginPayload) =>
  httpClient.post<AuthApiResponse>('/api/login', payload)

export const fetchMeApi = () => httpClient.get<User>('/api/me')

export const updateAvatarApi = (avatarUrl: string | null) =>
  httpClient.patch<User>('/api/me/avatar', { avatarUrl })

export const logoutUserApi = () => httpClient.post('/api/logout')
