import { configureStore } from '@reduxjs/toolkit'
import cardsReducer from './cards/reducer'
import cardEditReducer from './cardEdit/reducer'
import cardFormNavReducer from './CardFormNav/reducer'

const store = configureStore({
  reducer: {
    cards: cardsReducer,
    cardEdit: cardEditReducer,
    cardFormNav: cardFormNavReducer,
  },
})

export default store
