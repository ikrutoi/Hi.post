import { configureStore } from '@reduxjs/toolkit'

import infoButtonsReducer from './slices/infoButtonsSlice'
import layoutReducer from './slices/layoutSlice'
import cardsReducer from './slices/cardsSlice'
import cardEditReducer from './slices/cardEditSlice'

export const store = configureStore({
  reducer: {
    infoButtons: infoButtonsReducer,
    layout: layoutReducer,
    cards: cardsReducer,
    cardEdit: cardEditReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
