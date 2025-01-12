import { configureStore } from '@reduxjs/toolkit'
import cardsReducer from './cards/reducer'
import cardEditReducer from './cardEdit/reducer'

const store = configureStore({
  reducer: {
    cards: cardsReducer,
    cardEdit: cardEditReducer,
  },
})

export default store
