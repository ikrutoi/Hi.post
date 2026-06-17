import type { IconUserRegisteredElementColors } from '@shared/ui/icons'

export type User = {
  id: string
  name: string
  email: string
  passportColors?: IconUserRegisteredElementColors | null
  passportCode?: string | null
}

export type AuthResponse = {
  user: User
  token: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type AuthState = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  initialized: boolean
  userLoginPanelOpen: boolean
}
