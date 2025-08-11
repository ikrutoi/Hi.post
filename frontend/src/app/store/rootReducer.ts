import { combineReducers } from '@reduxjs/toolkit'
import { authReducer } from '@features/auth/store'
import envelopeReducer from '@features/envelope/store/envelopeSlice'
import infoButtonsReducer from '@store/slices/infoButtonsSlice'
import layoutReducer from '@store/slices/layoutSlice'
// import { layoutReducer } from '@shared/layout/model'

export const rootReducer = combineReducers({
  auth: authReducer,
  envelope: envelopeReducer,
  layout: layoutReducer,
  infoButtons: infoButtonsReducer,
  // cards: cardsReducer,
  // cardEdit: cardEditReducer,
})
