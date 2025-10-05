import type { StoreAdapter } from './storeAdapter.types'
import type { StoreMap } from './storeMap.types'

export interface RecipientAddressAdapter
  extends StoreAdapter<StoreMap['recipientAddress']> {
  addUniqueRecord(
    payload: Omit<StoreMap['recipientAddress'], 'id'>
  ): Promise<void>
}
