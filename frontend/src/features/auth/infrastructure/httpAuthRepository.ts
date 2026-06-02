import { getApiErrorMessage } from '@shared/api/apiError'
import {
  fetchMeApi,
  loginUserApi,
  registerUserApi,
  updateAvatarApi,
} from '../api/auth.api'
import type { User } from '../domain/types/auth.types'
import type { AuthRepository } from './authRepository'

export const httpAuthRepository: AuthRepository = {
  async login(payload) {
    try {
      const response = await loginUserApi(payload)
      return response.data
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Login failed'))
    }
  },

  async register(payload) {
    try {
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
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Registration failed'))
    }
  },

  async fetchMe(): Promise<User> {
    try {
      const response = await fetchMeApi()
      return response.data
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to load profile'))
    }
  },

  async updateAvatar(_userId, avatarUrl) {
    try {
      await updateAvatarApi(avatarUrl)
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to update avatar'))
    }
  },
}
