import type { SagaIterator } from 'redux-saga'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { selectCartItems } from '@cart/infrastructure/selectors'
import {
  requestCalendarPreview,
  setCalendarPreviewCached,
} from '@entities/card/infrastructure/state'
import { cardImageMetaLookupIdsFromCard } from '@entities/card/domain/helpers'
import { cardImageMetaLookupIds } from '@entities/card/domain/helpers/listPreviewDisplay'
import { resolveCardphotoPreviewUrlByMetaId } from './cardphotoHelpers'
import type { PostcardHydrated } from '@entities/postcard'

const inFlightCardIds = new Set<string>()

function* resolvePreviewUrl(
  cardId: string,
  fallbackPreviewUrl?: string,
): SagaIterator<string | null> {
  const items: PostcardHydrated[] = yield select(selectCartItems)
  const postcard = items.find((p) => p.card.id === cardId)
  const lookupIds =
    postcard != null
      ? cardImageMetaLookupIdsFromCard(postcard.card, postcard.postcard)
      : cardImageMetaLookupIds(cardId, undefined)
  for (const imageMetaId of lookupIds) {
    const resolved: string | null = yield call(
      resolveCardphotoPreviewUrlByMetaId,
      imageMetaId,
      fallbackPreviewUrl,
    )
    if (resolved) return resolved
  }
  return null
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
