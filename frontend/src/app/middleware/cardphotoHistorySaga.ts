import { put, select, call, takeLatest } from 'redux-saga/effects'
import { initStockImage, initCardphoto } from '@cardphoto/infrastructure/state'
import { selectCardphotoState } from '@cardphoto/infrastructure/selectors'
import { STOCK_IMAGES } from '@shared/assets/stock'
import type { ImageMeta, CardphotoState } from '@cardphoto/domain/types'

function getRandomStockMeta(): ImageMeta {
  const index = Math.floor(Math.random() * STOCK_IMAGES.length)
  return STOCK_IMAGES[index]
}

function* initCardphotoSaga() {
  const state: CardphotoState | null = yield select(selectCardphotoState)

  if (!state || state.operations.length === 0) {
    const randomMeta: ImageMeta = yield call(getRandomStockMeta)
    yield put(initStockImage(randomMeta))
  }
}

export function* cardphotoHistorySaga() {
  yield takeLatest(initCardphoto.type, initCardphotoSaga)
}
