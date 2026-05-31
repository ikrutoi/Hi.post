import { createListenerMiddleware } from '@reduxjs/toolkit'
import type { AuthResponse } from '@features/auth/domain/types/auth.types'
import { registerThunk, loginThunk, updateAvatarThunk } from '@features/auth/store/auth.thunks'
import { logout, setAuth } from '@/features/auth/infrastructure/state/auth.slice'
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
  actionCreator: logout,
  effect: async () => {
    clearAuthSession()
  },
})

authListenerMiddleware.startListening({
  actionCreator: updateAvatarThunk.fulfilled,
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState() as {
      auth: { user: AuthResponse['user']; token: string | null }
    }
    const { user, token } = state.auth
    if (user?.id && token) {
      saveAuthSession({ user, token })
    }
  },
})
