import { createListenerMiddleware } from '@reduxjs/toolkit'
import { registerThunk, loginThunk } from '@features/auth/store/auth.thunks'
import { logout } from '@features/auth/application/state/auth.slice'

export const authListenerMiddleware = createListenerMiddleware()

authListenerMiddleware.startListening({
  actionCreator: registerThunk.fulfilled,
  effect: async (action) => {
    localStorage.setItem('token', action.payload.token)
  },
})

authListenerMiddleware.startListening({
  actionCreator: loginThunk.fulfilled,
  effect: async (action) => {
    localStorage.setItem('token', action.payload.token)
  },
})

authListenerMiddleware.startListening({
  actionCreator: logout,
  effect: async () => {
    localStorage.removeItem('token')
  },
})
