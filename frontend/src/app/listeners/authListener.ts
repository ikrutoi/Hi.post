import { createListenerMiddleware } from '@reduxjs/toolkit'
import type { AuthResponse } from '@features/auth/domain/types/auth.types'
import { logoutUserApi, updateMeApi } from '@features/auth/api/auth.api'
import { registerThunk, loginThunk } from '@features/auth/store/auth.thunks'
import { logout, setAuth, updateUserPassportColors, updateUserPassportEmblemForm } from '@/features/auth/infrastructure/state/auth.slice'
import {
  clearAuthSession,
  saveAuthSession,
} from '@features/auth/infrastructure/sessionStorage'
import {
  postcardLocalDataChanged,
  rehydratePostcardsFromIdb,
} from '@features/sync/store/postcardSync.actions'
import { pullV2PostcardsIntoIdb } from '@features/sync/application/services/pullV2PostcardsIntoIdb'
import { pullV2LibraryIntoIdb } from '@features/sync/application/services/pullV2LibraryIntoIdb'
import {
  flushLocalIdbToV2AfterPull,
  pushLocalIdbFilesToV2,
} from '@features/sync/application/services/migrateLocalIdbToV2'
import { isHttpAuthMode } from '@shared/config/authMode'

export const authListenerMiddleware = createListenerMiddleware()

const persistSession = (payload: AuthResponse) => {
  saveAuthSession(payload)
}

async function pullV2AfterAuth(
  listenerApi: { dispatch: (action: unknown) => unknown },
): Promise<void> {
  if (!isHttpAuthMode()) return
  try {
    await pushLocalIdbFilesToV2()
    await pullV2PostcardsIntoIdb()
    await pullV2LibraryIntoIdb()
    await flushLocalIdbToV2AfterPull()
    listenerApi.dispatch(rehydratePostcardsFromIdb())
    listenerApi.dispatch(postcardLocalDataChanged())
  } catch {
    // IndexedDB keeps whatever was already local.
  }
}

authListenerMiddleware.startListening({
  actionCreator: setAuth,
  effect: async (action, listenerApi) => {
    persistSession(action.payload)
    await pullV2AfterAuth(listenerApi)
  },
})

authListenerMiddleware.startListening({
  actionCreator: registerThunk.fulfilled,
  effect: async (action, listenerApi) => {
    persistSession(action.payload)
    await pullV2AfterAuth(listenerApi)
  },
})

authListenerMiddleware.startListening({
  actionCreator: loginThunk.fulfilled,
  effect: async (action, listenerApi) => {
    persistSession(action.payload)
    await pullV2AfterAuth(listenerApi)
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
  actionCreator: updateUserPassportEmblemForm,
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState() as {
      auth: { user: AuthResponse['user'] | null; token: string | null }
    }
    const { user, token } = state.auth
    if (user && token) {
      persistSession({ user, token })
    }
    if (isHttpAuthMode()) {
      try {
        await updateMeApi({ passportEmblemForm: action.payload })
      } catch {
        // Local preference is kept; next fetchMe may overwrite.
      }
    }
  },
})

authListenerMiddleware.startListening({
  actionCreator: logout,
  effect: async () => {
    if (isHttpAuthMode()) {
      try {
        await logoutUserApi()
      } catch {
        // Local session is cleared even if the server request fails.
      }
    }
    clearAuthSession()
  },
})
