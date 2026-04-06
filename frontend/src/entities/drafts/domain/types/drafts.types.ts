import type { Card } from '@entities/card/domain/types'
import { LEGACY_LOCAL_ID_PROPERTY } from '@shared/config/legacyIndexedDb'

export interface DraftsItem {
  localId: number
  card: Card
}

export function normalizeDraftsItemRecord(raw: DraftsItem): DraftsItem {
  const row = raw as DraftsItem & Record<string, unknown>
  const legacy = row[LEGACY_LOCAL_ID_PROPERTY]
  const localId =
    typeof row.localId === 'number'
      ? row.localId
      : typeof legacy === 'number'
        ? legacy
        : 0
  const next: DraftsItem & Record<string, unknown> = { ...row, localId }
  delete next[LEGACY_LOCAL_ID_PROPERTY]
  return next
}
