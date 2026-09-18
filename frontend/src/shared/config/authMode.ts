/** Staging/prod cloud copy uses Laravel. `mock` is local-only (no API). */
export function isHttpAuthMode(): boolean {
  return import.meta.env.VITE_AUTH_MODE === 'http'
}
