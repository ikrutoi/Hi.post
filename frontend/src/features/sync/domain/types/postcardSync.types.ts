import type { PostcardHydrated } from '@entities/postcard/domain/types/postcard.types'
import { BACKEND_SYNC_PAYLOAD_VERSION } from '@entities/postcard/domain/backendCanon'

/** Opaque PostcardHydrated[] until phase 1+ schema. */
export const POSTCARD_SYNC_PAYLOAD_VERSION = BACKEND_SYNC_PAYLOAD_VERSION

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
  restoreStatus: PostcardSyncFetchStatus
  restoreError: string | null
  autoBackupPending: boolean
  lastAutoBackupAt: string | null
  restorePromptOpen: boolean
  restorePromptCloudUpdatedAt: string | null
  restorePromptDismissedForUpdatedAt: string | null
}
