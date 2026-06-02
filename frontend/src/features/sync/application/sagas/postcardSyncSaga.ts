import { call, put, takeLatest } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import { postcardsAdapter } from '@db/adapters/storeAdapters/postcardsAdapter'
import type { PostcardHydrated } from '@entities/postcard'
import { cardListPreviewUrlFromCard } from '@entities/card/domain/helpers'
import type { ImageAsset } from '@entities/assetRegistry/domain/types'
import { setAssets } from '@entities/assetRegistry/infrastructure/state'
import { setItems } from '@features/cart/infrastructure/state/cartSlice'
import {
  postcardCardphotoNeedsPersist,
  refreshPostcardsCardphotoUrls,
} from '@app/middleware/postcardCardphotoHydrate'
import { refreshRightSidebarBadgesFromPostcards } from '@app/middleware/postcardCreateSaga'
import { rehydratePostcardsFromIdb } from '@features/sync/store'

function cartPostcardPreviewAssets(postcards: PostcardHydrated[]): ImageAsset[] {
  const assets: ImageAsset[] = []
  const seen = new Set<string>()

  for (const postcard of postcards) {
    const meta = postcard.card.cardphoto?.appliedData
    const id = meta?.id
    if (!id || seen.has(id)) continue

    const preview = cardListPreviewUrlFromCard(postcard.card)
    if (!preview) continue

    seen.add(id)
    assets.push({
      id,
      url: meta?.url?.trim() || preview,
      thumbUrl: preview,
    })
  }

  return assets
}

function* rehydratePostcardsFromIdbSaga(): SagaIterator {
  const rawPostcards: PostcardHydrated[] = yield call(postcardsAdapter.getAll)
  const postcards: PostcardHydrated[] = yield call(
    refreshPostcardsCardphotoUrls,
    rawPostcards,
  )

  for (let i = 0; i < postcards.length; i++) {
    const next = postcards[i]
    const prev = rawPostcards[i]
    if (
      prev &&
      next &&
      prev.id === next.id &&
      postcardCardphotoNeedsPersist(prev, next)
    ) {
      yield call(postcardsAdapter.put, next)
    }
  }

  yield put(setItems(postcards))

  const cartAssets = cartPostcardPreviewAssets(postcards)
  if (cartAssets.length > 0) {
    yield put(setAssets(cartAssets))
  }

  yield call(refreshRightSidebarBadgesFromPostcards)
}

export function* watchPostcardSyncRehydrate(): SagaIterator {
  yield takeLatest(rehydratePostcardsFromIdb.type, rehydratePostcardsFromIdbSaga)
}
