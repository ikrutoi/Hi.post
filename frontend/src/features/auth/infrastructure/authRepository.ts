import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from '../domain/types/auth.types'
import { httpAuthRepository } from './httpAuthRepository'
import { mockAuthRepository } from './mockAuthRepository'

export interface AuthRepository {
  login(payload: LoginPayload): Promise<AuthResponse>
  register(payload: RegisterPayload): Promise<AuthResponse>
}

export function getAuthRepository(): AuthRepository {
  if (import.meta.env.VITE_AUTH_MODE === 'http') {
    return httpAuthRepository
  }
  return mockAuthRepository
}
