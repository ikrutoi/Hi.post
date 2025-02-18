import { configureStore } from '@reduxjs/toolkit'
import cardsReducer from './cards/reducer'
import cardEditReducer from './cardEdit/reducer'
import layoutReducer from './layout/reducer'
import infoButtonsReducer from './infoButtons/reducer'

const store = configureStore({
  reducer: {
    cards: cardsReducer,
    cardEdit: cardEditReducer,
    layout: layoutReducer,
    infoButtons: infoButtonsReducer,
  },
})

export default store
