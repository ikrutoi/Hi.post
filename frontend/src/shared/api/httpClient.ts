import axios from 'axios'
import {
  clearAuthSession,
  readAuthSession,
} from '@features/auth/infrastructure/sessionStorage'

type UnauthorizedHandler = () => void

let unauthorizedHandler: UnauthorizedHandler | null = null

export function setHttpUnauthorizedHandler(
  handler: UnauthorizedHandler | null,
): void {
  unauthorizedHandler = handler
}

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

httpClient.interceptors.request.use((config) => {
  const session = readAuthSession()

  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`
  }

  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }

  return config
})

function requestUrl(error: unknown): string {
  if (!axios.isAxiosError(error) || !error.config) return ''
  return `${error.config.baseURL ?? ''}${error.config.url ?? ''}`
}

function requestBearerToken(error: unknown): string | null {
  if (!axios.isAxiosError(error) || !error.config?.headers) return null
  const headers = error.config.headers
  const raw =
    typeof headers.get === 'function'
      ? headers.get('Authorization')
      : (headers.Authorization ?? headers.authorization)
  if (typeof raw !== 'string') return null
  const match = /^Bearer\s+(.+)$/i.exec(raw.trim())
  return match?.[1] ?? null
}

function isAuthHandshakeUrl(url: string): boolean {
  return /\/api\/(login|register|logout)(?:\?|$)/.test(url)
}

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = requestUrl(error)
      if (!isAuthHandshakeUrl(url)) {
        const currentToken = readAuthSession()?.token ?? null
        const requestToken = requestBearerToken(error)
        const isStaleRequest =
          Boolean(currentToken) &&
          Boolean(requestToken) &&
          currentToken !== requestToken

        if (!isStaleRequest && (currentToken || requestToken)) {
          clearAuthSession()
          unauthorizedHandler?.()
        }
      }
    }

    return Promise.reject(error)
  },
)
