import type { SagaIterator } from 'redux-saga'
import { call, put, takeEvery } from 'redux-saga/effects'
import {
  requestCalendarPreview,
  setCalendarPreviewCached,
} from '@entities/card/infrastructure/state'
import { resolveCardphotoPreviewUrlByMetaId } from './cardphotoHelpers'

const inFlightCardIds = new Set<string>()

const getImageMetaIdFromCardId = (cardId: string): string | null => {
  const [imageMetaId] = cardId.split('__')
  if (!imageMetaId || imageMetaId === 'current_session') return null
  return imageMetaId
}

function* resolvePreviewUrl(
  cardId: string,
  fallbackPreviewUrl?: string,
): SagaIterator<string | null> {
  const imageMetaId = getImageMetaIdFromCardId(cardId)
  if (!imageMetaId) return null
  const resolved: string | null = yield call(
    resolveCardphotoPreviewUrlByMetaId,
    imageMetaId,
    fallbackPreviewUrl,
  )
  return resolved
}

function* requestCalendarPreviewWorker(
  action: ReturnType<typeof requestCalendarPreview>,
): SagaIterator {
  const { cardId, previewUrl } = action.payload
  if (inFlightCardIds.has(cardId)) return
  inFlightCardIds.add(cardId)

  try {
    const resolvedUrl: string | null = yield call(
      resolvePreviewUrl,
      cardId,
      previewUrl,
    )
    if (!resolvedUrl) return
    yield put(setCalendarPreviewCached({ cardId, blobUrl: resolvedUrl }))
  } catch (e) {
    console.error('requestCalendarPreviewWorker failed', e)
  } finally {
    inFlightCardIds.delete(cardId)
  }
}

export function* cardCalendarPreviewSaga(): SagaIterator {
  yield takeEvery(requestCalendarPreview.type, requestCalendarPreviewWorker)
}
