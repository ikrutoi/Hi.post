import axios from 'axios'
import { RegisterPayload, LoginPayload } from '../types/auth.types'

export const registerUserApi = (payload: RegisterPayload) =>
  axios.post('/api/register', payload)

export const loginUserApi = (payload: LoginPayload) =>
  axios.post('/api/login', payload)
