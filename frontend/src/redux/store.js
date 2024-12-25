import { configureStore } from '@reduxjs/toolkit'
import cardsReducer from './cards/reducer'
import cardSectionsReducer from './cardSections/reducer'

const store = configureStore({
  reducer: {
    cards: cardsReducer,
    cardSections: cardSectionsReducer,
  },
})

export default store
