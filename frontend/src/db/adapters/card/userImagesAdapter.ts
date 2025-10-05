import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap } from '@db/types/storeMap.types'
import type { StoreAdapter } from '@db/types'

export const userImagesAdapter: StoreAdapter<StoreMap['userImages']> =
  createStoreAdapter<StoreMap['userImages']>('userImages')
