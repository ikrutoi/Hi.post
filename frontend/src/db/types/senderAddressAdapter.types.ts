import type { StoreAdapter } from './storeAdapter.types'
import type { StoreMap } from './storeMap.types'

export interface SenderAddressAdapter
  extends StoreAdapter<StoreMap['senderAddress']> {
  addUniqueRecord(payload: Omit<StoreMap['senderAddress'], 'id'>): Promise<void>
}
