import { configureStore } from '@reduxjs/toolkit'
import cardsReducer from './cards/reducer'
import cardEditReducer from './cardEdit/reducer'
import layoutReducer from './layout/reducer'

const store = configureStore({
  reducer: {
    cards: cardsReducer,
    cardEdit: cardEditReducer,
    layout: layoutReducer,
  },
})

export default store
