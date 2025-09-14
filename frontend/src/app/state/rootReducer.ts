import { combineReducers } from '@reduxjs/toolkit'

import {
  cardphotoReducer,
  cardphotoToolbarReducer,
  cardphotoActiveReducer,
} from '@features/cardphoto/application/state'
import {
  cardtextReducer,
  cardtextToolbarReducer,
} from '@features/cardtext/application/state'
import {
  envelopeReducer,
  envelopeToolbarReducer,
  envelopeUiReducer,
} from '@features/envelope/application/state'
import { aromaReducer } from '@features/aroma/application/state'
import { dateReducer } from '@features/date/application/state'

import { sentReducer } from '@features/sent/application/state'
import { cartReducer } from '@features/cart/application/state'
import { draftsReducer } from '@features/drafts/application/state'

import { authReducer } from '@features/auth/store'
import { postcardReducer } from '@features/postcard/model'
import { interactionReducer } from '@features/interaction'
import { layoutReducer } from '@features/layout/application/state/rootReducer'

export const rootReducer = combineReducers({
  cardphoto: cardphotoReducer,
  cardphotoToolbar: cardphotoToolbarReducer,
  cardphotoActive: cardphotoActiveReducer,
  cardtext: cardtextReducer,
  cardtextToolbar: cardtextToolbarReducer,
  envelope: envelopeReducer,
  envelopeToolbar: envelopeToolbarReducer,
  envelopeUi: envelopeUiReducer,
  aroma: aromaReducer,
  date: dateReducer,

  cart: cartReducer,
  drafts: draftsReducer,
  sent: sentReducer,

  auth: authReducer,
  postcard: postcardReducer,
  interaction: interactionReducer,
  layout: layoutReducer,
})
