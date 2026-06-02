import { httpPostcardSyncRepository } from './httpPostcardSyncRepository'
import { mockPostcardSyncRepository } from './mockPostcardSyncRepository'
import type { PostcardSyncRepository } from './postcardSyncRepository'

export function getPostcardSyncRepository(): PostcardSyncRepository {
  if (import.meta.env.VITE_AUTH_MODE === 'http') {
    return httpPostcardSyncRepository
  }
  return mockPostcardSyncRepository
}

export type { PostcardSyncRepository } from './postcardSyncRepository'
