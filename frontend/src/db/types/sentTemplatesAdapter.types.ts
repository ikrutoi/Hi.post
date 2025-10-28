import type { StoreAdapter } from './storeAdapter.types'
import type { TemplateStoreMap } from './storeMap.types'

export interface SentTemplatesAdapter
  extends StoreAdapter<TemplateStoreMap['sent']> {}
