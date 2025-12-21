import { useEffect } from 'react'
import { useAppDispatch } from '@app/hooks'
import { loginStart, loginSuccess } from '../../infrastructure/state'

export const useAuthInit = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(loginStart())
      const user = { id: '123', name: 'Ihar', email: 'ihar@email.com' }
      dispatch(loginSuccess({ user, token }))
    }
  }, [dispatch])
}
