import { put, select, call, takeLatest } from 'redux-saga/effects'
import {
  initStockImage,
  initCardphoto,
  addOperation,
} from '@cardphoto/infrastructure/state'
import { selectCardphotoState } from '@cardphoto/infrastructure/selectors'
import { STOCK_IMAGES } from '@shared/assets/stock'
import { createWorkingConfig } from './utils'
import type {
  ImageMeta,
  CardphotoState,
  CardphotoOperation,
  WorkingConfig,
} from '@cardphoto/domain/types'

function getRandomStockMeta(): ImageMeta {
  const index = Math.floor(Math.random() * STOCK_IMAGES.length)
  return STOCK_IMAGES[index]
}

function* initCardphotoSaga() {
  const state: CardphotoState | null = yield select(selectCardphotoState)

  if (state && (state.operations.length > 0 || state.base.stock.image)) {
    return
  }

  const randomMeta: ImageMeta = yield call(getRandomStockMeta)

  yield put(initStockImage(randomMeta))

  const workingConfig: WorkingConfig = yield call(
    createWorkingConfig,
    randomMeta
  )

  const op: CardphotoOperation = {
    type: 'operation',
    payload: { config: workingConfig, reason: 'initStock' },
  }

  yield put(addOperation(op))
}

export function* cardphotoHistorySaga() {
  yield takeLatest(initCardphoto.type, initCardphotoSaga)
}
