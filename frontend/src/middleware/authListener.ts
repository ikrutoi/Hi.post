import { createListenerMiddleware } from '@reduxjs/toolkit'
import {
  registerThunk,
  loginThunk,
  logout,
  setAuth,
} from '../store/slices/authSlice'

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
