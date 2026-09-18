import axios from 'axios'

type ApiErrorBody = {
  message?: string
  errors?: Record<string, string[]>
}

/** Token rejected — drop the local session. Network / 5xx keep IndexedDB + last user. */
export function isAuthSessionInvalid(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false
  const status = error.response?.status
  return status === 401 || status === 403
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorBody | undefined
    const firstFieldError = data?.errors
      ? Object.values(data.errors)[0]?.[0]
      : undefined

    return firstFieldError ?? data?.message ?? error.message ?? fallback
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallback
}
