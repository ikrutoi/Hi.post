import { call, takeLatest, all, fork, select, put } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { toolbarAction } from '@toolbar/application/helpers'
import { addOperation } from '@cardphoto/infrastructure/state'
import {
  handleCropAction,
  handleCropCheckAction,
  handleCardOrientation,
  handleImageRotate,
  handleCropFullAction,
  syncCropFullIcon,
  handleCropConfirm,
} from './cardphotoToolbarHandlers'
import {
  getQualityColor,
  dispatchQualityUpdate,
  calculateCropQuality,
} from '@cardphoto/application/helpers'
import { onDownloadClick } from './cardphotoProcessSaga'
import {
  updateToolbarSection,
  updateToolbarIcon,
} from '@toolbar/infrastructure/state'
import type { CardphotoState } from '@cardphoto/domain/types'

export function* watchCropChanges(): SagaIterator {
  yield takeLatest(addOperation.type, function* (): SagaIterator {
    yield call(syncCropFullIcon)

    const state = (yield select((s) => s.cardphoto)) as CardphotoState

    const config = state.currentConfig

    if (config?.crop && config?.image?.meta) {
      const { quality, qualityProgress } = calculateCropQuality(
        config.crop.meta,
        config.image,
        config.image.meta,
        config.card.orientation,
      )

      yield call(dispatchQualityUpdate, qualityProgress, quality)

      const color = getQualityColor(qualityProgress)
      document.documentElement.style.setProperty('--crop-handle-color', color)
    }
  })
}

export function* handleCardphotoToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key } = action.payload
  if (section !== 'cardphoto') return

  switch (key) {
    case 'download':
      yield call(onDownloadClick)
      break
    case 'crop':
      yield* handleCropAction()
      break
    case 'cropCheck':
      yield call(handleCropConfirm)
      break
    case 'cropFull':
      yield call(handleCropFullAction)
      break
    case 'cardOrientation':
      yield call(handleCardOrientation)
      break
    case 'imageRotateLeft':
    case 'imageRotateRight':
      yield call(handleImageRotate, key)
      break
  }
}

export function* watchCropToolbarStatus(): SagaIterator {
  yield takeLatest(updateToolbarIcon.type, function* (action: any) {
    const { key, value, section } = action.payload
    if (section !== 'cardphoto' || key !== 'crop') return

    const subButtonsStatus = value === 'active' ? 'enabled' : 'disabled'

    yield all([
      put(
        updateToolbarIcon({
          section,
          key: 'cropFull',
          value: subButtonsStatus,
        }),
      ),
      put(
        updateToolbarIcon({
          section,
          key: 'cropCheck',
          value: subButtonsStatus,
        }),
      ),
    ])
  })
}
