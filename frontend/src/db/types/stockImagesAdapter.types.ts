import type { StoreAdapter } from './storeAdapter.types'
import type { TemplateStoreMap } from './storeMap.types'

export interface StockImagesAdapter
  extends StoreAdapter<TemplateStoreMap['stockImages']> {}
