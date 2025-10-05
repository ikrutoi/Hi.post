import { combineReducers } from '@reduxjs/toolkit'

import {
  cardphotoReducer,
  cardphotoActiveReducer,
  imageHistoryReducer,
} from '@cardphoto/infrastructure/state'
import { cardtextReducer } from '@cardtext/infrastructure/state'
import {
  envelopeReducer,
  envelopeUiReducer,
} from '@envelope/infrastructure/state'
import { aromaReducer } from '@aroma/infrastructure/state'
import { dateReducer } from '@date/infrastructure/state'

import { sentReducer } from '@features/sent/application/state'
import { cartReducer } from '@features/cart/application/state'
import { draftsReducer } from '@features/drafts/application/state'

import { toolbarReducer } from '@toolbar/infrastructure/state'

import { authReducer } from '@features/auth/store'
import { postcardReducer } from '@features/postcard/model'
import { interactionReducer } from '@features/interaction'
import { layoutReducer } from '@layout/infrastructure/state/layoutReducer'

export const rootReducer = combineReducers({
  cardphoto: cardphotoReducer,
  cardphotoActive: cardphotoActiveReducer,
  imageHistory: imageHistoryReducer,
  cardtext: cardtextReducer,
  envelope: envelopeReducer,
  envelopeUi: envelopeUiReducer,
  aroma: aromaReducer,
  date: dateReducer,

  cart: cartReducer,
  drafts: draftsReducer,
  sent: sentReducer,

  toolbar: toolbarReducer,

  auth: authReducer,
  postcard: postcardReducer,
  interaction: interactionReducer,
  layout: layoutReducer,
})
