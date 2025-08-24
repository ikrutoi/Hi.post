import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { Drafts } from './types'

export const draftStore = createStoreAdapter<Drafts>('drafts')
