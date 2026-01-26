import { put } from 'redux-saga/effects'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import type { CardphotoToolbarState } from '@toolbar/domain/types'
import type { ImageMeta } from '@cardphoto/domain/types'

interface UpdateCropOptions {
  isFull?: boolean
}

export function* updateCropToolbarState(
  newCrop: 'active' | 'enabled',
  state: CardphotoToolbarState,
  options: UpdateCropOptions = {},
) {
  yield put(
    updateToolbarIcon({ section: 'cardphoto', key: 'crop', value: newCrop }),
  )

  const newSave =
    newCrop === 'active'
      ? 'disabled'
      : state.save === 'disabled'
        ? 'enabled'
        : state.save

  yield put(
    updateToolbarIcon({ section: 'cardphoto', key: 'save', value: newSave }),
  )

  const { isFull = false } = options

  const newCropFull =
    newCrop === 'active' ? (isFull ? 'disabled' : 'enabled') : 'disabled'

  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'cropFull',
      value: newCropFull,
    }),
  )

  const newCropCheck =
    newCrop === 'active'
      ? 'enabled'
      : state.cropCheck === 'enabled'
        ? 'disabled'
        : state.cropCheck

  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'cropCheck',
      value: newCropCheck,
    }),
  )

  const newClose = newCrop === 'active' ? 'disabled' : 'enabled'

  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'close',
      value: newClose,
    }),
  )
}

export const prepareForRedux = (meta: ImageMeta): ImageMeta => ({
  ...meta,
  full: meta.full ? { ...meta.full, blob: undefined } : undefined,
  thumbnail: meta.thumbnail
    ? { ...meta.thumbnail, blob: undefined }
    : undefined,
})
