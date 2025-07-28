import axios from 'axios'
import { RegisterPayload } from './types'

export const registerUserApi = (payload: RegisterPayload) => {
  return axios.post('https://your-api.com/auth/register', payload)
}
