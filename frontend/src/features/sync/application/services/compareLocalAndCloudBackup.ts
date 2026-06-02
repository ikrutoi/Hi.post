import type { PostcardHydrated } from '@entities/postcard'
import type { PostcardSyncSnapshot } from '../../domain/types/postcardSync.types'

function collectPostcardIds(postcards: PostcardHydrated[]): Set<string> {
  return new Set(postcards.map((postcard) => postcard.id))
}

function maxLocalUpdatedAt(postcards: PostcardHydrated[]): number {
  if (postcards.length === 0) return 0

  return Math.max(
    ...postcards.map(
      (postcard) => postcard.updatedAt ?? postcard.createdAt ?? 0,
    ),
  )
}

export function shouldOfferCloudRestore(
  localPostcards: PostcardHydrated[],
  cloudBackup: PostcardSyncSnapshot,
): boolean {
  const cloudPostcards = cloudBackup.postcards
  if (cloudPostcards.length === 0) return false

  if (localPostcards.length === 0) return true

  if (localPostcards.length !== cloudPostcards.length) return true

  const localIds = collectPostcardIds(localPostcards)
  const cloudIds = collectPostcardIds(cloudPostcards)

  if (localIds.size !== cloudIds.size) return true

  for (const id of cloudIds) {
    if (!localIds.has(id)) return true
  }

  const cloudBackupTime = new Date(cloudBackup.updatedAt).getTime()
  const localMaxUpdated = maxLocalUpdatedAt(localPostcards)

  if (!Number.isNaN(cloudBackupTime) && cloudBackupTime > localMaxUpdated) {
    return true
  }

  return false
}
