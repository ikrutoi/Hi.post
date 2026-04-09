import type { SagaIterator } from 'redux-saga'
import { call, put, takeEvery } from 'redux-saga/effects'
import { storeAdapters } from '@db/adapters/storeAdapters'
import {
  requestCalendarPreview,
  setCalendarPreviewCached,
} from '@entities/card/infrastructure/state'
import { hydrateMeta } from './cardphotoHelpers'
import type { ImageMeta } from '@cardphoto/domain/types'

const inFlightCardIds = new Set<string>()

const isBlobUrl = (url: string | null | undefined): boolean =>
  typeof url === 'string' && url.startsWith('blob:')

const getImageMetaIdFromCardId = (cardId: string): string | null => {
  const [imageMetaId] = cardId.split('__')
  if (!imageMetaId || imageMetaId === 'current_session') return null
  return imageMetaId
}

function* resolvePreviewUrl(cardId: string, fallbackPreviewUrl?: string) {
  if (fallbackPreviewUrl && !isBlobUrl(fallbackPreviewUrl)) {
    return fallbackPreviewUrl
  }

  const imageMetaId = getImageMetaIdFromCardId(cardId)
  if (!imageMetaId) return null

  const rawMeta: ImageMeta | null = yield call(
    [storeAdapters.cardphotoImages, 'getById'],
    imageMetaId,
  )
  const hydrated = hydrateMeta(rawMeta)
  if (!hydrated) return null

  return hydrated.thumbnail?.url || hydrated.url || null
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
