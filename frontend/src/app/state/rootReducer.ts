import { combineReducers } from '@reduxjs/toolkit'

// import { appReducer } from '@shared/infrastructure/state'

import { sectionEditorMenuReducer } from '@entities/sectionEditorMenu/infrastructure/state'

import {
  cardphotoLayoutReducer,
  cardphotoActiveReducer,
  imageHistoryReducer,
  cardphotoStepsReducer,
} from '@/features/cardphoto/infrastructure/stateLayout'

import {
  cardphotoReducer,
  cardphotoUiReducer,
  cardphotoCropReducer,
} from '@cardphoto/infrastructure/state'

import { cardtextReducer } from '@cardtext/infrastructure/state'
import { cardtextToolbarReducer } from '@cardtext/infrastructure/state'

// import { envelopeReducer } from '@envelope/infrastructure/state'
import { senderReducer } from '@envelope/sender/infrastructure/state'
import { recipientReducer } from '@envelope/recipient/infrastructure/state'

import { aromaReducer } from '@aroma/infrastructure/state'

import { dateReducer } from '@date/infrastructure/state'
import { calendarReducer } from '@date/calendar/infrastructure/state'
import { switcherReducer } from '@date/switcher/infrastructure/state'

// import { cardMenuReducer } from '@/app/basket/cardMenu/infrastructure/state'

import { CardPanelReducer } from '@cardPanel/infrastructure/state'

import { cardEditorReducer } from '@entities/cardEditor/infrastructure/state'

import { cardReducer } from '@entities/card/infrastructure/state'

import { cardMenuNavReducer } from '@layoutNav/infrastructure/state'
import { templateNavReducer } from '@layoutNav/infrastructure/state'

import { sentReducer } from '@features/sent/application/state'
import { cartReducer } from '@features/cart/infrastructure/state'
import { draftsReducer } from '@features/drafts/application/state'

import { toolbarReducer } from '@toolbar/infrastructure/state'

import { authReducer } from '@features/auth/store'
import { postcardReducer } from '@features/postcard/model'
import { interactionReducer } from '@features/interaction'
import { layoutReducer } from '@layout/infrastructure/state/layoutReducer'

export const rootReducer = combineReducers({
  // app: appReducer,

  sectionEditorMenu: sectionEditorMenuReducer,

  cardphotoLayout: cardphotoLayoutReducer,
  cardphotoActive: cardphotoActiveReducer,
  cardphotoSteps: cardphotoStepsReducer,
  imageHistory: imageHistoryReducer,

  cardphoto: cardphotoReducer,
  cardphotoUi: cardphotoUiReducer,
  cardphotoCrop: cardphotoCropReducer,

  cardtext: cardtextReducer,
  cardtextToolbar: cardtextToolbarReducer,

  // envelope: envelopeReducer,
  sender: senderReducer,
  recipient: recipientReducer,

  aroma: aromaReducer,

  date: dateReducer,
  calendar: calendarReducer,
  switcher: switcherReducer,

  // cardMenu: cardMenuReducer,

  cardPanel: CardPanelReducer,

  cardEditor: cardEditorReducer,

  card: cardReducer,

  cardMenuNav: cardMenuNavReducer,
  templateNav: templateNavReducer,

  cart: cartReducer,
  drafts: draftsReducer,
  sent: sentReducer,

  toolbar: toolbarReducer,

  auth: authReducer,
  postcard: postcardReducer,
  interaction: interactionReducer,
  layout: layoutReducer,
})
