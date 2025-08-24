import { combineReducers } from '@reduxjs/toolkit'

import { authReducer } from '@features/auth/store'
import envelopeReducer from '@features/envelope/store/envelopeSlice'
import infoButtonsReducer from '@store/slices/infoButtonsSlice'
import { postcardReducer } from '@features/postcard/model'
import { interactionReducer } from '@features/interaction'
import layoutReducer from '@features/layout/application/state/layout/layoutSlice'

export const rootReducer = combineReducers({
  auth: authReducer,
  envelope: envelopeReducer,
  infoButtons: infoButtonsReducer,
  postcard: postcardReducer,
  interaction: interactionReducer,
  layout: layoutReducer,
})
