import type { StoreAdapter } from './storeAdapter.types'
import type { TemplateStoreMap } from './storeMap.types'

export interface RecipientTemplatesAdapter
  extends StoreAdapter<TemplateStoreMap['recipient']> {
  addUniqueRecord(
    payload: Omit<TemplateStoreMap['recipient'], 'localId'>
  ): Promise<void>
}
