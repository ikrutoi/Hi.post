import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap } from '@/db/types'
import type { StoreAdapter } from '../../types'

export const storeAdapters: {
  stockImages: StoreAdapter<StoreMap['stockImages']>
  userImages: StoreAdapter<StoreMap['userImages']>
  cropImages: StoreAdapter<StoreMap['cropImages']>
  applyImage: StoreAdapter<StoreMap['applyImage']>
  cardtext: StoreAdapter<StoreMap['cardtext']>
  sender: StoreAdapter<StoreMap['sender']>
  recipient: StoreAdapter<StoreMap['recipient']>
  cards: StoreAdapter<StoreMap['cards']>
  session: StoreAdapter<StoreMap['session']>
  workingCard: StoreAdapter<StoreMap['workingCard']>
} = {
  stockImages: createStoreAdapter<StoreMap['stockImages']>('stockImages'),
  userImages: createStoreAdapter<StoreMap['userImages']>('userImages'),
  cropImages: createStoreAdapter<StoreMap['cropImages']>('cropImages'),
  applyImage: createStoreAdapter<StoreMap['applyImage']>('applyImage'),
  cardtext: createStoreAdapter<StoreMap['cardtext']>('cardtext'),
  sender: createStoreAdapter<StoreMap['sender']>('sender'),
  recipient: createStoreAdapter<StoreMap['recipient']>('recipient'),
  cards: createStoreAdapter<StoreMap['cards']>('cards'),
  session: createStoreAdapter<StoreMap['session']>('session'),
  workingCard: createStoreAdapter<StoreMap['workingCard']>('workingCard'),
}
