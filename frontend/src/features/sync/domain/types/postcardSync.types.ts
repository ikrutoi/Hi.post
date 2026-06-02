import type { PostcardHydrated } from '@entities/postcard/domain/types/postcard.types'

export const POSTCARD_SYNC_PAYLOAD_VERSION = 1

export type PostcardSyncSnapshot = {
  version: number
  exportedAt: string | null
  postcards: PostcardHydrated[]
  updatedAt: string
}

export type PostcardSyncUploadPayload = {
  version: number
  exportedAt: string
  postcards: PostcardHydrated[]
}

export type PostcardSyncFetchStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export type PostcardSyncState = {
  cloudBackup: PostcardSyncSnapshot | null
  fetchStatus: PostcardSyncFetchStatus
  error: string | null
  uploadStatus: PostcardSyncFetchStatus
  uploadError: string | null
}
