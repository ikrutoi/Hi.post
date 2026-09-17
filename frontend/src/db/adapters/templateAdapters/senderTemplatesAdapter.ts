import type { SenderTemplatesAdapter } from './templatesStoreAdapters'

/** Sender templates are retired: no IndexedDB store, no writes. */
export const senderTemplatesAdapter: SenderTemplatesAdapter = {
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
