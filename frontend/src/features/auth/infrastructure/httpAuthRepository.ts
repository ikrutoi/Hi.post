import { loginUserApi, registerUserApi } from '../api/auth.api'
import type { AuthRepository } from './authRepository'

export const httpAuthRepository: AuthRepository = {
  async login(payload) {
    const response = await loginUserApi(payload)
    return response.data
  },

  async register(payload) {
    const response = await registerUserApi({
      name:
        'name' in payload && typeof payload.name === 'string'
          ? payload.name
          : 'username' in payload && typeof payload.username === 'string'
            ? payload.username
            : payload.email,
      email: payload.email,
      password: payload.password,
    })
    return response.data
  },

  async updateAvatar(_userId, _avatarUrl) {
    throw new Error('Avatar upload is not available in HTTP auth mode yet')
  },
}
