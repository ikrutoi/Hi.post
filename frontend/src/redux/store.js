import { configureStore } from '@reduxjs/toolkit'
import cardsReducer from './cards/reducer'
import cardSectionsReducer from './cardSections/reducer'
import dateSelectionDateReducer from './dateSelectionDate/reducer'

const store = configureStore({
  reducer: {
    cards: cardsReducer,
    cardSections: cardSectionsReducer,
    dateSelectionDate: dateSelectionDateReducer,
  },
})

export default store
