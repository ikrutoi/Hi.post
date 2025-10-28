import { createStoreAdapter } from '../factory'
import type { DraftsItem } from '@entities/drafts/domain/types'

export const draftsAdapter = createStoreAdapter<DraftsItem>('drafts')
