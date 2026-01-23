import { put, select, call, takeLatest } from 'redux-saga/effects'
import {
  initStockImage,
  initCardphoto,
  // addOperation,
  type CardphotoSliceState,
} from '@cardphoto/infrastructure/state'
import {
  selectCardphotoState,
  selectCurrentConfig,
  selectActiveSourceImage,
} from '@cardphoto/infrastructure/selectors'
import { selectSizeCard } from '@layout/infrastructure/selectors'
import { STOCK_IMAGES } from '@shared/assets/stock'
import { createWorkingConfig } from './utils'
import {
  fitImageToCard,
  createInitialCropLayer,
} from '@cardphoto/application/utils/imageFit'
import type {
  ImageMeta,
  CardphotoState,
  CardphotoOperation,
  WorkingConfig,
  CardLayer,
} from '@cardphoto/domain/types'

function getRandomStockMeta(): ImageMeta {
  const index = Math.floor(Math.random() * STOCK_IMAGES.length)
  return STOCK_IMAGES[index]
}

function* initCardphotoSaga() {
  const state: CardphotoState = yield select(selectCardphotoState)
  if (state.operations.length > 1) return
  // const originalImage: ImageMeta = yield select(selectActiveSourceImage)

  const randomMeta: ImageMeta = yield call(getRandomStockMeta)
  const cardLayer: CardLayer = yield select(selectSizeCard)
  const imageLayer = fitImageToCard(randomMeta, cardLayer, 0, true)
  const cropLayer = createInitialCropLayer(imageLayer, cardLayer, randomMeta)
  const workingConfig = { card: cardLayer, image: imageLayer, crop: cropLayer }

  yield put(
    initStockImage({
      meta: randomMeta,
      config: workingConfig,
    }),
  )
}

export function* cardphotoHistorySaga() {
  yield takeLatest(initCardphoto.type, initCardphotoSaga)
}
