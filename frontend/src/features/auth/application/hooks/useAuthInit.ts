import { useEffect } from 'react'
import { useAppDispatch } from '@app/hooks'
import { setHttpUnauthorizedHandler } from '@shared/api/httpClient'
import { getAuthRepository } from '../../infrastructure/authRepository'
import {
  clearAuthSession,
  readAuthSession,
} from '../../infrastructure/sessionStorage'
import { logout, setAuth, setAuthInitialized } from '../../infrastructure/state'

export const useAuthInit = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    setHttpUnauthorizedHandler(() => {
      dispatch(logout())
    })

    let cancelled = false

    const init = async () => {
      const session = readAuthSession()

      if (!session?.token) {
        if (!cancelled) {
          dispatch(setAuthInitialized())
        }
        return
      }

      if (import.meta.env.VITE_AUTH_MODE === 'http') {
        try {
          const user = await getAuthRepository().fetchMe()
          if (!cancelled) {
            dispatch(setAuth({ user, token: session.token }))
          }
        } catch {
          clearAuthSession()
          if (!cancelled) {
            dispatch(logout())
          }
        }
      } else if (session.user?.id) {
        dispatch(setAuth(session))
      }

      if (!cancelled) {
        dispatch(setAuthInitialized())
      }
    }

    void init()

    return () => {
      cancelled = true
      setHttpUnauthorizedHandler(null)
    }
  }, [dispatch])
}
