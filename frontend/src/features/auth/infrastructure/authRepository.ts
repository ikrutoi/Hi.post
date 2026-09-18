import { isHttpAuthMode } from '@shared/config/authMode'
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
}

export function getAuthRepository(): AuthRepository {
  if (isHttpAuthMode()) {
    return httpAuthRepository
  }
  return mockAuthRepository
}
