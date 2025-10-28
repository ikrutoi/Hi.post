import type { StoreAdapter } from './storeAdapter.types'
import type { TemplateStoreMap } from './storeMap.types'

export interface DraftsTemplatesAdapter
  extends StoreAdapter<TemplateStoreMap['drafts']> {}
