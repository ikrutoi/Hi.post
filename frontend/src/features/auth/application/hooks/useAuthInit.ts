import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loginStart, loginSuccess } from '../state'

export const useAuthInit = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(loginStart())
      const user = { id: '123', name: 'Ihar', email: 'ihar@email.com' }
      dispatch(loginSuccess({ user, token }))
    }
  }, [dispatch])
}
