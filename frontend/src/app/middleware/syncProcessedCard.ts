import type { SagaIterator } from 'redux-saga'
import { put, select } from 'redux-saga/effects'
import { selectCardphotoState } from '@cardphoto/infrastructure/selectors'
import { selectCardtextState } from '@cardtext/infrastructure/selectors'
import { selectEnvelopeSessionRecord } from '@envelope/infrastructure/selectors'
import {
  selectIsMultiDateMode,
  selectMergedDispatchDates,
  selectMultiGroupId,
} from '@date/infrastructure/selectors'
import { selectSelectedAroma } from '@aroma/infrastructure/selectors'
import { setProcessedCardsFromEditor } from '@entities/card/infrastructure/state'
import { buildProcessedCardsForSync } from '@entities/card/domain/helpers/buildProcessedCardsForSync'
import type { CardphotoState } from '@cardphoto/domain/types'
import type { CardtextState } from '@cardtext/domain/types'
import type { EnvelopeSessionRecord } from '@envelope/domain/types'
import type { AromaItem } from '@entities/aroma/domain/types'
import type { DispatchDate } from '@entities/date'

export function* checkAndSyncProcessedCard(): SagaIterator {
  const cardphoto: CardphotoState = yield select(selectCardphotoState)
  const cardtext: CardtextState = yield select(selectCardtextState)
  const envelope: EnvelopeSessionRecord = yield select(
    selectEnvelopeSessionRecord,
  )
  const mergedDates: DispatchDate[] = yield select(selectMergedDispatchDates)
  const isMultiDateMode: boolean = yield select(selectIsMultiDateMode)
  const multiGroupId: string | null = yield select(selectMultiGroupId)
  const aroma: AromaItem = yield select(selectSelectedAroma)

  const appliedPhoto = cardphoto.appliedData
  if (!appliedPhoto) return
  if (mergedDates.length === 0) return

  const processedCards = buildProcessedCardsForSync({
    appliedPhotoId: appliedPhoto.id,
    thumbnailUrl: appliedPhoto.thumbnail?.url || '',
    mergedDates,
    isMultiDateMode,
    multiGroupId,
    cardphoto,
    cardtext,
    envelope,
    aroma,
  })

  yield put(setProcessedCardsFromEditor(processedCards))
}
