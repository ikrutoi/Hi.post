import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap, StoreAdapter } from '@db/types'

export const draftsAdapter: StoreAdapter<StoreMap['drafts']> =
  createStoreAdapter<StoreMap['drafts']>('drafts')
