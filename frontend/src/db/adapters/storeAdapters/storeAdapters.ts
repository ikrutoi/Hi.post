import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap } from '@/db/types'
import type { StoreAdapter } from '../../types'

export const storeAdapters: {
  stockImages: StoreAdapter<StoreMap['stockImages']>
  userImages: StoreAdapter<StoreMap['userImages']>
  cropImages: StoreAdapter<StoreMap['cropImages']>
  cardtext: StoreAdapter<StoreMap['cardtext']>
  sender: StoreAdapter<StoreMap['sender']>
  recipient: StoreAdapter<StoreMap['recipient']>
  cart: StoreAdapter<StoreMap['cart']>
  drafts: StoreAdapter<StoreMap['drafts']>
  sent: StoreAdapter<StoreMap['sent']>
  session: StoreAdapter<StoreMap['session']>
} = {
  stockImages: createStoreAdapter<StoreMap['stockImages']>('stockImages'),
  userImages: createStoreAdapter<StoreMap['userImages']>('userImages'),
  cropImages: createStoreAdapter<StoreMap['cropImages']>('cropImages'),
  cardtext: createStoreAdapter<StoreMap['cardtext']>('cardtext'),
  sender: createStoreAdapter<StoreMap['sender']>('sender'),
  recipient: createStoreAdapter<StoreMap['recipient']>('recipient'),
  cart: createStoreAdapter<StoreMap['cart']>('cart'),
  drafts: createStoreAdapter<StoreMap['drafts']>('drafts'),
  sent: createStoreAdapter<StoreMap['sent']>('sent'),
  session: createStoreAdapter<StoreMap['session']>('session'),
}
