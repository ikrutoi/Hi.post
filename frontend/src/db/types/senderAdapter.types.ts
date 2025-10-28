import type { StoreAdapter } from './storeAdapter.types'
import type { StoreMap } from './storeMap.types'

export interface SenderAdapter extends StoreAdapter<StoreMap['sender']> {
  addUniqueRecord(payload: Omit<StoreMap['sender'], 'localId'>): Promise<void>
}
