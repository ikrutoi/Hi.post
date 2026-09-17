import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap } from '@/db/types'
import type { StoreAdapter } from '../../types'
import { postcardsAdapter } from './postcardsAdapter'
import { cardphotoImagesAdapter } from './cardphotoImagesAdapter'
import { cardPieFavoritesAdapter } from './cardPieFavoritesAdapter'
import { senderAdapter } from './senderAdapter'
import { recipientAdapter } from './recipientAdapter'
import { cardtextAdapter } from './cardtextAdapter'

export const storeAdapters: {
  stockImages: StoreAdapter<StoreMap['stockImages']>
  userImages: StoreAdapter<StoreMap['userImages']>
  cardphotoImages: StoreAdapter<StoreMap['cardphotoImages']> & {
    putLocal: StoreAdapter<StoreMap['cardphotoImages']>['put']
  }
  applyImage: StoreAdapter<StoreMap['applyImage']>
  cardtext: StoreAdapter<StoreMap['cardtext']>
  sender: StoreAdapter<StoreMap['sender']>
  recipient: StoreAdapter<StoreMap['recipient']>
  postcards: StoreAdapter<StoreMap['postcards']>
  cardPieFavorites: StoreAdapter<StoreMap['cardPieFavorites']>
  session: StoreAdapter<StoreMap['session']>
  uiPreferences: StoreAdapter<StoreMap['uiPreferences']>
} = {
  stockImages: createStoreAdapter<StoreMap['stockImages']>('stockImages'),
  userImages: createStoreAdapter<StoreMap['userImages']>('userImages'),
  cardphotoImages: cardphotoImagesAdapter,
  applyImage: createStoreAdapter<StoreMap['applyImage']>('applyImage'),
  cardtext: cardtextAdapter,
  sender: senderAdapter,
  recipient: recipientAdapter,
  postcards: postcardsAdapter,
  cardPieFavorites: cardPieFavoritesAdapter,
  session: createStoreAdapter<StoreMap['session']>('session'),
  uiPreferences: createStoreAdapter<StoreMap['uiPreferences']>('uiPreferences'),
}
