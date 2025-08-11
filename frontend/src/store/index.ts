import { configureStore } from '@reduxjs/toolkit'

import { authReducer } from '@features/auth/store/authSlice'
import envelopeReducer from '@features/envelope/store/envelopeSlice'
import { authListenerMiddleware } from '@middleware/authListener'

import infoButtonsReducer from './slices/infoButtonsSlice'
import layoutReducer from './slices/layoutSlice'
// import cardsReducer from './slices/cardsSlice'
import cardEditReducer from './slices/cardEditSlice'

export const store = configureStore({
  reducer: {
    infoButtons: infoButtonsReducer,
    layout: layoutReducer,
    // cards: cardsReducer,
    cardEdit: cardEditReducer,
    envelope: envelopeReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(authListenerMiddleware.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
