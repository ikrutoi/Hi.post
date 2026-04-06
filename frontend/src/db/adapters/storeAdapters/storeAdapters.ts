import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap } from '@/db/types'
import type { StoreAdapter } from '../../types'
import { postcardsAdapter } from './postcardsAdapter'

export const storeAdapters: {
  stockImages: StoreAdapter<StoreMap['stockImages']>
  userImages: StoreAdapter<StoreMap['userImages']>
  cardphotoImages: StoreAdapter<StoreMap['cardphotoImages']>
  applyImage: StoreAdapter<StoreMap['applyImage']>
  cardtext: StoreAdapter<StoreMap['cardtext']>
  sender: StoreAdapter<StoreMap['sender']>
  recipient: StoreAdapter<StoreMap['recipient']>
  postcards: StoreAdapter<StoreMap['postcards']>
  session: StoreAdapter<StoreMap['session']>
  workingCard: StoreAdapter<StoreMap['workingCard']>
  uiPreferences: StoreAdapter<StoreMap['uiPreferences']>
} = {
  stockImages: createStoreAdapter<StoreMap['stockImages']>('stockImages'),
  userImages: createStoreAdapter<StoreMap['userImages']>('userImages'),
  cardphotoImages: createStoreAdapter<StoreMap['cardphotoImages']>('cardphotoImages'),
  applyImage: createStoreAdapter<StoreMap['applyImage']>('applyImage'),
  cardtext: createStoreAdapter<StoreMap['cardtext']>('cardtext'),
  sender: createStoreAdapter<StoreMap['sender']>('sender'),
  recipient: createStoreAdapter<StoreMap['recipient']>('recipient'),
  postcards: postcardsAdapter,
  session: createStoreAdapter<StoreMap['session']>('session'),
  workingCard: createStoreAdapter<StoreMap['workingCard']>('workingCard'),
  uiPreferences: createStoreAdapter<StoreMap['uiPreferences']>('uiPreferences'),
}
