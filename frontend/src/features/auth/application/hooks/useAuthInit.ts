import { useEffect } from 'react'
import { useAppDispatch } from '@app/hooks'
import { readAuthSession } from '../../infrastructure/sessionStorage'
import { setAuth, setAuthInitialized } from '../../infrastructure/state'

export const useAuthInit = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const session = readAuthSession()
    if (session) {
      dispatch(setAuth(session))
    }
    dispatch(setAuthInitialized())
  }, [dispatch])
}
