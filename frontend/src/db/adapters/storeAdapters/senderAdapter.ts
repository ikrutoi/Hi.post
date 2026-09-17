import type { StoreMap, SenderAdapter } from '@/db/types'

/** Sender templates are retired: no IndexedDB store, no writes. */
export const senderAdapter: SenderAdapter = {
  getAll: async () => [],
  getById: async () => null,
  put: async () => {},
  deleteById: async () => {},
  getMaxLocalId: async () => 0,
  addRecordWithId: async () => {},
  count: async () => 0,
  clear: async () => {},
  addUniqueRecord: async () => {},
}

export const senderAddressAdapter = senderAdapter
