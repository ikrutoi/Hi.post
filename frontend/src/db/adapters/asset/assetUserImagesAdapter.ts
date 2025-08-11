import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap } from '@db/types/storeMap'
import type { StoreAdapter } from '@db/types'

export const assetUserImagesAdapter: StoreAdapter<StoreMap['assetUserImages']> =
  createStoreAdapter<StoreMap['assetUserImages']>('assetUserImages')
