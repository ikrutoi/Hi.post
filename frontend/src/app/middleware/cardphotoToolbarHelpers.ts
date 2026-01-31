import { put } from 'redux-saga/effects'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import type { CardphotoToolbarState } from '@toolbar/domain/types'
import type { ImageMeta, WorkingConfig } from '@cardphoto/domain/types'

interface UpdateCropOptions {
  isFull?: boolean
}

export function* updateCropToolbarState(
  newCrop: 'active' | 'enabled',
  state: CardphotoToolbarState,
  options: UpdateCropOptions = {},
) {
  console.log('updateCropToolbar +++', newCrop, state)
  yield put(
    updateToolbarIcon({ section: 'cardphoto', key: 'crop', value: newCrop }),
  )

  const newSave =
    newCrop === 'active'
      ? 'disabled'
      : state.save.state === 'disabled'
        ? 'enabled'
        : state.save.state

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
      : state.cropCheck.state === 'enabled'
        ? 'disabled'
        : state.cropCheck.state

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
  full: { ...meta.full, blob: undefined },
  thumbnail: meta.thumbnail
    ? { ...meta.thumbnail, blob: undefined }
    : undefined,
})

export const prepareConfigForRedux = (
  config: WorkingConfig,
): WorkingConfig => ({
  ...config,
  image: {
    ...config.image,
    meta: prepareForRedux(config.image.meta),
  },
})
