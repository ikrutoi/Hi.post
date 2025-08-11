import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap } from '@db/types/storeMap'
import type { StoreAdapter } from '@db/types'

export const assetStockImagesAdapter: StoreAdapter<
  StoreMap['assetStockImages']
> = createStoreAdapter<StoreMap['assetStockImages']>('assetStockImages')
