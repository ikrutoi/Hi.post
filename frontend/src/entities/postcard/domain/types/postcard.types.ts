import type { Card } from '@entities/card/domain/types'
import { LEGACY_LOCAL_ID_PROPERTY } from '@shared/config/legacyIndexedDb'

export interface PostcardsDaySummary {
  postcard: Postcard
  count: number
}

export function normalizePostcardRecord(raw: Postcard): Postcard {
  const row = raw as Postcard & Record<string, unknown>
  const legacy = row[LEGACY_LOCAL_ID_PROPERTY]
  const localId =
    typeof row.localId === 'number'
      ? row.localId
      : typeof legacy === 'number'
        ? legacy
        : 0
  const next: Postcard & Record<string, unknown> = { ...row, localId }
  delete next[LEGACY_LOCAL_ID_PROPERTY]
  return next
}
