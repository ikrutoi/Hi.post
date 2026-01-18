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
  const sizeCard: CardLayer = yield select(selectSizeCard)

  const imageLayer: ImageLayer = fitImageToCard(imageMeta, sizeCard, 0)
  const cropLayer: CropLayer = createInitialCropLayer(
    imageLayer,
    sizeCard,
    imageMeta,
  )

  const workingConfig: WorkingConfig = {
    card: sizeCard,
    image: imageLayer,
    crop: cropLayer,
  }

  return workingConfig
}
