import type { StoreAdapter } from './storeAdapter.types'
import type { StoreMap } from './storeMap.types'

export interface RecipientAdapter extends StoreAdapter<StoreMap['recipient']> {
  addUniqueRecord(
    payload: Omit<StoreMap['recipient'], 'localId'>
  ): Promise<void>
}
