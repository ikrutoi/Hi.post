import axios from 'axios'
import { RegisterPayload } from './authTypes'

export const registerUser = async (data: RegisterPayload) => {
  try {
    const response = await axios.post('/api/register', data)
    return response.data
  } catch (error) {
    throw new Error('Registration failed: ' + (error as Error).message)
  }
}
