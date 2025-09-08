import { createStoreAdapter } from './createStoreAdapter'
import type { StoreMap } from '@db/types/storeMap'
import type { StoreAdapter } from '@db/types/storeAdapter'

export const indexDbService: {
  [K in keyof StoreMap]: StoreAdapter<StoreMap[K]>
} = {
  stockImages: createStoreAdapter<StoreMap['stockImages']>('stockImages'),
  userImages: createStoreAdapter<StoreMap['userImages']>('userImages'),
  cardtext: createStoreAdapter<StoreMap['cardtext']>('cardtext'),
  senderAddress: createStoreAdapter<StoreMap['senderAddress']>('senderAddress'),
  recipientAddress:
    createStoreAdapter<StoreMap['recipientAddress']>('recipientAddress'),
  cart: createStoreAdapter<StoreMap['cart']>('cart'),
  drafts: createStoreAdapter<StoreMap['drafts']>('drafts'),
  sent: createStoreAdapter<StoreMap['sent']>('sent'),
}
