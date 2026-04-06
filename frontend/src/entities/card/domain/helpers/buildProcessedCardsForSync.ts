import type { DispatchDate } from '@entities/date'
import type { AromaItem } from '@entities/aroma/domain/types'
import type { CardphotoState } from '@cardphoto/domain/types'
import type { CardtextState } from '@cardtext/domain/types'
import type { EnvelopeSessionRecord } from '@envelope/domain/types'
import type { Card } from '../types'
import type { Postcard } from '@entities/postcard'
import { makeSessionPostcardLocalId } from '@entities/postcard'

export function buildProcessedCardId(
  photoAssetId: string,
  d: DispatchDate,
): string {
  return `${photoAssetId}__${d.year}-${d.month}-${d.day}`
}

function buildInnerCard(opts: {
  id: string
  thumbnailUrl: string
  multiGroupId: string | null
  cardphoto: CardphotoState
  cardtext: CardtextState
  envelope: EnvelopeSessionRecord
  aroma: AromaItem
  date: DispatchDate
}): Card {
  const {
    id,
    thumbnailUrl,
    multiGroupId,
    cardphoto,
    cardtext,
    envelope,
    aroma,
    date,
  } = opts
  return {
    id,
    thumbnailUrl,
    cardphoto,
    cardtext,
    envelope,
    aroma,
    date,
    multiGroupId,
  }
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
}): Postcard[] {
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

  const multiBatch =
    isMultiDateMode && mergedDates.length > 1 && multiGroupId != null

  if (!multiBatch) {
    const d = mergedDates[0]
    return [
      {
        localId: makeSessionPostcardLocalId(0),
        price: '',
        status: 'processed',
        createdAt: now,
        updatedAt: now,
        card: buildInnerCard({
          id: appliedPhotoId,
          thumbnailUrl,
          multiGroupId: null,
          cardphoto,
          cardtext,
          envelope,
          aroma,
          date: d,
        }),
      },
    ]
  }

  return mergedDates.map((d, i) => ({
    localId: makeSessionPostcardLocalId(i),
    price: '',
    status: 'processed' as const,
    createdAt: now,
    updatedAt: now,
    card: buildInnerCard({
      id: buildProcessedCardId(appliedPhotoId, d),
      thumbnailUrl,
      multiGroupId,
      cardphoto,
      cardtext,
      envelope,
      aroma,
      date: d,
    }),
  }))
}
