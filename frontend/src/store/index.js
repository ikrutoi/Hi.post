import { configureStore } from '@reduxjs/toolkit'
import infoButtonsReducer from './slices/infoButtons'
import layoutReducer from './slices/layoutSlice'
import cardsSlice from './slices/cardsSlice'
import cardEditSlice from './slices/cardEditSlice'

const store = configureStore({
  reducer: {
    infoButtons: infoButtonsReducer,
    layout: layoutReducer,
    cards: cardsSlice,
    cardEdit: cardEditSlice,
  },
})

export default store
