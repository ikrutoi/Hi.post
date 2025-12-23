import type { CropArea, CropMode } from '../typesLayout/crop.types'
import type { ImageDimensions } from '../typesLayout/size.types'

export const centeringMaxCrop = (
  dimensions: ImageDimensions,
  aspectRatio: number,
  mode: CropMode
): CropArea => {
  const aspectRatioImageUser = Number(
    (dimensions.width / dimensions.height).toFixed(2)
  )

  let x = 0
  let y = 0
  let width = 0
  let height = 0

  const calcOfValues = (unit: 'more' | 'less') => {
    if (unit === 'more') {
      height = dimensions.height
      width = height * aspectRatio
      y = 0
      x = (dimensions.width - width) / 2
    }
    if (unit === 'less') {
      width = dimensions.width
      height = width / aspectRatio
      x = 0
      y = (dimensions.height - height) / 2
    }
  }

  if (mode === 'startCrop') {
    if (aspectRatioImageUser > aspectRatio + aspectRatio * 0.1) {
      calcOfValues('more')
    } else if (
      aspectRatioImageUser >= aspectRatio &&
      aspectRatioImageUser <= aspectRatio + aspectRatio * 0.1
    ) {
      width = dimensions.width * 0.95
      height = (width / aspectRatio) * 0.95
      x = dimensions.width * 0.025
      y = (dimensions.height - height) / 2
    } else {
      calcOfValues('less')
    }
  }

  if (mode === 'maxCrop') {
    if (aspectRatioImageUser > aspectRatio) {
      calcOfValues('more')
    } else {
      calcOfValues('less')
    }
  }

  return {
    x: Number(x.toFixed(2)),
    y: Number(y.toFixed(2)),
    width: Number(width.toFixed(2)),
    height: Number(height.toFixed(2)),
  }
}
