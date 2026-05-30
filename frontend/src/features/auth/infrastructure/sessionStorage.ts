import type { AuthResponse } from '../domain/types/auth.types'

const SESSION_KEY = 'hi.post.auth.session'
const LEGACY_TOKEN_KEY = 'token'

export function readAuthSession(): AuthResponse | null {
  if (typeof window === 'undefined') return null

  const raw = window.localStorage.getItem(SESSION_KEY)
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as AuthResponse
      if (parsed?.user?.id && parsed?.token) return parsed
    } catch {
      window.localStorage.removeItem(SESSION_KEY)
    }
  }

  const legacyToken = window.localStorage.getItem(LEGACY_TOKEN_KEY)
  if (legacyToken) {
    window.localStorage.removeItem(LEGACY_TOKEN_KEY)
  }

  return null
}

export function saveAuthSession(session: AuthResponse): void {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearAuthSession(): void {
  window.localStorage.removeItem(SESSION_KEY)
  window.localStorage.removeItem(LEGACY_TOKEN_KEY)
}
