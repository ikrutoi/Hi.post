import { useEffect } from 'react'
import { useAppDispatch } from '@app/hooks'
import { isAuthSessionInvalid } from '@shared/api/apiError'
import { setHttpUnauthorizedHandler } from '@shared/api/httpClient'
import { isHttpAuthMode } from '@shared/config/authMode'
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

      if (isHttpAuthMode()) {
        try {
          const user = await getAuthRepository().fetchMe()
          if (!cancelled) {
            dispatch(setAuth({ user, token: session.token }))
          }
        } catch (error) {
          const latestToken = readAuthSession()?.token
          if (latestToken && latestToken !== session.token) {
            return
          }
          if (isAuthSessionInvalid(error)) {
            clearAuthSession()
            if (!cancelled) {
              dispatch(logout())
            }
          } else if (session.user?.id) {
            if (!cancelled) {
              dispatch(setAuth(session))
            }
          } else {
            clearAuthSession()
            if (!cancelled) {
              dispatch(logout())
            }
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
