import type { StoreAdapter } from './storeAdapter.types'
import type { TemplateStoreMap } from './storeMap.types'

export interface SenderTemplatesAdapter
  extends StoreAdapter<TemplateStoreMap['sender']> {
  addUniqueRecord(
    payload: Omit<TemplateStoreMap['sender'][number], 'localId'>
  ): Promise<void>
}
