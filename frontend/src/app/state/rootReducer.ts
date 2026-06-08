import { combineReducers } from '@reduxjs/toolkit'

import { assetRegistryReducer } from '@entities/assetRegistry/infrastructure/state'

import { sectionEditorMenuReducer } from '@entities/sectionEditorMenu/infrastructure/state'

import {
  cardphotoReducer,
  cardphotoUiReducer,
  cardphotoCropReducer,
} from '@cardphoto/infrastructure/state'

import { cardtextReducer } from '@cardtext/infrastructure/state'

// import { envelopeReducer } from '@envelope/infrastructure/state'
import {
  envelopeSelectionReducer,
  envelopeRecipientsReducer,
} from '@envelope/infrastructure/state'
import { addressBookReducer } from '@envelope/addressBook/infrastructure/state'
import { senderReducer } from '@envelope/sender/infrastructure/state'
import { recipientReducer } from '@envelope/recipient/infrastructure/state'

import { aromaReducer } from '@aroma/infrastructure/state'

import { dateReducer } from '@date/infrastructure/state'
import { calendarReducer } from '@date/calendar/infrastructure/state'
import { switcherReducer } from '@date/switcher/infrastructure/state'

import {
  CardPanelReducer,
  MirrorSectionBackupReducer,
} from '@cardPanel/infrastructure/state'

import { cardEditorReducer } from '@entities/cardEditor/infrastructure/state'

import { cardReducer } from '@entities/card/infrastructure/state'

import { cartReducer } from '@features/cart/infrastructure/state'

import { toolbarReducer } from '@toolbar/infrastructure/state'
import { previewStripOrderReducer } from '@features/previewStrip/infrastructure/state'

import { authReducer } from '@features/auth/store'
import { postcardSyncReducer } from '@features/sync/store'
import { layoutReducer } from '@layout/infrastructure/state/layoutReducer'

export const rootReducer = combineReducers({
  // app: appReducer,

  assetRegistry: assetRegistryReducer,

  sectionEditorMenu: sectionEditorMenuReducer,

  cardphoto: cardphotoReducer,
  cardphotoUi: cardphotoUiReducer,
  cardphotoCrop: cardphotoCropReducer,

  cardtext: cardtextReducer,

  // envelope: envelopeReducer,
  envelopeSelection: envelopeSelectionReducer,
  envelopeRecipients: envelopeRecipientsReducer,
  addressBook: addressBookReducer,
  sender: senderReducer,
  recipient: recipientReducer,

  aroma: aromaReducer,

  date: dateReducer,
  calendar: calendarReducer,
  switcher: switcherReducer,

  cardPanel: CardPanelReducer,
  mirrorSectionBackup: MirrorSectionBackupReducer,

  cardEditor: cardEditorReducer,

  card: cardReducer,

  cart: cartReducer,

  toolbar: toolbarReducer,
  previewStripOrder: previewStripOrderReducer,

  auth: authReducer,
  postcardSync: postcardSyncReducer,
  layout: layoutReducer,
})
