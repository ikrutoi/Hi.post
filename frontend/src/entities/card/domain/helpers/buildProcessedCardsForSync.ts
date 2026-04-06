import type { DispatchDate } from '@entities/date'
import type { AromaItem } from '@entities/aroma/domain/types'
import type { CardphotoState } from '@cardphoto/domain/types'
import type { CardtextState } from '@cardtext/domain/types'
import type { EnvelopeSessionRecord } from '@envelope/domain/types'
import type { Card } from '../types'

export function buildProcessedCardId(
  photoAssetId: string,
  d: DispatchDate,
): string {
  return `${photoAssetId}__${d.year}-${d.month}-${d.day}`
}

export function buildProcessedCardsForSync(opts: {
  appliedPhotoId: string
  thumbnailUrl: string
  mergedDates: DispatchDate[]
  isMultiDateMode: boolean
  multiGroupId: string | null
  cardphoto: CardphotoState
  cardtext: CardtextState
  envelope: EnvelopeSessionRecord
  aroma: AromaItem
  now: number
}): Card[] {
  const {
    appliedPhotoId,
    thumbnailUrl,
    mergedDates,
    isMultiDateMode,
    multiGroupId,
    cardphoto,
    cardtext,
    envelope,
    aroma,
    now,
  } = opts

  if (mergedDates.length === 0) return []

  const sharedMeta = { createdAt: now, updatedAt: now }

  const multiBatch =
    isMultiDateMode && mergedDates.length > 1 && multiGroupId != null

  if (!multiBatch) {
    const d = mergedDates[0]
    return [
      {
        id: appliedPhotoId,
        status: 'processed',
        thumbnailUrl,
        cardphoto,
        cardtext,
        envelope,
        aroma,
        date: d,
        multiGroupId: null,
        meta: sharedMeta,
      },
    ]
  }

  return mergedDates.map((d) => ({
    id: buildProcessedCardId(appliedPhotoId, d),
    status: 'processed' as const,
    thumbnailUrl,
    cardphoto,
    cardtext,
    envelope,
    aroma,
    date: d,
    multiGroupId,
    meta: { ...sharedMeta },
  }))
}
