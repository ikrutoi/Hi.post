export type User = {
  id: string
  name: string
  email: string
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
}
