import { put, select, call, takeLatest } from 'redux-saga/effects'
import { initStockImage, initCardphoto } from '@cardphoto/infrastructure/state'
import { selectHistory } from '@cardphoto/infrastructure/selectors'
import { STOCK_IMAGES } from '@shared/assets/stock'
import type { ImageMeta, ImageHistory } from '@cardphoto/domain/types'

function getRandomStockMeta(): ImageMeta {
  const index = Math.floor(Math.random() * STOCK_IMAGES.length)
  return STOCK_IMAGES[index]
}

function* initCardphotoSaga() {
  let history: ImageHistory | null = yield select(selectHistory)

  if (
    !history ||
    (history.operations.length === 1 &&
      history.operations[0].type === 'initial')
  ) {
    const randomMeta: ImageMeta = yield call(getRandomStockMeta)
    yield put(initStockImage(randomMeta))
  }
}

export function* cardphotoHistorySaga() {
  yield takeLatest(initCardphoto.type, initCardphotoSaga)
}
