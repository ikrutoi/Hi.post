import { createListenerMiddleware } from '@reduxjs/toolkit'
import type { AuthResponse } from '@features/auth/domain/types/auth.types'
import { logoutUserApi } from '@features/auth/api/auth.api'
import { registerThunk, loginThunk } from '@features/auth/store/auth.thunks'
import { logout, setAuth, updateUserPassportColors } from '@/features/auth/infrastructure/state/auth.slice'
import {
  clearAuthSession,
  saveAuthSession,
} from '@features/auth/infrastructure/sessionStorage'

export const authListenerMiddleware = createListenerMiddleware()

const persistSession = (payload: AuthResponse) => {
  saveAuthSession(payload)
}

authListenerMiddleware.startListening({
  actionCreator: setAuth,
  effect: async (action) => {
    persistSession(action.payload)
  },
})

authListenerMiddleware.startListening({
  actionCreator: registerThunk.fulfilled,
  effect: async (action) => {
    persistSession(action.payload)
  },
})

authListenerMiddleware.startListening({
  actionCreator: loginThunk.fulfilled,
  effect: async (action) => {
    persistSession(action.payload)
  },
})

authListenerMiddleware.startListening({
  actionCreator: updateUserPassportColors,
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState() as {
      auth: { user: AuthResponse['user'] | null; token: string | null }
    }
    const { user, token } = state.auth
    if (user && token) {
      persistSession({ user, token })
    }
  },
})

authListenerMiddleware.startListening({
  actionCreator: logout,
  effect: async () => {
    if (import.meta.env.VITE_AUTH_MODE === 'http') {
      try {
        await logoutUserApi()
      } catch {
        // Local session is cleared even if the server request fails.
      }
    }
    clearAuthSession()
  },
})
