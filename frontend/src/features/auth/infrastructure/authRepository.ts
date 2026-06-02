import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from '../domain/types/auth.types'
import { httpAuthRepository } from './httpAuthRepository'
import { mockAuthRepository } from './mockAuthRepository'

export interface AuthRepository {
  login(payload: LoginPayload): Promise<AuthResponse>
  register(payload: RegisterPayload): Promise<AuthResponse>
  fetchMe(): Promise<User>
  updateAvatar(userId: string, avatarUrl: string | null): Promise<void>
}

export function getAuthRepository(): AuthRepository {
  if (import.meta.env.VITE_AUTH_MODE === 'http') {
    return httpAuthRepository
  }
  return mockAuthRepository
}
