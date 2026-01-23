import { select } from 'redux-saga/effects'
import { selectSizeCard } from '@layout/infrastructure/selectors'
import {
  fitImageToCard,
  createInitialCropLayer,
} from '@cardphoto/application/utils/imageFit'
import type {
  ImageMeta,
  WorkingConfig,
  CardLayer,
  ImageLayer,
  CropLayer,
} from '@cardphoto/domain/types'

export function* createWorkingConfig(imageMeta: ImageMeta) {
  const cardLayer: CardLayer = yield select(selectSizeCard)

  const imageLayer: ImageLayer = fitImageToCard(
    imageMeta,
    cardLayer,
    0,
    imageMeta.isCropped,
  )
  const cropLayer: CropLayer = createInitialCropLayer(
    imageLayer,
    cardLayer,
    imageMeta,
  )

  const workingConfig: WorkingConfig = {
    card: cardLayer,
    image: imageLayer,
    crop: cropLayer,
  }

  return workingConfig
}
