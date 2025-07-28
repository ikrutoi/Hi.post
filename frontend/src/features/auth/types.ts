export interface RegisterPayload {
  email: string
  password: string
  username?: string
}

export interface UserData {
  id: string
  email: string
  token: string
}

export interface AuthState {
  user: UserData | null
  loading: boolean
  error: string | null
}
