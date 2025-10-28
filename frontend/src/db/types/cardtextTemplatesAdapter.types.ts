import type { StoreAdapter } from './storeAdapter.types'
import type { TemplateStoreMap } from './storeMap.types'

export interface CardtextTemplatesAdapter
  extends StoreAdapter<TemplateStoreMap['cardtext']> {}
